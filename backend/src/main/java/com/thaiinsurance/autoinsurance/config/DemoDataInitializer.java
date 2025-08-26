package com.thaiinsurance.autoinsurance.config;

import com.thaiinsurance.autoinsurance.model.*;
import com.thaiinsurance.autoinsurance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Demo data initializer for H2 in-memory database
 */
@Component
@Profile({"dev", "demo"})
public class DemoDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
        initializeSampleData();
        System.out.println("✅ Demo data initialization completed!");
    }

    private void initializeRoles() {
        // Create admin user
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@thaiinsurance.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            admin.setEmailVerified(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin/admin123");
        }

        // Create customer user
        if (userRepository.findByUsername("customer").isEmpty()) {
            User customer = new User();
            customer.setUsername("customer");
            customer.setEmail("customer@example.com");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setRole(Role.CUSTOMER);
            customer.setIsActive(true);
            customer.setEmailVerified(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            userRepository.save(customer);
            System.out.println("✅ Customer user created: customer/customer123");
        }
    }

    private void initializeUsers() {
        // Create agent user
        if (userRepository.findByUsername("agent").isEmpty()) {
            User agent = new User();
            agent.setUsername("agent");
            agent.setEmail("agent@thaiinsurance.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setRole(Role.AGENT);
            agent.setIsActive(true);
            agent.setEmailVerified(true);
            agent.setCreatedAt(LocalDateTime.now());
            agent.setUpdatedAt(LocalDateTime.now());
            userRepository.save(agent);
            System.out.println("✅ Agent user created: agent/agent123");
        }
    }

    private void initializeSampleData() {
        try {
            // Create sample customer
            Customer customer = new Customer();
            customer.setNationalId("1234567890123");
            customer.setFirstName("สมชาย");
            customer.setLastName("ใจดี");
            customer.setFirstNameEn("Somchai");
            customer.setLastNameEn("Jaidee");
            customer.setEmail("somchai@example.com");
            customer.setPhoneNumber("0812345678");
            customer.setDateOfBirth(LocalDate.of(1985, 5, 15));
            customer.setGender(Customer.Gender.MALE);
            customer.setOccupationCategory(Customer.OccupationCategory.PRIVATE_EMPLOYEE);
            customer.setMonthlyIncome(50000.0);
            customer.setAddress("123 ถนนสุขุมวิท");
            customer.setDistrict("วัฒนา");
            customer.setProvince("กรุงเทพมหานคร");
            customer.setPostalCode("10110");
            customer.setKycStatus(Customer.KYCStatus.VERIFIED);
            customer.setIsActive(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            customer = customerRepository.save(customer);

            // Create sample vehicle
            Vehicle vehicle = new Vehicle();
            vehicle.setCustomer(customer);
            vehicle.setLicensePlate("กก 1234");
            vehicle.setChassisNumber("JH4DC4340RS000123");
            vehicle.setEngineNumber("D15B7123456");
            vehicle.setMake("Honda");
            vehicle.setModel("Civic");
            vehicle.setYear(2020);
            vehicle.setEngineSize(1.5);
            vehicle.setFuelType(Vehicle.FuelType.GASOLINE);
            vehicle.setColor("White");
            vehicle.setSeatingCapacity(5);
            vehicle.setMarketValue(750000.0);
            vehicle.setRegistrationDate(LocalDate.of(2020, 3, 15));
            vehicle.setVehicleType(Vehicle.VehicleType.SEDAN);
            vehicle.setUsageType(Vehicle.UsageType.PRIVATE);
            vehicle.setIsActive(true);
            vehicle.setCreatedAt(LocalDateTime.now());
            vehicle.setUpdatedAt(LocalDateTime.now());
            vehicleRepository.save(vehicle);

            System.out.println("✅ Sample customer and vehicle created");
            
        } catch (Exception e) {
            System.out.println("⚠️ Sample data creation failed (this is normal if repositories are not fully implemented): " + e.getMessage());
        }
    }
}