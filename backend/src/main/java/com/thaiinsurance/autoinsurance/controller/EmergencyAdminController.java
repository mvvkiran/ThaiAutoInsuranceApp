package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.CustomUserDetailsService;
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

@RestController
@RequestMapping("/api/emergency")
public class EmergencyAdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(EmergencyAdminController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @PostMapping("/fix-admin-now")
    public ResponseEntity<ApiResponse<Map<String, Object>>> fixAdminNow() {
        Map<String, Object> result = new HashMap<>();
        String adminEmail = "admin@insurance.com";
        String adminPassword = "Admin@123";
        
        logger.info("🚨 EMERGENCY ADMIN FIX STARTING");
        
        try {
            // Step 1: Delete any existing admin
            userRepository.findByEmail(adminEmail).ifPresent(user -> {
                userRepository.delete(user);
                logger.info("❌ Deleted existing admin user");
            });
            
            // Step 2: Create new admin with exact same pattern as working agent
            User admin = new User("admin", adminEmail, passwordEncoder.encode(adminPassword));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setPhoneNumber("0812345678");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            admin.setPhoneVerified(true);
            admin.setFailedLoginAttempts(0);
            admin.setAccountLocked(false);
            admin.setPasswordChangeRequired(false);
            
            User savedAdmin = userRepository.save(admin);
            logger.info("✅ Created new admin: ID={}, Role={}", savedAdmin.getId(), savedAdmin.getRole());
            
            result.put("step1_adminCreated", true);
            result.put("step1_adminId", savedAdmin.getId());
            result.put("step1_role", savedAdmin.getRole().toString());
            
            // Step 3: Test password immediately
            boolean passwordMatches = passwordEncoder.matches(adminPassword, savedAdmin.getPassword());
            result.put("step2_passwordMatches", passwordMatches);
            logger.info("🔐 Password matches: {}", passwordMatches);
            
            // Step 4: Test UserDetails loading
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(adminEmail);
                result.put("step3_userDetailsLoaded", true);
                result.put("step3_authorities", userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority()).toArray());
                logger.info("👤 UserDetails loaded successfully with authorities: {}", 
                           userDetails.getAuthorities());
            } catch (Exception e) {
                result.put("step3_userDetailsLoaded", false);
                result.put("step3_error", e.getMessage());
                logger.error("❌ UserDetails loading failed", e);
            }
            
            // Step 5: Test authentication
            try {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(adminEmail, adminPassword);
                
                Authentication auth = authenticationManager.authenticate(authToken);
                
                result.put("step4_authenticationSuccessful", true);
                result.put("step4_authenticated", auth.isAuthenticated());
                result.put("step4_authorities", auth.getAuthorities().stream()
                    .map(authority -> authority.getAuthority()).toArray());
                
                logger.info("🎉 AUTHENTICATION SUCCESSFUL! Authorities: {}", auth.getAuthorities());
                
            } catch (Exception e) {
                result.put("step4_authenticationSuccessful", false);
                result.put("step4_error", e.getMessage());
                result.put("step4_errorClass", e.getClass().getSimpleName());
                logger.error("❌ Authentication failed", e);
            }
            
            result.put("success", true);
            result.put("message", "Admin fix completed - check individual steps for details");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            logger.error("💥 EMERGENCY FIX FAILED", e);
        }
        
        logger.info("🏁 EMERGENCY ADMIN FIX COMPLETE");
        
        return ResponseEntity.ok(ApiResponse.success("Emergency admin fix executed", result));
    }
    
    @GetMapping("/check-admin-vs-agent")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkAdminVsAgent() {
        Map<String, Object> result = new HashMap<>();
        
        // Get both users
        User admin = userRepository.findByEmail("admin@insurance.com").orElse(null);
        User agent = userRepository.findByEmail("agent@insurance.com").orElse(null);
        
        if (admin == null) {
            result.put("error", "Admin user not found");
            return ResponseEntity.ok(ApiResponse.error("Admin user not found", result));
        }
        
        if (agent == null) {
            result.put("error", "Agent user not found");
            return ResponseEntity.ok(ApiResponse.error("Agent user not found", result));
        }
        
        // Compare everything
        Map<String, Object> comparison = new HashMap<>();
        
        comparison.put("admin_id", admin.getId());
        comparison.put("agent_id", agent.getId());
        comparison.put("admin_role", admin.getRole().toString());
        comparison.put("agent_role", agent.getRole().toString());
        comparison.put("admin_isActive", admin.getIsActive());
        comparison.put("agent_isActive", agent.getIsActive());
        comparison.put("admin_emailVerified", admin.getEmailVerified());
        comparison.put("agent_emailVerified", agent.getEmailVerified());
        comparison.put("admin_accountLocked", admin.getAccountLocked());
        comparison.put("agent_accountLocked", agent.getAccountLocked());
        comparison.put("admin_failedAttempts", admin.getFailedLoginAttempts());
        comparison.put("agent_failedAttempts", agent.getFailedLoginAttempts());
        comparison.put("admin_passwordChangeRequired", admin.getPasswordChangeRequired());
        comparison.put("agent_passwordChangeRequired", agent.getPasswordChangeRequired());
        
        // Test passwords
        comparison.put("admin_passwordMatches", passwordEncoder.matches("Admin@123", admin.getPassword()));
        comparison.put("agent_passwordMatches", passwordEncoder.matches("Agent@123", agent.getPassword()));
        
        // Test roles method
        comparison.put("admin_roles", admin.getRoles());
        comparison.put("agent_roles", agent.getRoles());
        comparison.put("admin_rolesSize", admin.getRoles().size());
        comparison.put("agent_rolesSize", agent.getRoles().size());
        
        result.put("comparison", comparison);
        
        // Find differences
        Map<String, String> differences = new HashMap<>();
        if (!admin.getIsActive().equals(agent.getIsActive())) {
            differences.put("isActive", "Different");
        }
        if (!admin.getEmailVerified().equals(agent.getEmailVerified())) {
            differences.put("emailVerified", "Different");
        }
        if (!admin.getAccountLocked().equals(agent.getAccountLocked())) {
            differences.put("accountLocked", "Different");
        }
        
        boolean adminPwMatch = passwordEncoder.matches("Admin@123", admin.getPassword());
        boolean agentPwMatch = passwordEncoder.matches("Agent@123", agent.getPassword());
        if (adminPwMatch != agentPwMatch) {
            differences.put("passwordMatches", "Admin: " + adminPwMatch + ", Agent: " + agentPwMatch);
        }
        
        result.put("differences", differences);
        result.put("hasDifferences", !differences.isEmpty());
        
        return ResponseEntity.ok(ApiResponse.success("Admin vs Agent comparison complete", result));
    }
}