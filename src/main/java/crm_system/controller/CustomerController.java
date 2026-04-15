package crm_system.controller;
 
import crm_system.entity.Customer;
import crm_system.entity.User;
import crm_system.repository.UserRepository;
import crm_system.service.CustomerService;
import crm_system.service.ManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final ManagerService managerService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerController(CustomerService customerService, 
                                ManagerService managerService,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        this.customerService = customerService;
        this.managerService = managerService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Customer> listCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable("id") int id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<Customer> saveCustomer(
            @RequestBody Map<String, Object> payload,
            @RequestParam("managerId") int managerId) {
        
        Customer customer = new Customer();
        if (payload.containsKey("id")) customer.setId((Integer) payload.get("id"));
        customer.setFirstName((String) payload.get("firstName"));
        customer.setLastName((String) payload.get("lastName"));
        customer.setEmail((String) payload.get("email"));
        customer.setPhone((String) payload.get("phone"));
        customer.setStatus(crm_system.enums.CustomerStatus.valueOf((String) payload.get("status")));
        
        customer.setManager(managerService.getManagerById(managerId));
        customerService.saveCustomer(customer);

        // Handle User creation if credentials provided
        if (payload.containsKey("username") && payload.containsKey("password")) {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            if (!username.isEmpty() && !password.isEmpty()) {
                User user = userRepository.findByUsername(username).orElse(new User());
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(password));
                user.setRole("CUSTOMER");
                userRepository.save(user);
            }
        }
        
        return ResponseEntity.ok(customer);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") int id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}

