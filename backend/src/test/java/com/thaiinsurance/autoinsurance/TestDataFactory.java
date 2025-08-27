package com.thaiinsurance.autoinsurance;

import com.thaiinsurance.autoinsurance.model.*;
import com.thaiinsurance.autoinsurance.dto.auth.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Centralized factory for creating consistent test data across all test classes.
 * Provides valid Thai-specific data that passes all validations.
 */
public class TestDataFactory {
    
    // Valid Thai test data constants
    public static final String VALID_NATIONAL_ID = "1234567890123";
    public static final String VALID_PHONE_NUMBER = "+66812345678";
    public static final String VALID_EMAIL = "test@example.com";
    public static final String VALID_USERNAME = "testuser";
    public static final String VALID_PASSWORD = "Password123!";
    
    /**
     * Create a valid Customer for testing
     */
    public static Customer createValidCustomer() {
        Customer customer = new Customer();
        customer.setNationalId(VALID_NATIONAL_ID);
        customer.setFirstName("Somchai");
        customer.setLastName("Jaidee");
        customer.setEmail(VALID_EMAIL);
        customer.setPhoneNumber(VALID_PHONE_NUMBER);
        customer.setDateOfBirth(LocalDate.of(1990, 1, 1));
        customer.setGender(Customer.Gender.MALE);
        customer.setAddress("123 Test Street, Bangkok, Thailand");
        customer.setProvince("Bangkok");
        customer.setPostalCode("10100");
        customer.setKycStatus(Customer.KYCStatus.PENDING);
        customer.setIsActive(true);
        customer.setPreferredLanguage(Customer.Language.THAI);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customer;
    }
    
    /**
     * Create an invalid Customer for testing validation
     */
    public static Customer createInvalidCustomer() {
        Customer customer = new Customer();
        customer.setNationalId("invalid-id");
        customer.setFirstName(""); // Empty required field
        customer.setEmail("invalid-email");
        customer.setPhoneNumber("invalid-phone");
        return customer;
    }
    
    /**
     * Create a valid User for testing
     */
    public static User createValidUser() {
        User user = new User();
        user.setUsername(VALID_USERNAME);
        user.setEmail(VALID_EMAIL);
        user.setPassword("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"); // encoded "password"
        user.setRoles(java.util.Arrays.asList(Role.CUSTOMER));
        user.setIsActive(true);
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
    
    /**
     * Create a valid RegisterRequest for testing
     */
    public static RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword(VALID_PASSWORD);
        request.setConfirmPassword(VALID_PASSWORD);
        request.setFirstName("New");
        request.setLastName("User");
        request.setNationalId("1234567890121");
        request.setPhoneNumber("+66812345678");
        request.setDateOfBirth(LocalDate.of(1990, 1, 1));
        request.setGender("MALE");
        request.setProvince("Bangkok");
        
        // Add missing required fields from validation error
        request.setAddress("123 Test Street");
        request.setAmphoe("Watthana");
        request.setTambon("Khlong Tan");
        request.setPostalCode("10110");
        request.setTermsAndConditions(true);
        request.setPrivacyPolicy(true);
        request.setDataProcessingConsent(true);
        
        return request;
    }
    
    /**
     * Create a valid LoginRequest for testing
     */
    public static LoginRequest createValidLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail(VALID_USERNAME);
        request.setPassword(VALID_PASSWORD);
        return request;
    }
    
    /**
     * Create a valid LoginResponse for testing
     */
    public static LoginResponse createValidLoginResponse() {
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            1L, VALID_USERNAME, VALID_EMAIL, "Test", "User", Set.of(Role.CUSTOMER)
        );
        
        return new LoginResponse(
            "access-token",
            "refresh-token", 
            3600L,
            userInfo
        );
    }
    
    /**
     * Create a valid RegisterResponse for testing
     */
    public static RegisterResponse createValidRegisterResponse() {
        return new RegisterResponse(
            "1",
            true,
            java.util.Arrays.asList("EMAIL", "SMS"),
            "Registration successful. Please verify your email and phone number."
        );
    }
}
