package com.thaiinsurance.autoinsurance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_reference", columnList = "payment_reference"),
    @Index(name = "idx_payments_policy", columnList = "policy_id"),
    @Index(name = "idx_payments_status", columnList = "status"),
    @Index(name = "idx_payments_date", columnList = "payment_date")
})
public class Payment extends BaseEntity {
    
    @NotBlank
    @Column(name = "payment_reference", unique = true, nullable = false, length = 50)
    private String paymentReference;
    
    @NotNull
    @Positive
    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "confirmed_date")
    private LocalDateTime confirmedDate;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(name = "gateway_response", length = 1000)
    private String gatewayResponse;
    
    @Column(name = "failure_reason", length = 500)
    private String failureReason;
    
    @Column(name = "notes", length = 1000)
    private String notes;
    
    // Thai-specific payment fields
    @Column(name = "bank_code", length = 10)
    private String bankCode;
    
    @Column(name = "bank_name", length = 100)
    private String bankName;
    
    @Column(name = "account_number", length = 20)
    private String accountNumber;
    
    @Column(name = "promptpay_ref", length = 50)
    private String promptpayRef;
    
    @Column(name = "slip_image_path", length = 500)
    private String slipImagePath;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "reference_number", length = 100)
    private String referenceNumber;
    
    @Column(name = "promptpay_qr_code", length = 500)
    private String promptPayQrCode;
    
    @Column(name = "bank_account_number", length = 20)
    private String bankAccountNumber;
    
    @Column(name = "credit_card_last4", length = 4)
    private String creditCardLast4;
    
    @Column(name = "credit_card_holder_name", length = 100)
    private String creditCardHolderName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_payment_id")
    private Payment originalPayment;
    
    // Constructors
    public Payment() {}
    
    public Payment(String paymentReference, BigDecimal amount, PaymentType paymentType, 
                  PaymentMethod paymentMethod) {
        this.paymentReference = paymentReference;
        this.amount = amount;
        this.paymentType = paymentType;
        this.paymentMethod = paymentMethod;
    }
    
    // Getters and Setters
    public String getPaymentReference() {
        return paymentReference;
    }
    
    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public PaymentType getPaymentType() {
        return paymentType;
    }
    
    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getConfirmedDate() {
        return confirmedDate;
    }
    
    public void setConfirmedDate(LocalDateTime confirmedDate) {
        this.confirmedDate = confirmedDate;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getGatewayResponse() {
        return gatewayResponse;
    }
    
    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getBankCode() {
        return bankCode;
    }
    
    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
    
    public String getBankName() {
        return bankName;
    }
    
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public String getPromptpayRef() {
        return promptpayRef;
    }
    
    public void setPromptpayRef(String promptpayRef) {
        this.promptpayRef = promptpayRef;
    }
    
    public String getSlipImagePath() {
        return slipImagePath;
    }
    
    public void setSlipImagePath(String slipImagePath) {
        this.slipImagePath = slipImagePath;
    }
    
    public Policy getPolicy() {
        return policy;
    }
    
    public void setPolicy(Policy policy) {
        this.policy = policy;
    }
    
    public User getProcessedBy() {
        return processedBy;
    }
    
    public void setProcessedBy(User processedBy) {
        this.processedBy = processedBy;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public String getPromptPayQrCode() {
        return promptPayQrCode;
    }
    
    public void setPromptPayQrCode(String promptPayQrCode) {
        this.promptPayQrCode = promptPayQrCode;
    }
    
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }
    
    public String getCreditCardLast4() {
        return creditCardLast4;
    }
    
    public void setCreditCardLast4(String creditCardLast4) {
        this.creditCardLast4 = creditCardLast4;
    }
    
    public String getCreditCardHolderName() {
        return creditCardHolderName;
    }
    
    public void setCreditCardHolderName(String creditCardHolderName) {
        this.creditCardHolderName = creditCardHolderName;
    }
    
    public Payment getOriginalPayment() {
        return originalPayment;
    }
    
    public void setOriginalPayment(Payment originalPayment) {
        this.originalPayment = originalPayment;
    }
    
    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate) && 
               (status == PaymentStatus.PENDING || status == PaymentStatus.FAILED);
    }
    
    public long getDaysOverdue() {
        if (!isOverdue()) return 0;
        return dueDate.until(LocalDate.now()).getDays();
    }
    
    // Enums
    public enum PaymentType {
        PREMIUM("Premium Payment"),
        REFUND("Refund"),
        CLAIM_SETTLEMENT("Claim Settlement");
        
        private final String displayName;
        
        PaymentType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PaymentMethod {
        CREDIT_CARD("Credit Card"),
        DEBIT_CARD("Debit Card"),
        BANK_TRANSFER("Bank Transfer"),
        PROMPTPAY("PromptPay"),
        QR_CODE("QR Code Payment"),
        CASH("Cash"),
        CHEQUE("Cheque");
        
        private final String displayName;
        
        PaymentMethod(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PaymentStatus {
        PENDING("Pending"),
        PROCESSING("Processing"),
        COMPLETED("Completed"),
        FAILED("Failed"),
        CANCELLED("Cancelled"),
        REFUNDED("Refunded");
        
        private final String displayName;
        
        PaymentStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}