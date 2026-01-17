package crm_system.repository;

import crm_system.entity.Customer;
import crm_system.enums.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    List<Customer> findByStatus(CustomerStatus status);
}
