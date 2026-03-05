package crm_system.service;

import crm_system.entity.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getAllOrders();
    List<Order> getOrdersByCustomerId(int customerId);
    Order getOrderById(Long id);
    Order saveOrder(Order order);
    double getTotalRevenue();
}