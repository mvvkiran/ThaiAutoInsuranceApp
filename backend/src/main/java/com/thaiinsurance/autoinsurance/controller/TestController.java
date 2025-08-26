package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.dto.PolicyDTO;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.service.PolicyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PolicyService policyService;
    
    @GetMapping("/verify-users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyUsers() {
        Map<String, Object> result = new HashMap<>();
        
        logger.info("=== VERIFYING ALL USERS ===");
        
        // Check all users
        String[] emails = {
            "admin@insurance.com",
            "agent@insurance.com", 
            "customer@insurance.com",
            "underwriter@insurance.com",
            "adjuster@insurance.com"
        };
        
        String[] passwords = {
            "Admin@123",
            "Agent@123",
            "Customer@123", 
            "Underwriter@123",
            "Adjuster@123"
        };
        
        for (int i = 0; i < emails.length; i++) {
            String email = emails[i];
            String password = passwords[i];
            Map<String, Object> userInfo = new HashMap<>();
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
                
                userInfo.put("exists", true);
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                userInfo.put("role", user.getRole().toString());
                userInfo.put("isActive", user.getIsActive());
                userInfo.put("emailVerified", user.getEmailVerified());
                userInfo.put("passwordMatches", passwordMatches);
                userInfo.put("roles", user.getRoles());
                userInfo.put("rolesSize", user.getRoles().size());
                
                logger.info("User {}: exists={}, role={}, active={}, passwordMatches={}", 
                           email, true, user.getRole(), user.getIsActive(), passwordMatches);
            } else {
                userInfo.put("exists", false);
                logger.error("User {} not found!", email);
            }
            
            result.put(email, userInfo);
        }
        
        return ResponseEntity.ok(ApiResponse.success("User verification complete", result));
    }
    
    @PostMapping("/test-password")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> result = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            
            result.put("userExists", true);
            result.put("passwordMatches", matches);
            result.put("storedPasswordLength", user.getPassword().length());
            result.put("providedPasswordLength", password.length());
            result.put("role", user.getRole().toString());
            result.put("isActive", user.getIsActive());
            
            logger.info("Password test for {}: matches={}", email, matches);
        } else {
            result.put("userExists", false);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Password test complete", result));
    }
    
    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<Page<PolicyDTO>>> testPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        logger.info("Testing policies endpoint - page: {}, size: {}", page, size);
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Policy> policies = policyService.getAllPolicies(pageable);
            
            // Convert to DTO to avoid circular references
            Page<PolicyDTO> policyDTOs = policies.map(PolicyDTO::new);
            
            logger.info("Found {} policies, returning page {}/{}", 
                       policies.getTotalElements(), page + 1, policies.getTotalPages());
            
            return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policyDTOs));
            
        } catch (Exception e) {
            logger.error("Error retrieving policies: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve policies: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Test endpoint is working", "OK"));
    }
}