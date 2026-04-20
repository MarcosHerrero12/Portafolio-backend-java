package com.portfolio.commerce.service;

import com.portfolio.commerce.entity.Product;
import com.portfolio.commerce.entity.Review;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review addReview(Product product, User user, Integer rating, String comment) {
        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
}
