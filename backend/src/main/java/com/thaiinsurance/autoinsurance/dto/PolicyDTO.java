package com.thaiinsurance.autoinsurance.dto;

import com.thaiinsurance.autoinsurance.model.Policy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PolicyDTO {
    
    private Long id;
    private String policyNumber;
    private Policy.PolicyType policyType;
    private Policy.CoverageType coverageType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal premiumAmount;
    private BigDecimal sumInsured;
    private BigDecimal deductible;
    private Policy.PolicyStatus status;
    private LocalDate issuedDate;
    private LocalDate cancelledDate;
    private String cancellationReason;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Customer basic info (to avoid circular reference)
    private Long customerId;
    private String customerName;
    private String customerEmail;
    
    // Vehicle basic info (to avoid circular reference)
    private Long vehicleId;
    private String vehicleLicensePlate;
    private String vehicleMake;
    private String vehicleModel;
    private Integer vehicleYear;
    
    // Agent basic info
    private Long agentId;
    private String agentName;
    
    // Default constructor
    public PolicyDTO() {}
    
    // Constructor from Policy entity
    public PolicyDTO(Policy policy) {
        this.id = policy.getId();
        this.policyNumber = policy.getPolicyNumber();
        this.policyType = policy.getPolicyType();
        this.coverageType = policy.getCoverageType();
        this.startDate = policy.getStartDate();
        this.endDate = policy.getEndDate();
        this.premiumAmount = policy.getPremiumAmount();
        this.sumInsured = policy.getSumInsured();
        this.deductible = policy.getDeductible();
        this.status = policy.getStatus();
        this.issuedDate = policy.getIssuedDate();
        this.cancelledDate = policy.getCancelledDate();
        this.cancellationReason = policy.getCancellationReason();
        this.remarks = policy.getRemarks();
        this.createdAt = policy.getCreatedAt();
        this.updatedAt = policy.getUpdatedAt();
        
        // Set customer info safely
        if (policy.getCustomer() != null) {
            this.customerId = policy.getCustomer().getId();
            this.customerName = policy.getCustomer().getFirstName() + " " + policy.getCustomer().getLastName();
            this.customerEmail = policy.getCustomer().getEmail();
        }
        
        // Set vehicle info safely
        if (policy.getVehicle() != null) {
            this.vehicleId = policy.getVehicle().getId();
            this.vehicleLicensePlate = policy.getVehicle().getLicensePlate();
            this.vehicleMake = policy.getVehicle().getMake();
            this.vehicleModel = policy.getVehicle().getModel();
            this.vehicleYear = policy.getVehicle().getYear();
        }
        
        // Set agent info safely
        if (policy.getAgent() != null) {
            this.agentId = policy.getAgent().getId();
            this.agentName = policy.getAgent().getFirstName() + " " + policy.getAgent().getLastName();
        }
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPolicyNumber() {
        return policyNumber;
    }
    
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
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
    
    public Policy.PolicyStatus getStatus() {
        return status;
    }
    
    public void setStatus(Policy.PolicyStatus status) {
        this.status = status;
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
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public Long getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public String getVehicleLicensePlate() {
        return vehicleLicensePlate;
    }
    
    public void setVehicleLicensePlate(String vehicleLicensePlate) {
        this.vehicleLicensePlate = vehicleLicensePlate;
    }
    
    public String getVehicleMake() {
        return vehicleMake;
    }
    
    public void setVehicleMake(String vehicleMake) {
        this.vehicleMake = vehicleMake;
    }
    
    public String getVehicleModel() {
        return vehicleModel;
    }
    
    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }
    
    public Integer getVehicleYear() {
        return vehicleYear;
    }
    
    public void setVehicleYear(Integer vehicleYear) {
        this.vehicleYear = vehicleYear;
    }
    
    public Long getAgentId() {
        return agentId;
    }
    
    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }
    
    public String getAgentName() {
        return agentName;
    }
    
    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }
}