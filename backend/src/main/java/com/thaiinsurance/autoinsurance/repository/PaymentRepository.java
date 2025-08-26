package com.thaiinsurance.autoinsurance.repository;

import com.thaiinsurance.autoinsurance.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long> {
    
    Optional<Payment> findByPaymentReference(String paymentReference);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    Boolean existsByPaymentReference(String paymentReference);
    
    List<Payment> findByPolicyId(Long policyId);
    
    @Query("SELECT p FROM Payment p WHERE p.policy.customer.id = :customerId")
    List<Payment> findByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT p FROM Payment p WHERE p.status = :status")
    List<Payment> findByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentType = :paymentType")
    List<Payment> findByPaymentType(@Param("paymentType") Payment.PaymentType paymentType);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentMethod = :paymentMethod")
    List<Payment> findByPaymentMethod(@Param("paymentMethod") Payment.PaymentMethod paymentMethod);
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate < CURRENT_DATE AND p.status IN ('PENDING', 'FAILED')")
    List<Payment> findOverduePayments();
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate <= :date AND p.status IN ('PENDING', 'FAILED')")
    List<Payment> findPaymentsDueByDate(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.amount >= :minAmount AND p.amount <= :maxAmount")
    List<Payment> findByAmountBetween(@Param("minAmount") BigDecimal minAmount,
                                     @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT p FROM Payment p WHERE p.policy.id = :policyId AND p.paymentType = :paymentType")
    List<Payment> findByPolicyIdAndPaymentType(@Param("policyId") Long policyId,
                                              @Param("paymentType") Payment.PaymentType paymentType);
    
    @Query("SELECT p FROM Payment p WHERE p.processedBy.id = :userId")
    List<Payment> findByProcessedBy(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Payment p WHERE p.bankCode = :bankCode AND p.status = 'COMPLETED'")
    List<Payment> findCompletedPaymentsByBank(@Param("bankCode") String bankCode);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentType = :paymentType")
    long countByPaymentType(@Param("paymentType") Payment.PaymentType paymentType);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :paymentMethod")
    long countByPaymentMethod(@Param("paymentMethod") Payment.PaymentMethod paymentMethod);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalCompletedPaymentsByDateRange(@Param("startDate") LocalDateTime startDate,
                                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentType = :paymentType AND p.status = 'COMPLETED'")
    BigDecimal calculateTotalCompletedPaymentsByType(@Param("paymentType") Payment.PaymentType paymentType);
    
    @Query("SELECT AVG(p.amount) FROM Payment p WHERE p.paymentMethod = :paymentMethod AND p.status = 'COMPLETED'")
    BigDecimal calculateAveragePaymentAmountByMethod(@Param("paymentMethod") Payment.PaymentMethod paymentMethod);
    
    @Query("SELECT p FROM Payment p WHERE p.policy.id = :policyId AND p.status = 'COMPLETED' ORDER BY p.paymentDate DESC")
    List<Payment> findCompletedPaymentsByPolicyOrderByDateDesc(@Param("policyId") Long policyId);
    
    // Additional methods needed by services
    @Query("SELECT p FROM Payment p WHERE p.policy.customer.id = :customerId")
    List<Payment> findByPolicyCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND DATE(p.paymentDate) BETWEEN :startDate AND :endDate")
    BigDecimal sumCompletedPaymentAmountsByDateRange(@Param("startDate") LocalDate startDate, 
                                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PENDING' AND p.dueDate BETWEEN :startDate AND :endDate")
    BigDecimal sumPendingPaymentAmountsByDateRange(@Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal sumCompletedPaymentAmounts();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PENDING'")
    BigDecimal sumPendingPaymentAmounts();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :paymentMethod AND p.paymentDate BETWEEN :startDate AND :endDate")
    long countByPaymentMethodAndDateRange(@Param("paymentMethod") Payment.PaymentMethod paymentMethod, 
                                         @Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentMethod = :paymentMethod AND p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueByPaymentMethodAndDateRange(@Param("paymentMethod") Payment.PaymentMethod paymentMethod, 
                                                    @Param("startDate") LocalDate startDate, 
                                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.paymentDate BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") Payment.PaymentStatus status, 
                                  @Param("startDate") LocalDate startDate, 
                                  @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal sumRevenueByDateRange(@Param("startDate") LocalDate startDate, 
                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT AVG(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getAveragePaymentAmount(@Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    long countByDateRange(@Param("startDate") LocalDate startDate, 
                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.policy.id = :policyId AND p.status = 'COMPLETED'")
    BigDecimal sumCompletedPaymentAmountsByPolicy(@Param("policyId") Long policyId);
    
    // Additional methods needed by PaymentService
    @Query("SELECT p FROM Payment p WHERE p.paymentReference LIKE %:searchTerm% OR p.policy.policyNumber LIKE %:searchTerm% OR p.policy.customer.firstName LIKE %:searchTerm%")
    Page<Payment> searchPayments(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalPaymentAmount();
    
    @Query("SELECT AVG(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getAveragePaymentAmount();
}