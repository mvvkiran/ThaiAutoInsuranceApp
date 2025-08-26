package com.thaiinsurance.autoinsurance.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class NumberGeneratorUtil {
    
    private static final AtomicLong policyCounter = new AtomicLong(1);
    private static final AtomicLong claimCounter = new AtomicLong(1);
    private static final AtomicLong paymentCounter = new AtomicLong(1);
    
    private static final Random random = new Random();
    
    /**
     * Generates a unique policy number
     * Format: POL-YYYYMMDD-XXXXXX
     */
    public String generatePolicyNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%06d", policyCounter.getAndIncrement());
        return "POL-" + dateStr + "-" + sequence;
    }
    
    /**
     * Generates a unique claim number
     * Format: CLM-YYYYMMDD-XXXXXX
     */
    public String generateClaimNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%06d", claimCounter.getAndIncrement());
        return "CLM-" + dateStr + "-" + sequence;
    }
    
    /**
     * Generates a unique payment reference
     * Format: PAY-YYYYMMDD-XXXXXX
     */
    public String generatePaymentReference() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%06d", paymentCounter.getAndIncrement());
        return "PAY-" + dateStr + "-" + sequence;
    }
    
    /**
     * Generates a random transaction ID
     * Format: TXN-XXXXXXXXXXXX (12 digit random number)
     */
    public String generateTransactionId() {
        long randomNum = 100000000000L + (long)(random.nextDouble() * 900000000000L);
        return "TXN-" + randomNum;
    }
    
    /**
     * Generates a PromptPay reference number
     * Format: PPXXXXXXXXXXXXXXXX (18 digits total)
     */
    public String generatePromptPayReference() {
        StringBuilder sb = new StringBuilder("PP");
        for (int i = 0; i < 16; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    
    /**
     * Generates a random OTP (One Time Password)
     */
    public String generateOTP(int length) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
    
    /**
     * Generates a customer reference number
     * Format: CUST-XXXXXXXXXX
     */
    public String generateCustomerReference() {
        long timestamp = System.currentTimeMillis();
        long randomNum = random.nextInt(10000);
        return "CUST-" + (timestamp % 1000000) + String.format("%04d", randomNum);
    }
    
    /**
     * Validates if a policy number follows the correct format
     */
    public boolean isValidPolicyNumberFormat(String policyNumber) {
        if (policyNumber == null) {
            return false;
        }
        return policyNumber.matches("^POL-\\d{8}-\\d{6}$");
    }
    
    /**
     * Validates if a claim number follows the correct format
     */
    public boolean isValidClaimNumberFormat(String claimNumber) {
        if (claimNumber == null) {
            return false;
        }
        return claimNumber.matches("^CLM-\\d{8}-\\d{6}$");
    }
    
    /**
     * Validates if a payment reference follows the correct format
     */
    public boolean isValidPaymentReferenceFormat(String paymentReference) {
        if (paymentReference == null) {
            return false;
        }
        return paymentReference.matches("^PAY-\\d{8}-\\d{6}$");
    }
}