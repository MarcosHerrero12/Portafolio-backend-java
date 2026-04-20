package com.portfolio.commerce.controller;

import com.portfolio.commerce.entity.Category;
import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.service.CategoryService;
import com.portfolio.commerce.service.ProductService;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final UserRepository userRepository;

    // Get products based on role
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAdminProducts(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.ok(productService.getAllProducts());
        } else {
            return ResponseEntity.ok(productService.getProductsBySellerId(user.getId()));
        }
    }

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Product product
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        
        // Prevent pending sellers from creating products
        if (user.getRole().name().equals("SELLER") && user.getSellerStatus() != com.portfolio.commerce.entity.SellerStatus.APPROVED) {
            throw new AccessDeniedException("Tu cuenta de vendedor está pendiente de aprobación.");
        }
        
        product.setSeller(user);
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id, 
            @RequestBody Product product
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Product existingProduct = productService.getProductById(id);

        // Security check: only admin or the seller themselves can update
        if (!user.getRole().name().equals("ADMIN") && !existingProduct.getSeller().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to update this product");
        }

        // Check if seller is approved to update
        if (user.getRole().name().equals("SELLER") && user.getSellerStatus() != com.portfolio.commerce.entity.SellerStatus.APPROVED) {
            throw new AccessDeniedException("Tu cuenta de vendedor está pendiente de aprobación.");
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setImageUrl(product.getImageUrl());
        if (product.getCategory() != null) {
            existingProduct.setCategory(product.getCategory());
        }
        return ResponseEntity.ok(productService.saveProduct(existingProduct));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Product existingProduct = productService.getProductById(id);

        if (!user.getRole().name().equals("ADMIN") && !existingProduct.getSeller().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this product");
        }

        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Seller Management (ADMIN ONLY)
    @GetMapping("/sellers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getPendingSellers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("SELLER") && u.getSellerStatus() == com.portfolio.commerce.entity.SellerStatus.PENDING)
                .toList());
    }

    @PostMapping("/sellers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> approveSeller(@PathVariable Long id) {
        User seller = userRepository.findById(id).orElseThrow();
        seller.setSellerStatus(com.portfolio.commerce.entity.SellerStatus.APPROVED);
        return ResponseEntity.ok(userRepository.save(seller));
    }

    @PostMapping("/sellers/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> rejectSeller(@PathVariable Long id) {
        User seller = userRepository.findById(id).orElseThrow();
        seller.setSellerStatus(com.portfolio.commerce.entity.SellerStatus.REJECTED);
        return ResponseEntity.ok(userRepository.save(seller));
    }

    // Category Management - Only ADMIN can create categories
    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}
