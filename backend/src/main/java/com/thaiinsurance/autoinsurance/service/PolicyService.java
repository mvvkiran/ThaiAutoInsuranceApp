package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.dto.PolicyQuoteRequest;
import com.thaiinsurance.autoinsurance.dto.PolicyQuoteResponse;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.Vehicle;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.PolicyRepository;
import com.thaiinsurance.autoinsurance.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for Policy management with Thai insurance specifics
 */
@Service
@Transactional
public class PolicyService {
    
    private static final Logger logger = LoggerFactory.getLogger(PolicyService.class);
    
    // Thai insurance constants
    private static final BigDecimal CMI_BASE_PREMIUM = new BigDecimal("645.00"); // Standard CMI premium
    private static final BigDecimal VAT_RATE = new BigDecimal("0.07"); // 7% VAT
    private static final BigDecimal STAMP_DUTY = new BigDecimal("1.00"); // 1 Baht stamp duty
    private static final BigDecimal[] NO_CLAIM_DISCOUNTS = {
        BigDecimal.ZERO,           // 0 years
        new BigDecimal("0.10"),    // 1 year - 10%
        new BigDecimal("0.20"),    // 2 years - 20%
        new BigDecimal("0.30"),    // 3 years - 30%
        new BigDecimal("0.40"),    // 4 years - 40%
        new BigDecimal("0.50")     // 5+ years - 50%
    };
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    /**
     * Generate policy quote with Thai insurance calculations
     */
    public PolicyQuoteResponse generateQuote(PolicyQuoteRequest request) {
        logger.info("Generating quote for customer {} and vehicle {}", 
                   request.getCustomerId(), request.getVehicleId());
        
        // Validate customer exists
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
            
        // Validate vehicle exists
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        // Generate quote number
        String quoteNumber = generateQuoteNumber();
        
        PolicyQuoteResponse quote = new PolicyQuoteResponse();
        quote.setQuoteNumber(quoteNumber);
        quote.setCustomerId(customer.getId());
        quote.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        quote.setVehicleId(vehicle.getId());
        quote.setVehicleRegistration(vehicle.getLicensePlate());
        quote.setPolicyType(request.getPolicyType());
        quote.setCoverageType(request.getCoverageType());
        quote.setStartDate(request.getStartDate());
        quote.setEndDate(request.getStartDate().plusYears(request.getPolicyYears()));
        quote.setValidUntil(LocalDate.now().plusDays(30)); // Quote valid for 30 days
        
        // Calculate premium based on policy type and coverage
        BigDecimal basePremium = calculateBasePremium(request, vehicle);
        quote.setBasePremium(basePremium);
        
        // Apply no-claim discount if applicable
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.isHasNoClaimDiscount() && request.getNoClaimYears() > 0) {
            discountAmount = calculateNoClaimDiscount(basePremium, request.getNoClaimYears());
            quote.setNoClaimDiscountAmount(discountAmount);
            quote.setHasNoClaimDiscount(true);
            quote.setNoClaimYears(request.getNoClaimYears());
        }
        
        quote.setDiscountAmount(discountAmount);
        quote.setDiscountPercentage(calculateDiscountPercentage(basePremium, discountAmount));
        
        // Calculate tax (VAT + stamp duty)
        BigDecimal netPremium = basePremium.subtract(discountAmount);
        BigDecimal vatAmount = netPremium.multiply(VAT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal taxAmount = vatAmount.add(STAMP_DUTY);
        quote.setTaxAmount(taxAmount);
        
        // Calculate total premium
        BigDecimal totalPremium = netPremium.add(taxAmount);
        quote.setTotalPremium(totalPremium);
        
        // Set coverage details
        quote.setSumInsured(request.getSumInsured());
        quote.setDeductible(request.getDeductible());
        quote.setRemarks(request.getRemarks());
        
        logger.info("Generated quote {} with total premium {}", quoteNumber, totalPremium);
        return quote;
    }
    
    /**
     * Create policy from quote
     */
    public Policy createPolicyFromQuote(String quoteNumber, Long agentId) {
        // In real implementation, you'd store quotes temporarily
        // For now, we'll create a basic policy
        
        Policy policy = new Policy();
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setStatus(Policy.PolicyStatus.DRAFT);
        policy.setIssuedDate(LocalDate.now());
        
        return policyRepository.save(policy);
    }
    
    /**
     * Get all policies with pagination
     */
    @Transactional(readOnly = true)
    public Page<Policy> getAllPolicies(Pageable pageable) {
        return policyRepository.findAll(pageable);
    }
    
    /**
     * Search policies
     */
    @Transactional(readOnly = true)
    public Page<Policy> searchPolicies(String searchTerm, Pageable pageable) {
        return policyRepository.searchPolicies(searchTerm, pageable);
    }
    
    /**
     * Get policy by ID
     */
    @Transactional(readOnly = true)
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }
    
    /**
     * Get policy by policy number
     */
    @Transactional(readOnly = true)
    public Optional<Policy> getPolicyByNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber);
    }
    
    /**
     * Get policies by customer
     */
    @Transactional(readOnly = true)
    public List<Policy> getPoliciesByCustomer(Long customerId) {
        return policyRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get expiring policies
     */
    @Transactional(readOnly = true)
    public List<Policy> getExpiringPolicies(int days) {
        LocalDate expiryDate = LocalDate.now().plusDays(days);
        return policyRepository.findExpiringPolicies(expiryDate);
    }
    
    /**
     * Renew policy
     */
    public Policy renewPolicy(Long policyId, LocalDate newStartDate, int years) {
        Policy existingPolicy = policyRepository.findById(policyId)
            .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        
        // Create new policy based on existing one
        Policy renewedPolicy = new Policy();
        renewedPolicy.setPolicyNumber(generatePolicyNumber());
        renewedPolicy.setPolicyType(existingPolicy.getPolicyType());
        renewedPolicy.setCoverageType(existingPolicy.getCoverageType());
        renewedPolicy.setStartDate(newStartDate);
        renewedPolicy.setEndDate(newStartDate.plusYears(years));
        renewedPolicy.setPremiumAmount(existingPolicy.getPremiumAmount());
        renewedPolicy.setSumInsured(existingPolicy.getSumInsured());
        renewedPolicy.setDeductible(existingPolicy.getDeductible());
        renewedPolicy.setCustomer(existingPolicy.getCustomer());
        renewedPolicy.setVehicle(existingPolicy.getVehicle());
        renewedPolicy.setAgent(existingPolicy.getAgent());
        renewedPolicy.setStatus(Policy.PolicyStatus.DRAFT);
        
        return policyRepository.save(renewedPolicy);
    }
    
    /**
     * Cancel policy
     */
    public Policy cancelPolicy(Long policyId, String reason) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        
        if (policy.getStatus() == Policy.PolicyStatus.CANCELLED) {
            throw new IllegalArgumentException("Policy is already cancelled");
        }
        
        policy.setStatus(Policy.PolicyStatus.CANCELLED);
        policy.setCancelledDate(LocalDate.now());
        policy.setCancellationReason(reason);
        
        return policyRepository.save(policy);
    }
    
    /**
     * Calculate statistics
     */
    @Transactional(readOnly = true)
    public PolicyStatistics getStatistics() {
        PolicyStatistics stats = new PolicyStatistics();
        stats.setTotalPolicies(policyRepository.count());
        stats.setActivePolicies(policyRepository.countByStatus(Policy.PolicyStatus.ACTIVE));
        stats.setExpiredPolicies(policyRepository.countByStatus(Policy.PolicyStatus.EXPIRED));
        stats.setCancelledPolicies(policyRepository.countByStatus(Policy.PolicyStatus.CANCELLED));
        
        return stats;
    }
    
    // Private helper methods
    
    private String generateQuoteNumber() {
        String timestamp = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "QT-" + timestamp + "-" + uuid;
    }
    
    private String generatePolicyNumber() {
        String timestamp = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "POL-" + timestamp + "-" + uuid;
    }
    
    private BigDecimal calculateBasePremium(PolicyQuoteRequest request, Vehicle vehicle) {
        BigDecimal basePremium;
        
        if (request.getPolicyType() == Policy.PolicyType.CMI) {
            // CMI has fixed premium
            basePremium = CMI_BASE_PREMIUM;
        } else {
            // Voluntary insurance - calculate based on vehicle value and coverage
            basePremium = calculateVoluntaryPremium(request, vehicle);
        }
        
        // Apply multi-year discount
        if (request.getPolicyYears() > 1) {
            BigDecimal multiYearDiscount = new BigDecimal("0.05"); // 5% discount for multi-year
            basePremium = basePremium.multiply(BigDecimal.ONE.subtract(multiYearDiscount));
        }
        
        return basePremium.setScale(2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculateVoluntaryPremium(PolicyQuoteRequest request, Vehicle vehicle) {
        BigDecimal vehicleValue = request.getSumInsured() != null ? 
            request.getSumInsured() : new BigDecimal("500000"); // Default 500K
        
        BigDecimal premiumRate;
        switch (request.getCoverageType()) {
            case COMPREHENSIVE:
                premiumRate = new BigDecimal("0.02"); // 2% of vehicle value
                break;
            case THIRD_PARTY_FIRE_THEFT:
                premiumRate = new BigDecimal("0.015"); // 1.5% of vehicle value
                break;
            case THIRD_PARTY_ONLY:
            default:
                premiumRate = new BigDecimal("0.01"); // 1% of vehicle value
                break;
        }
        
        return vehicleValue.multiply(premiumRate);
    }
    
    private BigDecimal calculateNoClaimDiscount(BigDecimal basePremium, int noClaimYears) {
        int discountIndex = Math.min(noClaimYears, NO_CLAIM_DISCOUNTS.length - 1);
        BigDecimal discountRate = NO_CLAIM_DISCOUNTS[discountIndex];
        return basePremium.multiply(discountRate).setScale(2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculateDiscountPercentage(BigDecimal basePremium, BigDecimal discountAmount) {
        if (basePremium.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return discountAmount.divide(basePremium, 4, RoundingMode.HALF_UP)
                           .multiply(new BigDecimal("100"));
    }
    
    // Inner class for statistics
    public static class PolicyStatistics {
        private long totalPolicies;
        private long activePolicies;
        private long expiredPolicies;
        private long cancelledPolicies;
        
        // Getters and setters
        public long getTotalPolicies() { return totalPolicies; }
        public void setTotalPolicies(long totalPolicies) { this.totalPolicies = totalPolicies; }
        public long getActivePolicies() { return activePolicies; }
        public void setActivePolicies(long activePolicies) { this.activePolicies = activePolicies; }
        public long getExpiredPolicies() { return expiredPolicies; }
        public void setExpiredPolicies(long expiredPolicies) { this.expiredPolicies = expiredPolicies; }
        public long getCancelledPolicies() { return cancelledPolicies; }
        public void setCancelledPolicies(long cancelledPolicies) { this.cancelledPolicies = cancelledPolicies; }
    }
}