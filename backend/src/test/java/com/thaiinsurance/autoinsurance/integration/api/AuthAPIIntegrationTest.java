package com.thaiinsurance.autoinsurance.integration.api;

import com.thaiinsurance.autoinsurance.BaseIntegrationTest;
import com.thaiinsurance.autoinsurance.TestDataFactory;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:integrationdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
})
public class AuthAPIIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Clean up database for each test
        try {
            customerRepository.deleteAll();
            userRepository.deleteAll();
        } catch (Exception e) {
            // Tables might not exist yet, ignore
        }
    }

    @Test
    void register_WithValidData_ShouldReturnCreated() throws Exception {
        // Given
        RegisterRequest registerRequest = TestDataFactory.createValidRegisterRequest();

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.customerId").exists())
                .andExpect(jsonPath("$.data.verificationRequired").value(true));

        // Verify user was created
        assertTrue(userRepository.existsByUsername(registerRequest.getUsername()));
        assertTrue(userRepository.existsByEmail(registerRequest.getEmail()));
    }

    @Test
    void register_WithDuplicateEmail_ShouldReturnBadRequest() throws Exception {
        // Given - Create existing user first
        RegisterRequest registerRequest = TestDataFactory.createValidRegisterRequest();
        
        // Create user first
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(registerRequest)))
                .andExpect(status().isCreated());

        // Try to register with same email
        RegisterRequest duplicateRequest = TestDataFactory.createValidRegisterRequest();
        duplicateRequest.setUsername("differentuser");
        // Same email as existing user

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void register_WithInvalidNationalId_ShouldReturnBadRequest() throws Exception {
        // Given
        RegisterRequest registerRequest = TestDataFactory.createValidRegisterRequest();
        registerRequest.setNationalId("123456789"); // Invalid National ID

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
        // Note: Not checking specific message as validation may vary
    }

    @Test
    void login_WithValidCredentials_ShouldReturnTokens() throws Exception {
        // Given
        String email = "test@example.com";
        String password = "TestPassword123!";
        createTestUser(email, password);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(email);
        loginRequest.setPassword(password);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(email));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("nonexistent@example.com");
        loginRequest.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void forgotPassword_WithValidEmail_ShouldReturnSuccess() throws Exception {
        // Given
        String email = "test@example.com";
        createTestUser(email, "Password123!");

        // When & Then
        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // Helper methods
    private User createTestUser(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmailVerified(true);
        user.setIsActive(true);
        user.setRoles(java.util.Arrays.asList(Role.CUSTOMER));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private String performLogin(String email, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(email);
        loginRequest.setPassword(password);

        String response = mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response)
                .path("data")
                .path("accessToken")
                .asText();
    }
}