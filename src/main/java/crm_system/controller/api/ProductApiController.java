package crm_system.controller.api;

import crm_system.entity.Product;
import crm_system.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductApiController {

    private final ProductService productService;

    public ProductApiController(ProductService productService) {
        this.productService = productService;
    }

    // This endpoint returns data as raw JSON instead of an HTML webpage
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
}
