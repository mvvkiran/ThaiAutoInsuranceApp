package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import com.thaiinsurance.autoinsurance.util.ThaiValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findByIsActiveTrue();
    }
    
    public Page<Customer> searchCustomers(String searchTerm, Pageable pageable) {
        return customerRepository.searchCustomers(searchTerm, pageable);
    }
    
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    public Optional<Customer> getCustomerByNationalId(String nationalId) {
        return customerRepository.findByNationalId(nationalId);
    }
    
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    public Optional<Customer> getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber);
    }
    
    @Transactional
    public Customer createCustomer(Customer customer) {
        validateCustomer(customer);
        
        // Clean and validate Thai National ID
        String cleanNationalId = ThaiValidationUtil.cleanThaiNationalId(customer.getNationalId());
        if (!ThaiValidationUtil.isValidThaiNationalId(cleanNationalId)) {
            throw new IllegalArgumentException("Invalid Thai National ID");
        }
        customer.setNationalId(cleanNationalId);
        
        // Clean and validate phone number
        String cleanPhoneNumber = ThaiValidationUtil.cleanThaiPhoneNumber(customer.getPhoneNumber());
        if (!ThaiValidationUtil.isValidThaiPhoneNumber(cleanPhoneNumber)) {
            throw new IllegalArgumentException("Invalid Thai phone number");
        }
        customer.setPhoneNumber(cleanPhoneNumber);
        
        // Validate postal code if provided
        if (customer.getPostalCode() != null && !customer.getPostalCode().isEmpty()) {
            if (!ThaiValidationUtil.isValidThaiPostalCode(customer.getPostalCode())) {
                throw new IllegalArgumentException("Invalid Thai postal code");
            }
        }
        
        // Check for duplicates
        if (customerRepository.existsByNationalId(customer.getNationalId())) {
            throw new IllegalArgumentException("Customer with this National ID already exists");
        }
        
        if (customer.getEmail() != null && customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Customer with this email already exists");
        }
        
        if (customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            throw new IllegalArgumentException("Customer with this phone number already exists");
        }
        
        return customerRepository.save(customer);
    }
    
    @Transactional
    public Customer createCustomerWithUser(Customer customer, String username, String password) {
        validateCustomer(customer);
        
        // Create user account first
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (customer.getEmail() != null && userRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(customer.getEmail());
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(customer.getFirstName());
        user.setLastName(customer.getLastName());
        user.setPhoneNumber(customer.getPhoneNumber());
        user.addRole(Role.CUSTOMER);
        
        user = userRepository.save(user);
        
        // Create customer
        customer.setUser(user);
        return createCustomer(customer);
    }
    
    @Transactional
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        
        validateCustomer(customerDetails);
        
        // Update fields
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setFirstNameThai(customerDetails.getFirstNameThai());
        customer.setLastNameThai(customerDetails.getLastNameThai());
        customer.setDateOfBirth(customerDetails.getDateOfBirth());
        customer.setGender(customerDetails.getGender());
        
        // Check phone number change
        if (!customer.getPhoneNumber().equals(customerDetails.getPhoneNumber())) {
            String cleanPhoneNumber = ThaiValidationUtil.cleanThaiPhoneNumber(customerDetails.getPhoneNumber());
            if (!ThaiValidationUtil.isValidThaiPhoneNumber(cleanPhoneNumber)) {
                throw new IllegalArgumentException("Invalid Thai phone number");
            }
            if (customerRepository.existsByPhoneNumber(cleanPhoneNumber)) {
                throw new IllegalArgumentException("Phone number already exists");
            }
            customer.setPhoneNumber(cleanPhoneNumber);
        }
        
        // Check email change
        if (customerDetails.getEmail() != null && !customerDetails.getEmail().equals(customer.getEmail())) {
            if (customerRepository.existsByEmail(customerDetails.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            customer.setEmail(customerDetails.getEmail());
        }
        
        customer.setAddressLine1(customerDetails.getAddressLine1());
        customer.setAddressLine2(customerDetails.getAddressLine2());
        customer.setDistrict(customerDetails.getDistrict());
        customer.setProvince(customerDetails.getProvince());
        
        // Validate postal code
        if (customerDetails.getPostalCode() != null && !customerDetails.getPostalCode().isEmpty()) {
            if (!ThaiValidationUtil.isValidThaiPostalCode(customerDetails.getPostalCode())) {
                throw new IllegalArgumentException("Invalid Thai postal code");
            }
        }
        customer.setPostalCode(customerDetails.getPostalCode());
        
        customer.setOccupationCategory(customerDetails.getOccupationCategory());
        customer.setOccupationDetail(customerDetails.getOccupationDetail());
        customer.setMonthlyIncome(customerDetails.getMonthlyIncome());
        
        return customerRepository.save(customer);
    }
    
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        
        // Soft delete
        customer.setIsActive(false);
        customerRepository.save(customer);
    }
    
    @Transactional
    public Customer updateKycStatus(Long id, Customer.KYCStatus status) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        
        customer.setKycStatus(status);
        
        if (status == Customer.KYCStatus.VERIFIED) {
            customer.setKycVerifiedAt(LocalDate.now());
        } else {
            customer.setKycVerifiedAt(null);
        }
        
        return customerRepository.save(customer);
    }
    
    public List<Customer> getCustomersByKycStatus(Customer.KYCStatus status) {
        return customerRepository.findByKycStatus(status);
    }
    
    public List<Customer> getCustomersByProvince(String province) {
        return customerRepository.findByProvinceAndIsActiveTrue(province);
    }
    
    public List<Customer> getCustomersByOccupationCategory(Customer.OccupationCategory category) {
        return customerRepository.findByOccupationCategoryAndIsActiveTrue(category);
    }
    
    public List<Customer> getCustomersByIncomeRange(Double minIncome, Double maxIncome) {
        return customerRepository.findByIncomeRange(minIncome, maxIncome);
    }
    
    public List<Customer> getCustomersByBirthDateRange(LocalDate startDate, LocalDate endDate) {
        return customerRepository.findByDateOfBirthBetween(startDate, endDate);
    }
    
    public long getCustomerCountByKycStatus(Customer.KYCStatus status) {
        return customerRepository.countByKycStatus(status);
    }
    
    public long getNewCustomersCount(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        return customerRepository.countNewCustomersBetween(startDateTime, endDateTime);
    }
    
    private void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        
        if (customer.getNationalId() == null || customer.getNationalId().trim().isEmpty()) {
            throw new IllegalArgumentException("National ID is required");
        }
        
        if (customer.getFirstName() == null || customer.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (customer.getLastName() == null || customer.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        
        if (customer.getPhoneNumber() == null || customer.getPhoneNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        
        if (customer.getDateOfBirth() != null && customer.getDateOfBirth().isAfter(LocalDate.now().minusYears(15))) {
            throw new IllegalArgumentException("Customer must be at least 15 years old");
        }
        
        if (customer.getMonthlyIncome() != null && customer.getMonthlyIncome() < 0) {
            throw new IllegalArgumentException("Monthly income cannot be negative");
        }
    }
}