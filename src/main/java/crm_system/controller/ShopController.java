package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
import crm_system.entity.Product;
import crm_system.enums.OrderStatus;
import crm_system.repository.CustomerRepository;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
import crm_system.entity.Review;
import crm_system.service.ReviewService;
import crm_system.service.EmailService;
import crm_system.enums.CustomerStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ProductService productService;
    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final ReviewService reviewService;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public ShopController(ProductService productService,
                           OrderService orderService,
                           CustomerRepository customerRepository,
                           ReviewService reviewService,
                           EmailService emailService) {
        this.productService = productService;
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.reviewService = reviewService;
        this.emailService = emailService;
    }

    @GetMapping
    public List<Product> shop() {
        return productService.getActiveProducts();
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<?> productDetails(@PathVariable("id") Long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        List<Review> reviews = reviewService.getReviewsByProductId(id);
        return ResponseEntity.ok(Map.of("product", product, "reviews", reviews));
    }

    @PostMapping("/product/{id}/review")
    public ResponseEntity<?> submitReview(@PathVariable("id") Long productId,
                                          @RequestBody Map<String, Object> payload,
                                          Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        Product product = productService.getProductById(productId);

        if (product != null && customer != null) {
            Review review = new Review();
            review.setProduct(product);
            review.setCustomer(customer);
            
            // Extract rating and comment safely
            try {
                review.setRating(Integer.parseInt(payload.get("rating").toString()));
                review.setComment((String) payload.get("comment"));
                reviewService.saveReview(review);
                return ResponseEntity.ok(Map.of("success", true, "review", review));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid review format"));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Product or user not found"));
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchase(@RequestBody Map<String, Object> payload,
                                      Authentication authentication) {
        
        String razorpayPaymentId = (String) payload.get("razorpay_payment_id");
        if (razorpayPaymentId == null || razorpayPaymentId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment Required"));
        }

        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        
        if (customer == null) {
            customer = new Customer();
            customer.setFirstName(username);
            customer.setLastName("");
            customer.setEmail(username + "@crm.com");
            customer.setStatus(CustomerStatus.ACTIVE);
            customer = customerRepository.save(customer);
        }

        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        Product product = productService.getProductById(productId);

        if (product == null || product.getStock() < quantity) {
            return ResponseEntity.badRequest().body(Map.of("error", "Product not found or out of stock"));
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setTotalPrice(product.getPrice() * quantity);
        order.setStatus(OrderStatus.PURCHASED);
        orderService.createOrder(order);

        product.setStock(product.getStock() - quantity);
        productService.saveProduct(product);

        // Send order confirmation email
        try { emailService.sendOrderConfirmation(order); } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of("success", true, "order", order));
    }
}
