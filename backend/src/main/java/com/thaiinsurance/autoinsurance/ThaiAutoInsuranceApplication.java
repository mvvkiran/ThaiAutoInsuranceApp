package com.thaiinsurance.autoinsurance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableTransactionManagement
public class ThaiAutoInsuranceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThaiAutoInsuranceApplication.class, args);
    }
}