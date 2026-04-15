package crm_system.service;

import crm_system.entity.Order;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Real Gmail Email notification service.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(Order order) {
        String customerEmail = order.getCustomer() != null ? order.getCustomer().getEmail() : null;
        if (customerEmail == null) return;

        String productName = order.getProduct() != null ? order.getProduct().getName() : "Product";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("crmsystemme@gmail.com");
            message.setTo(customerEmail);
            message.setSubject("Order #" + order.getId() + " Confirmed! — CRM Store");
            message.setText(String.format(
                "Hello %s,\n\nThank you for your order!\n\nOrder Details:\n- Item: %s\n- Quantity: %d\n- Total: ₹%.2f\n- Status: %s\n\nWe will notify you when your order is shipped.\n\nBest regards,\nThe CRM Store Team",
                order.getCustomer().getFirstName(), productName, order.getQuantity(), order.getTotalPrice(), order.getStatus()
            ));

            mailSender.send(message);
            System.out.println("✅ Real email sent to: " + customerEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send real email: " + e.getMessage());
            // Fallback to console log for debugging
            logToConsole(order);
        }
    }

    public void sendStatusUpdate(Order order) {
        String customerEmail = order.getCustomer() != null ? order.getCustomer().getEmail() : null;
        if (customerEmail == null) return;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("crmsystemme@gmail.com");
            message.setTo(customerEmail);
            message.setSubject("Order #" + order.getId() + " Status Update — CRM Store");
            message.setText(String.format(
                "Hello %s,\n\nYour order #%d has been updated to: %s.\n\nThank you for shopping with us!",
                order.getCustomer().getFirstName(), order.getId(), order.getStatus().toString().replace("_", " ")
            ));

            mailSender.send(message);
            System.out.println("✅ Status update email sent to: " + customerEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send status update email: " + e.getMessage());
        }
    }

    private void logToConsole(Order order) {
        System.out.println("📧 [Simulated Email] To: " + order.getCustomer().getEmail() + " | Status: " + order.getStatus());
    }
}
