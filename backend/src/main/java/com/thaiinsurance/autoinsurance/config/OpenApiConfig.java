package com.thaiinsurance.autoinsurance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Thai Auto Insurance API")
                        .description("Comprehensive auto insurance management system for Thailand market")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Thai Insurance Development Team")
                                .email("api-support@thaiinsurance.com")
                                .url("https://thaiinsurance.com"))
                        .license(new License()
                                .name("Private License")
                                .url("https://thaiinsurance.com/license")))
                .servers(getServerList())
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT Authentication token")));
    }
    
    private List<Server> getServerList() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development server");
        
        Server stagingServer = new Server();
        stagingServer.setUrl("https://api-staging.thaiinsurance.com");
        stagingServer.setDescription("Staging server");
        
        Server prodServer = new Server();
        prodServer.setUrl("https://api.thaiinsurance.com");
        prodServer.setDescription("Production server");
        
        return Arrays.asList(devServer, stagingServer, prodServer);
    }
}