package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicles_license_plate", columnList = "license_plate"),
    @Index(name = "idx_vehicles_chassis_number", columnList = "chassis_number"),
    @Index(name = "idx_vehicles_customer", columnList = "customer_id")
})
public class Vehicle extends BaseEntity {
    
    @Pattern(regexp = "^[ก-๏0-9A-Z\\s]{1,10}$", message = "Invalid Thai license plate format")
    @Column(name = "license_plate", unique = true, nullable = false, length = 10)
    private String licensePlate;
    
    @NotBlank
    @Column(name = "chassis_number", unique = true, nullable = false, length = 50)
    private String chassisNumber;
    
    @NotBlank
    @Column(name = "engine_number", nullable = false, length = 50)
    private String engineNumber;
    
    @NotBlank
    @Column(name = "make", nullable = false, length = 50)
    private String make;
    
    @NotBlank
    @Column(name = "model", nullable = false, length = 50)
    private String model;
    
    @Positive
    @Column(name = "manufacture_year", nullable = false)
    private Integer year;
    
    @Column(name = "color", length = 30)
    private String color;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;
    
    @Column(name = "engine_size")
    private Double engineSize;
    
    @Column(name = "seating_capacity")
    private Integer seatingCapacity;
    
    @Column(name = "weight")
    private Double weight;
    
    @Column(name = "market_value")
    private Double marketValue;
    
    @Column(name = "registration_date")
    private LocalDate registrationDate;
    
    @Column(name = "registration_province", length = 100)
    private String registrationProvince;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "usage_type", nullable = false)
    private UsageType usageType;
    
    @Column(name = "annual_mileage")
    private Integer annualMileage;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VehicleStatus status = VehicleStatus.ACTIVE;
    
    @Column(name = "current_mileage")
    private Integer currentMileage;
    
    @Column(name = "modifications", columnDefinition = "TEXT")
    private String modifications;
    
    @Column(name = "inactive_reason")
    private String inactiveReason;
    
    @Column(name = "inactive_date")
    private LocalDate inactiveDate;
    
    @Column(name = "last_transfer_date")
    private LocalDate lastTransferDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Customer owner;
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Policy> policies = new ArrayList<>();
    
    // Constructors
    public Vehicle() {}
    
    public Vehicle(String licensePlate, String chassisNumber, String make, 
                  String model, Integer year, VehicleType vehicleType) {
        this.licensePlate = licensePlate;
        this.chassisNumber = chassisNumber;
        this.make = make;
        this.model = model;
        this.year = year;
        this.vehicleType = vehicleType;
    }
    
    // Getters and Setters
    public String getLicensePlate() {
        return licensePlate;
    }
    
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
    
    public String getChassisNumber() {
        return chassisNumber;
    }
    
    public void setChassisNumber(String chassisNumber) {
        this.chassisNumber = chassisNumber;
    }
    
    public String getEngineNumber() {
        return engineNumber;
    }
    
    public void setEngineNumber(String engineNumber) {
        this.engineNumber = engineNumber;
    }
    
    public String getMake() {
        return make;
    }
    
    public void setMake(String make) {
        this.make = make;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public VehicleType getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public FuelType getFuelType() {
        return fuelType;
    }
    
    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }
    
    public Double getEngineSize() {
        return engineSize;
    }
    
    public void setEngineSize(Double engineSize) {
        this.engineSize = engineSize;
    }
    
    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }
    
    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }
    
    public Double getWeight() {
        return weight;
    }
    
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    
    public Double getMarketValue() {
        return marketValue;
    }
    
    public void setMarketValue(Double marketValue) {
        this.marketValue = marketValue;
    }
    
    public LocalDate getRegistrationDate() {
        return registrationDate;
    }
    
    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    public String getRegistrationProvince() {
        return registrationProvince;
    }
    
    public void setRegistrationProvince(String registrationProvince) {
        this.registrationProvince = registrationProvince;
    }
    
    public UsageType getUsageType() {
        return usageType;
    }
    
    public void setUsageType(UsageType usageType) {
        this.usageType = usageType;
    }
    
    public Integer getAnnualMileage() {
        return annualMileage;
    }
    
    public void setAnnualMileage(Integer annualMileage) {
        this.annualMileage = annualMileage;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    public List<Policy> getPolicies() {
        return policies;
    }
    
    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }
    
    public VehicleStatus getStatus() {
        return status;
    }
    
    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
    
    public Integer getCurrentMileage() {
        return currentMileage;
    }
    
    public void setCurrentMileage(Integer currentMileage) {
        this.currentMileage = currentMileage;
    }
    
    public String getModifications() {
        return modifications;
    }
    
    public void setModifications(String modifications) {
        this.modifications = modifications;
    }
    
    public String getInactiveReason() {
        return inactiveReason;
    }
    
    public void setInactiveReason(String inactiveReason) {
        this.inactiveReason = inactiveReason;
    }
    
    public LocalDate getInactiveDate() {
        return inactiveDate;
    }
    
    public void setInactiveDate(LocalDate inactiveDate) {
        this.inactiveDate = inactiveDate;
    }
    
    public LocalDate getLastTransferDate() {
        return lastTransferDate;
    }
    
    public void setLastTransferDate(LocalDate lastTransferDate) {
        this.lastTransferDate = lastTransferDate;
    }
    
    public Customer getOwner() {
        return owner;
    }
    
    public void setOwner(Customer owner) {
        this.owner = owner;
    }
    
    public String getDisplayName() {
        return make + " " + model + " (" + year + ") - " + licensePlate;
    }
    
    public int getAge() {
        return LocalDate.now().getYear() - year;
    }
    
    public Integer getManufacturingYear() {
        return year;
    }
    
    // Enums
    public enum VehicleType {
        SEDAN,
        HATCHBACK,
        SUV,
        PICKUP,
        MOTORCYCLE,
        VAN,
        TRUCK,
        BUS,
        PERSONAL_CAR,
        OTHER
    }
    
    public enum FuelType {
        GASOLINE,
        DIESEL,
        HYBRID,
        ELECTRIC,
        CNG,
        LPG
    }
    
    public enum UsageType {
        PRIVATE("Private Use"),
        COMMERCIAL("Commercial Use"),
        TAXI("Taxi"),
        RENTAL("Rental"),
        GOVERNMENT("Government Use");
        
        private final String displayName;
        
        UsageType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum VehicleStatus {
        ACTIVE("Active"),
        INACTIVE("Inactive"),
        SUSPENDED("Suspended"),
        SCRAPPED("Scrapped");
        
        private final String displayName;
        
        VehicleStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}