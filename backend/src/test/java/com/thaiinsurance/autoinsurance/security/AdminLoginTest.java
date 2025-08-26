package com.thaiinsurance.autoinsurance.security;

import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AdminLoginTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Test
    public void testAdminUserExists() {
        User adminUser = userRepository.findByEmail("admin@insurance.com").orElse(null);
        assertNotNull(adminUser, "Admin user should exist");
        assertEquals(Role.ADMIN, adminUser.getRole());
        assertTrue(adminUser.getIsActive());
    }
    
    @Test
    public void testPasswordEncoding() {
        User adminUser = userRepository.findByEmail("admin@insurance.com").orElse(null);
        assertNotNull(adminUser);
        
        // Test password matches
        boolean matches = passwordEncoder.matches("Admin@123", adminUser.getPassword());
        assertTrue(matches, "Password should match encoded version");
    }
    
    @Test
    public void testUserDetailsService() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin@insurance.com");
        assertNotNull(userDetails);
        assertEquals("admin", userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        
        // Check authorities
        assertNotNull(userDetails.getAuthorities());
        assertFalse(userDetails.getAuthorities().isEmpty());
        
        boolean hasAdminRole = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        assertTrue(hasAdminRole, "User should have ROLE_ADMIN authority");
    }
    
    @Test
    public void testAuthentication() {
        try {
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken("admin@insurance.com", "Admin@123");
            
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            assertNotNull(authentication);
            assertTrue(authentication.isAuthenticated());
            assertEquals("admin", authentication.getName());
            
            boolean hasAdminRole = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            assertTrue(hasAdminRole, "Authenticated user should have ROLE_ADMIN authority");
            
        } catch (Exception e) {
            fail("Authentication should succeed: " + e.getMessage());
        }
    }
}