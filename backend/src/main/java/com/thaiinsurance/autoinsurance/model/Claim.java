package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims", indexes = {
    @Index(name = "idx_claims_number", columnList = "claim_number"),
    @Index(name = "idx_claims_policy", columnList = "policy_id"),
    @Index(name = "idx_claims_status", columnList = "status"),
    @Index(name = "idx_claims_incident_date", columnList = "incident_date")
})
public class Claim extends BaseEntity {
    
    @NotBlank
    @Column(name = "claim_number", unique = true, nullable = false, length = 50)
    private String claimNumber;
    
    @NotNull
    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;
    
    @Column(name = "incident_time")
    private LocalDateTime incidentTime;
    
    @NotBlank
    @Column(name = "incident_location", nullable = false, length = 500)
    private String incidentLocation;
    
    @NotNull
    @Lob
    @Column(name = "incident_description", nullable = false)
    private String incidentDescription;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "incident_type", nullable = false)
    private IncidentType incidentType;
    
    @Column(name = "police_report_number", length = 50)
    private String policeReportNumber;
    
    @Column(name = "third_party_involved", nullable = false)
    private Boolean thirdPartyInvolved = false;
    
    @Column(name = "third_party_details", length = 1000)
    private String thirdPartyDetails;
    
    @Column(name = "estimated_damage_amount", precision = 12, scale = 2)
    private BigDecimal estimatedDamageAmount;
    
    @Column(name = "claimed_amount", precision = 12, scale = 2)
    private BigDecimal claimedAmount;
    
    @Column(name = "approved_amount", precision = 12, scale = 2)
    private BigDecimal approvedAmount;
    
    @Column(name = "paid_amount", precision = 12, scale = 2)
    private BigDecimal paidAmount;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClaimStatus status = ClaimStatus.SUBMITTED;
    
    @Column(name = "priority_level")
    @Enumerated(EnumType.STRING)
    private PriorityLevel priorityLevel = PriorityLevel.NORMAL;
    
    @Column(name = "reported_date", nullable = false)
    private LocalDate reportedDate;
    
    @Column(name = "investigated_date")
    private LocalDate investigatedDate;
    
    @Column(name = "approved_date")
    private LocalDate approvedDate;
    
    @Column(name = "rejected_date")
    private LocalDate rejectedDate;
    
    @Column(name = "closed_date")
    private LocalDate closedDate;
    
    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason;
    
    @Column(name = "adjuster_notes", length = 2000)
    private String adjusterNotes;
    
    @Column(name = "settlement_notes", length = 2000)
    private String settlementNotes;
    
    @Column(name = "third_party_contact_info", length = 500)
    private String thirdPartyContactInfo;
    
    @Column(name = "witness_name", length = 200)
    private String witnessName;
    
    @Column(name = "witness_contact_info", length = 500)
    private String witnessContactInfo;
    
    @Column(name = "is_driver_injured", nullable = false)
    private Boolean isDriverInjured = false;
    
    @Column(name = "are_passengers_injured", nullable = false)
    private Boolean arePassengersInjured = false;
    
    @Column(name = "is_third_party_injured", nullable = false)
    private Boolean isThirdPartyInjured = false;
    
    @Column(name = "injury_details", columnDefinition = "TEXT")
    private String injuryDetails;
    
    @Column(name = "emergency_contact_name", length = 200)
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_info", length = 500)
    private String emergencyContactInfo;
    
    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;
    
    @Column(name = "additional_remarks", columnDefinition = "TEXT")
    private String additionalRemarks;
    
    @Column(name = "review_start_date")
    private LocalDate reviewStartDate;
    
    @Column(name = "settlement_date")
    private LocalDate settlementDate;
    
    @Column(name = "surveyor_name", length = 200)
    private String surveyorName;
    
    @Column(name = "surveyor_phone", length = 20)
    private String surveyorPhone;
    
    @Column(name = "surveyor_assigned_date")
    private LocalDate surveyorAssignedDate;
    
    @Column(name = "repair_details", columnDefinition = "TEXT")
    private String repairDetails;
    
    @Column(name = "estimate_date")
    private LocalDate estimateDate;
    
    @Column(name = "settlement_amount", precision = 12, scale = 2)
    private BigDecimal settlementAmount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adjuster_id")
    private User adjuster;
    
    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimDocument> documents = new ArrayList<>();
    
    // Constructors
    public Claim() {
        this.reportedDate = LocalDate.now();
    }
    
    public Claim(String claimNumber, LocalDate incidentDate, String incidentLocation,
                String incidentDescription, IncidentType incidentType) {
        this();
        this.claimNumber = claimNumber;
        this.incidentDate = incidentDate;
        this.incidentLocation = incidentLocation;
        this.incidentDescription = incidentDescription;
        this.incidentType = incidentType;
    }
    
    // Getters and Setters
    public String getClaimNumber() {
        return claimNumber;
    }
    
    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }
    
    public LocalDate getIncidentDate() {
        return incidentDate;
    }
    
    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }
    
    public LocalDateTime getIncidentTime() {
        return incidentTime;
    }
    
    public void setIncidentTime(LocalDateTime incidentTime) {
        this.incidentTime = incidentTime;
    }
    
    public String getIncidentLocation() {
        return incidentLocation;
    }
    
    public void setIncidentLocation(String incidentLocation) {
        this.incidentLocation = incidentLocation;
    }
    
    public String getIncidentDescription() {
        return incidentDescription;
    }
    
    public void setIncidentDescription(String incidentDescription) {
        this.incidentDescription = incidentDescription;
    }
    
    public IncidentType getIncidentType() {
        return incidentType;
    }
    
    public void setIncidentType(IncidentType incidentType) {
        this.incidentType = incidentType;
    }
    
    public String getPoliceReportNumber() {
        return policeReportNumber;
    }
    
    public void setPoliceReportNumber(String policeReportNumber) {
        this.policeReportNumber = policeReportNumber;
    }
    
    public Boolean getThirdPartyInvolved() {
        return thirdPartyInvolved;
    }
    
    public void setThirdPartyInvolved(Boolean thirdPartyInvolved) {
        this.thirdPartyInvolved = thirdPartyInvolved;
    }
    
    public String getThirdPartyDetails() {
        return thirdPartyDetails;
    }
    
    public void setThirdPartyDetails(String thirdPartyDetails) {
        this.thirdPartyDetails = thirdPartyDetails;
    }
    
    public BigDecimal getEstimatedDamageAmount() {
        return estimatedDamageAmount;
    }
    
    public void setEstimatedDamageAmount(BigDecimal estimatedDamageAmount) {
        this.estimatedDamageAmount = estimatedDamageAmount;
    }
    
    public BigDecimal getClaimedAmount() {
        return claimedAmount;
    }
    
    public void setClaimedAmount(BigDecimal claimedAmount) {
        this.claimedAmount = claimedAmount;
    }
    
    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }
    
    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }
    
    public BigDecimal getPaidAmount() {
        return paidAmount;
    }
    
    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }
    
    public ClaimStatus getStatus() {
        return status;
    }
    
    public void setStatus(ClaimStatus status) {
        this.status = status;
    }
    
    public PriorityLevel getPriorityLevel() {
        return priorityLevel;
    }
    
    public void setPriorityLevel(PriorityLevel priorityLevel) {
        this.priorityLevel = priorityLevel;
    }
    
    public LocalDate getReportedDate() {
        return reportedDate;
    }
    
    public void setReportedDate(LocalDate reportedDate) {
        this.reportedDate = reportedDate;
    }
    
    public LocalDate getInvestigatedDate() {
        return investigatedDate;
    }
    
    public void setInvestigatedDate(LocalDate investigatedDate) {
        this.investigatedDate = investigatedDate;
    }
    
    public LocalDate getApprovedDate() {
        return approvedDate;
    }
    
    public void setApprovedDate(LocalDate approvedDate) {
        this.approvedDate = approvedDate;
    }
    
    public LocalDate getRejectedDate() {
        return rejectedDate;
    }
    
    public void setRejectedDate(LocalDate rejectedDate) {
        this.rejectedDate = rejectedDate;
    }
    
    public LocalDate getClosedDate() {
        return closedDate;
    }
    
    public void setClosedDate(LocalDate closedDate) {
        this.closedDate = closedDate;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public String getAdjusterNotes() {
        return adjusterNotes;
    }
    
    public void setAdjusterNotes(String adjusterNotes) {
        this.adjusterNotes = adjusterNotes;
    }
    
    public String getSettlementNotes() {
        return settlementNotes;
    }
    
    public void setSettlementNotes(String settlementNotes) {
        this.settlementNotes = settlementNotes;
    }
    
    public String getThirdPartyContactInfo() {
        return thirdPartyContactInfo;
    }
    
    public void setThirdPartyContactInfo(String thirdPartyContactInfo) {
        this.thirdPartyContactInfo = thirdPartyContactInfo;
    }
    
    public String getWitnessName() {
        return witnessName;
    }
    
    public void setWitnessName(String witnessName) {
        this.witnessName = witnessName;
    }
    
    public String getWitnessContactInfo() {
        return witnessContactInfo;
    }
    
    public void setWitnessContactInfo(String witnessContactInfo) {
        this.witnessContactInfo = witnessContactInfo;
    }
    
    public Boolean getIsDriverInjured() {
        return isDriverInjured;
    }
    
    public void setIsDriverInjured(Boolean isDriverInjured) {
        this.isDriverInjured = isDriverInjured;
    }
    
    public Boolean getArePassengersInjured() {
        return arePassengersInjured;
    }
    
    public void setArePassengersInjured(Boolean arePassengersInjured) {
        this.arePassengersInjured = arePassengersInjured;
    }
    
    public Boolean getIsThirdPartyInjured() {
        return isThirdPartyInjured;
    }
    
    public void setIsThirdPartyInjured(Boolean isThirdPartyInjured) {
        this.isThirdPartyInjured = isThirdPartyInjured;
    }
    
    public String getInjuryDetails() {
        return injuryDetails;
    }
    
    public void setInjuryDetails(String injuryDetails) {
        this.injuryDetails = injuryDetails;
    }
    
    public String getEmergencyContactName() {
        return emergencyContactName;
    }
    
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }
    
    public String getEmergencyContactInfo() {
        return emergencyContactInfo;
    }
    
    public void setEmergencyContactInfo(String emergencyContactInfo) {
        this.emergencyContactInfo = emergencyContactInfo;
    }
    
    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }
    
    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }
    
    public String getAdditionalRemarks() {
        return additionalRemarks;
    }
    
    public void setAdditionalRemarks(String additionalRemarks) {
        this.additionalRemarks = additionalRemarks;
    }
    
    public LocalDate getReviewStartDate() {
        return reviewStartDate;
    }
    
    public void setReviewStartDate(LocalDate reviewStartDate) {
        this.reviewStartDate = reviewStartDate;
    }
    
    public LocalDate getSettlementDate() {
        return settlementDate;
    }
    
    public void setSettlementDate(LocalDate settlementDate) {
        this.settlementDate = settlementDate;
    }
    
    // For backwards compatibility
    public void setPriority(PriorityLevel priority) {
        this.priorityLevel = priority;
    }
    
    public String getSurveyorName() {
        return surveyorName;
    }
    
    public void setSurveyorName(String surveyorName) {
        this.surveyorName = surveyorName;
    }
    
    public String getSurveyorPhone() {
        return surveyorPhone;
    }
    
    public void setSurveyorPhone(String surveyorPhone) {
        this.surveyorPhone = surveyorPhone;
    }
    
    public LocalDate getSurveyorAssignedDate() {
        return surveyorAssignedDate;
    }
    
    public void setSurveyorAssignedDate(LocalDate surveyorAssignedDate) {
        this.surveyorAssignedDate = surveyorAssignedDate;
    }
    
    public String getRepairDetails() {
        return repairDetails;
    }
    
    public void setRepairDetails(String repairDetails) {
        this.repairDetails = repairDetails;
    }
    
    public LocalDate getEstimateDate() {
        return estimateDate;
    }
    
    public void setEstimateDate(LocalDate estimateDate) {
        this.estimateDate = estimateDate;
    }
    
    public BigDecimal getSettlementAmount() {
        return settlementAmount;
    }
    
    public void setSettlementAmount(BigDecimal settlementAmount) {
        this.settlementAmount = settlementAmount;
    }
    
    // Backwards compatibility methods
    public void setEstimatedAmount(BigDecimal amount) {
        this.estimatedDamageAmount = amount;
    }
    
    public Policy getPolicy() {
        return policy;
    }
    
    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
    
    public User getAdjuster() {
        return adjuster;
    }
    
    public void setAdjuster(User adjuster) {
        this.adjuster = adjuster;
    }
    
    public List<ClaimDocument> getDocuments() {
        return documents;
    }
    
    public void setDocuments(List<ClaimDocument> documents) {
        this.documents = documents;
    }
    
    public boolean isSettleable() {
        return status == ClaimStatus.APPROVED && approvedAmount != null && approvedAmount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    public long getDaysSinceReported() {
        return reportedDate.until(LocalDate.now()).getDays();
    }
    
    // Enums
    public enum IncidentType {
        COLLISION("Vehicle Collision"),
        THEFT("Vehicle Theft"),
        FIRE("Fire Damage"),
        FLOOD("Flood Damage"),
        VANDALISM("Vandalism"),
        NATURAL_DISASTER("Natural Disaster"),
        PERSONAL_ACCIDENT("Personal Accident"),
        THIRD_PARTY_PROPERTY("Third Party Property Damage"),
        OTHER("Other");
        
        private final String displayName;
        
        IncidentType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum ClaimStatus {
        SUBMITTED("Submitted"),
        UNDER_REVIEW("Under Review"),
        UNDER_INVESTIGATION("Under Investigation"),
        PENDING_DOCUMENTS("Pending Documents"),
        APPROVED("Approved"),
        REJECTED("Rejected"),
        SETTLED("Settled"),
        CLOSED("Closed");
        
        private final String displayName;
        
        ClaimStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PriorityLevel {
        LOW("Low"),
        NORMAL("Normal"),
        MEDIUM("Medium"),
        HIGH("High"),
        URGENT("Urgent");
        
        private final String displayName;
        
        PriorityLevel(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}