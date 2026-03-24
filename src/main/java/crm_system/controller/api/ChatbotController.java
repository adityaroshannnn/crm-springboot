package crm_system.controller.api;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "").toLowerCase().trim();
        String response;

        if (message.contains("hello") || message.contains("hi") || message.contains("hey")) {
            response = "Greetings. I am the Archive Concierge. How may I be of service to you today?";
        } else if (message.contains("shipping") || message.contains("delivery") || message.contains("long") || message.contains("track")) {
            response = "Your acquisitions are handled with the utmost care. Standard carriage requires 3-5 days. For patrons with requisitions over $100, complimentary expedited shipping is provided. Please refer to your 'Acquisitions' tab to track their journey.";
        } else if (message.contains("return") || message.contains("exchange") || message.contains("refund")) {
            response = "Should an item not meet your exacting standards, we graciously accept returns within 30 days. The merchandise must remain pristine. Kindly contact our staff at support@otakuhub.com to arrange the return logistics.";
        } else if (message.contains("payment") || message.contains("pay") || message.contains("card")) {
            response = "We ensure absolute security for all transactions via Razorpay. We accept all major Credit and Debit facilities, as well as UPI and Net Banking.";
        } else if (message.contains("discount") || message.contains("promo") || message.contains("sale") || message.contains("coupon")) {
            response = "Our collection is already curated at exceptional value; however, we sporadically unveil seasonal privileges to our esteemed members. Keep a close watch on the Boutique.";
        } else if (message.contains("stock") || message.contains("sold out") || message.contains("available") || message.contains("inventory")) {
            response = "I apologize, but our exclusive items are highly sought after and may deplete swiftly. If an artifact is unavailable, rest assured our curators are diligently attempting to secure more.";
        } else {
            response = "I humbly beg your pardon, but I am unable to decipher that request. May I assist you regarding **shipping**, **returns**, **payments**, or our current **inventory**?";
        }

        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        return result;
    }
}
