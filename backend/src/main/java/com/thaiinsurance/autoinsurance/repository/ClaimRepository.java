package com.thaiinsurance.autoinsurance.repository;

import com.thaiinsurance.autoinsurance.model.Claim;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends BaseRepository<Claim, Long> {
    
    Optional<Claim> findByClaimNumber(String claimNumber);
    
    Boolean existsByClaimNumber(String claimNumber);
    
    List<Claim> findByPolicyId(Long policyId);
    
    @Query("SELECT c FROM Claim c WHERE c.policy.customer.id = :customerId")
    List<Claim> findByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT c FROM Claim c WHERE c.status = :status")
    List<Claim> findByStatus(@Param("status") Claim.ClaimStatus status);
    
    @Query("SELECT c FROM Claim c WHERE c.incidentType = :incidentType")
    List<Claim> findByIncidentType(@Param("incidentType") Claim.IncidentType incidentType);
    
    @Query("SELECT c FROM Claim c WHERE c.priorityLevel = :priorityLevel AND c.status IN :statuses")
    List<Claim> findByPriorityLevelAndStatusIn(@Param("priorityLevel") Claim.PriorityLevel priorityLevel,
                                              @Param("statuses") List<Claim.ClaimStatus> statuses);
    
    @Query("SELECT c FROM Claim c WHERE c.reportedDate BETWEEN :startDate AND :endDate")
    List<Claim> findClaimsReportedBetween(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE c.incidentDate BETWEEN :startDate AND :endDate")
    List<Claim> findClaimsByIncidentDateBetween(@Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE c.adjuster.id = :adjusterId")
    List<Claim> findByAdjusterId(@Param("adjusterId") Long adjusterId);
    
    @Query("SELECT c FROM Claim c WHERE c.adjuster.id = :adjusterId AND c.status IN :statuses")
    List<Claim> findByAdjusterIdAndStatusIn(@Param("adjusterId") Long adjusterId,
                                           @Param("statuses") List<Claim.ClaimStatus> statuses);
    
    @Query("SELECT c FROM Claim c WHERE c.estimatedDamageAmount >= :minAmount AND c.estimatedDamageAmount <= :maxAmount")
    List<Claim> findByEstimatedDamageAmountBetween(@Param("minAmount") BigDecimal minAmount,
                                                  @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT c FROM Claim c WHERE c.claimedAmount >= :minAmount AND c.claimedAmount <= :maxAmount")
    List<Claim> findByClaimedAmountBetween(@Param("minAmount") BigDecimal minAmount,
                                          @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT c FROM Claim c WHERE c.thirdPartyInvolved = true")
    List<Claim> findClaimsWithThirdParty();
    
    @Query("SELECT c FROM Claim c WHERE c.reportedDate < :date AND c.status IN ('SUBMITTED', 'UNDER_REVIEW', 'UNDER_INVESTIGATION', 'PENDING_DOCUMENTS')")
    List<Claim> findOverdueClaims(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status")
    long countByStatus(@Param("status") Claim.ClaimStatus status);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.incidentType = :incidentType")
    long countByIncidentType(@Param("incidentType") Claim.IncidentType incidentType);
    
    @Query("SELECT SUM(c.approvedAmount) FROM Claim c WHERE c.status = 'APPROVED' AND c.approvedDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalApprovedAmountByDateRange(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(c.estimatedDamageAmount) FROM Claim c WHERE c.incidentType = :incidentType")
    BigDecimal calculateAverageEstimatedDamageByIncidentType(@Param("incidentType") Claim.IncidentType incidentType);
    
    // Additional methods needed by services
    @Query("SELECT c FROM Claim c WHERE c.policy.customer.id = :customerId")
    List<Claim> findByPolicyCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status AND c.reportedDate BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") Claim.ClaimStatus status, 
                                  @Param("startDate") LocalDate startDate, 
                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.incidentType = :incidentType AND c.reportedDate BETWEEN :startDate AND :endDate")
    long countByIncidentTypeAndDateRange(@Param("incidentType") Claim.IncidentType incidentType, 
                                        @Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.priorityLevel = :priority AND c.reportedDate BETWEEN :startDate AND :endDate")
    long countByPriorityAndDateRange(@Param("priority") Claim.PriorityLevel priority, 
                                    @Param("startDate") LocalDate startDate, 
                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(c.paidAmount) FROM Claim c WHERE c.status = 'SETTLED' AND c.closedDate BETWEEN :startDate AND :endDate")
    BigDecimal sumSettledAmountByDateRange(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(c.paidAmount) FROM Claim c WHERE c.status = 'SETTLED' AND c.closedDate BETWEEN :startDate AND :endDate")
    BigDecimal getAverageSettlementAmount(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.reportedDate BETWEEN :startDate AND :endDate")
    long countNewClaimsBetween(@Param("startDate") LocalDate startDate, 
                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.policy.policyNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.policy.customer.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.policy.customer.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    org.springframework.data.domain.Page<Claim> searchClaims(@Param("searchTerm") String searchTerm, 
                                                           org.springframework.data.domain.Pageable pageable);
    
    @Query(value = "SELECT AVG(DATEDIFF('DAY', c.reported_date, c.closed_date)) FROM claims c WHERE c.status = 'SETTLED' AND c.closed_date BETWEEN ?1 AND ?2", nativeQuery = true)
    Double getAverageSettlementDays(@Param("startDate") LocalDate startDate, 
                                   @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.reportedDate BETWEEN :startDate AND :endDate")
    long countByDateRange(@Param("startDate") LocalDate startDate, 
                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = 'SETTLED' AND c.closedDate BETWEEN :startDate AND :endDate")
    long countSettledByDateRange(@Param("startDate") LocalDate startDate, 
                                @Param("endDate") LocalDate endDate);
    
    // Additional methods needed by ClaimService
    @Query("SELECT c FROM Claim c WHERE c.priorityLevel = :priority")
    List<Claim> findByPriorityLevel(@Param("priority") Claim.PriorityLevel priority);
    
    @Query("SELECT c FROM Claim c WHERE c.status IN ('SUBMITTED', 'UNDER_REVIEW', 'PENDING_DOCUMENTS')")
    List<Claim> findPendingClaims();
    
    @Query("SELECT c FROM Claim c WHERE c.status = 'SETTLED' AND c.settlementDate BETWEEN :startDate AND :endDate")
    List<Claim> findSettledClaimsBetweenDates(@Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(c.settlementAmount) FROM Claim c WHERE c.status = 'SETTLED'")
    BigDecimal getTotalSettlementAmount();
}