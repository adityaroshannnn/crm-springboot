package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.service.CustomerService;
import crm_system.service.ManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final ManagerService managerService;

    public CustomerController(CustomerService customerService, ManagerService managerService) {
        this.customerService = customerService;
        this.managerService = managerService;
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
            @RequestBody Customer customer,
            @RequestParam("managerId") int managerId) {
        customer.setManager(managerService.getManagerById(managerId));
        customerService.saveCustomer(customer);
        return ResponseEntity.ok(customer);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") int id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}

