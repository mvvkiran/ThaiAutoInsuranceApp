package com.thaiinsurance.autoinsurance.repository;

import com.thaiinsurance.autoinsurance.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends BaseRepository<Customer, Long> {
    
    Optional<Customer> findByNationalId(String nationalId);
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    
    Boolean existsByNationalId(String nationalId);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByPhoneNumber(String phoneNumber);
    
    List<Customer> findByIsActiveTrue();
    
    @Query("SELECT c FROM Customer c WHERE c.kycStatus = :status")
    List<Customer> findByKycStatus(@Param("status") Customer.KYCStatus status);
    
    @Query("SELECT c FROM Customer c WHERE c.province = :province AND c.isActive = true")
    List<Customer> findByProvinceAndIsActiveTrue(@Param("province") String province);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "c.nationalId LIKE CONCAT('%', :searchTerm, '%') OR " +
           "c.phoneNumber LIKE CONCAT('%', :searchTerm, '%')")
    Page<Customer> searchCustomers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.dateOfBirth BETWEEN :startDate AND :endDate")
    List<Customer> findByDateOfBirthBetween(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Customer c WHERE c.occupationCategory = :category AND c.isActive = true")
    List<Customer> findByOccupationCategoryAndIsActiveTrue(@Param("category") Customer.OccupationCategory category);
    
    @Query("SELECT c FROM Customer c WHERE c.monthlyIncome >= :minIncome AND c.monthlyIncome <= :maxIncome")
    List<Customer> findByIncomeRange(@Param("minIncome") Double minIncome, @Param("maxIncome") Double maxIncome);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.kycStatus = :status")
    long countByKycStatus(@Param("status") Customer.KYCStatus status);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt >= :startDateTime AND c.createdAt <= :endDateTime")
    long countNewCustomersBetween(@Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.isActive = true AND c.createdAt BETWEEN :startDateTime AND :endDateTime")
    long countActiveCustomersByDateRange(@Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.createdAt BETWEEN :startDateTime AND :endDateTime")
    long countByDateRange(@Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime);
    
    // Additional methods for AdminService
    long countByIsActiveTrue();
}