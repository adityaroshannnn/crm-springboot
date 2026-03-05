package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
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
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;
    private final CustomerRepository customerRepository;

    public OrderController(OrderService orderService,
                            ProductService productService,
                            CustomerRepository customerRepository) {
        this.orderService = orderService;
        this.productService = productService;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/orders")
    public String listOrders(Model model) {
        model.addAttribute("orders", orderService.getAllOrders());
        return "order-list";
    }

    @GetMapping("/my-orders")
    public String myOrders(Authentication authentication, Model model) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        if (customer != null) {
            model.addAttribute("orders", orderService.getOrdersByCustomerId(customer.getId()));
        } else {
            model.addAttribute("orders", java.util.Collections.emptyList());
        }
        return "my-orders";
    }

    @PostMapping("/my-orders/refund")
    public String requestRefund(@RequestParam("id") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null && order.getStatus() == OrderStatus.PURCHASED) {
            order.setStatus(OrderStatus.REFUND_REQUESTED);
            orderService.saveOrder(order);
        }
        return "redirect:/my-orders";
    }

    @PostMapping("/orders/approve-refund")
    public String approveRefund(@RequestParam("id") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null && order.getStatus() == OrderStatus.REFUND_REQUESTED) {
            order.setStatus(OrderStatus.REFUNDED);
            orderService.saveOrder(order);

            if (order.getProduct() != null) {
                order.getProduct().setStock(order.getProduct().getStock() + order.getQuantity());
                productService.saveProduct(order.getProduct());
            }
        }
        return "redirect:/orders";
    }
}
