package com.thaiinsurance.autoinsurance.repository;

import com.thaiinsurance.autoinsurance.model.Policy;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends BaseRepository<Policy, Long> {
    
    Optional<Policy> findByPolicyNumber(String policyNumber);
    
    Boolean existsByPolicyNumber(String policyNumber);
    
    List<Policy> findByCustomerId(Long customerId);
    
    List<Policy> findByVehicleId(Long vehicleId);
    
    @Query("SELECT p FROM Policy p WHERE p.status = :status")
    List<Policy> findByStatus(@Param("status") Policy.PolicyStatus status);
    
    @Query("SELECT p FROM Policy p WHERE p.customer.id = :customerId AND p.status = :status")
    List<Policy> findByCustomerIdAndStatus(@Param("customerId") Long customerId, 
                                          @Param("status") Policy.PolicyStatus status);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate BETWEEN :startDate AND :endDate")
    List<Policy> findPoliciesExpiringBetween(@Param("startDate") LocalDate startDate, 
                                            @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate < CURRENT_DATE AND p.status = 'ACTIVE'")
    List<Policy> findExpiredActivePolicies();
    
    @Query("SELECT p FROM Policy p WHERE p.endDate <= :date AND p.status = 'ACTIVE'")
    List<Policy> findPoliciesExpiringByDate(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Policy p WHERE p.policyType = :type AND p.status = 'ACTIVE'")
    List<Policy> findActivePoliciesByType(@Param("type") Policy.PolicyType type);
    
    @Query("SELECT p FROM Policy p WHERE p.coverageType = :coverageType AND p.status = 'ACTIVE'")
    List<Policy> findActivePoliciesByCoverageType(@Param("coverageType") Policy.CoverageType coverageType);
    
    @Query("SELECT p FROM Policy p WHERE p.premiumAmount >= :minAmount AND p.premiumAmount <= :maxAmount")
    List<Policy> findByPremiumRange(@Param("minAmount") BigDecimal minAmount, 
                                   @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT p FROM Policy p WHERE p.agent.id = :agentId AND p.status = 'ACTIVE'")
    List<Policy> findActivePoliciesByAgent(@Param("agentId") Long agentId);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.status = :status")
    long countByStatus(@Param("status") Policy.PolicyStatus status);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.customer.id = :customerId")
    long countByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT SUM(p.premiumAmount) FROM Policy p WHERE p.status = 'ACTIVE' AND p.issuedDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalPremiumByDateRange(@Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Policy p WHERE p.vehicle.licensePlate = :licensePlate AND p.status = 'ACTIVE'")
    Optional<Policy> findActivePolicyByLicensePlate(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT p FROM Policy p WHERE p.startDate <= CURRENT_DATE AND p.endDate >= CURRENT_DATE AND p.status = 'ACTIVE'")
    List<Policy> findCurrentlyActivePolicies();
    
    // Additional methods needed by services
    @Query("SELECT p FROM Policy p WHERE LOWER(p.policyNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.customer.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.customer.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.vehicle.licensePlate) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    org.springframework.data.domain.Page<Policy> searchPolicies(@Param("searchTerm") String searchTerm, 
                                                              org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate <= :expiryDate AND p.status = 'ACTIVE'")
    List<Policy> findExpiringPolicies(@Param("expiryDate") LocalDate expiryDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.status = :status AND p.issuedDate BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") Policy.PolicyStatus status, 
                                  @Param("startDate") LocalDate startDate, 
                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.issuedDate BETWEEN :startDate AND :endDate")
    long countNewPoliciesBetween(@Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.policyType = :type AND p.issuedDate BETWEEN :startDate AND :endDate")
    long countByTypeAndDateRange(@Param("type") Policy.PolicyType type, 
                                @Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.coverageType = :coverageType AND p.issuedDate BETWEEN :startDate AND :endDate")
    long countByCoverageTypeAndDateRange(@Param("coverageType") Policy.CoverageType coverageType, 
                                        @Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.endDate BETWEEN :startDate AND :endDate AND p.status = 'EXPIRED'")
    long countExpiredPoliciesByDateRange(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.endDate BETWEEN :startDate AND :endDate")
    long countRenewedPoliciesByDateRange(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.issuedDate BETWEEN :startDate AND :endDate")
    long countByDateRange(@Param("startDate") LocalDate startDate, 
                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Policy p WHERE p.status = 'ACTIVE' AND p.issuedDate BETWEEN :startDate AND :endDate")
    long countActiveByDateRange(@Param("startDate") LocalDate startDate, 
                               @Param("endDate") LocalDate endDate);
}