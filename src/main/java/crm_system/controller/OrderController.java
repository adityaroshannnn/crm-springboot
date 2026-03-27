package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
import crm_system.enums.OrderStatus;
import crm_system.repository.CustomerRepository;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
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
    public List<Order> listOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my-orders")
    public List<Order> myOrders(Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        if (customer != null) {
            return orderService.getOrdersByCustomerId(customer.getId());
        }
        return Collections.emptyList();
    }

    @PostMapping("/my-orders/refund/{id}")
    public ResponseEntity<?> requestRefund(@PathVariable("id") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null && order.getStatus() == OrderStatus.PURCHASED) {
            order.setStatus(OrderStatus.REFUND_REQUESTED);
            orderService.saveOrder(order);
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.badRequest().body("Order not found or not purchased");
    }

    @PostMapping("/orders/approve-refund/{id}")
    public ResponseEntity<?> approveRefund(@PathVariable("id") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null && order.getStatus() == OrderStatus.REFUND_REQUESTED) {
            order.setStatus(OrderStatus.REFUNDED);
            orderService.saveOrder(order);

            if (order.getProduct() != null) {
                order.getProduct().setStock(order.getProduct().getStock() + order.getQuantity());
                productService.saveProduct(order.getProduct());
            }
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.badRequest().body("Order not found or refund not requested");
    }
}
