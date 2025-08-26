package com.thaiinsurance.autoinsurance.config;

import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DataInitializerTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Test
    public void testAdminUserCreation() {
        // Check if admin user was created
        User adminUser = userRepository.findByEmail("admin@insurance.com").orElse(null);
        
        assertNotNull(adminUser, "Admin user should be created by DataInitializer");
        assertEquals("admin", adminUser.getUsername());
        assertEquals("admin@insurance.com", adminUser.getEmail());
        assertEquals(Role.ADMIN, adminUser.getRole());
        assertTrue(adminUser.getIsActive());
        assertTrue(adminUser.getEmailVerified());
        
        // Verify password encoding
        assertTrue(passwordEncoder.matches("Admin@123", adminUser.getPassword()), 
                  "Password should match encoded version");
    }
    
    @Test
    public void testAgentUserCreation() {
        User agentUser = userRepository.findByEmail("agent@insurance.com").orElse(null);
        
        assertNotNull(agentUser, "Agent user should be created by DataInitializer");
        assertEquals(Role.AGENT, agentUser.getRole());
        assertTrue(passwordEncoder.matches("Agent@123", agentUser.getPassword()));
    }
    
    @Test
    public void testCustomerUserCreation() {
        User customerUser = userRepository.findByEmail("customer@insurance.com").orElse(null);
        
        assertNotNull(customerUser, "Customer user should be created by DataInitializer");
        assertEquals(Role.CUSTOMER, customerUser.getRole());
        assertTrue(passwordEncoder.matches("Customer@123", customerUser.getPassword()));
    }
    
    @Test
    public void testUserRolesMethod() {
        User adminUser = userRepository.findByEmail("admin@insurance.com").orElse(null);
        assertNotNull(adminUser);
        
        // Test getRoles() method returns Set with single role
        assertNotNull(adminUser.getRoles());
        assertFalse(adminUser.getRoles().isEmpty());
        assertTrue(adminUser.getRoles().contains(Role.ADMIN));
        assertEquals(1, adminUser.getRoles().size());
    }
}