package crm_system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactForwardingController {

    // Match all routes that do not contain a period (like .js, .css)
    // and aren't prefixed with /api, and forward them to the React index.html
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
