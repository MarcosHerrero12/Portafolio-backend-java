package com.portfolio.commerce.service;

import com.portfolio.commerce.dto.AuthRequest;
import com.portfolio.commerce.dto.AuthResponse;
import com.portfolio.commerce.dto.RegisterRequest;
import com.portfolio.commerce.entity.Role;
import com.portfolio.commerce.entity.SellerStatus;
import com.portfolio.commerce.entity.User;
import com.portfolio.commerce.repository.UserRepository;
import com.portfolio.commerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        var userBuilder = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()));
        
        if (request.isSeller()) {
            userBuilder.role(Role.SELLER)
                    .sellerStatus(SellerStatus.PENDING)
                    .companyName(request.getCompanyName())
                    .taxId(request.getTaxId())
                    .address(request.getAddress())
                    .phoneNumber(request.getPhoneNumber());
        } else {
            userBuilder.role(Role.USER)
                    .sellerStatus(SellerStatus.NONE);
        }
        
        var user = userBuilder.build();
        repository.save(user);
        
        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .name(user.getName())
                .role(user.getRole().name())
                .sellerStatus(user.getSellerStatus().name())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .name(user.getName())
                .role(user.getRole().name())
                .sellerStatus(user.getSellerStatus().name())
                .build();
    }
}
