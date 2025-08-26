package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.model.Vehicle;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import com.thaiinsurance.autoinsurance.repository.VehicleRepository;
import com.thaiinsurance.autoinsurance.util.ThaiValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Service for Vehicle management with Thai DLT integration
 */
@Service
@Transactional
public class VehicleService {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);
    
    // Thai license plate patterns
    private static final Pattern THAI_LICENSE_PLATE_OLD = Pattern.compile("^[ก-ฮ]{2}\\s?\\d{4}$");
    private static final Pattern THAI_LICENSE_PLATE_NEW = Pattern.compile("^\\d[ก-ฮ]{2}\\s?\\d{4}$");
    
    // Thai vehicle categories
    private static final String[] VALID_VEHICLE_CATEGORIES = {
        "รถยนต์นั่งส่วนบุคคล", "รถยนต์นั่งสาธารณะ", "รถยนต์บรรทุกส่วนบุคคล", 
        "รถยนต์บรรทุกสาธารณะ", "รถจักรยานยนต์", "รถแทรกเตอร์"
    };
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    /**
     * Register new vehicle
     */
    public Vehicle registerVehicle(Vehicle vehicle) {
        logger.info("Registering vehicle with license plate {}", vehicle.getLicensePlate());
        
        validateVehicle(vehicle);
        
        // Clean and validate license plate
        String cleanLicensePlate = cleanLicensePlate(vehicle.getLicensePlate());
        if (!isValidThaiLicensePlate(cleanLicensePlate)) {
            throw new IllegalArgumentException("Invalid Thai license plate format");
        }
        vehicle.setLicensePlate(cleanLicensePlate);
        
        // Check for duplicate license plate
        if (vehicleRepository.existsByLicensePlate(cleanLicensePlate)) {
            throw new IllegalArgumentException("Vehicle with this license plate already exists");
        }
        
        // Validate chassis number
        if (vehicleRepository.existsByChassisNumber(vehicle.getChassisNumber())) {
            throw new IllegalArgumentException("Vehicle with this chassis number already exists");
        }
        
        // Validate engine number
        if (vehicle.getEngineNumber() != null && 
            vehicleRepository.existsByEngineNumber(vehicle.getEngineNumber())) {
            throw new IllegalArgumentException("Vehicle with this engine number already exists");
        }
        
        // Set default values
        if (vehicle.getRegistrationDate() == null) {
            vehicle.setRegistrationDate(LocalDate.now());
        }
        
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(Vehicle.VehicleStatus.ACTIVE);
        }
        
        // In real implementation, integrate with DLT API for verification
        // simulateDltVerification(vehicle);
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        logger.info("Registered vehicle {} with ID {}", cleanLicensePlate, savedVehicle.getId());
        
        return savedVehicle;
    }
    
    /**
     * Get all vehicles with pagination
     */
    @Transactional(readOnly = true)
    public Page<Vehicle> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }
    
    /**
     * Search vehicles
     */
    @Transactional(readOnly = true)
    public Page<Vehicle> searchVehicles(String searchTerm, Pageable pageable) {
        return vehicleRepository.searchVehicles(searchTerm, pageable);
    }
    
    /**
     * Get vehicle by ID
     */
    @Transactional(readOnly = true)
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }
    
    /**
     * Get vehicle by license plate
     */
    @Transactional(readOnly = true)
    public Optional<Vehicle> getVehicleByLicensePlate(String licensePlate) {
        String cleanLicensePlate = cleanLicensePlate(licensePlate);
        return vehicleRepository.findByLicensePlate(cleanLicensePlate);
    }
    
    /**
     * Get vehicle by chassis number
     */
    @Transactional(readOnly = true)
    public Optional<Vehicle> getVehicleByChassisNumber(String chassisNumber) {
        return vehicleRepository.findByChassisNumber(chassisNumber);
    }
    
    /**
     * Get vehicles by owner
     */
    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }
    
    /**
     * Get vehicles by make and model
     */
    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByMakeAndModel(String make, String model) {
        return vehicleRepository.findByMakeAndModel(make, model);
    }
    
    /**
     * Get vehicles by year range
     */
    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByYearRange(Integer startYear, Integer endYear) {
        return vehicleRepository.findByYearBetween(startYear, endYear);
    }
    
    /**
     * Update vehicle information
     */
    public Vehicle updateVehicle(Long vehicleId, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        // Update allowed fields (license plate cannot be changed)
        if (vehicleDetails.getColor() != null) {
            vehicle.setColor(vehicleDetails.getColor());
        }
        
        if (vehicleDetails.getCurrentMileage() != null) {
            vehicle.setCurrentMileage(vehicleDetails.getCurrentMileage());
        }
        
        if (vehicleDetails.getMarketValue() != null) {
            vehicle.setMarketValue(vehicleDetails.getMarketValue());
        }
        
        if (vehicleDetails.getModifications() != null) {
            vehicle.setModifications(vehicleDetails.getModifications());
        }
        
        // Update ownership if provided and valid
        if (vehicleDetails.getOwner() != null && vehicleDetails.getOwner().getId() != null) {
            Customer newOwner = customerRepository.findById(vehicleDetails.getOwner().getId())
                .orElseThrow(() -> new IllegalArgumentException("New owner not found"));
            vehicle.setOwner(newOwner);
        }
        
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Transfer vehicle ownership
     */
    public Vehicle transferOwnership(Long vehicleId, Long newOwnerId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        Customer newOwner = customerRepository.findById(newOwnerId)
            .orElseThrow(() -> new IllegalArgumentException("New owner not found"));
        
        Customer oldOwner = vehicle.getOwner();
        vehicle.setOwner(newOwner);
        vehicle.setLastTransferDate(LocalDate.now());
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        
        logger.info("Transferred vehicle {} from customer {} to customer {}", 
                   vehicle.getLicensePlate(), 
                   oldOwner != null ? oldOwner.getId() : "Unknown", 
                   newOwner.getId());
        
        return savedVehicle;
    }
    
    /**
     * Deactivate vehicle
     */
    public Vehicle deactivateVehicle(Long vehicleId, String reason) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        vehicle.setStatus(Vehicle.VehicleStatus.INACTIVE);
        vehicle.setInactiveReason(reason);
        vehicle.setInactiveDate(LocalDate.now());
        
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Get vehicle statistics
     */
    @Transactional(readOnly = true)
    public VehicleStatistics getStatistics() {
        VehicleStatistics stats = new VehicleStatistics();
        stats.setTotalVehicles(vehicleRepository.count());
        stats.setActiveVehicles(vehicleRepository.countByStatus(Vehicle.VehicleStatus.ACTIVE));
        stats.setInactiveVehicles(vehicleRepository.countByStatus(Vehicle.VehicleStatus.INACTIVE));
        
        // Count by vehicle type
        stats.setPersonalCars(vehicleRepository.countByVehicleType(Vehicle.VehicleType.PERSONAL_CAR));
        stats.setMotorcycles(vehicleRepository.countByVehicleType(Vehicle.VehicleType.MOTORCYCLE));
        stats.setTrucks(vehicleRepository.countByVehicleType(Vehicle.VehicleType.TRUCK));
        stats.setVans(vehicleRepository.countByVehicleType(Vehicle.VehicleType.VAN));
        
        return stats;
    }
    
    /**
     * Verify vehicle with DLT (Department of Land Transport)
     * This is a placeholder for actual DLT API integration
     */
    public VehicleVerificationResult verifyWithDlt(String licensePlate) {
        logger.info("Verifying vehicle {} with DLT", licensePlate);
        
        String cleanLicensePlate = cleanLicensePlate(licensePlate);
        if (!isValidThaiLicensePlate(cleanLicensePlate)) {
            throw new IllegalArgumentException("Invalid Thai license plate format");
        }
        
        // In real implementation, call DLT API
        VehicleVerificationResult result = new VehicleVerificationResult();
        result.setLicensePlate(cleanLicensePlate);
        result.setVerified(true); // Simulate successful verification
        result.setMessage("Vehicle verified successfully with DLT");
        result.setVerificationDate(LocalDate.now());
        
        return result;
    }
    
    // Private helper methods
    
    private void validateVehicle(Vehicle vehicle) {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        
        if (vehicle.getLicensePlate() == null || vehicle.getLicensePlate().trim().isEmpty()) {
            throw new IllegalArgumentException("License plate is required");
        }
        
        if (vehicle.getChassisNumber() == null || vehicle.getChassisNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Chassis number is required");
        }
        
        if (vehicle.getMake() == null || vehicle.getMake().trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle make is required");
        }
        
        if (vehicle.getModel() == null || vehicle.getModel().trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle model is required");
        }
        
        if (vehicle.getManufacturingYear() == null || 
            vehicle.getManufacturingYear() < 1950 || 
            vehicle.getManufacturingYear() > LocalDate.now().getYear() + 1) {
            throw new IllegalArgumentException("Invalid manufacturing year");
        }
        
        if (vehicle.getOwner() == null || vehicle.getOwner().getId() == null) {
            throw new IllegalArgumentException("Vehicle owner is required");
        }
        
        // Validate owner exists
        if (!customerRepository.existsById(vehicle.getOwner().getId())) {
            throw new IllegalArgumentException("Vehicle owner not found");
        }
    }
    
    private String cleanLicensePlate(String licensePlate) {
        if (licensePlate == null) return null;
        
        // Remove spaces and convert to uppercase
        return licensePlate.replaceAll("\\s+", "").trim().toUpperCase();
    }
    
    private boolean isValidThaiLicensePlate(String licensePlate) {
        if (licensePlate == null || licensePlate.isEmpty()) {
            return false;
        }
        
        // Check old format (e.g., กข1234) or new format (e.g., 1กข2345)
        return THAI_LICENSE_PLATE_OLD.matcher(licensePlate).matches() ||
               THAI_LICENSE_PLATE_NEW.matcher(licensePlate).matches();
    }
    
    // Inner classes for response DTOs
    public static class VehicleVerificationResult {
        private String licensePlate;
        private boolean verified;
        private String message;
        private LocalDate verificationDate;
        private String dltStatus;
        private String registrationProvince;
        private LocalDate registrationExpiry;
        
        // Getters and setters
        public String getLicensePlate() { return licensePlate; }
        public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public LocalDate getVerificationDate() { return verificationDate; }
        public void setVerificationDate(LocalDate verificationDate) { this.verificationDate = verificationDate; }
        public String getDltStatus() { return dltStatus; }
        public void setDltStatus(String dltStatus) { this.dltStatus = dltStatus; }
        public String getRegistrationProvince() { return registrationProvince; }
        public void setRegistrationProvince(String registrationProvince) { this.registrationProvince = registrationProvince; }
        public LocalDate getRegistrationExpiry() { return registrationExpiry; }
        public void setRegistrationExpiry(LocalDate registrationExpiry) { this.registrationExpiry = registrationExpiry; }
    }
    
    public static class VehicleStatistics {
        private long totalVehicles;
        private long activeVehicles;
        private long inactiveVehicles;
        private long personalCars;
        private long motorcycles;
        private long trucks;
        private long vans;
        
        // Getters and setters
        public long getTotalVehicles() { return totalVehicles; }
        public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }
        public long getActiveVehicles() { return activeVehicles; }
        public void setActiveVehicles(long activeVehicles) { this.activeVehicles = activeVehicles; }
        public long getInactiveVehicles() { return inactiveVehicles; }
        public void setInactiveVehicles(long inactiveVehicles) { this.inactiveVehicles = inactiveVehicles; }
        public long getPersonalCars() { return personalCars; }
        public void setPersonalCars(long personalCars) { this.personalCars = personalCars; }
        public long getMotorcycles() { return motorcycles; }
        public void setMotorcycles(long motorcycles) { this.motorcycles = motorcycles; }
        public long getTrucks() { return trucks; }
        public void setTrucks(long trucks) { this.trucks = trucks; }
        public long getVans() { return vans; }
        public void setVans(long vans) { this.vans = vans; }
    }
}