package crm_system.service;

import crm_system.entity.User;
import crm_system.repository.UserRepository;
import crm_system.entity.Customer;
import crm_system.repository.CustomerRepository;
import crm_system.enums.CustomerStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerRepository = customerRepository;
    }

    @Override
    public User registerUser(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("CUSTOMER");
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        if (!customerRepository.findByEmail(username + "@crm.com").isPresent()) {
            Customer customer = new Customer();
            customer.setFirstName(username);
            customer.setLastName("");
            customer.setEmail(username + "@crm.com");
            customer.setStatus(CustomerStatus.ACTIVE);
            customerRepository.save(customer);
        }

        return savedUser;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}