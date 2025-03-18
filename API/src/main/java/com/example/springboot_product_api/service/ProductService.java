package com.example.springboot_product_api.service;

import com.example.springboot_product_api.entities.Product;
import com.example.springboot_product_api.exception.ResourceNotFoundException;
import com.example.springboot_product_api.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {

    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product not found with id " + id));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = Product.builder()
                .id(id)
                .name(productDetails.getName())
                .description(productDetails.getDescription())
                .price(productDetails.getPrice())
                .build();
        try {
            return productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("failed to update product with id " + id);

        }
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        try {
            productRepository.delete(product);
        } catch (Exception e) {
            throw new RuntimeException("failed to delete product with id " + id);
        }
    }
}
