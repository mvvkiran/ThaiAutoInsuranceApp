package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customers_national_id", columnList = "national_id"),
    @Index(name = "idx_customers_email", columnList = "email"),
    @Index(name = "idx_customers_phone", columnList = "phone_number")
})
public class Customer extends BaseEntity {
    
    @NotBlank
    @Pattern(regexp = "^[0-9]{13}$", message = "Thai National ID must be 13 digits")
    @Column(name = "national_id", unique = true, nullable = false, length = 13)
    private String nationalId;
    
    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(name = "first_name_thai", length = 100)
    private String firstNameThai;
    
    @Column(name = "last_name_thai", length = 100)
    private String lastNameThai;
    
    @Column(name = "first_name_en", length = 100)
    private String firstNameEn;
    
    @Column(name = "last_name_en", length = 100)
    private String lastNameEn;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    
    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "Thai phone number must be 10 digits")
    @Column(name = "phone_number", nullable = false, length = 10)
    private String phoneNumber;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "address_line1", length = 255)
    private String addressLine1;
    
    @Column(name = "address_line2", length = 255)
    private String addressLine2;
    
    @Column(name = "district", length = 100)
    private String district;
    
    @Column(name = "province", length = 100)
    private String province;
    
    @Pattern(regexp = "^[0-9]{5}$", message = "Thai postal code must be 5 digits")
    @Column(name = "postal_code", length = 5)
    private String postalCode;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "tambon", length = 100)
    private String tambon;
    
    @Column(name = "amphoe", length = 100)
    private String amphoe;
    
    @Column(name = "country", length = 100)
    private String country = "Thailand";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_language")
    private Language preferredLanguage = Language.THAI;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "occupation_category")
    private OccupationCategory occupationCategory;
    
    @Column(name = "occupation_detail", length = 100)
    private String occupationDetail;
    
    @Column(name = "monthly_income")
    private Double monthlyIncome;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KYCStatus kycStatus = KYCStatus.PENDING;
    
    @Column(name = "kyc_verified_at")
    private LocalDate kycVerifiedAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehicle> vehicles = new ArrayList<>();
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Policy> policies = new ArrayList<>();
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    // Constructors
    public Customer() {}
    
    public Customer(String nationalId, String firstName, String lastName, String phoneNumber) {
        this.nationalId = nationalId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }
    
    // Getters and Setters
    public String getNationalId() {
        return nationalId;
    }
    
    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getFirstNameThai() {
        return firstNameThai;
    }
    
    public void setFirstNameThai(String firstNameThai) {
        this.firstNameThai = firstNameThai;
    }
    
    public String getLastNameThai() {
        return lastNameThai;
    }
    
    public void setLastNameThai(String lastNameThai) {
        this.lastNameThai = lastNameThai;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public Gender getGender() {
        return gender;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAddressLine1() {
        return addressLine1;
    }
    
    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }
    
    public String getAddressLine2() {
        return addressLine2;
    }
    
    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }
    
    public String getDistrict() {
        return district;
    }
    
    public void setDistrict(String district) {
        this.district = district;
    }
    
    public String getProvince() {
        return province;
    }
    
    public void setProvince(String province) {
        this.province = province;
    }
    
    public String getPostalCode() {
        return postalCode;
    }
    
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
    
    public String getFirstNameEn() {
        return firstNameEn;
    }
    
    public void setFirstNameEn(String firstNameEn) {
        this.firstNameEn = firstNameEn;
    }
    
    public String getLastNameEn() {
        return lastNameEn;
    }
    
    public void setLastNameEn(String lastNameEn) {
        this.lastNameEn = lastNameEn;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getTambon() {
        return tambon;
    }
    
    public void setTambon(String tambon) {
        this.tambon = tambon;
    }
    
    public String getAmphoe() {
        return amphoe;
    }
    
    public void setAmphoe(String amphoe) {
        this.amphoe = amphoe;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public Language getPreferredLanguage() {
        return preferredLanguage;
    }
    
    public void setPreferredLanguage(Language preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }
    
    public OccupationCategory getOccupationCategory() {
        return occupationCategory;
    }
    
    public void setOccupationCategory(OccupationCategory occupationCategory) {
        this.occupationCategory = occupationCategory;
    }
    
    public String getOccupationDetail() {
        return occupationDetail;
    }
    
    public void setOccupationDetail(String occupationDetail) {
        this.occupationDetail = occupationDetail;
    }
    
    public Double getMonthlyIncome() {
        return monthlyIncome;
    }
    
    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
    public KYCStatus getKycStatus() {
        return kycStatus;
    }
    
    public void setKycStatus(KYCStatus kycStatus) {
        this.kycStatus = kycStatus;
    }
    
    public LocalDate getKycVerifiedAt() {
        return kycVerifiedAt;
    }
    
    public void setKycVerifiedAt(LocalDate kycVerifiedAt) {
        this.kycVerifiedAt = kycVerifiedAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public List<Vehicle> getVehicles() {
        return vehicles;
    }
    
    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }
    
    public List<Policy> getPolicies() {
        return policies;
    }
    
    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (addressLine1 != null) address.append(addressLine1);
        if (addressLine2 != null) address.append(", ").append(addressLine2);
        if (district != null) address.append(", ").append(district);
        if (province != null) address.append(", ").append(province);
        if (postalCode != null) address.append(" ").append(postalCode);
        return address.toString();
    }
    
    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    public enum OccupationCategory {
        GOVERNMENT_OFFICER,
        PRIVATE_EMPLOYEE,
        BUSINESS_OWNER,
        FREELANCER,
        STUDENT,
        RETIRED,
        UNEMPLOYED,
        OTHER
    }
    
    public enum KYCStatus {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }
    
    public enum Language {
        THAI("Thai"),
        ENGLISH("English");
        
        private final String displayName;
        
        Language(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}