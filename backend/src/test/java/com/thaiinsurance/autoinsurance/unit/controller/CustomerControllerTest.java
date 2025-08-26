package com.thaiinsurance.autoinsurance.unit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thaiinsurance.autoinsurance.TestDataHelper;
import com.thaiinsurance.autoinsurance.controller.CustomerController;
import com.thaiinsurance.autoinsurance.model.Customer;
import com.thaiinsurance.autoinsurance.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
@ActiveProfiles("test")
@DisplayName("Customer Controller Tests")
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    private Customer testCustomer;
    private List<Customer> customerList;

    @BeforeEach
    void setUp() {
        testCustomer = TestDataHelper.createValidCustomer();
        testCustomer.setId(1L);
        customerList = Arrays.asList(testCustomer);
    }

    @Nested
    @DisplayName("Get All Customers")
    class GetAllCustomers {

        @Test
        @DisplayName("Should get all customers when user has AGENT role")
        @WithMockUser(roles = "AGENT")
        void shouldGetAllCustomersWhenUserHasAgentRole() throws Exception {
            // Given
            when(customerService.getAllCustomers()).thenReturn(customerList);

            // When & Then
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Customers retrieved successfully"))
                    .andExpect(jsonPath("$.data[0].id").value(1))
                    .andExpect(jsonPath("$.data[0].nationalId").value(testCustomer.getNationalId()))
                    .andExpect(jsonPath("$.data[0].firstName").value(testCustomer.getFirstName()));

            verify(customerService).getAllCustomers();
        }

        @Test
        @DisplayName("Should get all customers when user has ADMIN role")
        @WithMockUser(roles = "ADMIN")
        void shouldGetAllCustomersWhenUserHasAdminRole() throws Exception {
            // Given
            when(customerService.getAllCustomers()).thenReturn(customerList);

            // When & Then
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));

            verify(customerService).getAllCustomers();
        }

        @Test
        @DisplayName("Should return forbidden when user has CUSTOMER role")
        @WithMockUser(roles = "CUSTOMER")
        void shouldReturnForbiddenWhenUserHasCustomerRole() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isForbidden());

            verify(customerService, never()).getAllCustomers();
        }

        @Test
        @DisplayName("Should return unauthorized when user is not authenticated")
        void shouldReturnUnauthorizedWhenUserIsNotAuthenticated() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isUnauthorized());

            verify(customerService, never()).getAllCustomers();
        }
    }

    @Nested
    @DisplayName("Search Customers")
    class SearchCustomers {

        @Test
        @DisplayName("Should search customers with default pagination")
        @WithMockUser(roles = "AGENT")
        void shouldSearchCustomersWithDefaultPagination() throws Exception {
            // Given
            String query = "Somchai";
            Page<Customer> customerPage = new PageImpl<>(customerList);
            when(customerService.searchCustomers(eq(query), any())).thenReturn(customerPage);

            // When & Then
            mockMvc.perform(get("/api/customers/search")
                            .param("query", query))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.content[0].firstName").value(testCustomer.getFirstName()));

            verify(customerService).searchCustomers(eq(query), any());
        }

        @Test
        @DisplayName("Should search customers with custom pagination")
        @WithMockUser(roles = "ADMIN")
        void shouldSearchCustomersWithCustomPagination() throws Exception {
            // Given
            String query = "Bangkok";
            Page<Customer> customerPage = new PageImpl<>(customerList);
            when(customerService.searchCustomers(eq(query), any())).thenReturn(customerPage);

            // When & Then
            mockMvc.perform(get("/api/customers/search")
                            .param("query", query)
                            .param("page", "1")
                            .param("size", "10")
                            .param("sortBy", "firstName")
                            .param("sortDir", "asc"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));

            verify(customerService).searchCustomers(eq(query), any());
        }

        @Test
        @DisplayName("Should return bad request for empty query")
        @WithMockUser(roles = "AGENT")
        void shouldReturnBadRequestForEmptyQuery() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/customers/search")
                            .param("query", ""))
                    .andExpect(status().isBadRequest());

            verify(customerService, never()).searchCustomers(anyString(), any());
        }
    }

    @Nested
    @DisplayName("Get Customer by ID")
    class GetCustomerById {

        @Test
        @DisplayName("Should get customer by ID when customer exists")
        @WithMockUser(roles = "AGENT")
        void shouldGetCustomerByIdWhenCustomerExists() throws Exception {
            // Given
            Long customerId = 1L;
            when(customerService.getCustomerById(customerId)).thenReturn(Optional.of(testCustomer));

            // When & Then
            mockMvc.perform(get("/api/customers/{id}", customerId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpected(jsonPath("$.data.id").value(customerId))
                    .andExpected(jsonPath("$.data.firstName").value(testCustomer.getFirstName()));

            verify(customerService).getCustomerById(customerId);
        }

        @Test
        @DisplayName("Should return not found when customer does not exist")
        @WithMockUser(roles = "AGENT")
        void shouldReturnNotFoundWhenCustomerDoesNotExist() throws Exception {
            // Given
            Long customerId = 999L;
            when(customerService.getCustomerById(customerId)).thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(get("/api/customers/{id}", customerId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));

            verify(customerService).getCustomerById(customerId);
        }

        @Test
        @DisplayName("Should return bad request for invalid ID format")
        @WithMockUser(roles = "AGENT")
        void shouldReturnBadRequestForInvalidIdFormat() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/customers/{id}", "invalid"))
                    .andExpect(status().isBadRequest());

            verify(customerService, never()).getCustomerById(anyLong());
        }
    }

    @Nested
    @DisplayName("Create Customer")
    class CreateCustomer {

        @Test
        @DisplayName("Should create customer with valid data")
        @WithMockUser(roles = "AGENT")
        void shouldCreateCustomerWithValidData() throws Exception {
            // Given
            Customer newCustomer = TestDataHelper.createValidCustomer();
            Customer savedCustomer = TestDataHelper.createValidCustomer();
            savedCustomer.setId(1L);
            
            when(customerService.createCustomer(any(Customer.class))).thenReturn(savedCustomer);

            // When & Then
            mockMvc.perform(post("/api/customers")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(newCustomer)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Customer created successfully"))
                    .andExpect(jsonPath("$.data.id").value(1));

            verify(customerService).createCustomer(any(Customer.class));
        }

        @Test
        @DisplayName("Should return bad request for invalid customer data")
        @WithMockUser(roles = "AGENT")
        void shouldReturnBadRequestForInvalidCustomerData() throws Exception {
            // Given
            Customer invalidCustomer = TestDataHelper.createInvalidCustomer();

            when(customerService.createCustomer(any(Customer.class)))
                    .thenThrow(new IllegalArgumentException("Invalid Thai National ID"));

            // When & Then
            mockMvc.perform(post("/api/customers")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidCustomer)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpected(jsonPath("$.message").value("Invalid Thai National ID"));

            verify(customerService).createCustomer(any(Customer.class));
        }

        @Test
        @DisplayName("Should return conflict for duplicate customer data")
        @WithMockUser(roles = "AGENT")
        void shouldReturnConflictForDuplicateCustomerData() throws Exception {
            // Given
            Customer duplicateCustomer = TestDataHelper.createValidCustomer();

            when(customerService.createCustomer(any(Customer.class)))
                    .thenThrow(new IllegalArgumentException("Customer with this National ID already exists"));

            // When & Then
            mockMvc.perform(post("/api/customers")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(duplicateCustomer)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.success").value(false));

            verify(customerService).createCustomer(any(Customer.class));
        }

        @Test
        @DisplayName("Should return bad request for missing required fields")
        @WithMockUser(roles = "AGENT")
        void shouldReturnBadRequestForMissingRequiredFields() throws Exception {
            // Given
            Customer incompleteCustomer = new Customer(); // Missing required fields

            // When & Then
            mockMvc.perform(post("/api/customers")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(incompleteCustomer)))
                    .andExpect(status().isBadRequest());

            verify(customerService, never()).createCustomer(any(Customer.class));
        }
    }

    @Nested
    @DisplayName("Update Customer")
    class UpdateCustomer {

        @Test
        @DisplayName("Should update customer with valid data")
        @WithMockUser(roles = "AGENT")
        void shouldUpdateCustomerWithValidData() throws Exception {
            // Given
            Long customerId = 1L;
            Customer updateData = TestDataHelper.createValidCustomer();
            updateData.setFirstName("Updated Name");
            
            Customer updatedCustomer = TestDataHelper.createValidCustomer();
            updatedCustomer.setId(customerId);
            updatedCustomer.setFirstName("Updated Name");

            when(customerService.updateCustomer(eq(customerId), any(Customer.class)))
                    .thenReturn(updatedCustomer);

            // When & Then
            mockMvc.perform(put("/api/customers/{id}", customerId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateData)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Customer updated successfully"))
                    .andExpected(jsonPath("$.data.firstName").value("Updated Name"));

            verify(customerService).updateCustomer(eq(customerId), any(Customer.class));
        }

        @Test
        @DisplayName("Should return not found when updating non-existent customer")
        @WithMockUser(roles = "AGENT")
        void shouldReturnNotFoundWhenUpdatingNonExistentCustomer() throws Exception {
            // Given
            Long customerId = 999L;
            Customer updateData = TestDataHelper.createValidCustomer();

            when(customerService.updateCustomer(eq(customerId), any(Customer.class)))
                    .thenThrow(new IllegalArgumentException("Customer not found with id: " + customerId));

            // When & Then
            mockMvc.perform(put("/api/customers/{id}", customerId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateData)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));

            verify(customerService).updateCustomer(eq(customerId), any(Customer.class));
        }

        @Test
        @DisplayName("Should return bad request for invalid update data")
        @WithMockUser(roles = "AGENT")
        void shouldReturnBadRequestForInvalidUpdateData() throws Exception {
            // Given
            Long customerId = 1L;
            Customer invalidUpdateData = TestDataHelper.createInvalidCustomer();

            when(customerService.updateCustomer(eq(customerId), any(Customer.class)))
                    .thenThrow(new IllegalArgumentException("Invalid Thai phone number"));

            // When & Then
            mockMvc.perform(put("/api/customers/{id}", customerId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidUpdateData)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));

            verify(customerService).updateCustomer(eq(customerId), any(Customer.class));
        }
    }

    @Nested
    @DisplayName("Delete Customer")
    class DeleteCustomer {

        @Test
        @DisplayName("Should delete customer successfully")
        @WithMockUser(roles = "ADMIN")
        void shouldDeleteCustomerSuccessfully() throws Exception {
            // Given
            Long customerId = 1L;
            doNothing().when(customerService).deleteCustomer(customerId);

            // When & Then
            mockMvc.perform(delete("/api/customers/{id}", customerId)
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Customer deleted successfully"));

            verify(customerService).deleteCustomer(customerId);
        }

        @Test
        @DisplayName("Should return not found when deleting non-existent customer")
        @WithMockUser(roles = "ADMIN")
        void shouldReturnNotFoundWhenDeletingNonExistentCustomer() throws Exception {
            // Given
            Long customerId = 999L;
            doThrow(new IllegalArgumentException("Customer not found with id: " + customerId))
                    .when(customerService).deleteCustomer(customerId);

            // When & Then
            mockMvc.perform(delete("/api/customers/{id}", customerId)
                            .with(csrf()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));

            verify(customerService).deleteCustomer(customerId);
        }

        @Test
        @DisplayName("Should return forbidden when user has AGENT role")
        @WithMockUser(roles = "AGENT")
        void shouldReturnForbiddenWhenUserHasAgentRole() throws Exception {
            // Given
            Long customerId = 1L;

            // When & Then
            mockMvc.perform(delete("/api/customers/{id}", customerId)
                            .with(csrf()))
                    .andExpect(status().isForbidden());

            verify(customerService, never()).deleteCustomer(anyLong());
        }
    }

    @Nested
    @DisplayName("KYC Status Management")
    class KycStatusManagement {

        @Test
        @DisplayName("Should update KYC status successfully")
        @WithMockUser(roles = "ADMIN")
        void shouldUpdateKycStatusSuccessfully() throws Exception {
            // Given
            Long customerId = 1L;
            Customer.KYCStatus newStatus = Customer.KYCStatus.VERIFIED;
            Customer updatedCustomer = TestDataHelper.createValidCustomer();
            updatedCustomer.setId(customerId);
            updatedCustomer.setKycStatus(newStatus);
            updatedCustomer.setKycVerifiedAt(LocalDate.now());

            when(customerService.updateKycStatus(customerId, newStatus)).thenReturn(updatedCustomer);

            // When & Then
            mockMvc.perform(patch("/api/customers/{id}/kyc-status", customerId)
                            .with(csrf())
                            .param("status", newStatus.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpected(jsonPath("$.data.kycStatus").value("VERIFIED"));

            verify(customerService).updateKycStatus(customerId, newStatus);
        }

        @Test
        @DisplayName("Should return bad request for invalid KYC status")
        @WithMockUser(roles = "ADMIN")
        void shouldReturnBadRequestForInvalidKycStatus() throws Exception {
            // Given
            Long customerId = 1L;
            String invalidStatus = "INVALID_STATUS";

            // When & Then
            mockMvc.perform(patch("/api/customers/{id}/kyc-status", customerId)
                            .with(csrf())
                            .param("status", invalidStatus))
                    .andExpected(status().isBadRequest());

            verify(customerService, never()).updateKycStatus(anyLong(), any());
        }

        @Test
        @DisplayName("Should get customers by KYC status")
        @WithMockUser(roles = "ADMIN")
        void shouldGetCustomersByKycStatus() throws Exception {
            // Given
            Customer.KYCStatus status = Customer.KYCStatus.PENDING;
            when(customerService.getCustomersByKycStatus(status)).thenReturn(customerList);

            // When & Then
            mockMvc.perform(get("/api/customers/kyc-status/{status}", status))
                    .andExpect(status().isOk())
                    .andExpected(jsonPath("$.success").value(true))
                    .andExpected(jsonPath("$.data").isArray());

            verify(customerService).getCustomersByKycStatus(status);
        }
    }

    @Nested
    @DisplayName("Customer Statistics")
    class CustomerStatistics {

        @Test
        @DisplayName("Should get customer statistics")
        @WithMockUser(roles = "ADMIN")
        void shouldGetCustomerStatistics() throws Exception {
            // Given
            when(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.VERIFIED)).thenReturn(10L);
            when(customerService.getCustomerCountByKycStatus(Customer.KYCStatus.PENDING)).thenReturn(5L);
            when(customerService.getNewCustomersCount(any(LocalDate.class), any(LocalDate.class))).thenReturn(8L);

            // When & Then
            mockMvc.perform(get("/api/customers/statistics"))
                    .andExpect(status().isOk())
                    .andExpected(jsonPath("$.success").value(true))
                    .andExpected(jsonPath("$.data.verifiedCustomers").value(10))
                    .andExpected(jsonPath("$.data.pendingCustomers").value(5));

            verify(customerService).getCustomerCountByKycStatus(Customer.KYCStatus.VERIFIED);
            verify(customerService).getCustomerCountByKycStatus(Customer.KYCStatus.PENDING);
        }

        @Test
        @DisplayName("Should return forbidden for statistics access with CUSTOMER role")
        @WithMockUser(roles = "CUSTOMER")
        void shouldReturnForbiddenForStatisticsAccessWithCustomerRole() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/customers/statistics"))
                    .andExpect(status().isForbidden());

            verify(customerService, never()).getCustomerCountByKycStatus(any());
        }
    }

    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {

        @Test
        @DisplayName("Should handle service layer exceptions gracefully")
        @WithMockUser(roles = "AGENT")
        void shouldHandleServiceLayerExceptionsGracefully() throws Exception {
            // Given
            when(customerService.getAllCustomers()).thenThrow(new RuntimeException("Database connection failed"));

            // When & Then
            mockMvc.perform(get("/api/customers"))
                    .andExpect(status().isInternalServerError())
                    .andExpected(jsonPath("$.success").value(false))
                    .andExpected(jsonPath("$.message").value("Database connection failed"));

            verify(customerService).getAllCustomers();
        }

        @Test
        @DisplayName("Should handle malformed JSON in request body")
        @WithMockUser(roles = "AGENT")
        void shouldHandleMalformedJsonInRequestBody() throws Exception {
            // Given
            String malformedJson = "{\"firstName\": \"John\", \"lastName\": }"; // Missing value

            // When & Then
            mockMvc.perform(post("/api/customers")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(malformedJson))
                    .andExpect(status().isBadRequest());

            verify(customerService, never()).createCustomer(any(Customer.class));
        }
    }
}