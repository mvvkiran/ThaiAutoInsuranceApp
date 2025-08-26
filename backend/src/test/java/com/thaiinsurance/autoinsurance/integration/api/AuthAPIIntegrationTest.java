package com.thaiinsurance.autoinsurance.integration.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thaiinsurance.autoinsurance.BaseIntegrationTest;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@Transactional
public class AuthAPIIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_WithValidData_ShouldReturnCreated() throws Exception {
        // Given
        RegisterRequest registerRequest = createValidRegisterRequest();

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.data.customerId").isNotEmpty())
                .andExpect(jsonPath("$.data.verificationRequired").value(true));

        // Verify user was created
        Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());
        assertTrue(user.isPresent());
        assertEquals(registerRequest.getEmail(), user.get().getEmail());
        assertFalse(user.get().getEmailVerified());
    }

    @Test
    void register_WithDuplicateEmail_ShouldReturnBadRequest() throws Exception {
        // Given
        RegisterRequest registerRequest = createValidRegisterRequest();
        
        // Create user first
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").containsString("already exists"));
    }

    @Test
    void register_WithInvalidNationalId_ShouldReturnBadRequest() throws Exception {
        // Given
        RegisterRequest registerRequest = createValidRegisterRequest();
        registerRequest.setNationalId("123456789"); // Invalid National ID

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").containsString("Invalid Thai National ID"));
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.userInfo.email").value(email));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("nonexistent@example.com");
        loginRequest.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void forgotPassword_WithValidEmail_ShouldReturnSuccess() throws Exception {
        // Given
        String email = "test@example.com";
        createTestUser(email, "Password123!");

        // When & Then
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Verify reset token was generated
        Optional<User> user = userRepository.findByEmail(email);
        assertTrue(user.isPresent());
        assertNotNull(user.get().getPasswordResetToken());
    }

    @Test
    void getCurrentUser_WithValidToken_ShouldReturnUserInfo() throws Exception {
        // Given
        String email = "test@example.com";
        String password = "TestPassword123!";
        User user = createTestUser(email, password);

        String token = performLogin(email, password);

        // When & Then
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email))
                .andExpect(jsonPath("$.data.id").value(user.getId()));
    }

    // Helper methods
    private RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("สมใส");
        request.setLastName("ใจดี");
        request.setFirstNameEn("Somsai");
        request.setLastNameEn("Jaidee");
        request.setNationalId("1234567890123"); // This should be a valid checksum
        request.setDateOfBirth(LocalDate.of(1990, 1, 1));
        request.setGender("MALE");
        request.setEmail("somsai.jaidee@example.com");
        request.setPhoneNumber("+66812345678");
        request.setPreferredLanguage("th");
        request.setAddress("123 ถนนสุขุมวิท");
        request.setTambon("คลองตัน");
        request.setAmphoe("วัฒนา");
        request.setProvince("กรุงเทพมหานคร");
        request.setPostalCode("10110");
        request.setPassword("TestPassword123!");
        request.setConfirmPassword("TestPassword123!");
        request.setTermsAndConditions(true);
        request.setPrivacyPolicy(true);
        request.setDataProcessingConsent(true);
        return request;
    }

    private User createTestUser(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmailVerified(true);
        user.setIsActive(true);
        return userRepository.save(user);
    }

    private String performLogin(String email, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(email);
        loginRequest.setPassword(password);

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
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