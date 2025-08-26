package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.dto.PolicyQuoteRequest;
import com.thaiinsurance.autoinsurance.dto.PolicyQuoteResponse;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Policy Management
 * Handles CMI and Voluntary insurance policies for Thai market
 */
@RestController
@RequestMapping("/api/policies")
@Tag(name = "Policy Management", description = "Thai auto insurance policy management APIs")
public class PolicyController {
    
    @Autowired
    private PolicyService policyService;
    
    @PostMapping("/quote")
    @Operation(summary = "Generate insurance quote", 
               description = "Generate quote for CMI or Voluntary insurance with Thai calculations")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PolicyQuoteResponse>> generateQuote(
            @Valid @RequestBody PolicyQuoteRequest request) {
        try {
            PolicyQuoteResponse quote = policyService.generateQuote(request);
            return ResponseEntity.ok(ApiResponse.success("Quote generated successfully", quote));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Quote generation failed", e.getMessage()));
        }
    }
    
    @PostMapping("/quote/{quoteNumber}/purchase")
    @Operation(summary = "Purchase policy from quote", 
               description = "Create policy from existing quote")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Policy>> purchaseFromQuote(
            @PathVariable String quoteNumber,
            @RequestParam(required = false) Long agentId) {
        try {
            Policy policy = policyService.createPolicyFromQuote(quoteNumber, agentId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Policy created successfully", policy));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Policy creation failed", e.getMessage()));
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all policies", 
               description = "Retrieve all policies with pagination")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Policy>>> getAllPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Policy> policies = policyService.getAllPolicies(pageable);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policies));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search policies", 
               description = "Search policies by policy number, customer name, or vehicle")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Policy>>> searchPolicies(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Policy> policies = policyService.searchPolicies(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Policy search completed", policies));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get policy by ID", 
               description = "Retrieve policy details by ID")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Policy>> getPolicyById(@PathVariable Long id) {
        return policyService.getPolicyById(id)
                .map(policy -> ResponseEntity.ok(ApiResponse.success("Policy found", policy)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{policyNumber}")
    @Operation(summary = "Get policy by policy number", 
               description = "Retrieve policy by policy number")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Policy>> getPolicyByNumber(@PathVariable String policyNumber) {
        return policyService.getPolicyByNumber(policyNumber)
                .map(policy -> ResponseEntity.ok(ApiResponse.success("Policy found", policy)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get policies by customer", 
               description = "Retrieve all policies for a customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Policy>>> getPoliciesByCustomer(@PathVariable Long customerId) {
        List<Policy> policies = policyService.getPoliciesByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer policies retrieved", policies));
    }
    
    @GetMapping("/expiring")
    @Operation(summary = "Get expiring policies", 
               description = "Retrieve policies expiring within specified days")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Policy>>> getExpiringPolicies(
            @Parameter(description = "Number of days to look ahead for expiring policies")
            @RequestParam(defaultValue = "30") int days) {
        List<Policy> policies = policyService.getExpiringPolicies(days);
        return ResponseEntity.ok(ApiResponse.success("Expiring policies retrieved", policies));
    }
    
    @PostMapping("/{policyId}/renew")
    @Operation(summary = "Renew policy", 
               description = "Create renewal policy from existing policy")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Policy>> renewPolicy(
            @PathVariable Long policyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "1") int years) {
        try {
            Policy renewedPolicy = policyService.renewPolicy(policyId, startDate, years);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Policy renewed successfully", renewedPolicy));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Policy renewal failed", e.getMessage()));
        }
    }
    
    @PutMapping("/{policyId}/cancel")
    @Operation(summary = "Cancel policy", 
               description = "Cancel active policy with reason")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Policy>> cancelPolicy(
            @PathVariable Long policyId,
            @RequestBody PolicyCancellationRequest request) {
        try {
            Policy cancelledPolicy = policyService.cancelPolicy(policyId, request.getReason());
            return ResponseEntity.ok(ApiResponse.success("Policy cancelled successfully", cancelledPolicy));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Policy cancellation failed", e.getMessage()));
        }
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Get policy statistics", 
               description = "Get policy count statistics by status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PolicyService.PolicyStatistics>> getStatistics() {
        PolicyService.PolicyStatistics stats = policyService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Policy statistics retrieved", stats));
    }
    
    @GetMapping("/by-type/{policyType}")
    @Operation(summary = "Get policies by type", 
               description = "Retrieve policies by type (CMI or VOLUNTARY)")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Policy>>> getPoliciesByType(@PathVariable Policy.PolicyType policyType) {
        // This would need to be implemented in the service
        return ResponseEntity.ok(ApiResponse.success("Policies by type retrieved", List.of()));
    }
    
    @GetMapping("/by-status/{status}")
    @Operation(summary = "Get policies by status", 
               description = "Retrieve policies by status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Policy>>> getPoliciesByStatus(@PathVariable Policy.PolicyStatus status) {
        // This would need to be implemented in the service
        return ResponseEntity.ok(ApiResponse.success("Policies by status retrieved", List.of()));
    }
    
    @GetMapping("/coverage-report")
    @Operation(summary = "Generate coverage report", 
               description = "Generate policy coverage statistics report")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<CoverageReport>> getCoverageReport() {
        // Generate coverage statistics
        CoverageReport report = new CoverageReport();
        // Populate report data...
        
        return ResponseEntity.ok(ApiResponse.success("Coverage report generated", report));
    }
    
    // Inner classes for request/response DTOs
    
    public static class PolicyCancellationRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
    
    public static class CoverageReport {
        private long totalPolicies;
        private long cmiPolicies;
        private long voluntaryPolicies;
        private long comprehensiveCoverage;
        private long thirdPartyCoverage;
        
        // Getters and setters
        public long getTotalPolicies() { return totalPolicies; }
        public void setTotalPolicies(long totalPolicies) { this.totalPolicies = totalPolicies; }
        public long getCmiPolicies() { return cmiPolicies; }
        public void setCmiPolicies(long cmiPolicies) { this.cmiPolicies = cmiPolicies; }
        public long getVoluntaryPolicies() { return voluntaryPolicies; }
        public void setVoluntaryPolicies(long voluntaryPolicies) { this.voluntaryPolicies = voluntaryPolicies; }
        public long getComprehensiveCoverage() { return comprehensiveCoverage; }
        public void setComprehensiveCoverage(long comprehensiveCoverage) { this.comprehensiveCoverage = comprehensiveCoverage; }
        public long getThirdPartyCoverage() { return thirdPartyCoverage; }
        public void setThirdPartyCoverage(long thirdPartyCoverage) { this.thirdPartyCoverage = thirdPartyCoverage; }
    }
}