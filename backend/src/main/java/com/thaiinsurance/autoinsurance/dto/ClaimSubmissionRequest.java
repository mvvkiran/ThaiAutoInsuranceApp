package com.thaiinsurance.autoinsurance.dto;

import com.thaiinsurance.autoinsurance.model.Claim;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Claim Submission Request
 */
public class ClaimSubmissionRequest {
    
    @NotNull(message = "Policy ID is required")
    private Long policyId;
    
    @NotNull(message = "Incident type is required")
    private Claim.IncidentType incidentType;
    
    @NotNull(message = "Incident date and time is required")
    private LocalDateTime incidentDateTime;
    
    @NotBlank(message = "Incident location is required")
    private String incidentLocation;
    
    @NotBlank(message = "Incident description is required")
    private String incidentDescription;
    
    private String policeReportNumber;
    
    private String thirdPartyInvolved;
    
    private String thirdPartyContactInfo;
    
    private String witnessName;
    
    private String witnessContactInfo;
    
    private boolean isDriverInjured = false;
    
    private boolean arePassengersInjured = false;
    
    private boolean isThirdPartyInjured = false;
    
    private String injuryDetails;
    
    private String repairShopName;
    
    private String repairShopAddress;
    
    private String repairShopPhone;
    
    private String emergencyContactName;
    
    private String emergencyContactPhone;
    
    private String additionalRemarks;
    
    private List<MultipartFile> photos;
    
    private List<MultipartFile> videos;
    
    private MultipartFile policeReport;
    
    private MultipartFile medicalReport;
    
    private List<MultipartFile> additionalDocuments;
    
    // Constructors
    public ClaimSubmissionRequest() {}
    
    public ClaimSubmissionRequest(Long policyId, Claim.IncidentType incidentType, 
                                LocalDateTime incidentDateTime, String incidentLocation, 
                                String incidentDescription) {
        this.policyId = policyId;
        this.incidentType = incidentType;
        this.incidentDateTime = incidentDateTime;
        this.incidentLocation = incidentLocation;
        this.incidentDescription = incidentDescription;
    }
    
    // Getters and Setters
    public Long getPolicyId() {
        return policyId;
    }
    
    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }
    
    public Claim.IncidentType getIncidentType() {
        return incidentType;
    }
    
    public void setIncidentType(Claim.IncidentType incidentType) {
        this.incidentType = incidentType;
    }
    
    public LocalDateTime getIncidentDateTime() {
        return incidentDateTime;
    }
    
    public void setIncidentDateTime(LocalDateTime incidentDateTime) {
        this.incidentDateTime = incidentDateTime;
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
    
    public String getPoliceReportNumber() {
        return policeReportNumber;
    }
    
    public void setPoliceReportNumber(String policeReportNumber) {
        this.policeReportNumber = policeReportNumber;
    }
    
    public String getThirdPartyInvolved() {
        return thirdPartyInvolved;
    }
    
    public void setThirdPartyInvolved(String thirdPartyInvolved) {
        this.thirdPartyInvolved = thirdPartyInvolved;
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
    
    public boolean isDriverInjured() {
        return isDriverInjured;
    }
    
    public void setDriverInjured(boolean driverInjured) {
        isDriverInjured = driverInjured;
    }
    
    public boolean arePassengersInjured() {
        return arePassengersInjured;
    }
    
    public void setPassengersInjured(boolean passengersInjured) {
        arePassengersInjured = passengersInjured;
    }
    
    public boolean isThirdPartyInjured() {
        return isThirdPartyInjured;
    }
    
    public void setThirdPartyInjured(boolean thirdPartyInjured) {
        isThirdPartyInjured = thirdPartyInjured;
    }
    
    public String getInjuryDetails() {
        return injuryDetails;
    }
    
    public void setInjuryDetails(String injuryDetails) {
        this.injuryDetails = injuryDetails;
    }
    
    public String getRepairShopName() {
        return repairShopName;
    }
    
    public void setRepairShopName(String repairShopName) {
        this.repairShopName = repairShopName;
    }
    
    public String getRepairShopAddress() {
        return repairShopAddress;
    }
    
    public void setRepairShopAddress(String repairShopAddress) {
        this.repairShopAddress = repairShopAddress;
    }
    
    public String getRepairShopPhone() {
        return repairShopPhone;
    }
    
    public void setRepairShopPhone(String repairShopPhone) {
        this.repairShopPhone = repairShopPhone;
    }
    
    public String getEmergencyContactName() {
        return emergencyContactName;
    }
    
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
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
    
    public List<MultipartFile> getPhotos() {
        return photos;
    }
    
    public void setPhotos(List<MultipartFile> photos) {
        this.photos = photos;
    }
    
    public List<MultipartFile> getVideos() {
        return videos;
    }
    
    public void setVideos(List<MultipartFile> videos) {
        this.videos = videos;
    }
    
    public MultipartFile getPoliceReport() {
        return policeReport;
    }
    
    public void setPoliceReport(MultipartFile policeReport) {
        this.policeReport = policeReport;
    }
    
    public MultipartFile getMedicalReport() {
        return medicalReport;
    }
    
    public void setMedicalReport(MultipartFile medicalReport) {
        this.medicalReport = medicalReport;
    }
    
    public List<MultipartFile> getAdditionalDocuments() {
        return additionalDocuments;
    }
    
    public void setAdditionalDocuments(List<MultipartFile> additionalDocuments) {
        this.additionalDocuments = additionalDocuments;
    }
}