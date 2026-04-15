package crm_system.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all client-side SPA routes to index.html so that
 * React Router can handle them. Without this, refreshing a
 * page like /dashboard would return a 404 from Spring Boot.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/customers",
        "/managers",
        "/products",
        "/orders",
        "/my-orders",
        "/shop",
        "/shop/{id}",
        "/store-settings",
        "/help-desk",
        "/contact",
        "/profile"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
