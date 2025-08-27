package com.thaiinsurance.autoinsurance.unit.service;

import com.thaiinsurance.autoinsurance.dto.auth.RegisterRequest;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.security.JwtTokenUtil;
import com.thaiinsurance.autoinsurance.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRegisterRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = createValidRegisterRequest();
    }

    @Test
    void registerCustomer_WithValidRequest_ShouldCreateUserAndCustomer() {
        // Given
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByPhoneNumber(validRegisterRequest.getPhoneNumber())).thenReturn(false);
        when(customerRepository.existsByNationalId(validRegisterRequest.getNationalId())).thenReturn(false);
        when(passwordEncoder.encode(validRegisterRequest.getPassword())).thenReturn("encoded-password");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(validRegisterRequest.getEmail());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(customerRepository.save(any(Customer.class))).thenReturn(new Customer());

        // When
        User result = authService.registerCustomer(validRegisterRequest);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(validRegisterRequest.getEmail(), result.getEmail());

        // Verify user was saved with correct properties
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUserData = userCaptor.getValue();
        
        assertEquals(validRegisterRequest.getEmail(), savedUserData.getUsername());
        assertEquals(validRegisterRequest.getEmail(), savedUserData.getEmail());
        assertEquals("encoded-password", savedUserData.getPassword());
        assertEquals(Role.CUSTOMER, savedUserData.getRole());
        assertTrue(savedUserData.getIsActive());
        assertFalse(savedUserData.getEmailVerified());
        assertFalse(savedUserData.getPhoneVerified());

        // Verify customer was saved
        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerCaptor.capture());
        Customer savedCustomerData = customerCaptor.getValue();
        
        assertEquals(validRegisterRequest.getFirstName(), savedCustomerData.getFirstName());
        assertEquals(validRegisterRequest.getLastName(), savedCustomerData.getLastName());
        assertEquals(validRegisterRequest.getNationalId(), savedCustomerData.getNationalId());
        assertEquals(Customer.KYCStatus.PENDING, savedCustomerData.getKycStatus());
    }

    @Test
    void registerCustomer_WithExistingEmail_ShouldThrowException() {
        // Given
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.registerCustomer(validRegisterRequest)
        );
        
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomer_WithExistingPhoneNumber_ShouldThrowException() {
        // Given
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByPhoneNumber(validRegisterRequest.getPhoneNumber())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.registerCustomer(validRegisterRequest)
        );
        
        assertEquals("Phone number already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomer_WithExistingNationalId_ShouldThrowException() {
        // Given
        when(userRepository.existsByEmail(validRegisterRequest.getEmail())).thenReturn(false);
        when(customerRepository.existsByPhoneNumber(validRegisterRequest.getPhoneNumber())).thenReturn(false);
        when(customerRepository.existsByNationalId(validRegisterRequest.getNationalId())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.registerCustomer(validRegisterRequest)
        );
        
        assertEquals("National ID already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomer_WithInvalidNationalId_ShouldThrowException() {
        // Given
        validRegisterRequest.setNationalId("123456789"); // Invalid format

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.registerCustomer(validRegisterRequest)
        );
        
        assertEquals("Invalid Thai National ID format", exception.getMessage());
    }

    @Test
    void sendPasswordResetEmail_WithValidEmail_ShouldGenerateTokenAndSaveUser() {
        // Given
        String email = "test@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        authService.sendPasswordResetEmail(email);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertNotNull(savedUser.getPasswordResetToken());
        assertNotNull(savedUser.getPasswordResetTokenExpiry());
        assertTrue(savedUser.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    void sendPasswordResetEmail_WithNonExistentEmail_ShouldNotThrowException() {
        // Given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then (should not throw exception for security reasons)
        assertDoesNotThrow(() -> authService.sendPasswordResetEmail(email));
        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPassword_WithValidToken_ShouldUpdatePassword() {
        // Given
        String token = "valid-token";
        String newPassword = "NewPassword123!";
        User user = new User();
        user.setId(1L);
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        
        when(userRepository.findByPasswordResetToken(token)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("encoded-new-password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        authService.resetPassword(token, newPassword);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertEquals("encoded-new-password", savedUser.getPassword());
        assertNull(savedUser.getPasswordResetToken());
        assertNull(savedUser.getPasswordResetTokenExpiry());
    }

    @Test
    void resetPassword_WithExpiredToken_ShouldThrowException() {
        // Given
        String token = "expired-token";
        String newPassword = "NewPassword123!";
        User user = new User();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().minusMinutes(30)); // Expired
        
        when(userRepository.findByPasswordResetToken(token)).thenReturn(Optional.of(user));

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.resetPassword(token, newPassword)
        );
        
        assertEquals("Reset token has expired", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void verifyEmail_WithValidToken_ShouldMarkEmailAsVerified() {
        // Given
        String token = "valid-verification-token";
        User user = new User();
        user.setId(1L);
        user.setEmailVerificationToken(token);
        user.setEmailVerified(false);
        
        when(userRepository.findByEmailVerificationToken(token)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        authService.verifyEmail(token);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertTrue(savedUser.getEmailVerified());
        assertNull(savedUser.getEmailVerificationToken());
    }

    @Test
    void isUsernameAvailable_WithAvailableUsername_ShouldReturnTrue() {
        // Given
        String username = "available@example.com";
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(userRepository.existsByEmail(username)).thenReturn(false);

        // When
        boolean result = authService.isUsernameAvailable(username);

        // Then
        assertTrue(result);
    }

    @Test
    void isUsernameAvailable_WithTakenUsername_ShouldReturnFalse() {
        // Given
        String username = "taken@example.com";
        when(userRepository.existsByUsername(username)).thenReturn(true);

        // When
        boolean result = authService.isUsernameAvailable(username);

        // Then
        assertFalse(result);
    }

    private RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("สมใส");
        request.setLastName("ใจดี");
        request.setFirstNameEn("Somsai");
        request.setLastNameEn("Jaidee");
        request.setNationalId("1101700207366"); // Using valid Thai National ID from TestDataHelper
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
}