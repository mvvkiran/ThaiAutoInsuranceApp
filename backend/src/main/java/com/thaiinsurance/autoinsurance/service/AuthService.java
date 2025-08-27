package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.util.ThaiValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    /**
     * Register new customer user
     */
    public User registerCustomer(RegisterRequest request) {
        logger.info("Registering new customer with email: {}", request.getEmail());
        
        // Validate Thai-specific fields
        validateRegistrationRequest(request);
        
        // Check if username already exists (if provided separately from email)
        if (request.getUsername() != null && !request.getUsername().equals(request.getEmail()) 
            && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Check if phone number already exists
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        
        // Check if national ID already exists
        if (customerRepository.existsByNationalId(request.getNationalId())) {
            throw new IllegalArgumentException("National ID already exists");
        }
        
        try {
            // Create User entity
            User user = new User();
            user.setUsername(request.getUsername() != null ? request.getUsername() : request.getEmail());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.CUSTOMER);
            user.setIsActive(true);
            user.setEmailVerified(false);
            user.setPhoneVerified(false);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            
            // Save user first
            User savedUser = userRepository.save(user);
            
            // Create Customer entity
            Customer customer = new Customer();
            customer.setUser(savedUser);
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setFirstNameEn(request.getFirstNameEn());
            customer.setLastNameEn(request.getLastNameEn());
            customer.setNationalId(request.getNationalId());
            customer.setDateOfBirth(request.getDateOfBirth());
            customer.setGender(Customer.Gender.valueOf(request.getGender()));
            // Convert phone number from international format to local format if needed
            String localPhoneNumber = request.getPhoneNumber().startsWith("+66") ? 
                "0" + request.getPhoneNumber().substring(3) : request.getPhoneNumber();
            customer.setPhoneNumber(localPhoneNumber);
            customer.setEmail(request.getEmail());
            customer.setPreferredLanguage(mapLanguage(request.getPreferredLanguage()));
            customer.setAddress(request.getAddress());
            customer.setTambon(request.getTambon());
            customer.setAmphoe(request.getAmphoe());
            customer.setProvince(request.getProvince());
            customer.setPostalCode(request.getPostalCode());
            customer.setCountry("TH");
            customer.setKycStatus(Customer.KYCStatus.PENDING);
            customer.setIsActive(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            
            customerRepository.save(customer);
            
            logger.info("Successfully registered customer with ID: {}", savedUser.getId());
            return savedUser;
            
        } catch (Exception e) {
            logger.error("Error during customer registration: ", e);
            throw new IllegalArgumentException("Registration failed: " + e.getMessage());
        }
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String email) {
        logger.info("Sending password reset email to: {}", email);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            // Don't reveal if email exists or not for security
            logger.info("Password reset requested for non-existent email: {}", email);
            return;
        }
        
        User user = userOpt.get();
        
        // Generate reset token
        String resetToken = generatePasswordResetToken();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        userRepository.save(user);
        
        // TODO: Send email with reset token
        // For now, just log it (in production, use email service)
        logger.info("Password reset token generated for user {}: {}", user.getId(), resetToken);
    }
    
    /**
     * Reset password using reset token
     */
    public void resetPassword(String token, String newPassword) {
        logger.info("Attempting password reset with token: {}", token);
        
        Optional<User> userOpt = userRepository.findByPasswordResetToken(token);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid reset token");
        }
        
        User user = userOpt.get();
        
        // Check if token is expired
        if (user.getPasswordResetTokenExpiry() == null || 
            user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        
        // Update password and clear reset token
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        logger.info("Password successfully reset for user: {}", user.getId());
    }
    
    /**
     * Verify email address
     */
    public void verifyEmail(String verificationToken) {
        logger.info("Attempting email verification with token: {}", verificationToken);
        
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(verificationToken);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("Invalid verification token");
        }
        
        User user = userOpt.get();
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        logger.info("Email verified for user: {}", user.getId());
    }
    
    /**
     * Send email verification
     */
    public void sendEmailVerification(Long userId) {
        logger.info("Sending email verification for user: {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
        if (user.getEmailVerified()) {
            throw new IllegalArgumentException("Email is already verified");
        }
        
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        // TODO: Send verification email
        // For now, just log it (in production, use email service)
        logger.info("Email verification token generated for user {}: {}", user.getId(), verificationToken);
    }
    
    /**
     * Check if username/email is available
     */
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username) && !userRepository.existsByEmail(username);
    }
    
    /**
     * Check if email is available
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
    
    // Private helper methods
    
    private void validateRegistrationRequest(RegisterRequest request) {
        // Validate Thai National ID
        if (!ThaiValidationUtil.isValidThaiNationalId(request.getNationalId())) {
            throw new IllegalArgumentException("Invalid Thai National ID format");
        }
        
        // Validate Thai phone number (convert +66 format to 0X format for validation)
        String phoneForValidation = request.getPhoneNumber().startsWith("+66") ? 
            "0" + request.getPhoneNumber().substring(3) : request.getPhoneNumber();
        if (!ThaiValidationUtil.isValidThaiPhoneNumber(phoneForValidation)) {
            throw new IllegalArgumentException("Invalid Thai phone number format");
        }
        
        // Validate postal code
        if (!ThaiValidationUtil.isValidThaiPostalCode(request.getPostalCode())) {
            throw new IllegalArgumentException("Invalid Thai postal code format");
        }
        
        // Validate password strength
        if (!isValidPassword(request.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
        }
        
        // Validate confirm password
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }
    }
    
    private boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) return false;
        
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
    
    private String generatePasswordResetToken() {
        return UUID.randomUUID().toString();
    }
    
    private Customer.Language mapLanguage(String languageCode) {
        if ("th".equals(languageCode)) {
            return Customer.Language.THAI;
        } else if ("en".equals(languageCode)) {
            return Customer.Language.ENGLISH;
        } else {
            throw new IllegalArgumentException("Invalid language code: " + languageCode);
        }
    }
}