package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.dto.PolicyDTO;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "System administration and management APIs")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard", description = "Get comprehensive system statistics for admin dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Map<String, Object> dashboard = adminService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved successfully", dashboard));
    }
    
    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Get paginated list of all users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<User> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
    
    @GetMapping("/customers")
    @Operation(summary = "Get all customers", description = "Get paginated list of all customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<Customer>>> getAllCustomers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Customer> customers = adminService.getAllCustomers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", customers));
    }
    
    @GetMapping("/policies")
    @Operation(summary = "Get all policies", description = "Get paginated list of all policies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PolicyDTO>>> getAllPolicies(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PolicyDTO> policies = adminService.getAllPolicies(pageable);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policies));
    }
    
    @GetMapping("/users/search")
    @Operation(summary = "Search users", description = "Search users by name, email, or username")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<User>>> searchUsers(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = adminService.searchUsers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("User search completed", users));
    }
    
    @GetMapping("/customers/search")
    @Operation(summary = "Search customers", description = "Search customers by name, email, or phone")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<Customer>>> searchCustomers(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Customer> customers = adminService.searchCustomers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Customer search completed", customers));
    }
    
    // User CRUD operations
    @PostMapping("/users")
    @Operation(summary = "Create new user", description = "Create a new user account")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User userRequest) {
        User createdUser = adminService.createUser(userRequest);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", createdUser));
    }
    
    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID", description = "Get detailed user information by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> getUserById(
            @Parameter(description = "User ID") @PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
    
    @PutMapping("/users/{id}")
    @Operation(summary = "Update user", description = "Update existing user information")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            @RequestBody User userRequest) {
        User updatedUser = adminService.updateUser(id, userRequest);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Delete user account (soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @Parameter(description = "User ID") @PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
    
    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Toggle user status", description = "Activate or deactivate user account")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(
            @Parameter(description = "User ID") @PathVariable Long id) {
        User user = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", user));
    }
}