package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
import crm_system.entity.Product;
import crm_system.enums.OrderStatus;
import crm_system.repository.CustomerRepository;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
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

    public ShopController(ProductService productService,
                           OrderService orderService,
                           CustomerRepository customerRepository) {
        this.productService = productService;
        this.orderService = orderService;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/shop")
    public String shop(Model model) {
        model.addAttribute("products", productService.getActiveProducts());
        return "shop";
    }

    @GetMapping("/shop/buy")
    public String buyConfirmation(@RequestParam("id") Long productId, Model model) {
        Product product = productService.getProductById(productId);
        if (product == null) {
            return "redirect:/shop?error";
        }
        model.addAttribute("product", product);
        return "purchase";
    }

    @PostMapping("/shop/purchase")
    public String purchase(@RequestParam("productId") Long productId,
                           @RequestParam("quantity") int quantity,
                           Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
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

        return "redirect:/my-orders";
    }
}
