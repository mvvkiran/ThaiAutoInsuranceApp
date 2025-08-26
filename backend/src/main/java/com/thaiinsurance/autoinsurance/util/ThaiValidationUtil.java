package com.thaiinsurance.autoinsurance.util;

import java.util.regex.Pattern;

public class ThaiValidationUtil {
    
    // Thai National ID validation pattern
    private static final Pattern THAI_NATIONAL_ID_PATTERN = Pattern.compile("^[0-9]{13}$");
    
    // Thai phone number validation pattern
    private static final Pattern THAI_PHONE_PATTERN = Pattern.compile("^[0-9]{10}$");
    
    // Thai postal code validation pattern
    private static final Pattern THAI_POSTAL_CODE_PATTERN = Pattern.compile("^[0-9]{5}$");
    
    // Thai license plate patterns (simplified)
    private static final Pattern THAI_LICENSE_PLATE_PATTERN = Pattern.compile("^[ก-๏0-9A-Z\\s]{1,10}$");
    
    /**
     * Validates Thai National ID using checksum algorithm
     */
    public static boolean isValidThaiNationalId(String nationalId) {
        if (nationalId == null || !THAI_NATIONAL_ID_PATTERN.matcher(nationalId).matches()) {
            return false;
        }
        
        // Calculate checksum using Thai National ID algorithm
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(nationalId.charAt(i)) * (13 - i);
        }
        
        int remainder = sum % 11;
        int expectedCheckDigit;
        if (remainder < 2) {
            expectedCheckDigit = 1 - remainder;
        } else {
            expectedCheckDigit = 11 - remainder;
        }
        
        int actualCheckDigit = Character.getNumericValue(nationalId.charAt(12));
        return expectedCheckDigit == actualCheckDigit;
    }
    
    /**
     * Validates Thai phone number format
     */
    public static boolean isValidThaiPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || !THAI_PHONE_PATTERN.matcher(phoneNumber).matches()) {
            return false;
        }
        
        // Check if it starts with valid Thai mobile prefixes
        String prefix = phoneNumber.substring(0, 2);
        return prefix.equals("08") || prefix.equals("09") || prefix.equals("06") || prefix.equals("07");
    }
    
    /**
     * Validates Thai postal code
     */
    public static boolean isValidThaiPostalCode(String postalCode) {
        if (postalCode == null || !THAI_POSTAL_CODE_PATTERN.matcher(postalCode).matches()) {
            return false;
        }
        
        // Check if postal code is in valid range (10000-99999)
        int code = Integer.parseInt(postalCode);
        return code >= 10000 && code <= 99999;
    }
    
    /**
     * Validates Thai license plate format (simplified)
     */
    public static boolean isValidThaiLicensePlate(String licensePlate) {
        if (licensePlate == null) {
            return false;
        }
        
        String trimmed = licensePlate.trim();
        return THAI_LICENSE_PLATE_PATTERN.matcher(trimmed).matches() && 
               trimmed.length() >= 3 && trimmed.length() <= 10;
    }
    
    /**
     * Formats Thai phone number for display
     */
    public static String formatThaiPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() != 10) {
            return phoneNumber;
        }
        
        return phoneNumber.substring(0, 3) + "-" + 
               phoneNumber.substring(3, 6) + "-" + 
               phoneNumber.substring(6);
    }
    
    /**
     * Formats Thai National ID for display
     */
    public static String formatThaiNationalId(String nationalId) {
        if (nationalId == null || nationalId.length() != 13) {
            return nationalId;
        }
        
        return nationalId.substring(0, 1) + "-" +
               nationalId.substring(1, 5) + "-" +
               nationalId.substring(5, 10) + "-" +
               nationalId.substring(10, 12) + "-" +
               nationalId.substring(12);
    }
    
    /**
     * Removes formatting from Thai National ID
     */
    public static String cleanThaiNationalId(String nationalId) {
        if (nationalId == null) {
            return null;
        }
        return nationalId.replaceAll("[^0-9]", "");
    }
    
    /**
     * Removes formatting from Thai phone number
     */
    public static String cleanThaiPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }
        return phoneNumber.replaceAll("[^0-9]", "");
    }
    
    /**
     * Validates Thai bank account number (basic validation)
     */
    public static boolean isValidThaiBankAccount(String accountNumber) {
        if (accountNumber == null) {
            return false;
        }
        
        String cleaned = accountNumber.replaceAll("[^0-9]", "");
        return cleaned.length() >= 10 && cleaned.length() <= 15;
    }
    
    /**
     * Gets province name from postal code (basic mapping)
     */
    public static String getProvinceFromPostalCode(String postalCode) {
        if (!isValidThaiPostalCode(postalCode)) {
            return null;
        }
        
        String prefix = postalCode.substring(0, 2);
        
        // Basic mapping of postal code prefixes to provinces
        switch (prefix) {
            case "10": return "Bangkok";
            case "11": return "Samut Prakan";
            case "12": return "Nonthaburi";
            case "13": return "Pathum Thani";
            case "20": return "Chonburi";
            case "21": return "Rayong";
            case "30": return "Nakhon Ratchasima";
            case "40": return "Khon Kaen";
            case "50": return "Chiang Mai";
            case "60": return "Nakhon Sawan";
            case "70": return "Ratchaburi";
            case "80": return "Nakhon Si Thammarat";
            case "90": return "Songkhla";
            default: return "Unknown";
        }
    }
}