package com.thaiinsurance.autoinsurance.dto;

import com.thaiinsurance.autoinsurance.model.Policy;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for Policy Quote Response
 */
public class PolicyQuoteResponse {
    
    private String quoteNumber;
    private Long customerId;
    private String customerName;
    private Long vehicleId;
    private String vehicleRegistration;
    private Policy.PolicyType policyType;
    private Policy.CoverageType coverageType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal basePremium;
    private BigDecimal discountAmount;
    private BigDecimal discountPercentage;
    private BigDecimal taxAmount;
    private BigDecimal totalPremium;
    private BigDecimal sumInsured;
    private BigDecimal deductible;
    private String agentCode;
    private String agentName;
    private BigDecimal agentCommission;
    private LocalDate validUntil;
    private String remarks;
    private boolean hasNoClaimDiscount;
    private Integer noClaimYears;
    private BigDecimal noClaimDiscountAmount;
    
    // Constructors
    public PolicyQuoteResponse() {}
    
    public PolicyQuoteResponse(String quoteNumber, BigDecimal totalPremium, LocalDate validUntil) {
        this.quoteNumber = quoteNumber;
        this.totalPremium = totalPremium;
        this.validUntil = validUntil;
    }
    
    // Getters and Setters
    public String getQuoteNumber() {
        return quoteNumber;
    }
    
    public void setQuoteNumber(String quoteNumber) {
        this.quoteNumber = quoteNumber;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public Long getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public String getVehicleRegistration() {
        return vehicleRegistration;
    }
    
    public void setVehicleRegistration(String vehicleRegistration) {
        this.vehicleRegistration = vehicleRegistration;
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
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public BigDecimal getBasePremium() {
        return basePremium;
    }
    
    public void setBasePremium(BigDecimal basePremium) {
        this.basePremium = basePremium;
    }
    
    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
    
    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTotalPremium() {
        return totalPremium;
    }
    
    public void setTotalPremium(BigDecimal totalPremium) {
        this.totalPremium = totalPremium;
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
    
    public String getAgentCode() {
        return agentCode;
    }
    
    public void setAgentCode(String agentCode) {
        this.agentCode = agentCode;
    }
    
    public String getAgentName() {
        return agentName;
    }
    
    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }
    
    public BigDecimal getAgentCommission() {
        return agentCommission;
    }
    
    public void setAgentCommission(BigDecimal agentCommission) {
        this.agentCommission = agentCommission;
    }
    
    public LocalDate getValidUntil() {
        return validUntil;
    }
    
    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
    
    public BigDecimal getNoClaimDiscountAmount() {
        return noClaimDiscountAmount;
    }
    
    public void setNoClaimDiscountAmount(BigDecimal noClaimDiscountAmount) {
        this.noClaimDiscountAmount = noClaimDiscountAmount;
    }
}