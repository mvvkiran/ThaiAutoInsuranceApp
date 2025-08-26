package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin-fix")
public class AdminFixController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminFixController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/recreate-admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recreateAdminUser() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String adminEmail = "admin@insurance.com";
            
            // First, delete existing admin user if exists
            Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
            if (existingAdmin.isPresent()) {
                userRepository.delete(existingAdmin.get());
                logger.info("Deleted existing admin user");
            }
            
            // Create fresh admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
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
            
            // Verify the saved user
            boolean passwordMatches = passwordEncoder.matches("Admin@123", savedAdmin.getPassword());
            
            result.put("success", true);
            result.put("adminId", savedAdmin.getId());
            result.put("email", savedAdmin.getEmail());
            result.put("role", savedAdmin.getRole().toString());
            result.put("isActive", savedAdmin.getIsActive());
            result.put("passwordMatches", passwordMatches);
            result.put("roles", savedAdmin.getRoles());
            result.put("authorities", savedAdmin.getRoles().stream()
                    .map(role -> role.getAuthority()).toArray());
            
            logger.info("✅ Admin user recreated successfully: {} (ID: {})", adminEmail, savedAdmin.getId());
            
            return ResponseEntity.ok(ApiResponse.success("Admin user recreated successfully", result));
            
        } catch (Exception e) {
            logger.error("❌ Error recreating admin user", e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("Failed to recreate admin user", result));
        }
    }
    
    @GetMapping("/compare-users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> compareUsers() {
        Map<String, Object> result = new HashMap<>();
        
        // Compare admin and agent users
        Optional<User> adminOpt = userRepository.findByEmail("admin@insurance.com");
        Optional<User> agentOpt = userRepository.findByEmail("agent@insurance.com");
        
        if (adminOpt.isPresent() && agentOpt.isPresent()) {
            User admin = adminOpt.get();
            User agent = agentOpt.get();
            
            Map<String, Object> adminInfo = getUserInfo(admin, "Admin@123");
            Map<String, Object> agentInfo = getUserInfo(agent, "Agent@123");
            
            result.put("admin", adminInfo);
            result.put("agent", agentInfo);
            
            // Find differences
            Map<String, String> differences = new HashMap<>();
            if (!adminInfo.get("passwordMatches").equals(agentInfo.get("passwordMatches"))) {
                differences.put("passwordMatches", "Admin: " + adminInfo.get("passwordMatches") + ", Agent: " + agentInfo.get("passwordMatches"));
            }
            if (!adminInfo.get("isActive").equals(agentInfo.get("isActive"))) {
                differences.put("isActive", "Admin: " + adminInfo.get("isActive") + ", Agent: " + agentInfo.get("isActive"));
            }
            if (!adminInfo.get("emailVerified").equals(agentInfo.get("emailVerified"))) {
                differences.put("emailVerified", "Admin: " + adminInfo.get("emailVerified") + ", Agent: " + agentInfo.get("emailVerified"));
            }
            
            result.put("differences", differences);
            result.put("hasDifferences", !differences.isEmpty());
            
        } else {
            result.put("error", "Admin or Agent user not found");
            result.put("adminExists", adminOpt.isPresent());
            result.put("agentExists", agentOpt.isPresent());
        }
        
        return ResponseEntity.ok(ApiResponse.success("User comparison complete", result));
    }
    
    private Map<String, Object> getUserInfo(User user, String testPassword) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("role", user.getRole().toString());
        info.put("isActive", user.getIsActive());
        info.put("emailVerified", user.getEmailVerified());
        info.put("phoneVerified", user.getPhoneVerified());
        info.put("accountLocked", user.getAccountLocked());
        info.put("failedLoginAttempts", user.getFailedLoginAttempts());
        info.put("passwordChangeRequired", user.getPasswordChangeRequired());
        info.put("passwordMatches", passwordEncoder.matches(testPassword, user.getPassword()));
        info.put("roles", user.getRoles());
        info.put("rolesSize", user.getRoles().size());
        info.put("authorities", user.getRoles().stream()
                .map(role -> role.getAuthority()).toArray());
        return info;
    }
}