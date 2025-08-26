package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "policies", indexes = {
    @Index(name = "idx_policies_number", columnList = "policy_number"),
    @Index(name = "idx_policies_customer", columnList = "customer_id"),
    @Index(name = "idx_policies_vehicle", columnList = "vehicle_id"),
    @Index(name = "idx_policies_status", columnList = "status"),
    @Index(name = "idx_policies_expiry", columnList = "end_date")
})
public class Policy extends BaseEntity {
    
    @NotBlank
    @Column(name = "policy_number", unique = true, nullable = false, length = 50)
    private String policyNumber;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "policy_type", nullable = false)
    private PolicyType policyType;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_type", nullable = false)
    private CoverageType coverageType;
    
    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @NotNull
    @Positive
    @Column(name = "premium_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal premiumAmount;
    
    @Column(name = "sum_insured", precision = 12, scale = 2)
    private BigDecimal sumInsured;
    
    @Column(name = "deductible", precision = 10, scale = 2)
    private BigDecimal deductible;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PolicyStatus status = PolicyStatus.DRAFT;
    
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;
    
    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "agent_commission", precision = 10, scale = 2)
    private BigDecimal agentCommission;
    
    @Column(name = "remarks", length = 1000)
    private String remarks;
    
    @Column(name = "issued_date")
    private LocalDate issuedDate;
    
    @Column(name = "cancelled_date")
    private LocalDate cancelledDate;
    
    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;
    
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Claim> claims = new ArrayList<>();
    
    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();
    
    // Constructors
    public Policy() {}
    
    public Policy(String policyNumber, PolicyType policyType, CoverageType coverageType,
                 LocalDate startDate, LocalDate endDate, BigDecimal premiumAmount) {
        this.policyNumber = policyNumber;
        this.policyType = policyType;
        this.coverageType = coverageType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.premiumAmount = premiumAmount;
    }
    
    // Getters and Setters
    public String getPolicyNumber() {
        return policyNumber;
    }
    
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }
    
    public PolicyType getPolicyType() {
        return policyType;
    }
    
    public void setPolicyType(PolicyType policyType) {
        this.policyType = policyType;
    }
    
    public CoverageType getCoverageType() {
        return coverageType;
    }
    
    public void setCoverageType(CoverageType coverageType) {
        this.coverageType = coverageType;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }
    
    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }
    
    public BigDecimal getSumInsured() {
        return sumInsured;
    }
    
    public void setSumInsured(BigDecimal sumInsured) {
        this.sumInsured = sumInsured;
    }
    
    public BigDecimal getDeductible() {
        return deductible;
    }
    
    public void setDeductible(BigDecimal deductible) {
        this.deductible = deductible;
    }
    
    public PolicyStatus getStatus() {
        return status;
    }
    
    public void setStatus(PolicyStatus status) {
        this.status = status;
    }
    
    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BigDecimal getAgentCommission() {
        return agentCommission;
    }
    
    public void setAgentCommission(BigDecimal agentCommission) {
        this.agentCommission = agentCommission;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public LocalDate getIssuedDate() {
        return issuedDate;
    }
    
    public void setIssuedDate(LocalDate issuedDate) {
        this.issuedDate = issuedDate;
    }
    
    public LocalDate getCancelledDate() {
        return cancelledDate;
    }
    
    public void setCancelledDate(LocalDate cancelledDate) {
        this.cancelledDate = cancelledDate;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    public Vehicle getVehicle() {
        return vehicle;
    }
    
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
    
    public User getAgent() {
        return agent;
    }
    
    public void setAgent(User agent) {
        this.agent = agent;
    }
    
    public List<Claim> getClaims() {
        return claims;
    }
    
    public void setClaims(List<Claim> claims) {
        this.claims = claims;
    }
    
    public List<Payment> getPayments() {
        return payments;
    }
    
    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
    
    public boolean isActive() {
        return status == PolicyStatus.ACTIVE && 
               LocalDate.now().isBefore(endDate.plusDays(1));
    }
    
    public boolean isExpired() {
        return LocalDate.now().isAfter(endDate);
    }
    
    public long getDaysUntilExpiry() {
        return LocalDate.now().until(endDate).getDays();
    }
    
    // Enums
    public enum PolicyType {
        CMI("Compulsory Motor Insurance"),
        VOLUNTARY("Voluntary Motor Insurance");
        
        private final String displayName;
        
        PolicyType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum CoverageType {
        THIRD_PARTY_ONLY("Third Party Only"),
        THIRD_PARTY_FIRE_THEFT("Third Party, Fire & Theft"),
        COMPREHENSIVE("Comprehensive");
        
        private final String displayName;
        
        CoverageType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PolicyStatus {
        DRAFT("Draft"),
        QUOTED("Quoted"),
        ACTIVE("Active"),
        EXPIRED("Expired"),
        CANCELLED("Cancelled"),
        SUSPENDED("Suspended");
        
        private final String displayName;
        
        PolicyStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}