package crm_system.controller;

import crm_system.entity.Customer;
import crm_system.entity.Order;
import crm_system.repository.CustomerRepository;
import crm_system.service.OrderService;
import crm_system.service.StoreSettingsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final StoreSettingsService storeSettingsService;

    public InvoiceController(OrderService orderService,
                              CustomerRepository customerRepository,
                              StoreSettingsService storeSettingsService) {
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.storeSettingsService = storeSettingsService;
    }

    @GetMapping("/{orderId}")
    public void getInvoice(@PathVariable("orderId") Long orderId,
                            Authentication authentication,
                            HttpServletResponse response) throws Exception {

        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            response.sendError(404, "Order not found");
            return;
        }

        // Verify the order belongs to the logged-in user
        String username = authentication.getName();
        Customer customer = customerRepository.findByEmail(username + "@crm.com").orElse(null);
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && (customer == null || order.getCustomer() == null ||
                customer.getId() != order.getCustomer().getId())) {
            response.sendError(403, "Access denied");
            return;
        }

        String storeName = storeSettingsService.getSettings().getStoreName();
        String productName = order.getProduct() != null ? order.getProduct().getName() : "N/A";
        String customerName = order.getCustomer() != null
                ? (order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName()).trim()
                : "Customer";
        String customerEmail = order.getCustomer() != null ? order.getCustomer().getEmail() : "";

        response.setContentType("text/html; charset=UTF-8");
        PrintWriter w = response.getWriter();

        w.println("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        w.println("<title>Invoice #" + order.getId() + " — " + storeName + "</title>");
        w.println("<style>");
        w.println("*{margin:0;padding:0;box-sizing:border-box}");
        w.println("body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d0d0d;color:#e0e0e0;padding:40px}");
        w.println(".invoice{max-width:700px;margin:0 auto;background:#1a1a1a;border:1px solid #333;border-radius:16px;overflow:hidden}");
        w.println(".header{background:#111;padding:32px 40px;border-bottom:1px solid #333;display:flex;justify-content:space-between;align-items:center}");
        w.println(".logo{font-size:24px;font-weight:700;color:#d4af37;font-family:Georgia,serif}");
        w.println(".invoice-id{color:#888;font-size:14px}");
        w.println(".body{padding:32px 40px}");
        w.println(".section{margin-bottom:24px}");
        w.println(".section-title{color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}");
        w.println(".section-value{color:#fff;font-size:15px}");
        w.println("table{width:100%;border-collapse:collapse;margin:20px 0}");
        w.println("th{text-align:left;padding:12px 0;border-bottom:1px solid #333;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px}");
        w.println("td{padding:14px 0;border-bottom:1px solid #222;font-size:15px}");
        w.println(".total-row td{border-bottom:none;padding-top:16px;font-size:18px;font-weight:700;color:#d4af37}");
        w.println(".footer{padding:24px 40px;background:#111;border-top:1px solid #333;text-align:center;color:#666;font-size:12px}");
        w.println(".status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;background:rgba(212,175,55,0.15);color:#d4af37}");
        w.println("@media print{body{background:#fff;color:#000}.invoice{border:1px solid #ddd;background:#fff}.header,.footer{background:#f9f9f9}.logo{color:#333}th,td{color:#000}.total-row td{color:#333}.status{background:#eee;color:#333}}");
        w.println("</style></head><body>");
        w.println("<div class='invoice'>");

        // Header
        w.println("<div class='header'>");
        w.println("<div><div class='logo'>✦ " + storeName + "</div></div>");
        w.println("<div class='invoice-id'>Invoice #" + order.getId() + "<br><span class='status'>" + order.getStatus() + "</span></div>");
        w.println("</div>");

        // Body
        w.println("<div class='body'>");

        // Customer info
        w.println("<div class='section'>");
        w.println("<div class='section-title'>Billed To</div>");
        w.println("<div class='section-value'>" + customerName + "<br><span style='color:#888'>" + customerEmail + "</span></div>");
        w.println("</div>");

        // Date
        w.println("<div class='section'>");
        w.println("<div class='section-title'>Date</div>");
        w.println("<div class='section-value'>" + (order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().toString() : "N/A") + "</div>");
        w.println("</div>");

        // Items
        w.println("<table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th style='text-align:right'>Total</th></tr></thead><tbody>");
        double unitPrice = order.getProduct() != null ? order.getProduct().getPrice() : order.getTotalPrice() / Math.max(order.getQuantity(), 1);
        w.println("<tr><td>" + productName + "</td><td>" + order.getQuantity() + "</td><td>₹" + String.format("%.2f", unitPrice) + "</td><td style='text-align:right'>₹" + String.format("%.2f", order.getTotalPrice()) + "</td></tr>");
        w.println("<tr class='total-row'><td colspan='3'>Total</td><td style='text-align:right'>₹" + String.format("%.2f", order.getTotalPrice()) + "</td></tr>");
        w.println("</tbody></table>");

        w.println("</div>"); // body

        // Footer
        w.println("<div class='footer'>Thank you for shopping with " + storeName + " · This is a computer-generated invoice</div>");
        w.println("</div></body></html>");
    }
}
