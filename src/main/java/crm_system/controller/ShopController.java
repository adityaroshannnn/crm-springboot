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
import crm_system.enums.CustomerStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ShopController {

    private final ProductService productService;
    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final ReviewService reviewService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public ShopController(ProductService productService,
                           OrderService orderService,
                           CustomerRepository customerRepository,
                           ReviewService reviewService) {
        this.productService = productService;
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.reviewService = reviewService;
    }

    @GetMapping("/shop")
    public String shop(Model model) {
        model.addAttribute("products", productService.getActiveProducts());
        return "shop";
    }

    @GetMapping("/shop/product/{id}")
    public String productDetails(@PathVariable("id") Long id, Model model) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return "redirect:/shop?error";
        }
        model.addAttribute("product", product);
        model.addAttribute("reviews", reviewService.getReviewsByProductId(id));
        return "product-details";
    }

    @PostMapping("/shop/product/{id}/review")
    public String submitReview(@PathVariable("id") Long productId,
                               @RequestParam("rating") int rating,
                               @RequestParam("comment") String comment,
                               Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        Product product = productService.getProductById(productId);

        if (product != null && customer != null) {
            Review review = new Review();
            review.setProduct(product);
            review.setCustomer(customer);
            review.setRating(rating);
            review.setComment(comment);
            reviewService.saveReview(review);
        }
        return "redirect:/shop/product/" + productId;
    }

    @GetMapping("/shop/buy")
    public String buyConfirmation(@RequestParam("id") Long productId, Model model) {
        Product product = productService.getProductById(productId);
        if (product == null) {
            return "redirect:/shop?error";
        }
        model.addAttribute("product", product);
        model.addAttribute("razorpayKeyId", razorpayKeyId);
        return "purchase";
    }

    @PostMapping("/shop/purchase")
    public String purchase(@RequestParam("productId") Long productId,
                           @RequestParam("quantity") int quantity,
                           @RequestParam(value = "razorpay_payment_id", required = false) String razorpayPaymentId,
                           Authentication authentication) {
        
        if (razorpayPaymentId == null || razorpayPaymentId.trim().isEmpty()) {
            return "redirect:/shop/buy?id=" + productId + "&error=PaymentRequired";
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

        Product product = productService.getProductById(productId);

        if (product == null || product.getStock() < quantity) {
            return "redirect:/shop?error";
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

        return "redirect:/shop/order-success";
    }

    @GetMapping("/shop/order-success")
    public String orderSuccess() {
        return "order-success";
    }
}
