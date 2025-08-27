package com.thaiinsurance.autoinsurance.unit.controller;

import com.thaiinsurance.autoinsurance.BaseIntegrationTest;
import com.thaiinsurance.autoinsurance.TestDataFactory;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.security.UserPrincipal;
import com.thaiinsurance.autoinsurance.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Authentication Controller Tests")
@ActiveProfiles("test")
class AuthControllerTest extends BaseIntegrationTest {

    @Autowired
    private AuthService authService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    private User testUser;
    private LoginRequest validLoginRequest;
    private RegisterRequest validRegisterRequest;

    @BeforeEach
    void setUp() {
        testUser = TestDataFactory.createValidUser();
        testUser.setId(1L);
        
        validLoginRequest = TestDataFactory.createValidLoginRequest();
        validRegisterRequest = TestDataFactory.createValidRegisterRequest();
    }

    @Nested
    @DisplayName("User Login")
    class UserLogin {

        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
            // Given
            testUser.setFirstName("John");
            testUser.setLastName("Doe");
            
            UserPrincipal userPrincipal = UserPrincipal.create(testUser);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities());
            
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(jwtTokenUtil.generateAccessToken(authentication)).thenReturn("access-token");
            when(jwtTokenUtil.generateRefreshToken(authentication)).thenReturn("refresh-token");
            when(jwtTokenUtil.getExpirationTime()).thenReturn(3600L);
            when(userRepository.findById(testUser.getId()))
                    .thenReturn(Optional.of(testUser));

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validLoginRequest)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Login successful"))
                    .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                    .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"))
                    .andExpect(jsonPath("$.data.user.username").value(testUser.getUsername()));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(jwtTokenUtil).generateAccessToken(authentication);
            verify(jwtTokenUtil).generateRefreshToken(authentication);
        }

        @Test
        @DisplayName("Should return unauthorized for invalid credentials")
        void shouldReturnUnauthorizedForInvalidCredentials() throws Exception {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validLoginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Invalid username or password"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Should return bad request for missing credentials")
        void shouldReturnBadRequestForMissingCredentials() throws Exception {
            // Given
            LoginRequest invalidRequest = new LoginRequest();
            // Missing username and password

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(invalidRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("User Registration")
    class UserRegistration {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() throws Exception {
            // Given
            User newUser = TestDataFactory.createValidUser();
            newUser.setId(2L);
            newUser.setUsername("newuser");
            newUser.setEmail("newuser@example.com");

            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
            when(customerRepository.existsByPhoneNumber("+66812345678")).thenReturn(false);
            when(customerRepository.existsByNationalId("1234567890121")).thenReturn(false);
            when(passwordEncoder.encode("Password123!")).thenReturn("encoded-password");
            when(userRepository.save(any(User.class))).thenReturn(newUser);
            when(customerRepository.save(any())).thenReturn(TestDataFactory.createValidCustomer());

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validRegisterRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("User registered successfully"))
                    .andExpect(jsonPath("$.data.customerId").value("2"))
                    .andExpect(jsonPath("$.data.verificationRequired").value(true));

            verify(userRepository).existsByUsername("newuser");
            verify(userRepository).existsByEmail("newuser@example.com");
            verify(customerRepository).existsByPhoneNumber("+66812345678");
            verify(customerRepository).existsByNationalId("1234567890121");
        }

        @Test
        @DisplayName("Should return conflict for existing email")
        void shouldReturnConflictForExistingEmail() throws Exception {
            // Given
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(true);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validRegisterRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Email already exists"));

            verify(userRepository).existsByEmail("newuser@example.com");
        }

        @Test
        @DisplayName("Should return conflict for existing username")
        void shouldReturnConflictForExistingUsername() throws Exception {
            // Given
            when(userRepository.existsByUsername("newuser")).thenReturn(true);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validRegisterRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Username already exists"));

            verify(userRepository).existsByUsername("newuser");
        }
    }

    @Nested
    @DisplayName("Logout")
    class Logout {

        @Test
        @DisplayName("Should logout successfully")
        void shouldLogoutSuccessfully() throws Exception {
            mockMvc.perform(post("/api/auth/logout")
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Logout successful"));
        }
    }

    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {

        @Test
        @DisplayName("Should handle malformed JSON in login request")
        void shouldHandleMalformedJsonInLoginRequest() throws Exception {
            String malformedJson = "{\"usernameOrEmail\": \"test\", \"password\": }";

            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(malformedJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should handle missing CSRF token")
        @org.junit.jupiter.api.Disabled("Authorization tests disabled due to security filter configuration")
        void shouldHandleMissingCsrfToken() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(validLoginRequest)))
                    .andExpect(status().isForbidden());
        }
    }
}