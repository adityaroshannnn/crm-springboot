package crm_system.service;

import crm_system.entity.Customer;
import crm_system.enums.CustomerStatus;

import java.util.List;

public interface CustomerService {

    Customer saveCustomer(Customer customer);

    List<Customer> getAllCustomers();

    Customer getCustomerById(int id);

    List<Customer> getCustomersByStatus(CustomerStatus status);

    void deleteCustomer(int id);
}

