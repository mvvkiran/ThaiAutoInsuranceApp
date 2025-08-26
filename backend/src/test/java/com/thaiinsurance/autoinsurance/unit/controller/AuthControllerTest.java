package com.thaiinsurance.autoinsurance.unit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thaiinsurance.autoinsurance.TestDataHelper;
import com.thaiinsurance.autoinsurance.controller.AuthController;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.dto.auth.LoginResponse;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@ActiveProfiles("test")
@DisplayName("Authentication Controller Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    private User testUser;
    private LoginRequest validLoginRequest;
    private LoginResponse expectedLoginResponse;

    @BeforeEach
    void setUp() {
        testUser = TestDataHelper.createValidUser();
        testUser.setId(1L);
        testUser.setUsername("test.user");
        testUser.setEmail("test.user@example.com");
        
        validLoginRequest = new LoginRequest();
        validLoginRequest.setUsernameOrEmail("test.user");
        validLoginRequest.setPassword("password123");
        
        expectedLoginResponse = new LoginResponse();
        expectedLoginResponse.setUserId(1L);
        expectedLoginResponse.setUsername("test.user");
        expectedLoginResponse.setEmail("test.user@example.com");
        expectedLoginResponse.setAccessToken("sample.jwt.token");
        expectedLoginResponse.setRefreshToken("sample.refresh.token");
        expectedLoginResponse.setTokenType("Bearer");
        expectedLoginResponse.setExpiresIn(3600L);
    }

    @Nested
    @DisplayName("User Login")
    class UserLogin {

        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
            // Given
            UserPrincipal userPrincipal = UserPrincipal.create(testUser);
            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(userPrincipal);
            
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
            when(jwtTokenUtil.generateAccessToken(any(UserPrincipal.class))).thenReturn("sample.jwt.token");
            when(jwtTokenUtil.generateRefreshToken(any(UserPrincipal.class))).thenReturn("sample.refresh.token");
            when(jwtTokenUtil.getAccessTokenExpiration()).thenReturn(3600L);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Login successful"))
                    .andExpect(jsonPath("$.data.userId").value(1))
                    .andExpect(jsonPath("$.data.username").value("test.user"))
                    .andExpect(jsonPath("$.data.accessToken").value("sample.jwt.token"))
                    .andExpect(jsonPath("$.data.refreshToken").value("sample.refresh.token"))
                    .andExpect(jsonPath("$.data.tokenType").value("Bearer"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(jwtTokenUtil).generateAccessToken(any(UserPrincipal.class));
            verify(jwtTokenUtil).generateRefreshToken(any(UserPrincipal.class));
        }

        @Test
        @DisplayName("Should login successfully with email")
        void shouldLoginSuccessfullyWithEmail() throws Exception {
            // Given
            LoginRequest emailLoginRequest = new LoginRequest();
            emailLoginRequest.setUsernameOrEmail("test.user@example.com");
            emailLoginRequest.setPassword("password123");

            UserPrincipal userPrincipal = UserPrincipal.create(testUser);
            Authentication authentication = mock(Authentication.class);
            when(authentication.getPrincipal()).thenReturn(userPrincipal);
            
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(authentication);
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(jwtTokenUtil.generateAccessToken(any(UserPrincipal.class))).thenReturn("sample.jwt.token");
            when(jwtTokenUtil.generateRefreshToken(any(UserPrincipal.class))).thenReturn("sample.refresh.token");
            when(jwtTokenUtil.getAccessTokenExpiration()).thenReturn(3600L);

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(emailLoginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.email").value("test.user@example.com"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Should return unauthorized for invalid credentials")
        void shouldReturnUnauthorizedForInvalidCredentials() throws Exception {
            // Given
            LoginRequest invalidLoginRequest = new LoginRequest();
            invalidLoginRequest.setUsernameOrEmail("test.user");
            invalidLoginRequest.setPassword("wrongpassword");

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Invalid username or password"));

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidLoginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Invalid username or password"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(jwtTokenUtil, never()).generateAccessToken(any(UserPrincipal.class));
        }

        @Test
        @DisplayName("Should return unauthorized for disabled user account")
        void shouldReturnUnauthorizedForDisabledUserAccount() throws Exception {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new DisabledException("User account is disabled"));

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("User account is disabled"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Should return bad request for missing username/email")
        void shouldReturnBadRequestForMissingUsernameEmail() throws Exception {
            // Given
            LoginRequest invalidRequest = new LoginRequest();
            invalidRequest.setPassword("password123");
            // Missing username/email

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());

            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should return bad request for missing password")
        void shouldReturnBadRequestForMissingPassword() throws Exception {
            // Given
            LoginRequest invalidRequest = new LoginRequest();
            invalidRequest.setUsernameOrEmail("test.user");
            // Missing password

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());

            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should return bad request for empty username/email")
        void shouldReturnBadRequestForEmptyUsernameEmail() throws Exception {
            // Given
            LoginRequest invalidRequest = new LoginRequest();
            invalidRequest.setUsernameOrEmail("");
            invalidRequest.setPassword("password123");

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());

            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should return bad request for empty password")
        void shouldReturnBadRequestForEmptyPassword() throws Exception {
            // Given
            LoginRequest invalidRequest = new LoginRequest();
            invalidRequest.setUsernameOrEmail("test.user");
            invalidRequest.setPassword("");

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidRequest)))
                    .andExpect(status().isBadRequest());

            verify(authenticationManager, never()).authenticate(any());
        }
    }

    @Nested
    @DisplayName("Token Refresh")
    class TokenRefresh {

        @Test
        @DisplayName("Should refresh token successfully with valid refresh token")
        void shouldRefreshTokenSuccessfullyWithValidRefreshToken() throws Exception {
            // Given
            String refreshToken = "valid.refresh.token";
            String newAccessToken = "new.access.token";
            String newRefreshToken = "new.refresh.token";

            when(jwtTokenUtil.validateToken(refreshToken)).thenReturn(true);
            when(jwtTokenUtil.getUsernameFromToken(refreshToken)).thenReturn("test.user");
            when(userRepository.findByUsername("test.user")).thenReturn(Optional.of(testUser));
            when(jwtTokenUtil.generateAccessToken(any(UserPrincipal.class))).thenReturn(newAccessToken);
            when(jwtTokenUtil.generateRefreshToken(any(UserPrincipal.class))).thenReturn(newRefreshToken);
            when(jwtTokenUtil.getAccessTokenExpiration()).thenReturn(3600L);

            // When & Then
            mockMvc.perform(post("/api/auth/refresh-token")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Token refreshed successfully"))
                    .andExpect(jsonPath("$.data.accessToken").value(newAccessToken))
                    .andExpect(jsonPath("$.data.refreshToken").value(newRefreshToken));

            verify(jwtTokenUtil).validateToken(refreshToken);
            verify(jwtTokenUtil).generateAccessToken(any(UserPrincipal.class));
            verify(jwtTokenUtil).generateRefreshToken(any(UserPrincipal.class));
        }

        @Test
        @DisplayName("Should return unauthorized for invalid refresh token")
        void shouldReturnUnauthorizedForInvalidRefreshToken() throws Exception {
            // Given
            String invalidRefreshToken = "invalid.refresh.token";
            when(jwtTokenUtil.validateToken(invalidRefreshToken)).thenReturn(false);

            // When & Then
            mockMvc.perform(post("/api/auth/refresh-token")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\":\"" + invalidRefreshToken + "\"}"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Invalid refresh token"));

            verify(jwtTokenUtil).validateToken(invalidRefreshToken);
            verify(jwtTokenUtil, never()).generateAccessToken(any());
        }

        @Test
        @DisplayName("Should return unauthorized when user not found for refresh token")
        void shouldReturnUnauthorizedWhenUserNotFoundForRefreshToken() throws Exception {
            // Given
            String refreshToken = "valid.refresh.token";
            when(jwtTokenUtil.validateToken(refreshToken)).thenReturn(true);
            when(jwtTokenUtil.getUsernameFromToken(refreshToken)).thenReturn("nonexistent.user");
            when(userRepository.findByUsername("nonexistent.user")).thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(post("/api/auth/refresh-token")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("User not found"));

            verify(jwtTokenUtil).validateToken(refreshToken);
            verify(userRepository).findByUsername("nonexistent.user");
        }

        @Test
        @DisplayName("Should return bad request for missing refresh token")
        void shouldReturnBadRequestForMissingRefreshToken() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/auth/refresh-token")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());

            verify(jwtTokenUtil, never()).validateToken(any());
        }
    }

    @Nested
    @DisplayName("User Registration")
    class UserRegistration {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "newuser",
                    "email": "newuser@example.com",
                    "password": "password123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            User newUser = new User();
            newUser.setId(2L);
            newUser.setUsername("newuser");
            newUser.setEmail("newuser@example.com");

            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("encoded.password");
            when(userRepository.save(any(User.class))).thenReturn(newUser);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("User registered successfully"))
                    .andExpect(jsonPath("$.data.id").value(2))
                    .andExpect(jsonPath("$.data.username").value("newuser"));

            verify(userRepository).existsByUsername("newuser");
            verify(userRepository).existsByEmail("newuser@example.com");
            verify(passwordEncoder).encode("password123");
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should return conflict for existing username")
        void shouldReturnConflictForExistingUsername() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "existinguser",
                    "email": "newuser@example.com",
                    "password": "password123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            when(userRepository.existsByUsername("existinguser")).thenReturn(true);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Username already exists"));

            verify(userRepository).existsByUsername("existinguser");
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should return conflict for existing email")
        void shouldReturnConflictForExistingEmail() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "newuser",
                    "email": "existing@example.com",
                    "password": "password123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Email already exists"));

            verify(userRepository).existsByUsername("newuser");
            verify(userRepository).existsByEmail("existing@example.com");
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should return bad request for invalid email format")
        void shouldReturnBadRequestForInvalidEmailFormat() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "newuser",
                    "email": "invalid-email",
                    "password": "password123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isBadRequest());

            verify(userRepository, never()).existsByUsername(any());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should return bad request for weak password")
        void shouldReturnBadRequestForWeakPassword() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "newuser",
                    "email": "newuser@example.com",
                    "password": "123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should return bad request for invalid Thai phone number")
        void shouldReturnBadRequestForInvalidThaiPhoneNumber() throws Exception {
            // Given
            String registrationRequest = """
                {
                    "username": "newuser",
                    "email": "newuser@example.com",
                    "password": "password123",
                    "firstName": "New",
                    "lastName": "User",
                    "phoneNumber": "123456789"
                }
                """;

            // When & Then
            mockMvc.perform(post("/api/auth/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Logout")
    class Logout {

        @Test
        @DisplayName("Should logout successfully")
        void shouldLogoutSuccessfully() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/auth/logout")
                            .with(csrf())
                            .header("Authorization", "Bearer valid.token"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Logout successful"));
        }

        @Test
        @DisplayName("Should logout even without authorization header")
        void shouldLogoutEvenWithoutAuthorizationHeader() throws Exception {
            // When & Then
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
        @DisplayName("Should handle malformed JSON gracefully")
        void shouldHandleMalformedJsonGracefully() throws Exception {
            // Given
            String malformedJson = "{\"username\": \"test\", \"password\": }";

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(malformedJson))
                    .andExpect(status().isBadRequest());

            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should handle missing Content-Type header")
        void shouldHandleMissingContentTypeHeader() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isUnsupportedMediaType());

            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should handle authentication service exceptions")
        void shouldHandleAuthenticationServiceExceptions() throws Exception {
            // Given
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new RuntimeException("Authentication service unavailable"));

            // When & Then
            mockMvc.perform(post("/api/auth/login")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validLoginRequest)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication service unavailable"));

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }
    }
}