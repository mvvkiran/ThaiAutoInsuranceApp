package com.thaiinsurance.autoinsurance.dto.auth;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class RegisterRequest {
    
    // Personal Information
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    @Size(max = 100, message = "English first name must not exceed 100 characters")
    private String firstNameEn;
    
    @Size(max = 100, message = "English last name must not exceed 100 characters")
    private String lastNameEn;
    
    @NotBlank(message = "National ID is required")
    @Pattern(regexp = "^[0-9]{13}$", message = "National ID must be 13 digits")
    private String nationalId;
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;
    
    // Contact Information
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+66[0-9]{9}$", message = "Phone number must be in format +66xxxxxxxxx")
    private String phoneNumber;
    
    @Pattern(regexp = "^(th|en)$", message = "Preferred language must be 'th' or 'en'")
    private String preferredLanguage = "th";
    
    // Address Information
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotBlank(message = "Tambon is required")
    @Size(max = 100, message = "Tambon must not exceed 100 characters")
    private String tambon;
    
    @NotBlank(message = "Amphoe is required")
    @Size(max = 100, message = "Amphoe must not exceed 100 characters")
    private String amphoe;
    
    @NotBlank(message = "Province is required")
    @Size(max = 100, message = "Province must not exceed 100 characters")
    private String province;
    
    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[0-9]{5}$", message = "Postal code must be 5 digits")
    private String postalCode;
    
    private String country = "TH";
    
    // Authentication Information
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
    private String password;
    
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
    
    // Consent Information
    @AssertTrue(message = "Terms and conditions must be accepted")
    private boolean termsAndConditions;
    
    @AssertTrue(message = "Privacy policy must be accepted")
    private boolean privacyPolicy;
    
    @AssertTrue(message = "Data processing consent is required")
    private boolean dataProcessingConsent;
    
    private boolean marketingConsent = false;
    
    // Device Information (optional)
    private String deviceId;
    private String deviceType;
    private String appVersion;
    
    // Constructors
    public RegisterRequest() {}
    
    // Getters and Setters
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
    
    public String getNationalId() {
        return nationalId;
    }
    
    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getPreferredLanguage() {
        return preferredLanguage;
    }
    
    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
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
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
    
    public boolean isTermsAndConditions() {
        return termsAndConditions;
    }
    
    public void setTermsAndConditions(boolean termsAndConditions) {
        this.termsAndConditions = termsAndConditions;
    }
    
    public boolean isPrivacyPolicy() {
        return privacyPolicy;
    }
    
    public void setPrivacyPolicy(boolean privacyPolicy) {
        this.privacyPolicy = privacyPolicy;
    }
    
    public boolean isDataProcessingConsent() {
        return dataProcessingConsent;
    }
    
    public void setDataProcessingConsent(boolean dataProcessingConsent) {
        this.dataProcessingConsent = dataProcessingConsent;
    }
    
    public boolean isMarketingConsent() {
        return marketingConsent;
    }
    
    public void setMarketingConsent(boolean marketingConsent) {
        this.marketingConsent = marketingConsent;
    }
    
    public String getDeviceId() {
        return deviceId;
    }
    
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
    
    public String getDeviceType() {
        return deviceType;
    }
    
    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }
    
    public String getAppVersion() {
        return appVersion;
    }
    
    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }
}