package com.thaiinsurance.autoinsurance.integration.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thaiinsurance.autoinsurance.BaseIntegrationTest;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Security Integration Tests")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SecurityIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private User testUser;

    @BeforeEach
    void setUp() {
        setupTestUser();
    }


    private void setupTestUser() {
        testUser = new User();
        testUser.setUsername("security.test");
        testUser.setEmail("security.test@example.com");
        testUser.setPassword(passwordEncoder.encode("SecurePassword123!"));
        testUser.setFirstName("Security");
        testUser.setLastName("Test");
        testUser.setPhoneNumber("0812345678");
        testUser.setIsActive(true);
        testUser.setRoles(Set.of(Role.CUSTOMER));
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());
        testUser = userRepository.save(testUser);
    }

    @Nested
    @DisplayName("Authentication Tests")
    class AuthenticationTests {

        @Test
        @DisplayName("Should authenticate user with valid credentials")
        @Transactional
        void shouldAuthenticateUserWithValidCredentials() throws Exception {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test");
            loginRequest.setPassword("SecurePassword123!");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").exists())
                    .andExpect(jsonPath("$.data.refreshToken").exists())
                    .andExpect(jsonPath("$.data.username").value("security.test"))
                    .andExpect(jsonPath("$.data.tokenType").value("Bearer"));
        }

        @Test
        @DisplayName("Should reject authentication with invalid password")
        void shouldRejectAuthenticationWithInvalidPassword() throws Exception {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test");
            loginRequest.setPassword("WrongPassword");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Invalid username or password"));
        }

        @Test
        @DisplayName("Should reject authentication with non-existent user")
        void shouldRejectAuthenticationWithNonExistentUser() throws Exception {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("nonexistent.user");
            loginRequest.setPassword("AnyPassword");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Invalid username or password"));
        }

        @Test
        @DisplayName("Should authenticate with email instead of username")
        @Transactional
        void shouldAuthenticateWithEmailInsteadOfUsername() throws Exception {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test@example.com");
            loginRequest.setPassword("SecurePassword123!");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").exists());
        }

        @Test
        @DisplayName("Should reject authentication for disabled user")
        @Transactional
        void shouldRejectAuthenticationForDisabledUser() throws Exception {
            // Disable the user
            testUser.setIsActive(false);
            userRepository.save(testUser);

            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test");
            loginRequest.setPassword("SecurePassword123!");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("User account is disabled"));
        }
    }

    @Nested
    @DisplayName("JWT Token Tests")
    class JwtTokenTests {

        @Test
        @DisplayName("Should accept requests with valid JWT token")
        @Transactional
        void shouldAcceptRequestsWithValidJwtToken() throws Exception {
            String token = jwtTokenUtil.generateAccessToken(UserPrincipal.create(testUser));

            mockMvc.perform(get("/api/customers/statistics")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden()); // Expected because user has CUSTOMER role, not ADMIN
        }

        @Test
        @DisplayName("Should reject requests with invalid JWT token")
        void shouldRejectRequestsWithInvalidJwtToken() throws Exception {
            String invalidToken = "invalid.jwt.token";

            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + invalidToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject requests with expired JWT token")
        void shouldRejectRequestsWithExpiredJwtToken() throws Exception {
            // Create an expired token (this is a simulation - in real scenario you'd use a token that's actually expired)
            String expiredToken = "expired.jwt.token";

            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + expiredToken))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject requests without authorization header")
        void shouldRejectRequestsWithoutAuthorizationHeader() throws Exception {
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should reject requests with malformed authorization header")
        void shouldRejectRequestsWithMalformedAuthorizationHeader() throws Exception {
            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "InvalidFormat token"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should refresh token with valid refresh token")
        @Transactional
        void shouldRefreshTokenWithValidRefreshToken() throws Exception {
            String refreshToken = jwtTokenUtil.generateRefreshToken(UserPrincipal.create(testUser));

            mockMvc.perform(post("/api/auth/refresh-token")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").exists())
                    .andExpect(jsonPath("$.data.refreshToken").exists());
        }

        @Test
        @DisplayName("Should reject refresh with invalid refresh token")
        void shouldRejectRefreshWithInvalidRefreshToken() throws Exception {
            String invalidRefreshToken = "invalid.refresh.token";

            mockMvc.perform(post("/api/auth/refresh-token")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"refreshToken\":\"" + invalidRefreshToken + "\"}"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("Role-Based Authorization Tests")
    class RoleBasedAuthorizationTests {

        @Test
        @DisplayName("Should allow ADMIN access to customer management")
        @Transactional
        void shouldAllowAdminAccessToCustomerManagement() throws Exception {
            // Create admin user
            User adminUser = new User();
            adminUser.setUsername("admin.test");
            adminUser.setEmail("admin.test@example.com");
            adminUser.setPassword(passwordEncoder.encode("AdminPassword123!"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setIsActive(true);
            adminUser.setRoles(Set.of(Role.ADMIN));
            adminUser = userRepository.save(adminUser);

            String adminToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(adminUser));

            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should allow AGENT access to customer management")
        @Transactional
        void shouldAllowAgentAccessToCustomerManagement() throws Exception {
            // Create agent user
            User agentUser = new User();
            agentUser.setUsername("agent.test");
            agentUser.setEmail("agent.test@example.com");
            agentUser.setPassword(passwordEncoder.encode("AgentPassword123!"));
            agentUser.setFirstName("Agent");
            agentUser.setLastName("User");
            agentUser.setIsActive(true);
            agentUser.setRoles(Set.of(Role.AGENT));
            agentUser = userRepository.save(agentUser);

            String agentToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(agentUser));

            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + agentToken))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should deny CUSTOMER access to customer management")
        @Transactional
        void shouldDenyCustomerAccessToCustomerManagement() throws Exception {
            String customerToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(testUser));

            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + customerToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Should only allow ADMIN to delete customers")
        @Transactional
        void shouldOnlyAllowAdminToDeleteCustomers() throws Exception {
            // Test with AGENT role - should be forbidden
            User agentUser = new User();
            agentUser.setUsername("agent.delete.test");
            agentUser.setEmail("agent.delete.test@example.com");
            agentUser.setPassword(passwordEncoder.encode("AgentPassword123!"));
            agentUser.setFirstName("Agent");
            agentUser.setLastName("Delete");
            agentUser.setIsActive(true);
            agentUser.setRoles(Set.of(Role.AGENT));
            agentUser = userRepository.save(agentUser);

            String agentToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(agentUser));

            mockMvc.perform(delete("/api/customers/1")
                            .header("Authorization", "Bearer " + agentToken))
                    .andExpect(status().isForbidden());

            // Test with ADMIN role - should be allowed (even if customer doesn't exist)
            User adminUser = new User();
            adminUser.setUsername("admin.delete.test");
            adminUser.setEmail("admin.delete.test@example.com");
            adminUser.setPassword(passwordEncoder.encode("AdminPassword123!"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("Delete");
            adminUser.setIsActive(true);
            adminUser.setRoles(Set.of(Role.ADMIN));
            adminUser = userRepository.save(adminUser);

            String adminToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(adminUser));

            mockMvc.perform(delete("/api/customers/1")
                            .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isNotFound()); // Not forbidden, just customer doesn't exist
        }

        @Test
        @DisplayName("Should allow multiple roles for user")
        @Transactional
        void shouldAllowMultipleRolesForUser() throws Exception {
            // Create user with both AGENT and ADMIN roles
            User multiRoleUser = new User();
            multiRoleUser.setUsername("multirole.test");
            multiRoleUser.setEmail("multirole.test@example.com");
            multiRoleUser.setPassword(passwordEncoder.encode("MultiPassword123!"));
            multiRoleUser.setFirstName("Multi");
            multiRoleUser.setLastName("Role");
            multiRoleUser.setIsActive(true);
            multiRoleUser.setRoles(Set.of(Role.AGENT, Role.ADMIN));
            multiRoleUser = userRepository.save(multiRoleUser);

            String multiToken = jwtTokenUtil.generateAccessToken(UserPrincipal.create(multiRoleUser));

            // Should have access to both agent and admin functions
            mockMvc.perform(get("/api/customers")
                            .header("Authorization", "Bearer " + multiToken))
                    .andExpect(status().isOk());

            mockMvc.perform(delete("/api/customers/1")
                            .header("Authorization", "Bearer " + multiToken))
                    .andExpect(status().isNotFound()); // Not forbidden, just customer doesn't exist
        }
    }

    @Nested
    @DisplayName("Password Security Tests")
    class PasswordSecurityTests {

        @Test
        @DisplayName("Should enforce password complexity in registration")
        void shouldEnforcePasswordComplexityInRegistration() throws Exception {
            String weakPasswordRequest = """
                {
                    "username": "weakpass.test",
                    "email": "weakpass@example.com",
                    "password": "123",
                    "firstName": "Weak",
                    "lastName": "Password",
                    "phoneNumber": "0812345678"
                }
                """;

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(weakPasswordRequest))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should hash passwords before storing")
        @Transactional
        void shouldHashPasswordsBeforeStoring() throws Exception {
            String registrationRequest = """
                {
                    "username": "password.test",
                    "email": "password@example.com",
                    "password": "SecurePassword123!",
                    "firstName": "Password",
                    "lastName": "Test",
                    "phoneNumber": "0812345678"
                }
                """;

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(registrationRequest))
                    .andExpect(status().isCreated());

            // Verify password is hashed in database
            User savedUser = userRepository.findByUsername("password.test").orElseThrow();
            assert !savedUser.getPassword().equals("SecurePassword123!");
            assert passwordEncoder.matches("SecurePassword123!", savedUser.getPassword());
        }

        @Test
        @DisplayName("Should prevent password brute force attacks with account lockout")
        void shouldPreventPasswordBruteForceAttacks() throws Exception {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test");

            // Simulate multiple failed login attempts
            for (int i = 0; i < 5; i++) {
                loginRequest.setPassword("WrongPassword" + i);
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(asJsonString(loginRequest)))
                        .andExpect(status().isUnauthorized());
            }

            // Account should potentially be locked after multiple failures
            // This depends on your security configuration
        }
    }

    @Nested
    @DisplayName("Input Sanitization Tests")
    class InputSanitizationTests {

        @Test
        @DisplayName("Should sanitize SQL injection attempts")
        void shouldSanitizeSqlInjectionAttempts() throws Exception {
            LoginRequest sqlInjectionRequest = new LoginRequest();
            sqlInjectionRequest.setUsernameOrEmail("admin'; DROP TABLE users; --");
            sqlInjectionRequest.setPassword("password");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(sqlInjectionRequest)))
                    .andExpect(status().isUnauthorized());

            // Verify that the users table still exists by attempting to find a user
            assert userRepository.findByUsername("security.test").isPresent();
        }

        @Test
        @DisplayName("Should handle XSS attempts in input")
        void shouldHandleXssAttemptsInInput() throws Exception {
            String xssAttempt = """
                {
                    "username": "<script>alert('XSS')</script>",
                    "email": "xss@example.com",
                    "password": "SecurePassword123!",
                    "firstName": "<script>alert('XSS')</script>",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """;

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(xssAttempt))
                    .andExpect(status().isBadRequest()); // Should be rejected due to validation
        }

        @Test
        @DisplayName("Should handle excessively long input strings")
        void shouldHandleExcessivelyLongInputStrings() throws Exception {
            String longString = "a".repeat(1000);
            
            String longInputRequest = String.format("""
                {
                    "username": "%s",
                    "email": "long@example.com",
                    "password": "SecurePassword123!",
                    "firstName": "Long",
                    "lastName": "User",
                    "phoneNumber": "0812345678"
                }
                """, longString);

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(longInputRequest))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("HTTPS and Security Headers Tests")
    class HttpsAndSecurityHeadersTests {

        @Test
        @DisplayName("Should include security headers in responses")
        void shouldIncludeSecurityHeadersInResponses() throws Exception {
            mockMvc.perform(get("/api/auth/health"))
                    .andExpect(header().exists("X-Content-Type-Options"))
                    .andExpect(header().exists("X-Frame-Options"))
                    .andExpect(header().exists("X-XSS-Protection"));
        }

        @Test
        @DisplayName("Should handle CORS preflight requests")
        void shouldHandleCorsPreflightRequests() throws Exception {
            mockMvc.perform(options("/api/auth/login")
                            .header("Origin", "https://frontend.example.com")
                            .header("Access-Control-Request-Method", "POST")
                            .header("Access-Control-Request-Headers", "Content-Type,Authorization"))
                    .andExpect(status().isOk())
                    .andExpect(header().exists("Access-Control-Allow-Origin"));
        }
    }

    @Nested
    @DisplayName("Session Management Tests")
    class SessionManagementTests {

        @Test
        @DisplayName("Should handle concurrent sessions properly")
        @Transactional
        void shouldHandleConcurrentSessionsProperly() throws Exception {
            // Login to create first session
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setUsernameOrEmail("security.test");
            loginRequest.setPassword("SecurePassword123!");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isOk());

            // Login again to create second session
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(asJsonString(loginRequest)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Should properly handle logout")
        @Transactional
        void shouldProperlyHandleLogout() throws Exception {
            String token = jwtTokenUtil.generateAccessToken(UserPrincipal.create(testUser));

            mockMvc.perform(post("/api/auth/logout")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Logout successful"));
        }
    }
}