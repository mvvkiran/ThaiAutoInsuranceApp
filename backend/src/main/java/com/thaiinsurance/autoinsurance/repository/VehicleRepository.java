package com.thaiinsurance.autoinsurance.repository;

import com.thaiinsurance.autoinsurance.model.Vehicle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends BaseRepository<Vehicle, Long> {
    
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    
    Optional<Vehicle> findByChassisNumber(String chassisNumber);
    
    Boolean existsByLicensePlate(String licensePlate);
    
    Boolean existsByChassisNumber(String chassisNumber);
    
    List<Vehicle> findByCustomerId(Long customerId);
    
    List<Vehicle> findByCustomerIdAndIsActiveTrue(Long customerId);
    
    @Query("SELECT v FROM Vehicle v WHERE v.customer.id = :customerId AND v.isActive = true")
    List<Vehicle> findActiveVehiclesByCustomer(@Param("customerId") Long customerId);
    
    @Query("SELECT v FROM Vehicle v WHERE v.make = :make AND v.isActive = true")
    List<Vehicle> findByMakeAndIsActiveTrue(@Param("make") String make);
    
    @Query("SELECT v FROM Vehicle v WHERE v.make = :make AND v.model = :model AND v.isActive = true")
    List<Vehicle> findByMakeAndModelAndIsActiveTrue(@Param("make") String make, @Param("model") String model);
    
    @Query("SELECT v FROM Vehicle v WHERE v.year >= :fromYear AND v.year <= :toYear AND v.isActive = true")
    List<Vehicle> findByYearRangeAndIsActiveTrue(@Param("fromYear") Integer fromYear, @Param("toYear") Integer toYear);
    
    @Query("SELECT v FROM Vehicle v WHERE v.vehicleType = :type AND v.isActive = true")
    List<Vehicle> findByVehicleTypeAndIsActiveTrue(@Param("type") Vehicle.VehicleType type);
    
    @Query("SELECT v FROM Vehicle v WHERE v.registrationProvince = :province AND v.isActive = true")
    List<Vehicle> findByRegistrationProvinceAndIsActiveTrue(@Param("province") String province);
    
    @Query("SELECT v FROM Vehicle v WHERE v.usageType = :usageType AND v.isActive = true")
    List<Vehicle> findByUsageTypeAndIsActiveTrue(@Param("usageType") Vehicle.UsageType usageType);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.customer.id = :customerId AND v.isActive = true")
    long countActiveVehiclesByCustomer(@Param("customerId") Long customerId);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.vehicleType = :type AND v.isActive = true")
    long countByVehicleTypeAndIsActiveTrue(@Param("type") Vehicle.VehicleType type);
    
    @Query("SELECT DISTINCT v.make FROM Vehicle v WHERE v.isActive = true ORDER BY v.make")
    List<String> findDistinctMakes();
    
    @Query("SELECT DISTINCT v.model FROM Vehicle v WHERE v.make = :make AND v.isActive = true ORDER BY v.model")
    List<String> findDistinctModelsByMake(@Param("make") String make);
    
    // Additional methods needed by services
    List<Vehicle> findByOwnerId(Long ownerId);
    
    List<Vehicle> findByMakeAndModel(String make, String model);
    
    List<Vehicle> findByYearBetween(Integer startYear, Integer endYear);
    
    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.licensePlate) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(v.chassisNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(v.make) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(v.model) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(v.customer.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(v.customer.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    org.springframework.data.domain.Page<Vehicle> searchVehicles(@Param("searchTerm") String searchTerm, 
                                                               org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.make = :make AND v.registrationDate BETWEEN :startDate AND :endDate")
    long countByMakeAndDateRange(@Param("make") String make, 
                                @Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.year = :year AND v.registrationDate BETWEEN :startDate AND :endDate")
    long countByYearAndDateRange(@Param("year") Integer year, 
                                @Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    long countByVehicleType(Vehicle.VehicleType vehicleType);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.vehicleType = :vehicleType AND v.usageType = :usageType")
    long countByVehicleTypeAndUsageType(@Param("vehicleType") Vehicle.VehicleType vehicleType, @Param("usageType") Vehicle.UsageType usageType);
    
    Boolean existsByEngineNumber(String engineNumber);
    
    long countByStatus(Vehicle.VehicleStatus status);
}