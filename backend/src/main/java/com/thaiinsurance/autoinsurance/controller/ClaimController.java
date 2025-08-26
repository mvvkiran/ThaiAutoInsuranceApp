package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ClaimSubmissionRequest;
import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Claim;
import com.thaiinsurance.autoinsurance.service.ClaimService;
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

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
@Tag(name = "Claims Management", description = "Insurance claims processing and management APIs")
public class ClaimController {
    
    @Autowired
    private ClaimService claimService;
    
    @PostMapping
    @Operation(summary = "Submit new claim", description = "Submit a new insurance claim for policy")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> submitClaim(@Valid @RequestBody ClaimSubmissionRequest claimRequest) {
        Claim claim = convertToClaim(claimRequest);
        Claim submittedClaim = claimService.submitClaim(claim);
        return ResponseEntity.ok(ApiResponse.success("Claim submitted successfully", submittedClaim));
    }
    
    @GetMapping
    @Operation(summary = "Get all claims", description = "Retrieve all claims with pagination")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Claim>>> getAllClaims(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Claim> claims = claimService.getAllClaims(pageable);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get claim by ID", description = "Retrieve claim details by ID")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id)
            .map(claim -> ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", claim)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Claim not found", null)));
    }
    
    @GetMapping("/number/{claimNumber}")
    @Operation(summary = "Get claim by claim number", description = "Retrieve claim by claim number")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> getClaimByNumber(@PathVariable String claimNumber) {
        return claimService.getClaimByNumber(claimNumber)
            .map(claim -> ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", claim)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Claim not found", null)));
    }
    
    @GetMapping("/policy/{policyId}")
    @Operation(summary = "Get claims by policy", description = "Retrieve all claims for a specific policy")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsByPolicy(@PathVariable Long policyId) {
        List<Claim> claims = claimService.getClaimsByPolicy(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy claims retrieved successfully", claims));
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get claims by status", description = "Retrieve claims by status")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsByStatus(@PathVariable Claim.ClaimStatus status) {
        List<Claim> claims = claimService.getClaimsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }
    
    @GetMapping("/adjuster/{adjusterId}")
    @Operation(summary = "Get claims by adjuster", description = "Retrieve claims assigned to specific adjuster")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsByAdjuster(@PathVariable Long adjusterId) {
        List<Claim> claims = claimService.getClaimsByAdjuster(adjusterId);
        return ResponseEntity.ok(ApiResponse.success("Adjuster claims retrieved successfully", claims));
    }
    
    @GetMapping("/priority/{priority}")
    @Operation(summary = "Get claims by priority", description = "Retrieve claims by priority level")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getClaimsByPriority(@PathVariable Claim.PriorityLevel priority) {
        List<Claim> claims = claimService.getClaimsByPriority(priority);
        return ResponseEntity.ok(ApiResponse.success("Priority claims retrieved successfully", claims));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search claims", description = "Search claims by number, policy number, or incident details")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Claim>>> searchClaims(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Claim> claims = claimService.searchClaims(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Claim search completed", claims));
    }
    
    @GetMapping("/pending")
    @Operation(summary = "Get pending claims", description = "Retrieve claims requiring action")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getPendingClaims() {
        List<Claim> claims = claimService.getPendingClaims();
        return ResponseEntity.ok(ApiResponse.success("Pending claims retrieved successfully", claims));
    }
    
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue claims", description = "Retrieve overdue claims needing attention")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Claim>>> getOverdueClaims(
            @Parameter(description = "Days threshold for overdue") @RequestParam(defaultValue = "30") int daysThreshold) {
        List<Claim> claims = claimService.getOverdueClaims(daysThreshold);
        return ResponseEntity.ok(ApiResponse.success("Overdue claims retrieved successfully", claims));
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Get claim statistics", description = "Get claim statistics and metrics")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ClaimService.ClaimStatistics>> getClaimStatistics() {
        ClaimService.ClaimStatistics stats = claimService.getClaimStatistics();
        return ResponseEntity.ok(ApiResponse.success("Claim statistics retrieved successfully", stats));
    }
    
    @GetMapping("/processing-stats")
    @Operation(summary = "Get claim processing statistics", description = "Get claim processing time statistics for date range")
    @PreAuthorize("hasAnyRole('AGENT', 'CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ClaimService.ClaimProcessingStats>> getProcessingStats(
            @Parameter(description = "Start date") @RequestParam LocalDate startDate,
            @Parameter(description = "End date") @RequestParam LocalDate endDate) {
        ClaimService.ClaimProcessingStats stats = claimService.getProcessingStats(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Processing statistics retrieved successfully", stats));
    }
    
    // Claim management endpoints
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update claim status", description = "Update claim status with notes")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> updateClaimStatus(
            @PathVariable Long id,
            @RequestParam Claim.ClaimStatus status,
            @RequestParam(required = false) String notes,
            @RequestParam Long updatedBy) {
        Claim claim = claimService.updateClaimStatus(id, status, notes, updatedBy);
        return ResponseEntity.ok(ApiResponse.success("Claim status updated successfully", claim));
    }
    
    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign claim to adjuster", description = "Assign claim to claims adjuster")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> assignClaim(
            @PathVariable Long id,
            @RequestParam Long adjusterId) {
        Claim claim = claimService.assignClaim(id, adjusterId);
        return ResponseEntity.ok(ApiResponse.success("Claim assigned successfully", claim));
    }
    
    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve claim", description = "Approve claim with settlement amount")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> approveClaim(
            @PathVariable Long id,
            @RequestParam BigDecimal approvedAmount,
            @RequestParam(required = false) String notes,
            @RequestParam Long approvedBy) {
        Claim claim = claimService.approveClaim(id, approvedAmount, notes, approvedBy);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", claim));
    }
    
    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject claim", description = "Reject claim with reason")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> rejectClaim(
            @PathVariable Long id,
            @RequestParam String rejectionReason,
            @RequestParam Long rejectedBy) {
        Claim claim = claimService.rejectClaim(id, rejectionReason, rejectedBy);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", claim));
    }
    
    @PostMapping("/{id}/settle")
    @Operation(summary = "Settle claim", description = "Process claim settlement")
    @PreAuthorize("hasAnyRole('CLAIMS_ADJUSTER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Claim>> settleClaim(
            @PathVariable Long id,
            @RequestParam BigDecimal settlementAmount,
            @RequestParam(required = false) String settlementNotes) {
        Claim claim = claimService.settleClaim(id, settlementAmount, settlementNotes);
        return ResponseEntity.ok(ApiResponse.success("Claim settled successfully", claim));
    }
    
    // Helper methods
    private Claim convertToClaim(ClaimSubmissionRequest request) {
        Claim claim = new Claim();
        claim.setIncidentLocation(request.getIncidentLocation());
        claim.setIncidentDescription(request.getIncidentDescription());
        claim.setIncidentType(request.getIncidentType());
        claim.setPoliceReportNumber(request.getPoliceReportNumber());
        return claim;
    }
}