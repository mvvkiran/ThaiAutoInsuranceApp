package com.thaiinsurance.autoinsurance.dto.auth;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class RegisterResponse {
    
    private String customerId;
    private boolean verificationRequired;
    private List<String> verificationMethods;
    private String message;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    // Constructors
    public RegisterResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public RegisterResponse(String customerId, boolean verificationRequired, 
                           List<String> verificationMethods, String message) {
        this.customerId = customerId;
        this.verificationRequired = verificationRequired;
        this.verificationMethods = verificationMethods;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    
    public boolean isVerificationRequired() {
        return verificationRequired;
    }
    
    public void setVerificationRequired(boolean verificationRequired) {
        this.verificationRequired = verificationRequired;
    }
    
    public List<String> getVerificationMethods() {
        return verificationMethods;
    }
    
    public void setVerificationMethods(List<String> verificationMethods) {
        this.verificationMethods = verificationMethods;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}