package com.thaiinsurance.autoinsurance.dto;

import com.thaiinsurance.autoinsurance.model.Policy;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for Policy Quote Request
 */
public class PolicyQuoteRequest {
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @NotNull(message = "Policy type is required")
    private Policy.PolicyType policyType;
    
    @NotNull(message = "Coverage type is required")
    private Policy.CoverageType coverageType;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @Positive(message = "Sum insured must be positive")
    private BigDecimal sumInsured;
    
    private BigDecimal deductible;
    
    private Integer policyYears = 1;
    
    private boolean hasNoClaimDiscount = false;
    
    private Integer noClaimYears = 0;
    
    private String agentCode;
    
    private String remarks;
    
    // Constructors
    public PolicyQuoteRequest() {}
    
    public PolicyQuoteRequest(Long customerId, Long vehicleId, Policy.PolicyType policyType, 
                             Policy.CoverageType coverageType, LocalDate startDate) {
        this.customerId = customerId;
        this.vehicleId = vehicleId;
        this.policyType = policyType;
        this.coverageType = coverageType;
        this.startDate = startDate;
    }
    
    // Getters and Setters
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public Long getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public Policy.PolicyType getPolicyType() {
        return policyType;
    }
    
    public void setPolicyType(Policy.PolicyType policyType) {
        this.policyType = policyType;
    }
    
    public Policy.CoverageType getCoverageType() {
        return coverageType;
    }
    
    public void setCoverageType(Policy.CoverageType coverageType) {
        this.coverageType = coverageType;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
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
    
    public Integer getPolicyYears() {
        return policyYears;
    }
    
    public void setPolicyYears(Integer policyYears) {
        this.policyYears = policyYears;
    }
    
    public boolean isHasNoClaimDiscount() {
        return hasNoClaimDiscount;
    }
    
    public void setHasNoClaimDiscount(boolean hasNoClaimDiscount) {
        this.hasNoClaimDiscount = hasNoClaimDiscount;
    }
    
    public Integer getNoClaimYears() {
        return noClaimYears;
    }
    
    public void setNoClaimYears(Integer noClaimYears) {
        this.noClaimYears = noClaimYears;
    }
    
    public String getAgentCode() {
        return agentCode;
    }
    
    public void setAgentCode(String agentCode) {
        this.agentCode = agentCode;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}