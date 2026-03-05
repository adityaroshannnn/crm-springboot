package crm_system.config;

import crm_system.entity.Customer;
import crm_system.entity.Manager;
import crm_system.entity.Product;
import crm_system.entity.User;
import crm_system.enums.CustomerStatus;
import crm_system.repository.CustomerRepository;
import crm_system.repository.ManagerRepository;
import crm_system.repository.ProductRepository;
import crm_system.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(ManagerRepository managerRepository,
                      UserRepository userRepository,
                      ProductRepository productRepository,
                      CustomerRepository customerRepository,
                      PasswordEncoder passwordEncoder) {
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void loadData() {
        if (managerRepository.count() == 0) {
            Manager m1 = new Manager();
            m1.setName("Admin One");
            m1.setEmail("admin1@crm.com");

            Manager m2 = new Manager();
            m2.setName("Admin Two");
            m2.setEmail("admin2@crm.com");

            managerRepository.save(m1);
            managerRepository.save(m2);

            System.out.println("Managers inserted by Spring Boot");
        }

        if (userRepository.count() == 0) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "ADMIN");
            userRepository.save(admin);

            User customer1 = new User("customer1", passwordEncoder.encode("cust123"), "CUSTOMER");
            userRepository.save(customer1);

            System.out.println("Users inserted by Spring Boot");
        }

        if (productRepository.count() == 0) {
            productRepository.save(new Product("CRM Basic", "Entry-level CRM solution for small teams", 29.99, 100));
            productRepository.save(new Product("CRM Pro", "Advanced CRM with automation features", 79.99, 50));
            productRepository.save(new Product("CRM Enterprise", "Full-featured enterprise CRM platform", 199.99, 20));
            productRepository.save(new Product("Email Marketing Tool", "Integrated email campaign management", 49.99, 75));
            productRepository.save(new Product("Analytics Dashboard", "Real-time sales and customer analytics", 59.99, 60));
            productRepository.save(new Product("Customer Support Suite", "Ticketing and support management system", 39.99, 80));

            System.out.println("Products inserted by Spring Boot");
        }

        if (customerRepository.count() == 0) {
            Manager manager = managerRepository.findAll().stream().findFirst().orElse(null);

            Customer c1 = new Customer();
            c1.setFirstName("Customer");
            c1.setLastName("One");
            c1.setEmail("customer1@crm.com");
            c1.setStatus(CustomerStatus.ACTIVE);
            c1.setManager(manager);
            customerRepository.save(c1);

            System.out.println("Sample customer inserted by Spring Boot");
        }
    }
}
