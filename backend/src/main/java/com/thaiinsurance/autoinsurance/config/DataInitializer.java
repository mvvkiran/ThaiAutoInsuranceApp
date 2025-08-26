package com.thaiinsurance.autoinsurance.config;

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

@Component
@Order(1) // Execute first
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("=== STARTING DEFAULT USERS INITIALIZATION ===");
        
        try {
            // Create Admin User
            createAdminUser();
            
            // Create Agent User
            createAgentUser();
            
            // Create Customer User
            createCustomerUser();
            
            // Create Underwriter User
            createUnderwriterUser();
            
            // Create Claims Adjuster User
            createClaimsAdjusterUser();
            
            logger.info("=== DEFAULT USERS INITIALIZATION COMPLETED SUCCESSFULLY ===");
            
        } catch (Exception e) {
            logger.error("=== ERROR DURING USER INITIALIZATION ===", e);
            throw e;
        }
    }
    
    private void createAdminUser() {
        String adminEmail = "admin@insurance.com";
        logger.info("Creating admin user with email: {}", adminEmail);
        
        // Always recreate admin user to ensure it's correct
        userRepository.findByEmail(adminEmail).ifPresent(user -> {
            userRepository.delete(user);
            logger.info("Deleted existing admin user for recreation");
        });
        
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail(adminEmail);
        String encodedPassword = passwordEncoder.encode("Admin@123");
        admin.setPassword(encodedPassword);
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
        
        User savedUser = userRepository.save(admin);
        
        // Immediately verify the created user
        boolean passwordMatches = passwordEncoder.matches("Admin@123", savedUser.getPassword());
        logger.info("✅ Admin user created successfully: {} (ID: {}, Role: {}, PasswordMatches: {})", 
                   adminEmail, savedUser.getId(), savedUser.getRole(), passwordMatches);
        
        // Test roles method
        logger.info("Admin roles: {}, size: {}", savedUser.getRoles(), savedUser.getRoles().size());
    }
    
    private void createAgentUser() {
        String agentEmail = "agent@insurance.com";
        if (!userRepository.existsByEmail(agentEmail)) {
            User agent = new User();
            agent.setUsername("agent");
            agent.setEmail(agentEmail);
            agent.setPassword(passwordEncoder.encode("Agent@123"));
            agent.setFirstName("Insurance");
            agent.setLastName("Agent");
            agent.setPhoneNumber("0823456789");
            agent.setRole(Role.AGENT);
            agent.setIsActive(true);
            agent.setEmailVerified(true);
            agent.setPhoneVerified(true);
            
            userRepository.save(agent);
            logger.info("Agent user created: {}", agentEmail);
        } else {
            logger.info("Agent user already exists: {}", agentEmail);
        }
    }
    
    private void createCustomerUser() {
        String customerEmail = "customer@insurance.com";
        if (!userRepository.existsByEmail(customerEmail)) {
            User customer = new User();
            customer.setUsername("customer");
            customer.setEmail(customerEmail);
            customer.setPassword(passwordEncoder.encode("Customer@123"));
            customer.setFirstName("Test");
            customer.setLastName("Customer");
            customer.setPhoneNumber("0834567890");
            customer.setRole(Role.CUSTOMER);
            customer.setIsActive(true);
            customer.setEmailVerified(true);
            customer.setPhoneVerified(true);
            
            userRepository.save(customer);
            logger.info("Customer user created: {}", customerEmail);
        } else {
            logger.info("Customer user already exists: {}", customerEmail);
        }
    }
    
    private void createUnderwriterUser() {
        String underwriterEmail = "underwriter@insurance.com";
        if (!userRepository.existsByEmail(underwriterEmail)) {
            User underwriter = new User();
            underwriter.setUsername("underwriter");
            underwriter.setEmail(underwriterEmail);
            underwriter.setPassword(passwordEncoder.encode("Underwriter@123"));
            underwriter.setFirstName("Risk");
            underwriter.setLastName("Underwriter");
            underwriter.setPhoneNumber("0845678901");
            underwriter.setRole(Role.UNDERWRITER);
            underwriter.setIsActive(true);
            underwriter.setEmailVerified(true);
            underwriter.setPhoneVerified(true);
            
            userRepository.save(underwriter);
            logger.info("Underwriter user created: {}", underwriterEmail);
        } else {
            logger.info("Underwriter user already exists: {}", underwriterEmail);
        }
    }
    
    private void createClaimsAdjusterUser() {
        String adjusterEmail = "adjuster@insurance.com";
        if (!userRepository.existsByEmail(adjusterEmail)) {
            User adjuster = new User();
            adjuster.setUsername("adjuster");
            adjuster.setEmail(adjusterEmail);
            adjuster.setPassword(passwordEncoder.encode("Adjuster@123"));
            adjuster.setFirstName("Claims");
            adjuster.setLastName("Adjuster");
            adjuster.setPhoneNumber("0856789012");
            adjuster.setRole(Role.CLAIMS_ADJUSTER);
            adjuster.setIsActive(true);
            adjuster.setEmailVerified(true);
            adjuster.setPhoneVerified(true);
            
            userRepository.save(adjuster);
            logger.info("Claims Adjuster user created: {}", adjusterEmail);
        } else {
            logger.info("Claims Adjuster user already exists: {}", adjusterEmail);
        }
    }
}