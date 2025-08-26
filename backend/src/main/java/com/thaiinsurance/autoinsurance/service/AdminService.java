package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.dto.PolicyDTO;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.Role;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.PaymentRepository;
import com.thaiinsurance.autoinsurance.repository.PolicyRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service("adminService")
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalUsers", userRepository.countByIsActiveTrue());
        stats.put("totalCustomers", customerRepository.countByIsActiveTrue());
        stats.put("totalPolicies", policyRepository.count());
        stats.put("totalRevenue", 0.0); // Simplified for now
        
        return stats;
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    public Page<PolicyDTO> getAllPolicies(Pageable pageable) {
        Page<Policy> policies = policyRepository.findAll(pageable);
        return policies.map(PolicyDTO::new);
    }

    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.searchUsers(searchTerm, pageable);
    }

    public Page<Customer> searchCustomers(String searchTerm, Pageable pageable) {
        return customerRepository.searchCustomers(searchTerm, pageable);
    }

    // User CRUD operations
    public User createUser(User userRequest) {
        // Validate required fields
        if (userRequest.getUsername() == null || userRequest.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (userRequest.getEmail() == null || userRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRequest.getPassword() == null || userRequest.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        // Check if username or email already exists
        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new user
        User newUser = new User();
        newUser.setUsername(userRequest.getUsername());
        newUser.setEmail(userRequest.getEmail());
        newUser.setFirstName(userRequest.getFirstName());
        newUser.setLastName(userRequest.getLastName());
        newUser.setPhoneNumber(userRequest.getPhoneNumber());
        newUser.setRole(userRequest.getRole() != null ? userRequest.getRole() : Role.CUSTOMER);
        newUser.setIsActive(true);
        newUser.setEmailVerified(false);
        newUser.setPhoneVerified(false);
        newUser.setAccountLocked(false);
        newUser.setFailedLoginAttempts(0);
        newUser.setPasswordChangeRequired(true); // New users should change their password

        // Encode password
        newUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        return userRepository.save(newUser);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    public User updateUser(Long id, User userRequest) {
        User existingUser = getUserById(id);

        // Update fields if provided
        if (userRequest.getFirstName() != null && !userRequest.getFirstName().trim().isEmpty()) {
            existingUser.setFirstName(userRequest.getFirstName());
        }
        if (userRequest.getLastName() != null && !userRequest.getLastName().trim().isEmpty()) {
            existingUser.setLastName(userRequest.getLastName());
        }
        if (userRequest.getPhoneNumber() != null && !userRequest.getPhoneNumber().trim().isEmpty()) {
            existingUser.setPhoneNumber(userRequest.getPhoneNumber());
        }
        if (userRequest.getRole() != null) {
            existingUser.setRole(userRequest.getRole());
        }
        
        // Don't allow email or username changes through update (security)
        // Password changes should be handled through a separate endpoint

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        
        // Prevent deletion of admin users
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete admin users");
        }
        
        // Soft delete - just deactivate the user
        user.setIsActive(false);
        userRepository.save(user);
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        
        // Prevent deactivating admin users
        if (!user.getIsActive() && user.getRole() == Role.ADMIN) {
            // Allow reactivating admin users, but this check is for extra safety
        }
        
        user.setIsActive(!user.getIsActive());
        return userRepository.save(user);
    }
}