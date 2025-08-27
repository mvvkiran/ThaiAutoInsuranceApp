package com.thaiinsurance.autoinsurance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thaiinsurance.autoinsurance.security.*;
import com.thaiinsurance.autoinsurance.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Base test class for all controller tests.
 * Provides common configuration and mocked dependencies.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver", 
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.main.allow-bean-definition-overriding=true",
    "spring.jpa.show-sql=false",
    "spring.sql.init.mode=never"
})
public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    // Common security-related mock beans
    @MockBean
    protected JwtTokenUtil jwtTokenUtil;

    @MockBean
    protected JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    protected CustomUserDetailsService customUserDetailsService;

    // Service layer mock beans
    @MockBean
    protected AuthService authService;

    @MockBean
    protected CustomerService customerService;

    @MockBean
    protected PolicyService policyService;

    @MockBean
    protected ClaimService claimService;

    @MockBean
    protected com.thaiinsurance.autoinsurance.config.DataInitializer dataInitializer;

    @BeforeEach
    void baseSetUp() {
        // Common setup for all controller tests
        setupCommonMocks();
    }

    protected void setupCommonMocks() {
        // Override in subclasses for specific mock setups
    }

    protected String asJsonString(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
