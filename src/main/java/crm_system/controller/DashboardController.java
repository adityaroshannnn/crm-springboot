package crm_system.controller;

import crm_system.service.CustomerService;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CustomerService customerService;
    private final ProductService productService;
    private final OrderService orderService;

    public DashboardController(CustomerService customerService,
                                ProductService productService,
                                OrderService orderService) {
        this.customerService = customerService;
        this.productService = productService;
        this.orderService = orderService;
    }

    @GetMapping
    public Map<String, Object> dashboard() {
        return Map.of(
            "totalCustomers", customerService.getAllCustomers().size(),
            "totalProducts", productService.getAllProducts().size(),
            "totalOrders", orderService.getAllOrders().size(),
            "totalRevenue", orderService.getTotalRevenue()
        );
    }
}
