package crm_system.repository;

import crm_system.entity.Customer;
import crm_system.enums.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    List<Customer> findByStatus(CustomerStatus status);

    Optional<Customer> findByEmail(String email);
}
