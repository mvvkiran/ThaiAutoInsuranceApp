package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "claim_documents", indexes = {
    @Index(name = "idx_claim_documents_claim", columnList = "claim_id"),
    @Index(name = "idx_claim_documents_type", columnList = "document_type")
})
public class ClaimDocument extends BaseEntity {
    
    @NotBlank
    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;
    
    @NotBlank
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;
    
    @NotBlank
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    // Constructors
    public ClaimDocument() {}
    
    public ClaimDocument(String fileName, String filePath, String contentType, DocumentType documentType) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.documentType = documentType;
    }
    
    // Getters and Setters
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public DocumentType getDocumentType() {
        return documentType;
    }
    
    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsRequired() {
        return isRequired;
    }
    
    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Claim getClaim() {
        return claim;
    }
    
    public void setClaim(Claim claim) {
        this.claim = claim;
    }
    
    public User getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    // Enum
    public enum DocumentType {
        POLICE_REPORT("Police Report"),
        DAMAGE_PHOTOS("Damage Photos"),
        REPAIR_ESTIMATE("Repair Estimate"),
        MEDICAL_REPORT("Medical Report"),
        DRIVING_LICENSE("Driving License"),
        VEHICLE_REGISTRATION("Vehicle Registration"),
        INSURANCE_CERTIFICATE("Insurance Certificate"),
        WITNESS_STATEMENT("Witness Statement"),
        PHOTO("Photo"),
        VIDEO("Video"),
        OTHER("Other");
        
        private final String displayName;
        
        DocumentType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}