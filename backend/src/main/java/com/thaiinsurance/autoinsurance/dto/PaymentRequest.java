package com.thaiinsurance.autoinsurance.dto;

import com.thaiinsurance.autoinsurance.model.Payment;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * DTO for Payment Request
 */
public class PaymentRequest {
    
    @NotNull(message = "Policy ID is required")
    private Long policyId;
    
    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod paymentMethod;
    
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String promptPayQrCode;
    
    private String bankAccountNumber;
    
    private String bankCode;
    
    private String creditCardNumber;
    
    private String creditCardHolderName;
    
    private String creditCardExpiry;
    
    private String creditCardCvv;
    
    private Integer installmentMonths;
    
    private String referenceNumber;
    
    private String notes;
    
    // For PromptPay
    private String promptPayPhoneNumber;
    
    private String promptPayNationalId;
    
    // For bank transfer
    private String transferSlipImage;
    
    private String transferDateTime;
    
    // For e-wallet
    private String eWalletType;
    
    private String eWalletPhoneNumber;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(Long policyId, Payment.PaymentMethod paymentMethod, BigDecimal amount) {
        this.policyId = policyId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
    }
    
    // Getters and Setters
    public Long getPolicyId() {
        return policyId;
    }
    
    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }
    
    public Payment.PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(Payment.PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
    
    public String getBankCode() {
        return bankCode;
    }
    
    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
    
    public String getCreditCardNumber() {
        return creditCardNumber;
    }
    
    public void setCreditCardNumber(String creditCardNumber) {
        this.creditCardNumber = creditCardNumber;
    }
    
    public String getCreditCardHolderName() {
        return creditCardHolderName;
    }
    
    public void setCreditCardHolderName(String creditCardHolderName) {
        this.creditCardHolderName = creditCardHolderName;
    }
    
    public String getCreditCardExpiry() {
        return creditCardExpiry;
    }
    
    public void setCreditCardExpiry(String creditCardExpiry) {
        this.creditCardExpiry = creditCardExpiry;
    }
    
    public String getCreditCardCvv() {
        return creditCardCvv;
    }
    
    public void setCreditCardCvv(String creditCardCvv) {
        this.creditCardCvv = creditCardCvv;
    }
    
    public Integer getInstallmentMonths() {
        return installmentMonths;
    }
    
    public void setInstallmentMonths(Integer installmentMonths) {
        this.installmentMonths = installmentMonths;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getPromptPayPhoneNumber() {
        return promptPayPhoneNumber;
    }
    
    public void setPromptPayPhoneNumber(String promptPayPhoneNumber) {
        this.promptPayPhoneNumber = promptPayPhoneNumber;
    }
    
    public String getPromptPayNationalId() {
        return promptPayNationalId;
    }
    
    public void setPromptPayNationalId(String promptPayNationalId) {
        this.promptPayNationalId = promptPayNationalId;
    }
    
    public String getTransferSlipImage() {
        return transferSlipImage;
    }
    
    public void setTransferSlipImage(String transferSlipImage) {
        this.transferSlipImage = transferSlipImage;
    }
    
    public String getTransferDateTime() {
        return transferDateTime;
    }
    
    public void setTransferDateTime(String transferDateTime) {
        this.transferDateTime = transferDateTime;
    }
    
    public String geteWalletType() {
        return eWalletType;
    }
    
    public void seteWalletType(String eWalletType) {
        this.eWalletType = eWalletType;
    }
    
    public String geteWalletPhoneNumber() {
        return eWalletPhoneNumber;
    }
    
    public void seteWalletPhoneNumber(String eWalletPhoneNumber) {
        this.eWalletPhoneNumber = eWalletPhoneNumber;
    }
}