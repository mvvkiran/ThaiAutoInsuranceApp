package com.thaiinsurance.autoinsurance.unit.service;

import com.thaiinsurance.autoinsurance.TestDataHelper;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Customer Service Tests")
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CustomerService customerService;

    private Customer testCustomer;
    private User testUser;

    @BeforeEach
    void setUp() {
        testCustomer = TestDataHelper.createValidCustomer();
        testUser = TestDataHelper.createValidUser();
    }

    @Nested
    @DisplayName("Get Customer Operations")
    class GetCustomerOperations {

        @Test
        @DisplayName("Should get all active customers")
        void shouldGetAllActiveCustomers() {
            // Given
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByIsActiveTrue()).thenReturn(expectedCustomers);

            // When
            List<Customer> actualCustomers = customerService.getAllCustomers();

            // Then
            assertEquals(expectedCustomers, actualCustomers);
            verify(customerRepository).findByIsActiveTrue();
        }

        @Test
        @DisplayName("Should search customers with pagination")
        void shouldSearchCustomersWithPagination() {
            // Given
            String searchTerm = "Somchai";
            Pageable pageable = PageRequest.of(0, 10);
            Page<Customer> expectedPage = new PageImpl<>(Arrays.asList(testCustomer));
            when(customerRepository.searchCustomers(searchTerm, pageable)).thenReturn(expectedPage);

            // When
            Page<Customer> actualPage = customerService.searchCustomers(searchTerm, pageable);

            // Then
            assertEquals(expectedPage, actualPage);
            verify(customerRepository).searchCustomers(searchTerm, pageable);
        }

        @Test
        @DisplayName("Should get customer by ID")
        void shouldGetCustomerById() {
            // Given
            Long customerId = 1L;
            when(customerRepository.findById(customerId)).thenReturn(Optional.of(testCustomer));

            // When
            Optional<Customer> result = customerService.getCustomerById(customerId);

            // Then
            assertTrue(result.isPresent());
            assertEquals(testCustomer, result.get());
            verify(customerRepository).findById(customerId);
        }

        @Test
        @DisplayName("Should get customer by National ID")
        void shouldGetCustomerByNationalId() {
            // Given
            String nationalId = testCustomer.getNationalId();
            when(customerRepository.findByNationalId(nationalId)).thenReturn(Optional.of(testCustomer));

            // When
            Optional<Customer> result = customerService.getCustomerByNationalId(nationalId);

            // Then
            assertTrue(result.isPresent());
            assertEquals(testCustomer, result.get());
            verify(customerRepository).findByNationalId(nationalId);
        }

        @Test
        @DisplayName("Should get customer by email")
        void shouldGetCustomerByEmail() {
            // Given
            String email = testCustomer.getEmail();
            when(customerRepository.findByEmail(email)).thenReturn(Optional.of(testCustomer));

            // When
            Optional<Customer> result = customerService.getCustomerByEmail(email);

            // Then
            assertTrue(result.isPresent());
            assertEquals(testCustomer, result.get());
            verify(customerRepository).findByEmail(email);
        }

        @Test
        @DisplayName("Should get customer by phone number")
        void shouldGetCustomerByPhoneNumber() {
            // Given
            String phoneNumber = testCustomer.getPhoneNumber();
            when(customerRepository.findByPhoneNumber(phoneNumber)).thenReturn(Optional.of(testCustomer));

            // When
            Optional<Customer> result = customerService.getCustomerByPhoneNumber(phoneNumber);

            // Then
            assertTrue(result.isPresent());
            assertEquals(testCustomer, result.get());
            verify(customerRepository).findByPhoneNumber(phoneNumber);
        }
    }

    @Nested
    @DisplayName("Create Customer Operations")
    class CreateCustomerOperations {

        @Test
        @DisplayName("Should create customer successfully")
        void shouldCreateCustomerSuccessfully() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            when(customerRepository.existsByNationalId(anyString())).thenReturn(false);
            when(customerRepository.existsByEmail(anyString())).thenReturn(false);
            when(customerRepository.existsByPhoneNumber(anyString())).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);

            // When
            Customer result = customerService.createCustomer(newCustomer);

            // Then
            assertNotNull(result);
            verify(customerRepository).save(newCustomer);
            verify(customerRepository).existsByNationalId(newCustomer.getNationalId());
            verify(customerRepository).existsByPhoneNumber(newCustomer.getPhoneNumber());
        }

        @Test
        @DisplayName("Should create customer with user account")
        void shouldCreateCustomerWithUserAccount() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            String username = "test.user";
            String password = "password123";
            String encodedPassword = "encoded.password";

            when(userRepository.existsByUsername(username)).thenReturn(false);
            when(userRepository.existsByEmail(newCustomer.getEmail())).thenReturn(false);
            when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(customerRepository.existsByNationalId(anyString())).thenReturn(false);
            when(customerRepository.existsByEmail(anyString())).thenReturn(false);
            when(customerRepository.existsByPhoneNumber(anyString())).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);

            // When
            Customer result = customerService.createCustomerWithUser(newCustomer, username, password);

            // Then
            assertNotNull(result);
            verify(userRepository).save(any(User.class));
            verify(customerRepository).save(newCustomer);
            verify(passwordEncoder).encode(password);
        }

        @Test
        @DisplayName("Should throw exception for duplicate National ID")
        void shouldThrowExceptionForDuplicateNationalId() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            when(customerRepository.existsByNationalId(newCustomer.getNationalId())).thenReturn(true);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Customer with this National ID already exists", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for duplicate email")
        void shouldThrowExceptionForDuplicateEmail() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            when(customerRepository.existsByNationalId(newCustomer.getNationalId())).thenReturn(false);
            when(customerRepository.existsByEmail(newCustomer.getEmail())).thenReturn(true);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Customer with this email already exists", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for duplicate phone number")
        void shouldThrowExceptionForDuplicatePhoneNumber() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            when(customerRepository.existsByNationalId(newCustomer.getNationalId())).thenReturn(false);
            when(customerRepository.existsByEmail(newCustomer.getEmail())).thenReturn(false);
            when(customerRepository.existsByPhoneNumber(newCustomer.getPhoneNumber())).thenReturn(true);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Customer with this phone number already exists", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for invalid National ID")
        void shouldThrowExceptionForInvalidNationalId() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            newCustomer.setNationalId(TestDataHelper.INVALID_NATIONAL_IDS[0]); // Invalid checksum

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Invalid Thai National ID", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for invalid phone number")
        void shouldThrowExceptionForInvalidPhoneNumber() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            newCustomer.setPhoneNumber(TestDataHelper.INVALID_PHONE_NUMBERS[0]); // Invalid format

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Invalid Thai phone number", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for invalid postal code")
        void shouldThrowExceptionForInvalidPostalCode() {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            newCustomer.setPostalCode(TestDataHelper.INVALID_POSTAL_CODES[0]); // Invalid format

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(newCustomer));
            assertEquals("Invalid Thai postal code", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Update Customer Operations")
    class UpdateCustomerOperations {

        @Test
        @DisplayName("Should update customer successfully")
        void shouldUpdateCustomerSuccessfully() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            Customer updateDetails = TestDataHelper.createValidCustomer();
            updateDetails.setFirstName("Updated Name");

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

            // When
            Customer result = customerService.updateCustomer(customerId, updateDetails);

            // Then
            assertNotNull(result);
            assertEquals("Updated Name", existingCustomer.getFirstName());
            verify(customerRepository).save(existingCustomer);
        }

        @Test
        @DisplayName("Should throw exception when customer not found for update")
        void shouldThrowExceptionWhenCustomerNotFoundForUpdate() {
            // Given
            Long customerId = 999L;
            Customer updateDetails = TestDataHelper.createValidCustomer();
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.updateCustomer(customerId, updateDetails));
            assertTrue(exception.getMessage().contains("Customer not found"));
        }

        @Test
        @DisplayName("Should update phone number when valid")
        void shouldUpdatePhoneNumberWhenValid() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            Customer updateDetails = TestDataHelper.createValidCustomer();
            updateDetails.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[1]);

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.existsByPhoneNumber(updateDetails.getPhoneNumber())).thenReturn(false);
            when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

            // When
            Customer result = customerService.updateCustomer(customerId, updateDetails);

            // Then
            assertEquals(TestDataHelper.VALID_PHONE_NUMBERS[1], existingCustomer.getPhoneNumber());
            verify(customerRepository).existsByPhoneNumber(updateDetails.getPhoneNumber());
        }

        @Test
        @DisplayName("Should throw exception when updating to duplicate phone number")
        void shouldThrowExceptionWhenUpdatingToDuplicatePhoneNumber() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            Customer updateDetails = TestDataHelper.createValidCustomer();
            updateDetails.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[1]);

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.existsByPhoneNumber(updateDetails.getPhoneNumber())).thenReturn(true);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.updateCustomer(customerId, updateDetails));
            assertEquals("Phone number already exists", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Delete Customer Operations")
    class DeleteCustomerOperations {

        @Test
        @DisplayName("Should soft delete customer")
        void shouldSoftDeleteCustomer() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            existingCustomer.setIsActive(true);

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

            // When
            customerService.deleteCustomer(customerId);

            // Then
            assertFalse(existingCustomer.getIsActive());
            verify(customerRepository).save(existingCustomer);
        }

        @Test
        @DisplayName("Should throw exception when customer not found for deletion")
        void shouldThrowExceptionWhenCustomerNotFoundForDeletion() {
            // Given
            Long customerId = 999L;
            when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.deleteCustomer(customerId));
            assertTrue(exception.getMessage().contains("Customer not found"));
        }
    }

    @Nested
    @DisplayName("KYC Status Operations")
    class KycStatusOperations {

        @Test
        @DisplayName("Should update KYC status to verified")
        void shouldUpdateKycStatusToVerified() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            existingCustomer.setKycStatus(Customer.KYCStatus.PENDING);

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

            // When
            Customer result = customerService.updateKycStatus(customerId, Customer.KYCStatus.VERIFIED);

            // Then
            assertEquals(Customer.KYCStatus.VERIFIED, result.getKycStatus());
            assertNotNull(result.getKycVerifiedAt());
            verify(customerRepository).save(existingCustomer);
        }

        @Test
        @DisplayName("Should update KYC status to rejected and clear verified date")
        void shouldUpdateKycStatusToRejectedAndClearVerifiedDate() {
            // Given
            Long customerId = 1L;
            Customer existingCustomer = TestDataHelper.createValidCustomer();
            existingCustomer.setId(customerId);
            existingCustomer.setKycStatus(Customer.KYCStatus.VERIFIED);
            existingCustomer.setKycVerifiedAt(LocalDate.now());

            when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(existingCustomer);

            // When
            Customer result = customerService.updateKycStatus(customerId, Customer.KYCStatus.REJECTED);

            // Then
            assertEquals(Customer.KYCStatus.REJECTED, result.getKycStatus());
            assertNull(result.getKycVerifiedAt());
            verify(customerRepository).save(existingCustomer);
        }

        @Test
        @DisplayName("Should get customers by KYC status")
        void shouldGetCustomersByKycStatus() {
            // Given
            Customer.KYCStatus status = Customer.KYCStatus.VERIFIED;
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByKycStatus(status)).thenReturn(expectedCustomers);

            // When
            List<Customer> result = customerService.getCustomersByKycStatus(status);

            // Then
            assertEquals(expectedCustomers, result);
            verify(customerRepository).findByKycStatus(status);
        }

        @Test
        @DisplayName("Should get customer count by KYC status")
        void shouldGetCustomerCountByKycStatus() {
            // Given
            Customer.KYCStatus status = Customer.KYCStatus.VERIFIED;
            long expectedCount = 5L;
            when(customerRepository.countByKycStatus(status)).thenReturn(expectedCount);

            // When
            long actualCount = customerService.getCustomerCountByKycStatus(status);

            // Then
            assertEquals(expectedCount, actualCount);
            verify(customerRepository).countByKycStatus(status);
        }
    }

    @Nested
    @DisplayName("Query Operations")
    class QueryOperations {

        @Test
        @DisplayName("Should get customers by province")
        void shouldGetCustomersByProvince() {
            // Given
            String province = "Bangkok";
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByProvinceAndIsActiveTrue(province)).thenReturn(expectedCustomers);

            // When
            List<Customer> result = customerService.getCustomersByProvince(province);

            // Then
            assertEquals(expectedCustomers, result);
            verify(customerRepository).findByProvinceAndIsActiveTrue(province);
        }

        @Test
        @DisplayName("Should get customers by occupation category")
        void shouldGetCustomersByOccupationCategory() {
            // Given
            Customer.OccupationCategory category = Customer.OccupationCategory.PRIVATE_EMPLOYEE;
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByOccupationCategoryAndIsActiveTrue(category)).thenReturn(expectedCustomers);

            // When
            List<Customer> result = customerService.getCustomersByOccupationCategory(category);

            // Then
            assertEquals(expectedCustomers, result);
            verify(customerRepository).findByOccupationCategoryAndIsActiveTrue(category);
        }

        @Test
        @DisplayName("Should get customers by income range")
        void shouldGetCustomersByIncomeRange() {
            // Given
            Double minIncome = 30000.0;
            Double maxIncome = 100000.0;
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByIncomeRange(minIncome, maxIncome)).thenReturn(expectedCustomers);

            // When
            List<Customer> result = customerService.getCustomersByIncomeRange(minIncome, maxIncome);

            // Then
            assertEquals(expectedCustomers, result);
            verify(customerRepository).findByIncomeRange(minIncome, maxIncome);
        }

        @Test
        @DisplayName("Should get customers by birth date range")
        void shouldGetCustomersByBirthDateRange() {
            // Given
            LocalDate startDate = LocalDate.of(1980, 1, 1);
            LocalDate endDate = LocalDate.of(1990, 12, 31);
            List<Customer> expectedCustomers = Arrays.asList(testCustomer);
            when(customerRepository.findByDateOfBirthBetween(startDate, endDate)).thenReturn(expectedCustomers);

            // When
            List<Customer> result = customerService.getCustomersByBirthDateRange(startDate, endDate);

            // Then
            assertEquals(expectedCustomers, result);
            verify(customerRepository).findByDateOfBirthBetween(startDate, endDate);
        }

        @Test
        @DisplayName("Should get new customers count")
        void shouldGetNewCustomersCount() {
            // Given
            LocalDate startDate = LocalDate.of(2024, 1, 1);
            LocalDate endDate = LocalDate.of(2024, 12, 31);
            long expectedCount = 10L;
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
            when(customerRepository.countNewCustomersBetween(startDateTime, endDateTime)).thenReturn(expectedCount);

            // When
            long actualCount = customerService.getNewCustomersCount(startDate, endDate);

            // Then
            assertEquals(expectedCount, actualCount);
            verify(customerRepository).countNewCustomersBetween(startDateTime, endDateTime);
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("Should throw exception for null customer")
        void shouldThrowExceptionForNullCustomer() {
            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(null));
            assertEquals("Customer cannot be null", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for null National ID")
        void shouldThrowExceptionForNullNationalId() {
            // Given
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setNationalId(null);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(customer));
            assertEquals("National ID is required", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for empty first name")
        void shouldThrowExceptionForEmptyFirstName() {
            // Given
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setFirstName("");

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(customer));
            assertEquals("First name is required", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for customer under 15 years old")
        void shouldThrowExceptionForCustomerUnder15YearsOld() {
            // Given
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setDateOfBirth(LocalDate.now().minusYears(14)); // 14 years old

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(customer));
            assertEquals("Customer must be at least 15 years old", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception for negative monthly income")
        void shouldThrowExceptionForNegativeMonthlyIncome() {
            // Given
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setMonthlyIncome(-1000.0);

            // When & Then
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> customerService.createCustomer(customer));
            assertEquals("Monthly income cannot be negative", exception.getMessage());
        }
    }
}