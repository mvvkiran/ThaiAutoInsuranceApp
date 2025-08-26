package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.CustomUserDetailsService;
import com.thaiinsurance.autoinsurance.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/login-debug")
public class LoginDebugController {
    
    private static final Logger logger = LoggerFactory.getLogger(LoginDebugController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @PostMapping("/step-by-step")
    public ResponseEntity<ApiResponse<Map<String, Object>>> stepByStepLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> result = new HashMap<>();
        
        logger.info("=== STEP-BY-STEP LOGIN DEBUG FOR: {} ===", email);
        
        try {
            // Step 1: Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                result.put("step1_userExists", false);
                result.put("error", "User not found");
                return ResponseEntity.ok(ApiResponse.error("User not found", result));
            }
            
            User user = userOpt.get();
            result.put("step1_userExists", true);
            result.put("step1_userId", user.getId());
            result.put("step1_username", user.getUsername());
            result.put("step1_role", user.getRole().toString());
            result.put("step1_isActive", user.getIsActive());
            result.put("step1_emailVerified", user.getEmailVerified());
            result.put("step1_accountLocked", user.getAccountLocked());
            
            // Step 2: Check password
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            result.put("step2_passwordMatches", passwordMatches);
            result.put("step2_storedPasswordHash", user.getPassword().substring(0, 20) + "...");
            
            if (!passwordMatches) {
                result.put("error", "Password mismatch");
                return ResponseEntity.ok(ApiResponse.error("Password does not match", result));
            }
            
            // Step 3: Load UserDetails
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                result.put("step3_userDetailsLoaded", true);
                result.put("step3_userDetailsUsername", userDetails.getUsername());
                result.put("step3_userDetailsEnabled", userDetails.isEnabled());
                result.put("step3_userDetailsAccountNonLocked", userDetails.isAccountNonLocked());
                result.put("step3_userDetailsAccountNonExpired", userDetails.isAccountNonExpired());
                result.put("step3_userDetailsCredentialsNonExpired", userDetails.isCredentialsNonExpired());
                result.put("step3_authorities", userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority()).toArray());
                
                // Check if UserPrincipal
                if (userDetails instanceof UserPrincipal) {
                    UserPrincipal principal = (UserPrincipal) userDetails;
                    result.put("step3_principalRoles", principal.getRoles());
                    result.put("step3_principalId", principal.getId());
                }
                
            } catch (Exception e) {
                result.put("step3_userDetailsLoaded", false);
                result.put("step3_error", e.getMessage());
                logger.error("UserDetailsService failed for {}", email, e);
                return ResponseEntity.ok(ApiResponse.error("UserDetailsService failed", result));
            }
            
            // Step 4: Test Authentication
            try {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(email, password);
                
                Authentication auth = authenticationManager.authenticate(authToken);
                
                result.put("step4_authenticationSuccessful", true);
                result.put("step4_authenticationName", auth.getName());
                result.put("step4_authenticationPrincipal", auth.getPrincipal().getClass().getSimpleName());
                result.put("step4_authenticationAuthorities", auth.getAuthorities().stream()
                    .map(authority -> authority.getAuthority()).toArray());
                result.put("step4_isAuthenticated", auth.isAuthenticated());
                
            } catch (Exception e) {
                result.put("step4_authenticationSuccessful", false);
                result.put("step4_error", e.getMessage());
                result.put("step4_errorClass", e.getClass().getSimpleName());
                logger.error("Authentication failed for {}", email, e);
                return ResponseEntity.ok(ApiResponse.error("Authentication failed", result));
            }
            
            result.put("overallStatus", "SUCCESS");
            result.put("message", "All login steps completed successfully");
            
        } catch (Exception e) {
            result.put("overallStatus", "FAILED");
            result.put("error", e.getMessage());
            logger.error("Unexpected error during login debug", e);
        }
        
        logger.info("=== LOGIN DEBUG COMPLETE ===");
        
        return ResponseEntity.ok(ApiResponse.success("Login debug complete", result));
    }
    
    @PostMapping("/compare-login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> compareLogin() {
        Map<String, Object> result = new HashMap<>();
        
        // Test both admin and agent
        Map<String, String> adminRequest = Map.of("email", "admin@insurance.com", "password", "Admin@123");
        Map<String, String> agentRequest = Map.of("email", "agent@insurance.com", "password", "Agent@123");
        
        ResponseEntity<ApiResponse<Map<String, Object>>> adminResult = stepByStepLogin(adminRequest);
        ResponseEntity<ApiResponse<Map<String, Object>>> agentResult = stepByStepLogin(agentRequest);
        
        result.put("adminLogin", adminResult.getBody().getData());
        result.put("agentLogin", agentResult.getBody().getData());
        
        // Compare results
        Map<String, Object> adminData = adminResult.getBody().getData();
        Map<String, Object> agentData = agentResult.getBody().getData();
        
        Map<String, String> differences = new HashMap<>();
        
        // Compare key fields
        String[] compareFields = {
            "step1_isActive", "step1_emailVerified", "step1_accountLocked",
            "step2_passwordMatches", "step3_userDetailsEnabled", 
            "step3_userDetailsAccountNonLocked", "step4_authenticationSuccessful"
        };
        
        for (String field : compareFields) {
            Object adminValue = adminData.get(field);
            Object agentValue = agentData.get(field);
            
            if (adminValue != null && agentValue != null && !adminValue.equals(agentValue)) {
                differences.put(field, "Admin: " + adminValue + ", Agent: " + agentValue);
            } else if ((adminValue == null) != (agentValue == null)) {
                differences.put(field, "Admin: " + adminValue + ", Agent: " + agentValue);
            }
        }
        
        result.put("differences", differences);
        result.put("adminSuccessful", "SUCCESS".equals(adminData.get("overallStatus")));
        result.put("agentSuccessful", "SUCCESS".equals(agentData.get("overallStatus")));
        
        return ResponseEntity.ok(ApiResponse.success("Login comparison complete", result));
    }
}