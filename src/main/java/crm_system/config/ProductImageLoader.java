package crm_system.config;

import crm_system.entity.Product;
import crm_system.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Updates products with working image URLs on startup.
 */
@Component
public class ProductImageLoader implements CommandLineRunner {

    private final ProductService productService;

    // Map of product name keywords to specific working image URLs
    private static final Map<String, String> PRODUCT_IMAGES = Map.ofEntries(
        Map.entry("spider", "https://m.media-amazon.com/images/I/81-fEi8oGjL._AC_SL1500_.jpg"),
        Map.entry("batman", "https://m.media-amazon.com/images/I/71YMKJaGbBL._AC_SL1500_.jpg"),
        Map.entry("iron man", "https://m.media-amazon.com/images/I/71cSrCDB2BL._AC_SL1500_.jpg"),
        Map.entry("goku", "https://m.media-amazon.com/images/I/71tgff3cNHL._AC_SL1500_.jpg"),
        Map.entry("naruto", "https://m.media-amazon.com/images/I/71n0E2fORCL._AC_SL1500_.jpg"),
        Map.entry("luffy", "https://m.media-amazon.com/images/I/61Y95AXUHZL._AC_SL1500_.jpg"),
        Map.entry("captain", "https://m.media-amazon.com/images/I/81KPFm-gYJL._AC_SL1500_.jpg"),
        Map.entry("thor", "https://m.media-amazon.com/images/I/71H30s+aJ3L._AC_SL1500_.jpg"),
        Map.entry("hulk", "https://m.media-amazon.com/images/I/71pHlGMYXEL._AC_SL1500_.jpg"),
        Map.entry("deadpool", "https://m.media-amazon.com/images/I/71b-yGrCMpL._AC_SL1500_.jpg")
    );

    // Fallback images for any product not matching the above keywords
    private static final String[] FALLBACK_IMAGES = {
        "https://m.media-amazon.com/images/I/81-fEi8oGjL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71YMKJaGbBL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71cSrCDB2BL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71tgff3cNHL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71n0E2fORCL._AC_SL1500_.jpg",
    };

    public ProductImageLoader(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public void run(String... args) {
        List<Product> products = productService.getAllProducts();
        int updated = 0;

        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            String matchedUrl = findImageForProduct(product.getName());

            if (matchedUrl == null) {
                matchedUrl = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            }

            // Always update to ensure working URLs
            product.setImageUrl(matchedUrl);
            productService.saveProduct(product);
            updated++;
        }

        if (updated > 0) {
            System.out.println("✦ ProductImageLoader: Updated " + updated + " product(s) with images.");
        }
    }

    private String findImageForProduct(String productName) {
        if (productName == null) return null;
        String lower = productName.toLowerCase();
        for (Map.Entry<String, String> entry : PRODUCT_IMAGES.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }
}
