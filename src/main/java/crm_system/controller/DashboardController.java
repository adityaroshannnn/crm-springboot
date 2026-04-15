package crm_system.controller;

import crm_system.entity.Order;
import crm_system.entity.Product;
import crm_system.service.CustomerService;
import crm_system.service.OrderService;
import crm_system.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
        List<Order> allOrders = orderService.getAllOrders();
        List<Product> allProducts = productService.getAllProducts();

        // Basic stats
        int totalCustomers = customerService.getAllCustomers().size();
        int totalProducts = allProducts.size();
        int totalOrders = allOrders.size();
        double totalRevenue = allOrders.stream().mapToDouble(Order::getTotalPrice).sum();

        // Monthly revenue (last 6 months)
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        String[] monthNames = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            double revenue = allOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(monthStart) && o.getCreatedAt().isBefore(monthEnd))
                    .mapToDouble(Order::getTotalPrice)
                    .sum();
            long count = allOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(monthStart) && o.getCreatedAt().isBefore(monthEnd))
                    .count();
            monthlyRevenue.add(Map.of(
                    "month", monthNames[monthStart.getMonthValue() - 1] + " " + monthStart.getYear(),
                    "revenue", revenue,
                    "orders", count
            ));
        }

        // Top 5 products by order count
        Map<String, Long> productOrderCounts = allOrders.stream()
                .filter(o -> o.getProduct() != null)
                .collect(Collectors.groupingBy(o -> o.getProduct().getName(), Collectors.counting()));
        List<Map<String, Object>> topProducts = productOrderCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> Map.<String, Object>of("name", e.getKey(), "orders", e.getValue()))
                .collect(Collectors.toList());

        // Order status distribution
        Map<String, Long> statusDist = allOrders.stream()
                .collect(Collectors.groupingBy(o -> o.getStatus().name(), Collectors.counting()));

        // Recent 5 orders
        List<Map<String, Object>> recentOrders = allOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId());
                    m.put("customer", o.getCustomer() != null ? o.getCustomer().getFirstName() + " " + o.getCustomer().getLastName() : "N/A");
                    m.put("product", o.getProduct() != null ? o.getProduct().getName() : "N/A");
                    m.put("total", o.getTotalPrice());
                    m.put("status", o.getStatus().name());
                    m.put("date", o.getCreatedAt() != null ? o.getCreatedAt().toLocalDate().toString() : "");
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalCustomers", totalCustomers);
        result.put("totalProducts", totalProducts);
        result.put("totalOrders", totalOrders);
        result.put("totalRevenue", totalRevenue);
        result.put("monthlyRevenue", monthlyRevenue);
        result.put("topProducts", topProducts);
        result.put("statusDistribution", statusDist);
        result.put("recentOrders", recentOrders);
        return result;
    }
}
