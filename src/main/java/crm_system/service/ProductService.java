package crm_system.service;

import crm_system.entity.Product;
import java.util.List;

public interface ProductService {
    Product saveProduct(Product product);
    List<Product> getAllProducts();
    List<Product> getActiveProducts();
    Product getProductById(Long id);
    void deleteProduct(Long id);
}