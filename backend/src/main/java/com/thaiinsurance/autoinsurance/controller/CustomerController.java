package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Customer management APIs")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @GetMapping
    @Operation(summary = "Get all active customers", description = "Retrieve all active customers")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", customers));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search customers", description = "Search customers by name, national ID, or phone number")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Customer>>> searchCustomers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Customer> customers = customerService.searchCustomers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Customer search completed", customers));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Retrieve customer information by ID")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Customer found", customer)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/national-id/{nationalId}")
    @Operation(summary = "Get customer by National ID", description = "Retrieve customer by Thai National ID")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByNationalId(@PathVariable String nationalId) {
        return customerService.getCustomerByNationalId(nationalId)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Customer found", customer)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/phone/{phoneNumber}")
    @Operation(summary = "Get customer by phone number", description = "Retrieve customer by phone number")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByPhoneNumber(@PathVariable String phoneNumber) {
        return customerService.getCustomerByPhoneNumber(phoneNumber)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Customer found", customer)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Create new customer", description = "Create a new customer record")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@Valid @RequestBody Customer customer) {
        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Customer created successfully", createdCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", e.getMessage()));
        }
    }
    
    @PostMapping("/with-user")
    @Operation(summary = "Create customer with user account", description = "Create customer with associated user account")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> createCustomerWithUser(
            @Valid @RequestBody CustomerWithUserRequest request) {
        try {
            Customer createdCustomer = customerService.createCustomerWithUser(
                    request.getCustomer(), 
                    request.getUsername(), 
                    request.getPassword()
            );
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Customer with user account created successfully", createdCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update customer", description = "Update existing customer information")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable Long id, 
                                                               @Valid @RequestBody Customer customer) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updatedCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Update failed", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer", description = "Soft delete customer (deactivate)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Delete failed", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/kyc-status")
    @Operation(summary = "Update KYC status", description = "Update customer KYC verification status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Customer>> updateKycStatus(@PathVariable Long id, 
                                                                @RequestBody KycStatusUpdateRequest request) {
        try {
            Customer updatedCustomer = customerService.updateKycStatus(id, request.getStatus());
            return ResponseEntity.ok(ApiResponse.success("KYC status updated successfully", updatedCustomer));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Update failed", e.getMessage()));
        }
    }
    
    @GetMapping("/kyc-status/{status}")
    @Operation(summary = "Get customers by KYC status", description = "Retrieve customers by KYC verification status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomersByKycStatus(@PathVariable Customer.KYCStatus status) {
        List<Customer> customers = customerService.getCustomersByKycStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved by KYC status", customers));
    }
    
    @GetMapping("/province/{province}")
    @Operation(summary = "Get customers by province", description = "Retrieve customers by province")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomersByProvince(@PathVariable String province) {
        List<Customer> customers = customerService.getCustomersByProvince(province);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved by province", customers));
    }
    
    @GetMapping("/occupation/{category}")
    @Operation(summary = "Get customers by occupation category", description = "Retrieve customers by occupation category")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomersByOccupation(
            @PathVariable Customer.OccupationCategory category) {
        List<Customer> customers = customerService.getCustomersByOccupationCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved by occupation", customers));
    }
    
    @GetMapping("/income-range")
    @Operation(summary = "Get customers by income range", description = "Retrieve customers by monthly income range")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomersByIncomeRange(
            @RequestParam Double minIncome, @RequestParam Double maxIncome) {
        List<Customer> customers = customerService.getCustomersByIncomeRange(minIncome, maxIncome);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved by income range", customers));
    }
    
    @GetMapping("/statistics/kyc")
    @Operation(summary = "Get KYC statistics", description = "Get customer count by KYC status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<KycStatistics>> getKycStatistics() {
        KycStatistics stats = new KycStatistics();
        stats.setPending(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.PENDING));
        stats.setVerified(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.VERIFIED));
        stats.setRejected(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.REJECTED));
        stats.setExpired(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.EXPIRED));
        
        return ResponseEntity.ok(ApiResponse.success("KYC statistics retrieved", stats));
    }
    
    @GetMapping("/statistics/new-customers")
    @Operation(summary = "Get new customers statistics", description = "Get count of new customers in date range")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getNewCustomersCount(
            @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        long count = customerService.getNewCustomersCount(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("New customers count retrieved", count));
    }
    
    // Inner classes for request/response DTOs
    public static class CustomerWithUserRequest {
        private Customer customer;
        private String username;
        private String password;
        
        // Getters and setters
        public Customer getCustomer() { return customer; }
        public void setCustomer(Customer customer) { this.customer = customer; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class KycStatusUpdateRequest {
        private Customer.KYCStatus status;
        
        public Customer.KYCStatus getStatus() { return status; }
        public void setStatus(Customer.KYCStatus status) { this.status = status; }
    }
    
    public static class KycStatistics {
        private long pending;
        private long verified;
        private long rejected;
        private long expired;
        
        // Getters and setters
        public long getPending() { return pending; }
        public void setPending(long pending) { this.pending = pending; }
        public long getVerified() { return verified; }
        public void setVerified(long verified) { this.verified = verified; }
        public long getRejected() { return rejected; }
        public void setRejected(long rejected) { this.rejected = rejected; }
        public long getExpired() { return expired; }
        public void setExpired(long expired) { this.expired = expired; }
    }
}