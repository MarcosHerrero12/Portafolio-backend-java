package com.portfolio.commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    
    // Seller registration info
    private boolean isSeller;
    private String companyName;
    private String taxId;
    private String address;
    private String phoneNumber;
}
