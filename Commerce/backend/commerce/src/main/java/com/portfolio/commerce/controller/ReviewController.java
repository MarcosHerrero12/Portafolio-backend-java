package com.portfolio.commerce.controller;

import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.entity.Review;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.service.ProductService;
import com.portfolio.commerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload
    ) {
        Product product = productService.getProductById(productId);
        Integer rating = (Integer) payload.get("rating");
        String comment = (String) payload.get("comment");
        
        return ResponseEntity.ok(reviewService.addReview(product, user, rating, comment));
    }
}
