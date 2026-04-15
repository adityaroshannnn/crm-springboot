package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
import crm_system.entity.User;
import crm_system.repository.CustomerRepository;
import crm_system.repository.UserRepository;
import crm_system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final CustomerRepository customerRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public ProfileController(CustomerRepository customerRepository, 
                                OrderService orderService,
                                UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);

        List<Order> orders = customer != null
                ? orderService.getOrdersByCustomerId(customer.getId())
                : Collections.emptyList();

        double totalSpent = orders.stream().mapToDouble(Order::getTotalPrice).sum();

        return ResponseEntity.ok(Map.of(
                "username", username,
                "email", username + "@crm.com",
                "firstName", customer != null ? (customer.getFirstName() != null ? customer.getFirstName() : "") : username,
                "lastName", customer != null ? (customer.getLastName() != null ? customer.getLastName() : "") : "",
                "memberSince", customer != null && customer.getCreatedAt() != null ? customer.getCreatedAt().toString() : "",
                "totalOrders", orders.size(),
                "totalSpent", totalSpent
        ));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload,
                                            Authentication authentication) {
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);

        if (customer == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer not found"));
        }

        if (payload.containsKey("firstName")) customer.setFirstName(payload.get("firstName"));
        if (payload.containsKey("lastName")) customer.setLastName(payload.get("lastName"));
        
        if (payload.containsKey("email")) {
            String newEmail = payload.get("email");
            if (!newEmail.equals(customer.getEmail())) {
                // Update User username to match new email prefix (assuming pattern: username@crm.com)
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null) {
                    String newUsername = newEmail.contains("@") ? newEmail.split("@")[0] : newEmail;
                    user.setUsername(newUsername);
                    userRepository.save(user);
                }
                customer.setEmail(newEmail);
            }
        }
        
        customerRepository.save(customer);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
