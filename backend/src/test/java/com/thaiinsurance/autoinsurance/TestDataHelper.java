package com.thaiinsurance.autoinsurance;

import com.thaiinsurance.autoinsurance.model.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Helper class to create test data with realistic Thai context
 */
public class TestDataHelper {

    // Valid Thai National IDs with correct checksums
    public static final String[] VALID_NATIONAL_IDS = {
        "1101700207366", // Valid checksum (corrected)
        "1234567890121", // Valid checksum
        "1111111111119", // Valid checksum
        "2222222222227", // Valid checksum
        "3333333333335"  // Valid checksum
    };
    
    // Invalid Thai National IDs
    public static final String[] INVALID_NATIONAL_IDS = {
        "1101700207365", // Invalid checksum
        "1101700207373", // Invalid checksum
        "110170020736",  // Too short
        "11017002073644", // Too long
        "abc1700207364", // Non-numeric
        ""               // Empty
    };
    
    // Valid Thai phone numbers
    public static final String[] VALID_PHONE_NUMBERS = {
        "0812345678", // AIS
        "0898765432", // True
        "0651234567", // DTAC
        "0756789012", // True
        "0934567890"  // AIS
    };
    
    // Invalid Thai phone numbers
    public static final String[] INVALID_PHONE_NUMBERS = {
        "081234567",   // Too short
        "08123456789", // Too long
        "0412345678",  // Invalid prefix
        "1812345678",  // Invalid starting digit
        "abc2345678"   // Non-numeric
    };
    
    // Valid Thai postal codes
    public static final String[] VALID_POSTAL_CODES = {
        "10110", // Bangkok
        "10900", // Bangkok
        "50000", // Chiang Mai
        "30000", // Nakhon Ratchasima
        "80000"  // Nakhon Si Thammarat
    };
    
    // Invalid Thai postal codes
    public static final String[] INVALID_POSTAL_CODES = {
        "1011",   // Too short
        "101100", // Too long
        "00000",  // Invalid range
        "100000"  // Too long
    };
    
    // Valid Thai license plates
    public static final String[] VALID_LICENSE_PLATES = {
        "กก 1234",
        "ขข 5678", 
        "คค 9012",
        "ABC 123",
        "1กข 234",
        "มท 4567"
    };

    /**
     * Creates a valid test customer with Thai context
     */
    public static Customer createValidCustomer() {
        Customer customer = new Customer();
        customer.setNationalId(VALID_NATIONAL_IDS[0]);
        customer.setFirstName("Somchai");
        customer.setLastName("Jaidee");
        customer.setFirstNameThai("สมชาย");
        customer.setLastNameThai("ใจดี");
        customer.setDateOfBirth(LocalDate.of(1985, 5, 15));
        customer.setGender(Customer.Gender.MALE);
        customer.setPhoneNumber(VALID_PHONE_NUMBERS[0]);
        customer.setEmail("somchai.test@example.com");
        customer.setAddressLine1("123 Sukhumvit Road");
        customer.setDistrict("Watthana");
        customer.setProvince("Bangkok");
        customer.setPostalCode(VALID_POSTAL_CODES[0]);
        customer.setOccupationCategory(Customer.OccupationCategory.PRIVATE_EMPLOYEE);
        customer.setOccupationDetail("Software Engineer");
        customer.setMonthlyIncome(50000.0);
        customer.setKycStatus(Customer.KYCStatus.VERIFIED);
        customer.setIsActive(true);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customer;
    }

    /**
     * Creates a test customer with minimal required fields
     */
    public static Customer createMinimalCustomer() {
        Customer customer = new Customer();
        customer.setNationalId(VALID_NATIONAL_IDS[1]);
        customer.setFirstName("Malee");
        customer.setLastName("Sunthorn");
        customer.setPhoneNumber(VALID_PHONE_NUMBERS[1]);
        customer.setKycStatus(Customer.KYCStatus.PENDING);
        customer.setIsActive(true);
        return customer;
    }

    /**
     * Creates a test vehicle
     */
    public static Vehicle createValidVehicle() {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(VALID_LICENSE_PLATES[0]);
        vehicle.setVehicleType(Vehicle.VehicleType.SEDAN);
        vehicle.setMake("Toyota");
        vehicle.setModel("Vios");
        vehicle.setYear(2020);
        vehicle.setEngineSize(1500.0);
        vehicle.setFuelType(Vehicle.FuelType.GASOLINE);
        vehicle.setColor("White");
        vehicle.setChassisNumber("JTDBR32E500123456");
        vehicle.setEngineNumber("NZ12345678");
        vehicle.setRegistrationDate(LocalDate.of(2020, 1, 15));
        vehicle.setUsageType(Vehicle.UsageType.PRIVATE);
        vehicle.setIsActive(true);
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setUpdatedAt(LocalDateTime.now());
        return vehicle;
    }

    /**
     * Creates a test policy
     */
    public static Policy createValidPolicy() {
        Policy policy = new Policy();
        policy.setPolicyNumber("POL-TEST-001");
        policy.setPolicyType(Policy.PolicyType.VOLUNTARY);
        policy.setCoverageType(Policy.CoverageType.COMPREHENSIVE);
        policy.setStartDate(LocalDate.now());
        policy.setEndDate(LocalDate.now().plusYears(1));
        policy.setPremiumAmount(new BigDecimal("15000.00"));
        policy.setSumInsured(new BigDecimal("550000.00"));
        policy.setDeductible(new BigDecimal("5000.00"));
        policy.setStatus(Policy.PolicyStatus.ACTIVE);
        policy.setCreatedAt(LocalDateTime.now());
        policy.setUpdatedAt(LocalDateTime.now());
        return policy;
    }

    /**
     * Creates a test claim
     */
    public static Claim createValidClaim() {
        Claim claim = new Claim();
        claim.setClaimNumber("CLM-TEST-001");
        claim.setIncidentType(Claim.IncidentType.COLLISION);
        claim.setIncidentDate(LocalDate.now().minusDays(5));
        claim.setReportedDate(LocalDate.now().minusDays(4));
        claim.setIncidentLocation("Sukhumvit Road, Bangkok");
        claim.setIncidentDescription("Minor collision with another vehicle");
        claim.setEstimatedAmount(new BigDecimal("25000.00"));
        claim.setStatus(Claim.ClaimStatus.SUBMITTED);
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());
        return claim;
    }

    /**
     * Creates a test payment
     */
    public static Payment createValidPayment() {
        Payment payment = new Payment();
        payment.setPaymentReference("PAY-TEST-001");
        payment.setAmount(new BigDecimal("15000.00"));
        payment.setPaymentDate(LocalDateTime.now());
        payment.setDueDate(LocalDate.now().plusDays(15));
        payment.setPaymentMethod(Payment.PaymentMethod.BANK_TRANSFER);
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return payment;
    }

    /**
     * Creates a test user
     */
    public static User createValidUser() {
        User user = new User();
        user.setUsername("test.user");
        user.setEmail("test.user@example.com");
        user.setPassword("$2a$10$dXJ3SW6G7P6.E92wLJOCU.GbQY3JQ7TG5iNJP9Zr2jXb8Y5fQ8Z9W");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    /**
     * Gets a test role
     */
    public static Role createValidRole() {
        return Role.CUSTOMER;
    }

    /**
     * Creates a complete customer with associated entities
     */
    public static Customer createCompleteCustomer() {
        Customer customer = createValidCustomer();
        
        // Add vehicles
        List<Vehicle> vehicles = new ArrayList<>();
        Vehicle vehicle = createValidVehicle();
        vehicle.setCustomer(customer);
        vehicles.add(vehicle);
        customer.setVehicles(vehicles);
        
        // Add policies
        List<Policy> policies = new ArrayList<>();
        Policy policy = createValidPolicy();
        policy.setCustomer(customer);
        policy.setVehicle(vehicle);
        policies.add(policy);
        customer.setPolicies(policies);
        
        return customer;
    }

    /**
     * Creates a list of Thai provinces for testing
     */
    public static List<String> getThaiProvinces() {
        List<String> provinces = new ArrayList<>();
        provinces.add("Bangkok");
        provinces.add("Chiang Mai");
        provinces.add("Nakhon Ratchasima");
        provinces.add("Khon Kaen");
        provinces.add("Chonburi");
        provinces.add("Rayong");
        provinces.add("Nakhon Sawan");
        provinces.add("Ratchaburi");
        provinces.add("Nakhon Si Thammarat");
        provinces.add("Songkhla");
        return provinces;
    }

    /**
     * Creates invalid data for negative testing
     */
    public static Customer createInvalidCustomer() {
        Customer customer = new Customer();
        customer.setNationalId(INVALID_NATIONAL_IDS[0]); // Invalid checksum
        customer.setFirstName(""); // Empty first name
        customer.setLastName("A"); // Too short last name
        customer.setPhoneNumber(INVALID_PHONE_NUMBERS[0]); // Invalid phone
        customer.setPostalCode(INVALID_POSTAL_CODES[0]); // Invalid postal code
        return customer;
    }
}