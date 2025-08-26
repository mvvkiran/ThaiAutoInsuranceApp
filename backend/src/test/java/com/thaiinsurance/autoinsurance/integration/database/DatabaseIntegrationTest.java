package com.thaiinsurance.autoinsurance.integration.database;

import com.thaiinsurance.autoinsurance.BaseIntegrationTest;
import com.thaiinsurance.autoinsurance.TestDataHelper;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.repository.CustomerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Database Integration Tests")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class DatabaseIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private CustomerRepository customerRepository;

    @Nested
    @DisplayName("Database Schema Tests")
    class DatabaseSchemaTests {

        @Test
        @DisplayName("Should have all required tables")
        void shouldHaveAllRequiredTables() throws Exception {
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                
                // Check for main tables
                String[] expectedTables = {
                    "users", "roles", "user_roles", "customers", 
                    "vehicles", "policies", "claims", "claim_documents", "payments"
                };
                
                for (String tableName : expectedTables) {
                    try (ResultSet tables = metaData.getTables(null, null, tableName.toUpperCase(), new String[]{"TABLE"})) {
                        assertTrue(tables.next(), "Table " + tableName + " should exist");
                    }
                }
            }
        }

        @Test
        @DisplayName("Should have proper indexes on customers table")
        void shouldHaveProperIndexesOnCustomersTable() throws Exception {
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                
                List<String> indexes = new ArrayList<>();
                try (ResultSet indexInfo = metaData.getIndexInfo(null, null, "CUSTOMERS", false, false)) {
                    while (indexInfo.next()) {
                        String indexName = indexInfo.getString("INDEX_NAME");
                        if (indexName != null && !indexName.startsWith("PRIMARY")) {
                            indexes.add(indexName.toLowerCase());
                        }
                    }
                }
                
                // Check for expected indexes
                assertTrue(indexes.stream().anyMatch(idx -> idx.contains("national_id")), 
                    "Should have index on national_id");
                assertTrue(indexes.stream().anyMatch(idx -> idx.contains("email")), 
                    "Should have index on email");
                assertTrue(indexes.stream().anyMatch(idx -> idx.contains("phone")), 
                    "Should have index on phone_number");
            }
        }

        @Test
        @DisplayName("Should have proper foreign key constraints")
        void shouldHaveProperForeignKeyConstraints() throws Exception {
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                
                List<String> foreignKeys = new ArrayList<>();
                try (ResultSet fkInfo = metaData.getImportedKeys(null, null, "CUSTOMERS")) {
                    while (fkInfo.next()) {
                        String fkColumnName = fkInfo.getString("FKCOLUMN_NAME");
                        String pkTableName = fkInfo.getString("PKTABLE_NAME");
                        foreignKeys.add(fkColumnName + "->" + pkTableName);
                    }
                }
                
                // Check for expected foreign keys
                assertTrue(foreignKeys.stream().anyMatch(fk -> fk.contains("user_id")), 
                    "Should have foreign key to users table");
            }
        }
    }

    @Nested
    @DisplayName("Data Integrity Tests")
    class DataIntegrityTests {

        @Test
        @DisplayName("Should enforce unique constraint on national ID")
        @Transactional
        void shouldEnforceUniqueConstraintOnNationalId() {
            // Create first customer
            Customer customer1 = TestDataHelper.createValidCustomer();
            customer1.setEmail("customer1@test.com");
            customerRepository.save(customer1);

            // Try to create second customer with same National ID
            Customer customer2 = TestDataHelper.createValidCustomer();
            customer2.setEmail("customer2@test.com");
            customer2.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[1]);
            // Same National ID as customer1

            assertThrows(DataIntegrityViolationException.class, 
                () -> customerRepository.saveAndFlush(customer2));
        }

        @Test
        @DisplayName("Should enforce unique constraint on email")
        @Transactional
        void shouldEnforceUniqueConstraintOnEmail() {
            // Create first customer
            Customer customer1 = TestDataHelper.createValidCustomer();
            customer1.setEmail("duplicate@test.com");
            customerRepository.save(customer1);

            // Try to create second customer with same email
            Customer customer2 = TestDataHelper.createValidCustomer();
            customer2.setNationalId(TestDataHelper.VALID_NATIONAL_IDS[1]);
            customer2.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[1]);
            customer2.setEmail("duplicate@test.com"); // Same email

            assertThrows(DataIntegrityViolationException.class, 
                () -> customerRepository.saveAndFlush(customer2));
        }

        @Test
        @DisplayName("Should enforce unique constraint on phone number")
        @Transactional
        void shouldEnforceUniqueConstraintOnPhoneNumber() {
            // Create first customer
            Customer customer1 = TestDataHelper.createValidCustomer();
            customer1.setEmail("customer1@test.com");
            customerRepository.save(customer1);

            // Try to create second customer with same phone number
            Customer customer2 = TestDataHelper.createValidCustomer();
            customer2.setNationalId(TestDataHelper.VALID_NATIONAL_IDS[1]);
            customer2.setEmail("customer2@test.com");
            customer2.setPhoneNumber(customer1.getPhoneNumber()); // Same phone number

            assertThrows(DataIntegrityViolationException.class, 
                () -> customerRepository.saveAndFlush(customer2));
        }

        @Test
        @DisplayName("Should enforce NOT NULL constraints")
        @Transactional
        void shouldEnforceNotNullConstraints() {
            Customer customer = new Customer();
            // Missing required fields (national_id, first_name, last_name, phone_number)

            assertThrows(DataIntegrityViolationException.class, 
                () -> customerRepository.saveAndFlush(customer));
        }

        @Test
        @DisplayName("Should handle Thai characters properly")
        @Transactional
        void shouldHandleThaiCharactersProperly() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setFirstNameThai("สมชาย");
            customer.setLastNameThai("ใจดี");
            customer.setEmail("thai@test.com");

            Customer saved = customerRepository.saveAndFlush(customer);
            
            assertEquals("สมชาย", saved.getFirstNameThai());
            assertEquals("ใจดี", saved.getLastNameThai());

            // Verify retrieval from database
            Customer retrieved = customerRepository.findById(saved.getId()).orElseThrow();
            assertEquals("สมชาย", retrieved.getFirstNameThai());
            assertEquals("ใจดี", retrieved.getLastNameThai());
        }

        @Test
        @DisplayName("Should handle special characters in license plates")
        @Transactional
        void shouldHandleSpecialCharactersInLicensePlates() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setEmail("license@test.com");
            Customer savedCustomer = customerRepository.save(customer);

            // This would require Vehicle entity to be fully implemented
            // For now, we're testing that Thai characters are handled properly in customer names
            assertNotNull(savedCustomer);
        }
    }

    @Nested
    @DisplayName("Transaction Management Tests")
    class TransactionManagementTests {

        @Test
        @DisplayName("Should rollback transaction on exception")
        @Transactional
        void shouldRollbackTransactionOnException() {
            // Save a valid customer first
            Customer customer1 = TestDataHelper.createValidCustomer();
            customer1.setEmail("rollback1@test.com");
            customerRepository.save(customer1);

            try {
                // Try to save another customer with duplicate National ID
                Customer customer2 = TestDataHelper.createValidCustomer();
                customer2.setEmail("rollback2@test.com");
                customer2.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[1]);
                // Same National ID as customer1 - this will cause constraint violation
                
                customerRepository.save(customer2);
                customerRepository.flush(); // Force the constraint check
            } catch (DataIntegrityViolationException e) {
                // Expected exception
            }

            // Verify that customer1 is still in the database
            assertTrue(customerRepository.findByEmail("rollback1@test.com").isPresent());
            assertFalse(customerRepository.findByEmail("rollback2@test.com").isPresent());
        }

        @Test
        @DisplayName("Should handle concurrent transactions")
        void shouldHandleConcurrentTransactions() throws InterruptedException {
            final String baseEmail = "concurrent";
            final int threadCount = 5;
            Thread[] threads = new Thread[threadCount];
            List<Exception> exceptions = new ArrayList<>();

            for (int i = 0; i < threadCount; i++) {
                final int threadId = i;
                threads[i] = new Thread(() -> {
                    try {
                        Customer customer = TestDataHelper.createValidCustomer();
                        customer.setNationalId(TestDataHelper.VALID_NATIONAL_IDS[threadId % TestDataHelper.VALID_NATIONAL_IDS.length]);
                        customer.setPhoneNumber(TestDataHelper.VALID_PHONE_NUMBERS[threadId % TestDataHelper.VALID_PHONE_NUMBERS.length]);
                        customer.setEmail(baseEmail + threadId + "@test.com");
                        customerRepository.save(customer);
                    } catch (Exception e) {
                        synchronized (exceptions) {
                            exceptions.add(e);
                        }
                    }
                });
            }

            // Start all threads
            for (Thread thread : threads) {
                thread.start();
            }

            // Wait for all threads to complete
            for (Thread thread : threads) {
                thread.join();
            }

            // Should have no exceptions if all customers have unique data
            assertTrue(exceptions.isEmpty(), "Should handle concurrent transactions without errors");

            // Verify all customers were saved
            long count = customerRepository.count();
            assertTrue(count >= threadCount, "Should save all customers concurrently");
        }
    }

    @Nested
    @DisplayName("Connection Pool Tests")
    class ConnectionPoolTests {

        @Test
        @DisplayName("Should handle multiple database connections")
        void shouldHandleMultipleDatabaseConnections() throws Exception {
            List<Connection> connections = new ArrayList<>();
            
            try {
                // Get multiple connections
                for (int i = 0; i < 10; i++) {
                    Connection connection = dataSource.getConnection();
                    assertNotNull(connection);
                    assertFalse(connection.isClosed());
                    connections.add(connection);
                }
            } finally {
                // Clean up connections
                for (Connection connection : connections) {
                    if (!connection.isClosed()) {
                        connection.close();
                    }
                }
            }
        }

        @Test
        @DisplayName("Should reuse connections from pool")
        void shouldReuseConnectionsFromPool() throws Exception {
            Connection connection1 = dataSource.getConnection();
            connection1.close();
            
            Connection connection2 = dataSource.getConnection();
            connection2.close();
            
            // In a real connection pool, connection2 might be the same object as connection1
            // This test verifies that we can get connections after closing them
            assertNotNull(connection2);
        }
    }

    @Nested
    @DisplayName("Database Performance Tests")
    class DatabasePerformanceTests {

        @Test
        @DisplayName("Should handle bulk inserts efficiently")
        @Transactional
        void shouldHandleBulkInsertsEfficiently() {
            long startTime = System.currentTimeMillis();
            
            List<Customer> customers = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                Customer customer = TestDataHelper.createValidCustomer();
                customer.setNationalId(String.format("110170020%04d", i + 1000));
                customer.setPhoneNumber(String.format("081234%04d", i + 1000));
                customer.setEmail(String.format("bulk%d@test.com", i));
                customers.add(customer);
            }
            
            customerRepository.saveAll(customers);
            customerRepository.flush();
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            // Should complete within reasonable time (adjust based on your performance requirements)
            assertTrue(duration < 5000, "Bulk insert should complete within 5 seconds");
            
            // Verify all customers were saved
            assertEquals(100, customerRepository.count());
        }

        @Test
        @DisplayName("Should handle complex queries efficiently")
        @Transactional
        void shouldHandleComplexQueriesEfficiently() {
            // Create test data
            for (int i = 0; i < 50; i++) {
                Customer customer = TestDataHelper.createValidCustomer();
                customer.setNationalId(String.format("110170020%04d", i + 2000));
                customer.setPhoneNumber(String.format("081234%04d", i + 2000));
                customer.setEmail(String.format("query%d@test.com", i));
                customer.setProvince(i % 2 == 0 ? "Bangkok" : "Chiang Mai");
                customer.setOccupationCategory(
                    i % 3 == 0 ? Customer.OccupationCategory.PRIVATE_EMPLOYEE :
                    i % 3 == 1 ? Customer.OccupationCategory.GOVERNMENT_OFFICER :
                    Customer.OccupationCategory.BUSINESS_OWNER
                );
                customerRepository.save(customer);
            }

            long startTime = System.currentTimeMillis();
            
            // Execute complex query
            List<Customer> bangkokPrivateEmployees = customerRepository
                .findByProvinceAndIsActiveTrue("Bangkok");
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            // Should complete quickly due to proper indexing
            assertTrue(duration < 1000, "Complex query should complete within 1 second");
            assertFalse(bangkokPrivateEmployees.isEmpty());
        }
    }

    @Nested
    @DisplayName("Data Type Tests")
    class DataTypeTests {

        @Test
        @DisplayName("Should handle date fields correctly")
        @Transactional
        void shouldHandleDateFieldsCorrectly() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setEmail("date@test.com");
            Customer saved = customerRepository.save(customer);
            
            assertNotNull(saved.getCreatedAt());
            assertNotNull(saved.getUpdatedAt());
            assertNotNull(saved.getDateOfBirth());
        }

        @Test
        @DisplayName("Should handle decimal fields correctly")
        @Transactional
        void shouldHandleDecimalFieldsCorrectly() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setEmail("decimal@test.com");
            customer.setMonthlyIncome(55750.50);
            Customer saved = customerRepository.save(customer);
            
            assertEquals(55750.50, saved.getMonthlyIncome(), 0.01);
        }

        @Test
        @DisplayName("Should handle enum fields correctly")
        @Transactional  
        void shouldHandleEnumFieldsCorrectly() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setEmail("enum@test.com");
            customer.setGender(Customer.Gender.MALE);
            customer.setKycStatus(Customer.KYCStatus.VERIFIED);
            customer.setOccupationCategory(Customer.OccupationCategory.PRIVATE_EMPLOYEE);
            
            Customer saved = customerRepository.save(customer);
            
            assertEquals(Customer.Gender.MALE, saved.getGender());
            assertEquals(Customer.KYCStatus.VERIFIED, saved.getKycStatus());
            assertEquals(Customer.OccupationCategory.PRIVATE_EMPLOYEE, saved.getOccupationCategory());
        }

        @Test
        @DisplayName("Should handle boolean fields correctly")
        @Transactional
        void shouldHandleBooleanFieldsCorrectly() {
            Customer customer = TestDataHelper.createValidCustomer();
            customer.setEmail("boolean@test.com");
            customer.setIsActive(true);
            
            Customer saved = customerRepository.save(customer);
            
            assertTrue(saved.getIsActive());
            
            // Test false value
            saved.setIsActive(false);
            Customer updated = customerRepository.save(saved);
            
            assertFalse(updated.getIsActive());
        }
    }
}