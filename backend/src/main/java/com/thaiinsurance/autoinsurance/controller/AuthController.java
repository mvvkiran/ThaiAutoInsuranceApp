package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.dto.auth.LoginRequest;
import com.thaiinsurance.autoinsurance.dto.auth.LoginResponse;
import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.dto.auth.RegisterResponse;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.security.UserPrincipal;
import com.thaiinsurance.autoinsurance.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String accessToken = jwtTokenUtil.generateAccessToken(authentication);
        String refreshToken = jwtTokenUtil.generateRefreshToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Update last login timestamp
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        if (user != null) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getFirstName(),
                userPrincipal.getLastName(),
                userPrincipal.getRoles()
        );
        
        LoginResponse loginResponse = new LoginResponse(
                accessToken,
                refreshToken,
                jwtTokenUtil.getExpirationTime(),
                userInfo
        );
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generate new access token using refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(
            @RequestHeader(value = "Authorization", required = false) String refreshToken) {
        
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            ApiResponse<LoginResponse> response = new ApiResponse<>(false, "Authorization header is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        }
        
        if (!jwtTokenUtil.validateToken(refreshToken) || !jwtTokenUtil.isRefreshToken(refreshToken)) {
            ApiResponse<LoginResponse> response = new ApiResponse<>(false, "Invalid refresh token");
            return ResponseEntity.badRequest().body(response);
        }
        
        Long userId = jwtTokenUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null || !user.getIsActive()) {
            ApiResponse<LoginResponse> response = new ApiResponse<>(false, "User not found or inactive");
            return ResponseEntity.badRequest().body(response);
        }
        
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        
        String newAccessToken = jwtTokenUtil.generateAccessToken(authentication);
        String newRefreshToken = jwtTokenUtil.generateRefreshToken(authentication);
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getFirstName(),
                userPrincipal.getLastName(),
                userPrincipal.getRoles()
        );
        
        LoginResponse loginResponse = new LoginResponse(
                newAccessToken,
                newRefreshToken,
                jwtTokenUtil.getExpirationTime(),
                userInfo
        );
        
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", loginResponse));
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user (client should discard tokens)")
    public ResponseEntity<ApiResponse<String>> logout() {
        SecurityContextHolder.clearContext();
        ApiResponse<String> response = new ApiResponse<>(true, "Logout successful");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user information")
    public ResponseEntity<ApiResponse<LoginResponse.UserInfo>> getCurrentUser(Authentication authentication) {
        
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No authenticated user found"));
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getFirstName(),
                userPrincipal.getLastName(),
                userPrincipal.getRoles()
        );
        
        return ResponseEntity.ok(ApiResponse.success("User information retrieved", userInfo));
    }
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create new customer account")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerCustomer(registerRequest);
            
            RegisterResponse response = new RegisterResponse(
                user.getId().toString(),
                true,
                java.util.Arrays.asList("EMAIL", "SMS"),
                "Registration successful. Please verify your email and phone number."
            );
            
            return ResponseEntity.status(201).body(ApiResponse.success("User registered successfully", response));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Send password reset email")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.sendPasswordResetEmail(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Password reset email sent successfully"));
        } catch (Exception e) {
            // Don't reveal if email exists for security
            return ResponseEntity.ok(ApiResponse.success("If the email exists, a password reset email has been sent"));
        }
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password using reset token")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify email address using verification token")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestBody EmailVerificationRequest request) {
        try {
            authService.verifyEmail(request.getToken());
            return ResponseEntity.ok(ApiResponse.success("Email verified successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change password for authenticated user")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequest request, 
                                                             Authentication authentication) {
        
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No authenticated user found"));
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Current password is incorrect"));
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
    
    // Inner classes for request DTOs
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        
        // Getters and Setters
        public String getCurrentPassword() {
            return currentPassword;
        }
        
        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
    
    public static class ForgotPasswordRequest {
        private String email;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
    
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
    
    public static class EmailVerificationRequest {
        private String token;
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
    }
}