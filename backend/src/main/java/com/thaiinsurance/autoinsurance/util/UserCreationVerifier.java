package com.thaiinsurance.autoinsurance.util;

import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Order(2) // Run after DataInitializer
public class UserCreationVerifier implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(UserCreationVerifier.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("=== VERIFYING USER CREATION ===");
        
        verifyUser("admin@insurance.com", "Admin@123", Role.ADMIN);
        verifyUser("agent@insurance.com", "Agent@123", Role.AGENT);
        verifyUser("customer@insurance.com", "Customer@123", Role.CUSTOMER);
        verifyUser("underwriter@insurance.com", "Underwriter@123", Role.UNDERWRITER);
        verifyUser("adjuster@insurance.com", "Adjuster@123", Role.CLAIMS_ADJUSTER);
        
        logger.info("=== USER VERIFICATION COMPLETE ===");
    }
    
    private void verifyUser(String email, String password, Role expectedRole) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            logger.info("✅ User found: {} (Role: {}, Active: {})", 
                       email, user.getRole(), user.getIsActive());
            
            // Verify password
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            logger.info("   Password verification: {}", passwordMatches ? "✅ MATCHES" : "❌ MISMATCH");
            
            // Verify role
            boolean roleMatches = expectedRole.equals(user.getRole());
            logger.info("   Role verification: {} (Expected: {}, Actual: {})", 
                       roleMatches ? "✅ MATCHES" : "❌ MISMATCH", expectedRole, user.getRole());
            
            // Verify getRoles() method
            var roles = user.getRoles();
            logger.info("   Roles Set: {} (Size: {})", roles, roles.size());
            logger.info("   Contains expected role: {}", roles.contains(expectedRole));
            
        } else {
            logger.error("❌ User NOT found: {}", email);
        }
    }
}