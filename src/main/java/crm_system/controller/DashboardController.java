package crm_system.controller;

import crm_system.service.CustomerService;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
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

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalCustomers", customerService.getAllCustomers().size());
        model.addAttribute("totalProducts", productService.getAllProducts().size());
        model.addAttribute("totalOrders", orderService.getAllOrders().size());
        model.addAttribute("totalRevenue", orderService.getTotalRevenue());
        return "dashboard";
    }
}
