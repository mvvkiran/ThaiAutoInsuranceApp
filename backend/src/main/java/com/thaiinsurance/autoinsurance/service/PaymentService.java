package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.model.Payment;
import com.thaiinsurance.autoinsurance.model.Policy;
import com.thaiinsurance.autoinsurance.model.User;
import com.thaiinsurance.autoinsurance.repository.PaymentRepository;
import com.thaiinsurance.autoinsurance.repository.PolicyRepository;
import com.thaiinsurance.autoinsurance.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for Payment management with Thai payment methods support
 */
@Service
@Transactional
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Create new payment
     */
    public Payment createPayment(Payment payment) {
        logger.info("Creating payment for policy ID {}", payment.getPolicy().getId());
        
        validatePayment(payment);
        
        // Generate payment reference if not provided
        if (payment.getPaymentReference() == null || payment.getPaymentReference().isEmpty()) {
            payment.setPaymentReference(generatePaymentReference());
        }
        
        // Set initial status
        if (payment.getStatus() == null) {
            payment.setStatus(Payment.PaymentStatus.PENDING);
        }
        
        // Set payment date
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Created payment with ID {} and reference {}", 
                   savedPayment.getId(), savedPayment.getPaymentReference());
        
        return savedPayment;
    }
    
    /**
     * Process payment
     */
    public Payment processPayment(Long paymentId, String transactionId, String gatewayResponse) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        
        payment.setTransactionId(transactionId);
        payment.setGatewayResponse(gatewayResponse);
        payment.setStatus(Payment.PaymentStatus.PROCESSING);
        payment.setProcessedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Confirm payment
     */
    public Payment confirmPayment(Long paymentId, Long processedBy) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        
        User processor = userRepository.findById(processedBy)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setConfirmedDate(LocalDateTime.now());
        payment.setProcessedBy(processor);
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Fail payment
     */
    public Payment failPayment(Long paymentId, String failureReason) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        
        payment.setStatus(Payment.PaymentStatus.FAILED);
        payment.setFailureReason(failureReason);
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Refund payment
     */
    public Payment refundPayment(Long originalPaymentId, BigDecimal refundAmount, String reason) {
        Payment originalPayment = paymentRepository.findById(originalPaymentId)
            .orElseThrow(() -> new IllegalArgumentException("Original payment not found"));
        
        // Create refund payment
        Payment refundPayment = new Payment();
        refundPayment.setPaymentReference(generatePaymentReference());
        refundPayment.setAmount(refundAmount);
        refundPayment.setPaymentType(Payment.PaymentType.REFUND);
        refundPayment.setPaymentMethod(originalPayment.getPaymentMethod());
        refundPayment.setStatus(Payment.PaymentStatus.PENDING);
        refundPayment.setPolicy(originalPayment.getPolicy());
        refundPayment.setOriginalPayment(originalPayment);
        refundPayment.setNotes(reason);
        refundPayment.setPaymentDate(LocalDateTime.now());
        
        Payment savedRefund = paymentRepository.save(refundPayment);
        
        // Update original payment status
        originalPayment.setStatus(Payment.PaymentStatus.REFUNDED);
        paymentRepository.save(originalPayment);
        
        return savedRefund;
    }
    
    /**
     * Get all payments with pagination
     */
    @Transactional(readOnly = true)
    public Page<Payment> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }
    
    /**
     * Get payment by ID
     */
    @Transactional(readOnly = true)
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    /**
     * Get payment by reference
     */
    @Transactional(readOnly = true)
    public Optional<Payment> getPaymentByReference(String paymentReference) {
        return paymentRepository.findByPaymentReference(paymentReference);
    }
    
    /**
     * Get payments by policy
     */
    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByPolicy(Long policyId) {
        return paymentRepository.findByPolicyId(policyId);
    }
    
    /**
     * Get payments by status
     */
    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }
    
    /**
     * Get overdue payments
     */
    @Transactional(readOnly = true)
    public List<Payment> getOverduePayments() {
        return paymentRepository.findOverduePayments();
    }
    
    /**
     * Search payments
     */
    @Transactional(readOnly = true)
    public Page<Payment> searchPayments(String searchTerm, Pageable pageable) {
        return paymentRepository.searchPayments(searchTerm, pageable);
    }
    
    /**
     * Get payment statistics
     */
    @Transactional(readOnly = true)
    public PaymentStatistics getPaymentStatistics() {
        PaymentStatistics stats = new PaymentStatistics();
        stats.setTotalPayments(paymentRepository.count());
        stats.setPendingPayments(paymentRepository.countByStatus(Payment.PaymentStatus.PENDING));
        stats.setCompletedPayments(paymentRepository.countByStatus(Payment.PaymentStatus.COMPLETED));
        stats.setFailedPayments(paymentRepository.countByStatus(Payment.PaymentStatus.FAILED));
        stats.setTotalAmount(paymentRepository.getTotalPaymentAmount());
        stats.setAveragePaymentAmount(paymentRepository.getAveragePaymentAmount());
        
        return stats;
    }
    
    /**
     * Generate payment report for policy
     */
    @Transactional(readOnly = true)
    public PaymentReport generatePaymentReport(Long policyId) {
        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        
        List<Payment> payments = paymentRepository.findByPolicyId(policyId);
        
        PaymentReport report = new PaymentReport();
        report.setPolicyId(policyId);
        report.setPolicyNumber(policy.getPolicyNumber());
        report.setPayments(payments);
        report.setTotalPaid(payments.stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        report.setPendingAmount(payments.stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.PENDING)
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return report;
    }
    
    // Private helper methods
    
    private void validatePayment(Payment payment) {
        if (payment == null) {
            throw new IllegalArgumentException("Payment cannot be null");
        }
        
        if (payment.getAmount() == null || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }
        
        if (payment.getPaymentType() == null) {
            throw new IllegalArgumentException("Payment type is required");
        }
        
        if (payment.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Payment method is required");
        }
        
        if (payment.getPolicy() == null || payment.getPolicy().getId() == null) {
            throw new IllegalArgumentException("Policy is required");
        }
        
        // Validate policy exists
        if (!policyRepository.existsById(payment.getPolicy().getId())) {
            throw new IllegalArgumentException("Policy not found");
        }
    }
    
    private String generatePaymentReference() {
        return "PAY" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // Inner classes for response DTOs
    public static class PaymentStatistics {
        private long totalPayments;
        private long pendingPayments;
        private long completedPayments;
        private long failedPayments;
        private BigDecimal totalAmount;
        private BigDecimal averagePaymentAmount;
        
        // Getters and setters
        public long getTotalPayments() { return totalPayments; }
        public void setTotalPayments(long totalPayments) { this.totalPayments = totalPayments; }
        public long getPendingPayments() { return pendingPayments; }
        public void setPendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; }
        public long getCompletedPayments() { return completedPayments; }
        public void setCompletedPayments(long completedPayments) { this.completedPayments = completedPayments; }
        public long getFailedPayments() { return failedPayments; }
        public void setFailedPayments(long failedPayments) { this.failedPayments = failedPayments; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public BigDecimal getAveragePaymentAmount() { return averagePaymentAmount; }
        public void setAveragePaymentAmount(BigDecimal averagePaymentAmount) { this.averagePaymentAmount = averagePaymentAmount; }
    }
    
    public static class PaymentReport {
        private Long policyId;
        private String policyNumber;
        private List<Payment> payments;
        private BigDecimal totalPaid;
        private BigDecimal pendingAmount;
        
        // Getters and setters
        public Long getPolicyId() { return policyId; }
        public void setPolicyId(Long policyId) { this.policyId = policyId; }
        public String getPolicyNumber() { return policyNumber; }
        public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
        public List<Payment> getPayments() { return payments; }
        public void setPayments(List<Payment> payments) { this.payments = payments; }
        public BigDecimal getTotalPaid() { return totalPaid; }
        public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }
        public BigDecimal getPendingAmount() { return pendingAmount; }
        public void setPendingAmount(BigDecimal pendingAmount) { this.pendingAmount = pendingAmount; }
    }
}