package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.model.Claim;
import com.thaiinsurance.autoinsurance.model.ClaimDocument;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.ClaimRepository;
import com.thaiinsurance.autoinsurance.repository.PolicyRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for Claim management with Thai insurance regulations
 */
@Service
@Transactional
public class ClaimService {
    
    private static final Logger logger = LoggerFactory.getLogger(ClaimService.class);
    
    @Autowired
    private ClaimRepository claimRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Submit new claim
     */
    public Claim submitClaim(Claim claim) {
        logger.info("Submitting claim for policy ID {}", claim.getPolicy().getId());
        
        validateClaim(claim);
        
        // Generate claim number if not provided
        if (claim.getClaimNumber() == null || claim.getClaimNumber().isEmpty()) {
            claim.setClaimNumber(generateClaimNumber());
        }
        
        // Set initial status
        if (claim.getStatus() == null) {
            claim.setStatus(Claim.ClaimStatus.SUBMITTED);
        }
        
        // Set default priority level
        if (claim.getPriorityLevel() == null) {
            claim.setPriorityLevel(determinePriority(claim));
        }
        
        // Set reported date
        if (claim.getReportedDate() == null) {
            claim.setReportedDate(LocalDate.now());
        }
        
        Claim savedClaim = claimRepository.save(claim);
        logger.info("Submitted claim with ID {} and number {}", 
                   savedClaim.getId(), savedClaim.getClaimNumber());
        
        return savedClaim;
    }
    
    /**
     * Update claim status
     */
    public Claim updateClaimStatus(Long claimId, Claim.ClaimStatus newStatus, String notes, Long updatedBy) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        
        User updater = userRepository.findById(updatedBy)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Claim.ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(newStatus);
        
        // Update relevant dates based on new status
        switch (newStatus) {
            case UNDER_INVESTIGATION:
                claim.setInvestigatedDate(LocalDate.now());
                break;
            case UNDER_REVIEW:
                claim.setReviewStartDate(LocalDate.now());
                break;
            case APPROVED:
                claim.setApprovedDate(LocalDate.now());
                break;
            case REJECTED:
                claim.setRejectedDate(LocalDate.now());
                break;
            case SETTLED:
                claim.setSettlementDate(LocalDate.now());
                break;
            case CLOSED:
                claim.setClosedDate(LocalDate.now());
                break;
        }
        
        // Add notes if provided
        if (notes != null && !notes.isEmpty()) {
            String currentNotes = claim.getAdjusterNotes() != null ? claim.getAdjusterNotes() : "";
            claim.setAdjusterNotes(currentNotes + "\n[" + LocalDate.now() + "] " + notes);
        }
        
        Claim savedClaim = claimRepository.save(claim);
        logger.info("Updated claim {} status from {} to {}", 
                   claim.getClaimNumber(), oldStatus, newStatus);
        
        return savedClaim;
    }
    
    /**
     * Assign claim to adjuster
     */
    public Claim assignClaim(Long claimId, Long adjusterId) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        
        User adjuster = userRepository.findById(adjusterId)
            .orElseThrow(() -> new IllegalArgumentException("Adjuster not found"));
        
        claim.setAdjuster(adjuster);
        if (claim.getStatus() == Claim.ClaimStatus.SUBMITTED) {
            claim.setStatus(Claim.ClaimStatus.UNDER_REVIEW);
            claim.setReviewStartDate(LocalDate.now());
        }
        
        return claimRepository.save(claim);
    }
    
    /**
     * Approve claim with amount
     */
    public Claim approveClaim(Long claimId, BigDecimal approvedAmount, String notes, Long approvedBy) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        
        User approver = userRepository.findById(approvedBy)
            .orElseThrow(() -> new IllegalArgumentException("Approver not found"));
        
        claim.setApprovedAmount(approvedAmount);
        claim.setStatus(Claim.ClaimStatus.APPROVED);
        claim.setApprovedDate(LocalDate.now());
        
        if (notes != null && !notes.isEmpty()) {
            String currentNotes = claim.getAdjusterNotes() != null ? claim.getAdjusterNotes() : "";
            claim.setAdjusterNotes(currentNotes + "\n[" + LocalDate.now() + "] Approved: " + notes);
        }
        
        return claimRepository.save(claim);
    }
    
    /**
     * Reject claim with reason
     */
    public Claim rejectClaim(Long claimId, String rejectionReason, Long rejectedBy) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        
        User rejecter = userRepository.findById(rejectedBy)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        claim.setStatus(Claim.ClaimStatus.REJECTED);
        claim.setRejectionReason(rejectionReason);
        claim.setRejectedDate(LocalDate.now());
        
        return claimRepository.save(claim);
    }
    
    /**
     * Settle claim
     */
    public Claim settleClaim(Long claimId, BigDecimal settlementAmount, String settlementNotes) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        
        if (claim.getStatus() != Claim.ClaimStatus.APPROVED) {
            throw new IllegalStateException("Only approved claims can be settled");
        }
        
        claim.setSettlementAmount(settlementAmount);
        claim.setPaidAmount(settlementAmount);
        claim.setStatus(Claim.ClaimStatus.SETTLED);
        claim.setSettlementDate(LocalDate.now());
        claim.setSettlementNotes(settlementNotes);
        
        return claimRepository.save(claim);
    }
    
    /**
     * Get all claims with pagination
     */
    @Transactional(readOnly = true)
    public Page<Claim> getAllClaims(Pageable pageable) {
        return claimRepository.findAll(pageable);
    }
    
    /**
     * Get claim by ID
     */
    @Transactional(readOnly = true)
    public Optional<Claim> getClaimById(Long id) {
        return claimRepository.findById(id);
    }
    
    /**
     * Get claim by claim number
     */
    @Transactional(readOnly = true)
    public Optional<Claim> getClaimByNumber(String claimNumber) {
        return claimRepository.findByClaimNumber(claimNumber);
    }
    
    /**
     * Get claims by policy
     */
    @Transactional(readOnly = true)
    public List<Claim> getClaimsByPolicy(Long policyId) {
        return claimRepository.findByPolicyId(policyId);
    }
    
    /**
     * Get claims by status
     */
    @Transactional(readOnly = true)
    public List<Claim> getClaimsByStatus(Claim.ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }
    
    /**
     * Get claims by adjuster
     */
    @Transactional(readOnly = true)
    public List<Claim> getClaimsByAdjuster(Long adjusterId) {
        return claimRepository.findByAdjusterId(adjusterId);
    }
    
    /**
     * Get claims by priority
     */
    @Transactional(readOnly = true)
    public List<Claim> getClaimsByPriority(Claim.PriorityLevel priority) {
        return claimRepository.findByPriorityLevel(priority);
    }
    
    /**
     * Search claims
     */
    @Transactional(readOnly = true)
    public Page<Claim> searchClaims(String searchTerm, Pageable pageable) {
        return claimRepository.searchClaims(searchTerm, pageable);
    }
    
    /**
     * Get pending claims (requiring action)
     */
    @Transactional(readOnly = true)
    public List<Claim> getPendingClaims() {
        return claimRepository.findPendingClaims();
    }
    
    /**
     * Get overdue claims
     */
    @Transactional(readOnly = true)
    public List<Claim> getOverdueClaims(int daysThreshold) {
        return claimRepository.findOverdueClaims(LocalDate.now().minusDays(daysThreshold));
    }
    
    /**
     * Get claim statistics
     */
    @Transactional(readOnly = true)
    public ClaimStatistics getClaimStatistics() {
        ClaimStatistics stats = new ClaimStatistics();
        stats.setTotalClaims(claimRepository.count());
        stats.setSubmittedClaims(claimRepository.countByStatus(Claim.ClaimStatus.SUBMITTED));
        stats.setUnderReviewClaims(claimRepository.countByStatus(Claim.ClaimStatus.UNDER_REVIEW));
        stats.setApprovedClaims(claimRepository.countByStatus(Claim.ClaimStatus.APPROVED));
        stats.setRejectedClaims(claimRepository.countByStatus(Claim.ClaimStatus.REJECTED));
        stats.setSettledClaims(claimRepository.countByStatus(Claim.ClaimStatus.SETTLED));
        stats.setAverageSettlementDays(claimRepository.getAverageSettlementDays(
            LocalDate.now().minusYears(1), LocalDate.now()));
        stats.setTotalSettlementAmount(claimRepository.getTotalSettlementAmount());
        
        return stats;
    }
    
    /**
     * Calculate claim processing time statistics
     */
    @Transactional(readOnly = true)
    public ClaimProcessingStats getProcessingStats(LocalDate startDate, LocalDate endDate) {
        ClaimProcessingStats stats = new ClaimProcessingStats();
        
        List<Claim> settledClaims = claimRepository.findSettledClaimsBetweenDates(startDate, endDate);
        
        if (!settledClaims.isEmpty()) {
            double avgDays = settledClaims.stream()
                .mapToLong(Claim::getDaysSinceReported)
                .average()
                .orElse(0.0);
            
            stats.setAverageProcessingDays(avgDays);
            stats.setTotalSettledClaims((long) settledClaims.size());
            
            BigDecimal totalAmount = settledClaims.stream()
                .map(Claim::getSettlementAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            stats.setTotalSettlementAmount(totalAmount);
            stats.setAverageSettlementAmount(
                settledClaims.isEmpty() ? BigDecimal.ZERO : 
                totalAmount.divide(BigDecimal.valueOf(settledClaims.size()), BigDecimal.ROUND_HALF_UP)
            );
        }
        
        return stats;
    }
    
    // Private helper methods
    
    private void validateClaim(Claim claim) {
        if (claim == null) {
            throw new IllegalArgumentException("Claim cannot be null");
        }
        
        if (claim.getIncidentDate() == null) {
            throw new IllegalArgumentException("Incident date is required");
        }
        
        if (claim.getIncidentDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Incident date cannot be in the future");
        }
        
        if (claim.getIncidentLocation() == null || claim.getIncidentLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Incident location is required");
        }
        
        if (claim.getIncidentDescription() == null || claim.getIncidentDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Incident description is required");
        }
        
        if (claim.getIncidentType() == null) {
            throw new IllegalArgumentException("Incident type is required");
        }
        
        if (claim.getPolicy() == null || claim.getPolicy().getId() == null) {
            throw new IllegalArgumentException("Policy is required");
        }
        
        // Validate policy exists and is active
        Policy policy = policyRepository.findById(claim.getPolicy().getId())
            .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        
        if (policy.getStatus() != Policy.PolicyStatus.ACTIVE) {
            throw new IllegalArgumentException("Claims can only be submitted for active policies");
        }
        
        // Check if incident date is within policy coverage period
        if (claim.getIncidentDate().isBefore(policy.getStartDate()) || 
            claim.getIncidentDate().isAfter(policy.getEndDate())) {
            throw new IllegalArgumentException("Incident date must be within policy coverage period");
        }
    }
    
    private String generateClaimNumber() {
        return "CLM" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private Claim.PriorityLevel determinePriority(Claim claim) {
        // Determine priority based on incident type and injury status
        if (claim.getIsDriverInjured() || claim.getArePassengersInjured() || claim.getIsThirdPartyInjured()) {
            return Claim.PriorityLevel.HIGH;
        }
        
        if (claim.getIncidentType() == Claim.IncidentType.THEFT || 
            claim.getIncidentType() == Claim.IncidentType.FIRE) {
            return Claim.PriorityLevel.MEDIUM;
        }
        
        if (claim.getEstimatedDamageAmount() != null && 
            claim.getEstimatedDamageAmount().compareTo(new BigDecimal("100000")) > 0) {
            return Claim.PriorityLevel.MEDIUM;
        }
        
        return Claim.PriorityLevel.NORMAL;
    }
    
    // Inner classes for response DTOs
    public static class ClaimStatistics {
        private long totalClaims;
        private long submittedClaims;
        private long underReviewClaims;
        private long approvedClaims;
        private long rejectedClaims;
        private long settledClaims;
        private Double averageSettlementDays;
        private BigDecimal totalSettlementAmount;
        
        // Getters and setters
        public long getTotalClaims() { return totalClaims; }
        public void setTotalClaims(long totalClaims) { this.totalClaims = totalClaims; }
        public long getSubmittedClaims() { return submittedClaims; }
        public void setSubmittedClaims(long submittedClaims) { this.submittedClaims = submittedClaims; }
        public long getUnderReviewClaims() { return underReviewClaims; }
        public void setUnderReviewClaims(long underReviewClaims) { this.underReviewClaims = underReviewClaims; }
        public long getApprovedClaims() { return approvedClaims; }
        public void setApprovedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; }
        public long getRejectedClaims() { return rejectedClaims; }
        public void setRejectedClaims(long rejectedClaims) { this.rejectedClaims = rejectedClaims; }
        public long getSettledClaims() { return settledClaims; }
        public void setSettledClaims(long settledClaims) { this.settledClaims = settledClaims; }
        public Double getAverageSettlementDays() { return averageSettlementDays; }
        public void setAverageSettlementDays(Double averageSettlementDays) { this.averageSettlementDays = averageSettlementDays; }
        public BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
        public void setTotalSettlementAmount(BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }
    }
    
    public static class ClaimProcessingStats {
        private double averageProcessingDays;
        private long totalSettledClaims;
        private BigDecimal totalSettlementAmount;
        private BigDecimal averageSettlementAmount;
        
        // Getters and setters
        public double getAverageProcessingDays() { return averageProcessingDays; }
        public void setAverageProcessingDays(double averageProcessingDays) { this.averageProcessingDays = averageProcessingDays; }
        public long getTotalSettledClaims() { return totalSettledClaims; }
        public void setTotalSettledClaims(long totalSettledClaims) { this.totalSettledClaims = totalSettledClaims; }
        public BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
        public void setTotalSettlementAmount(BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }
        public BigDecimal getAverageSettlementAmount() { return averageSettlementAmount; }
        public void setAverageSettlementAmount(BigDecimal averageSettlementAmount) { this.averageSettlementAmount = averageSettlementAmount; }
    }
}