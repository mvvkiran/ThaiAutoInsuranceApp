# Thai Auto Insurance Integration Design

## 1. Integration Architecture Overview

### 1.1 Integration Patterns and Principles
The Thai Auto Insurance application follows enterprise integration patterns to ensure reliable, secure, and scalable connections with external systems:

- **API-First Architecture**: All integrations use REST APIs with OpenAPI specifications
- **Event-Driven Architecture**: Asynchronous processing using message queues
- **Circuit Breaker Pattern**: Fault tolerance for external service failures
- **Retry and Backoff Strategy**: Resilient error handling
- **Data Transformation**: Standardized mapping between internal and external data formats
- **Security by Design**: All integrations implement authentication, authorization, and encryption

### 1.2 Integration Landscape

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        External Integration Layer                       │
│                                                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐   │
│  │   Government    │ │    Payment      │ │    Communication        │   │
│  │   Services      │ │    Gateways     │ │    Services             │   │
│  │                 │ │                 │ │                         │   │
│  │ • DLT Vehicle   │ │ • Credit Cards  │ │ • SMS Services          │   │
│  │   Verification  │ │ • PromptPay     │ │ • Email Services        │   │
│  │ • OIC Reporting │ │ • Digital       │ │ • Push Notifications    │   │
│  │ • Bank of       │ │   Wallets       │ │ • LINE Notify           │   │
│  │   Thailand APIs │ │ • Bank Transfer │ │                         │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────────────┘   │
└─────────────┬─────────────────┬─────────────────┬─────────────────────────┘
              │                 │                 │
┌─────────────┴─────────────────┴─────────────────┴─────────────────────────┐
│                        Integration Hub                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    API Gateway                                  │   │
│  │  • Request/Response Transformation                             │   │
│  │  • Authentication & Authorization                              │   │
│  │  • Rate Limiting & Throttling                                  │   │
│  │  • Circuit Breaker Implementation                              │   │
│  │  • Request/Response Logging                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                Message Queue System                             │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │   │
│  │  │   Apache    │ │   Redis     │ │   Dead      │ │   Event     │ │   │
│  │  │   Kafka     │ │   Pub/Sub   │ │   Letter    │ │   Store     │ │   │
│  │  │             │ │             │ │   Queue     │ │             │ │   │
│  │  │ • Async     │ │ • Real-time │ │ • Failed    │ │ • Event     │ │   │
│  │  │   Events    │ │   Comms     │ │   Messages  │ │   Sourcing  │ │   │
│  │  │ • Audit     │ │ • Session   │ │ • Retry     │ │ • Analytics │ │   │
│  │  │   Trail     │ │   Data      │ │   Logic     │ │             │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────┬─────────────────┬─────────────────┬─────────────────────────┘
              │                 │                 │
┌─────────────┴─────────────────┴─────────────────┴─────────────────────────┐
│                      Core Application Services                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Integration │ │ Notification│ │   Payment   │ │     Document        │ │
│  │   Service   │ │   Service   │ │   Service   │ │     Service         │ │
│  │             │ │             │ │             │ │                     │ │
│  │ • Adapter   │ │ • Template  │ │ • Gateway   │ │ • Generation        │ │
│  │   Pattern   │ │   Engine    │ │   Facade    │ │ • Storage           │ │
│  │ • Data      │ │ • Multi-    │ │ • Payment   │ │ • Digital           │ │
│  │   Mapping   │ │   Channel   │ │   Routing   │ │   Signatures        │ │
│  │ • Error     │ │   Delivery  │ │ • Settlement│ │                     │ │
│  │   Handling  │ │             │ │   Tracking  │ │                     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Government API Integrations

### 2.1 Department of Land Transport (DLT) Integration

#### 2.1.1 Vehicle Verification Service
```java
@Service
@Component
public class DLTVehicleVerificationService {
    
    private final RestTemplate restTemplate;
    private final DLTConfigurationProperties dltConfig;
    private final CryptoService cryptoService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    
    @CircuitBreaker(name = "dlt-verification")
    @Retryable(value = {DLTServiceException.class}, maxAttempts = 3, 
               backoff = @Backoff(delay = 1000, multiplier = 2))
    public VehicleVerificationResult verifyVehicle(String registrationNumber, String provinceCode) {
        
        // Prepare request
        DLTVerificationRequest request = buildVerificationRequest(registrationNumber, provinceCode);
        
        // Add digital signature for authentication
        String requestSignature = cryptoService.signRequest(request, dltConfig.getPrivateKey());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", dltConfig.getApiKey());
        headers.set("X-Request-Signature", requestSignature);
        headers.set("X-Request-Timestamp", Instant.now().toString());
        
        HttpEntity<DLTVerificationRequest> httpEntity = new HttpEntity<>(request, headers);
        
        try {
            // Call DLT API
            ResponseEntity<DLTVerificationResponse> response = restTemplate.postForEntity(
                dltConfig.getBaseUrl() + "/api/v1/vehicle/verify",
                httpEntity,
                DLTVerificationResponse.class
            );
            
            // Validate response signature
            if (!cryptoService.verifyResponseSignature(response.getBody(), 
                                                      response.getHeaders().getFirst("X-Response-Signature"))) {
                throw new DLTServiceException("Invalid response signature");
            }
            
            return mapToVerificationResult(response.getBody());
            
        } catch (HttpClientErrorException e) {
            handleDLTClientError(e);
            throw new VehicleVerificationException("Vehicle verification failed", e);
        } catch (HttpServerErrorException e) {
            throw new DLTServiceException("DLT service temporarily unavailable", e);
        }
    }
    
    private DLTVerificationRequest buildVerificationRequest(String registrationNumber, String provinceCode) {
        return DLTVerificationRequest.builder()
            .registrationNumber(registrationNumber)
            .provinceCode(provinceCode)
            .requestId(UUID.randomUUID().toString())
            .timestamp(Instant.now())
            .build();
    }
    
    private VehicleVerificationResult mapToVerificationResult(DLTVerificationResponse response) {
        return VehicleVerificationResult.builder()
            .isValid(response.isRegistrationValid())
            .registrationExpiry(response.getRegistrationExpiry())
            .taxStatus(response.getTaxStatus())
            .vehicleDetails(VehicleDetails.builder()
                .make(response.getVehicleMake())
                .model(response.getVehicleModel())
                .year(response.getYearOfManufacture())
                .engineSize(response.getEngineSize())
                .color(response.getColor())
                .build())
            .verificationTimestamp(response.getVerificationTimestamp())
            .dltReference(response.getReferenceNumber())
            .build();
    }
    
    @Recover
    public VehicleVerificationResult recoverFromDLTFailure(DLTServiceException ex, 
                                                          String registrationNumber, 
                                                          String provinceCode) {
        // Log the failure
        log.error("DLT verification failed after retries for vehicle: {}-{}", 
                  provinceCode, registrationNumber, ex);
        
        // Return fallback response indicating service unavailability
        return VehicleVerificationResult.builder()
            .isValid(false)
            .verificationStatus(VerificationStatus.SERVICE_UNAVAILABLE)
            .errorMessage("DLT service temporarily unavailable. Manual verification required.")
            .build();
    }
}
```

#### 2.1.2 DLT Configuration
```yaml
# application.yml
integration:
  dlt:
    base-url: https://api.dlt.go.th
    api-key: ${DLT_API_KEY}
    private-key: ${DLT_PRIVATE_KEY}
    timeout:
      connection: 5000
      read: 30000
    retry:
      max-attempts: 3
      delay: 1000
      multiplier: 2
    circuit-breaker:
      failure-rate-threshold: 50
      wait-duration-in-open-state: 30s
      sliding-window-size: 10
      minimum-number-of-calls: 5
```

### 2.2 Office of Insurance Commission (OIC) Reporting

#### 2.2.1 Regulatory Reporting Service
```java
@Service
public class OICReportingService {
    
    private final RestTemplate restTemplate;
    private final OICConfigurationProperties oicConfig;
    private final ReportGenerationService reportGenerationService;
    
    @Scheduled(cron = "0 0 2 1 * *") // Monthly on the 1st at 2 AM
    public void submitMonthlyReport() {
        
        LocalDate reportDate = LocalDate.now().minusMonths(1);
        
        try {
            // Generate monthly statistics report
            MonthlyStatisticsReport report = reportGenerationService
                .generateMonthlyStatistics(reportDate);
            
            // Convert to OIC format
            OICMonthlyReportRequest oicRequest = convertToOICFormat(report);
            
            // Submit to OIC
            submitReportToOIC(oicRequest);
            
            log.info("Monthly OIC report submitted successfully for period: {}", reportDate);
            
        } catch (Exception e) {
            log.error("Failed to submit monthly OIC report for period: {}", reportDate, e);
            
            // Send alert to compliance team
            notificationService.sendComplianceAlert(
                "OIC Monthly Report Submission Failed",
                "Report period: " + reportDate + ", Error: " + e.getMessage()
            );
        }
    }
    
    private void submitReportToOIC(OICMonthlyReportRequest request) {
        
        // Encrypt sensitive data
        String encryptedData = cryptoService.encrypt(request.getSensitiveData());
        request.setSensitiveData(encryptedData);
        
        // Digital signature
        String signature = cryptoService.signDocument(request, oicConfig.getPrivateKey());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_XML);
        headers.set("X-OIC-Company-Code", oicConfig.getCompanyCode());
        headers.set("X-Digital-Signature", signature);
        headers.set("X-Submission-Date", LocalDateTime.now().toString());
        
        HttpEntity<OICMonthlyReportRequest> httpEntity = new HttpEntity<>(request, headers);
        
        ResponseEntity<OICSubmissionResponse> response = restTemplate.postForEntity(
            oicConfig.getSubmissionUrl(),
            httpEntity,
            OICSubmissionResponse.class
        );
        
        if (response.getBody().getStatus() != SubmissionStatus.ACCEPTED) {
            throw new OICSubmissionException("Report rejected: " + response.getBody().getErrorMessage());
        }
        
        // Store submission record
        saveSubmissionRecord(request, response.getBody());
    }
    
    private OICMonthlyReportRequest convertToOICFormat(MonthlyStatisticsReport report) {
        return OICMonthlyReportRequest.builder()
            .reportPeriod(report.getReportPeriod())
            .companyCode(oicConfig.getCompanyCode())
            .totalPoliciesIssued(report.getTotalPoliciesIssued())
            .totalPremiumCollected(report.getTotalPremiumCollected())
            .totalClaimsReported(report.getTotalClaimsReported())
            .totalClaimsPaid(report.getTotalClaimsPaid())
            .policyBreakdown(convertPolicyBreakdown(report.getPolicyBreakdown()))
            .claimsBreakdown(convertClaimsBreakdown(report.getClaimsBreakdown()))
            .regionalBreakdown(convertRegionalBreakdown(report.getRegionalBreakdown()))
            .submissionTimestamp(LocalDateTime.now())
            .build();
    }
}
```

### 2.3 Bank of Thailand (BOT) Integration

#### 2.3.1 Anti-Money Laundering (AML) Reporting
```java
@Service
public class BOTAMLReportingService {
    
    private final BOTConfigurationProperties botConfig;
    private final TransactionMonitoringService transactionMonitoringService;
    
    @EventListener
    public void handleHighValueTransaction(PaymentProcessedEvent event) {
        
        Payment payment = event.getPayment();
        
        // Check if reporting threshold is met
        if (payment.getAmount().compareTo(botConfig.getReportingThreshold()) >= 0) {
            
            // Generate AML report
            AMLTransactionReport report = buildAMLReport(payment);
            
            // Submit to BOT
            submitAMLReport(report);
        }
    }
    
    private void submitAMLReport(AMLTransactionReport report) {
        
        // Encrypt report data
        String encryptedReport = cryptoService.encryptWithBOTKey(report);
        
        BOTSubmissionRequest request = BOTSubmissionRequest.builder()
            .reportType("AML_TRANSACTION")
            .encryptedData(encryptedReport)
            .submissionId(UUID.randomUUID().toString())
            .timestamp(Instant.now())
            .build();
        
        // Digital signature
        String signature = cryptoService.signWithBOTKey(request);
        request.setDigitalSignature(signature);
        
        try {
            ResponseEntity<BOTSubmissionResponse> response = restTemplate.postForEntity(
                botConfig.getAmlSubmissionUrl(),
                request,
                BOTSubmissionResponse.class
            );
            
            if (response.getBody().getStatus() == SubmissionStatus.RECEIVED) {
                log.info("AML report submitted successfully: {}", request.getSubmissionId());
            } else {
                log.error("AML report submission failed: {}", response.getBody().getErrorMessage());
            }
            
        } catch (Exception e) {
            log.error("Failed to submit AML report", e);
            
            // Queue for retry
            amlRetryQueue.send(report);
        }
    }
}
```

## 3. Payment Gateway Integrations

### 3.1 Multi-Gateway Payment Service

#### 3.1.1 Payment Gateway Facade
```java
@Service
public class PaymentGatewayService {
    
    private final Map<PaymentMethod, PaymentProcessor> processors;
    private final PaymentConfigurationProperties paymentConfig;
    private final PaymentAuditService auditService;
    
    @PostConstruct
    public void initializeProcessors() {
        processors.put(PaymentMethod.CREDIT_CARD, 
                      new TwoCTwoPProcessor(paymentConfig.getTwoCTwoP()));
        processors.put(PaymentMethod.PROMPTPAY, 
                      new PromptPayProcessor(paymentConfig.getPromptPay()));
        processors.put(PaymentMethod.TRUEMONEY, 
                      new TrueMoneyProcessor(paymentConfig.getTrueMoney()));
        processors.put(PaymentMethod.RABBIT_LINE_PAY, 
                      new RabbitLinePayProcessor(paymentConfig.getRabbitLinePay()));
        processors.put(PaymentMethod.K_PLUS, 
                      new KPlusProcessor(paymentConfig.getKPlus()));
        processors.put(PaymentMethod.BANK_TRANSFER, 
                      new InternetBankingProcessor(paymentConfig.getInternetBanking()));
    }
    
    @CircuitBreaker(name = "payment-processing")
    public PaymentResult processPayment(PaymentRequest request) {
        
        // Validate request
        validatePaymentRequest(request);
        
        // Get appropriate processor
        PaymentProcessor processor = processors.get(request.getPaymentMethod());
        if (processor == null) {
            throw new UnsupportedPaymentMethodException(request.getPaymentMethod());
        }
        
        // Add Thai regulatory compliance checks
        performRegulatoryChecks(request);
        
        // Audit log - payment initiated
        auditService.logPaymentInitiated(request);
        
        try {
            // Process payment with retry mechanism
            PaymentResult result = executeWithRetry(() -> processor.processPayment(request));
            
            // Audit log - payment result
            auditService.logPaymentResult(request, result);
            
            // Publish payment event
            paymentEventPublisher.publishPaymentProcessed(request, result);
            
            return result;
            
        } catch (PaymentProcessingException e) {
            auditService.logPaymentError(request, e);
            throw e;
        }
    }
    
    private void performRegulatoryChecks(PaymentRequest request) {
        
        // High-value transaction reporting
        if (request.getAmount().compareTo(new BigDecimal("2000000")) >= 0) {
            botReportingService.reportHighValueTransaction(request);
        }
        
        // Foreign currency compliance
        if (!request.getCurrency().equals("THB")) {
            validateForeignExchangeCompliance(request);
        }
        
        // Sanctions screening
        if (sanctionsScreeningService.isBlacklisted(request.getCustomerId())) {
            throw new PaymentBlockedException("Customer is on sanctions list");
        }
    }
    
    private <T> T executeWithRetry(Supplier<T> operation) {
        return RetryTemplate.builder()
            .maxAttempts(3)
            .exponentialBackoff(1000, 2, 10000)
            .retryOn(TransientPaymentException.class)
            .build()
            .execute(context -> operation.get());
    }
}
```

#### 3.1.2 PromptPay Integration
```java
@Component
public class PromptPayProcessor implements PaymentProcessor {
    
    private final PromptPayAPI promptPayAPI;
    private final QRCodeGenerator qrCodeGenerator;
    private final PromptPayConfigurationProperties config;
    
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        
        // Generate PromptPay payment request
        PromptPayPaymentRequest promptPayRequest = PromptPayPaymentRequest.builder()
            .merchantId(config.getMerchantId())
            .amount(request.getAmount())
            .currency("THB")
            .reference1(request.getPolicyNumber())
            .reference2("PREMIUM")
            .customerPhone(request.getCustomerPhone())
            .description(request.getDescription())
            .callbackUrl(config.getCallbackUrl())
            .build();
        
        // Generate QR code
        String qrCodeData = generatePromptPayQR(promptPayRequest);
        String qrCodeImage = qrCodeGenerator.generateQRCodeImage(qrCodeData);
        
        // Store payment session
        PaymentSession session = PaymentSession.builder()
            .sessionId(UUID.randomUUID().toString())
            .paymentRequest(request)
            .promptPayRequest(promptPayRequest)
            .qrCodeData(qrCodeData)
            .expiryTime(Instant.now().plus(15, ChronoUnit.MINUTES))
            .status(PaymentSessionStatus.PENDING)
            .build();
        
        paymentSessionRepository.save(session);
        
        // Start payment monitoring
        monitorPaymentStatus(session.getSessionId());
        
        return PaymentResult.builder()
            .status(PaymentStatus.PENDING)
            .paymentId(session.getSessionId())
            .qrCodeImage(qrCodeImage)
            .qrCodeData(qrCodeData)
            .expiryTime(session.getExpiryTime())
            .statusCheckUrl(config.getStatusCheckUrl() + "/" + session.getSessionId())
            .build();
    }
    
    @Async
    private void monitorPaymentStatus(String sessionId) {
        
        PaymentSession session = paymentSessionRepository.findById(sessionId)
            .orElseThrow(() -> new PaymentSessionNotFoundException(sessionId));
        
        // Poll payment status every 30 seconds for 15 minutes
        for (int i = 0; i < 30; i++) {
            
            try {
                Thread.sleep(30000); // 30 seconds
                
                PromptPayStatusResponse status = promptPayAPI.checkPaymentStatus(
                    session.getPromptPayRequest().getTransactionId()
                );
                
                if (status.getStatus() == PromptPayStatus.PAID) {
                    updatePaymentSession(sessionId, PaymentSessionStatus.COMPLETED);
                    publishPaymentCompletedEvent(session);
                    break;
                    
                } else if (status.getStatus() == PromptPayStatus.EXPIRED) {
                    updatePaymentSession(sessionId, PaymentSessionStatus.EXPIRED);
                    break;
                }
                
            } catch (InterruptedException e) {
                log.warn("Payment monitoring interrupted for session: {}", sessionId);
                break;
            } catch (Exception e) {
                log.error("Error monitoring payment status for session: {}", sessionId, e);
            }
        }
    }
    
    private String generatePromptPayQR(PromptPayPaymentRequest request) {
        
        // PromptPay QR format specification
        StringBuilder qrBuilder = new StringBuilder();
        qrBuilder.append("00"); // Payload Format Indicator
        qrBuilder.append("02"); // Length
        qrBuilder.append("01"); // Version
        
        qrBuilder.append("01"); // Point of Initiation Method
        qrBuilder.append("02"); // Length
        qrBuilder.append("12"); // Dynamic QR
        
        // Merchant Account Information
        qrBuilder.append("29"); // Tag
        qrBuilder.append("37"); // Length
        qrBuilder.append("0016A000000677010111"); // PromptPay identifier
        qrBuilder.append("0213").append(request.getCustomerPhone()); // Mobile number
        
        // Transaction Currency
        qrBuilder.append("53"); // Tag
        qrBuilder.append("03"); // Length
        qrBuilder.append("764"); // THB currency code
        
        // Transaction Amount
        if (request.getAmount() != null) {
            String amount = request.getAmount().toPlainString();
            qrBuilder.append("54"); // Tag
            qrBuilder.append(String.format("%02d", amount.length())); // Length
            qrBuilder.append(amount); // Amount
        }
        
        // Additional Data
        if (request.getReference1() != null) {
            qrBuilder.append("62"); // Tag
            String additionalData = "07" + String.format("%02d", request.getReference1().length()) + request.getReference1();
            qrBuilder.append(String.format("%02d", additionalData.length()));
            qrBuilder.append(additionalData);
        }
        
        // Calculate and append CRC
        String qrWithoutCRC = qrBuilder.toString() + "6304";
        String crc = calculateCRC16(qrWithoutCRC);
        qrBuilder.append("63").append("04").append(crc);
        
        return qrBuilder.toString();
    }
}
```

### 3.2 Credit Card Processing (2C2P Integration)

#### 3.2.1 2C2P Payment Processor
```java
@Component
public class TwoCTwoPProcessor implements PaymentProcessor {
    
    private final TwoCTwoPAPI twoCTwoPAPI;
    private final TwoCTwoPConfigurationProperties config;
    private final CryptoService cryptoService;
    
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        
        // Build 2C2P request
        TwoCTwoPPaymentRequest twoCTwoPRequest = TwoCTwoPPaymentRequest.builder()
            .merchantID(config.getMerchantId())
            .invoiceNo(request.getInvoiceNumber())
            .description(request.getDescription())
            .amount(formatAmount(request.getAmount()))
            .currencyCode("764") // THB
            .cardToken(request.getCardToken())
            .cardholderName(request.getCardholderName())
            .cardExpiryMM(request.getCardExpiryMonth())
            .cardExpiryYYYY(request.getCardExpiryYear())
            .securityCode(request.getCvv())
            .customerEmail(request.getCustomerEmail())
            .paymentMethod("CC") // Credit Card
            .request3DS("Y") // Enable 3D Secure
            .recurringAmount(request.isRecurring() ? formatAmount(request.getAmount()) : null)
            .recurringInterval(request.getRecurringInterval())
            .recurringCount(request.getRecurringCount())
            .userDefined1(request.getPolicyNumber())
            .userDefined2(request.getCustomerId())
            .userDefined3("AUTO_INSURANCE")
            .build();
        
        // Calculate hash for security
        String hashValue = calculateRequestHash(twoCTwoPRequest);
        twoCTwoPRequest.setHashValue(hashValue);
        
        try {
            TwoCTwoPPaymentResponse response = twoCTwoPAPI.processPayment(twoCTwoPRequest);
            
            // Validate response
            if (!validateResponseHash(response)) {
                throw new PaymentSecurityException("Invalid response hash from 2C2P");
            }
            
            return mapToPaymentResult(response);
            
        } catch (TwoCTwoPException e) {
            throw new PaymentProcessingException("2C2P payment failed", e);
        }
    }
    
    private PaymentResult mapToPaymentResult(TwoCTwoPPaymentResponse response) {
        
        PaymentStatus status;
        switch (response.getStatus()) {
            case "000":
                status = PaymentStatus.SUCCESS;
                break;
            case "001":
                status = PaymentStatus.PENDING_3DS;
                break;
            case "002":
                status = PaymentStatus.REJECTED;
                break;
            default:
                status = PaymentStatus.FAILED;
        }
        
        PaymentResult.PaymentResultBuilder builder = PaymentResult.builder()
            .status(status)
            .transactionId(response.getTransactionRef())
            .authorizationCode(response.getApprovalCode())
            .responseCode(response.getStatus())
            .responseMessage(response.getDescription())
            .amount(parseAmount(response.getAmount()))
            .currency("THB")
            .processedAt(parseTimestamp(response.getDatetime()));
        
        // Handle 3D Secure
        if (status == PaymentStatus.PENDING_3DS) {
            builder.threeDSecureUrl(response.getRedirectUrl())
                   .threeDSecureData(response.getPayload());
        }
        
        // Handle tokenization
        if (response.getCardToken() != null) {
            builder.cardToken(response.getCardToken())
                   .cardMask(response.getMaskedCardNumber());
        }
        
        return builder.build();
    }
    
    private String calculateRequestHash(TwoCTwoPPaymentRequest request) {
        String hashString = request.getMerchantID() +
                           request.getInvoiceNo() +
                           request.getAmount() +
                           request.getCurrencyCode() +
                           config.getSecretKey();
        
        return DigestUtils.sha256Hex(hashString);
    }
    
    @EventListener
    public void handle3DSecureCallback(ThreeDSecureCallbackEvent event) {
        
        // Validate 3DS response
        ThreeDSecureResponse threeDSResponse = event.getResponse();
        
        if (validateThreeDSResponse(threeDSResponse)) {
            
            // Complete payment
            TwoCTwoP3DSCompleteRequest completeRequest = TwoCTwoP3DSCompleteRequest.builder()
                .merchantID(config.getMerchantId())
                .transactionRef(threeDSResponse.getTransactionRef())
                .paRes(threeDSResponse.getPaRes())
                .build();
            
            try {
                TwoCTwoPPaymentResponse finalResponse = twoCTwoPAPI.complete3DSPayment(completeRequest);
                
                // Update payment status
                paymentService.updatePaymentStatus(
                    threeDSResponse.getPaymentId(),
                    mapToPaymentResult(finalResponse)
                );
                
            } catch (Exception e) {
                log.error("Failed to complete 3DS payment", e);
                paymentService.markPaymentFailed(threeDSResponse.getPaymentId(), e.getMessage());
            }
        }
    }
}
```

### 3.3 Digital Wallet Integrations

#### 3.3.1 TrueMoney Wallet Integration
```java
@Component
public class TrueMoneyProcessor implements PaymentProcessor {
    
    private final TrueMoneyAPI trueMoneyAPI;
    private final TrueMoneyConfigurationProperties config;
    
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        
        // Validate TrueMoney wallet limits
        validateWalletLimits(request.getAmount());
        
        TrueMoneyPaymentRequest trueMoneyRequest = TrueMoneyPaymentRequest.builder()
            .partnerTxnId(request.getTransactionId())
            .partnerCode(config.getPartnerCode())
            .amount(request.getAmount())
            .currency("THB")
            .customerMsisdn(request.getCustomerPhone())
            .description(request.getDescription())
            .callbackUrl(config.getCallbackUrl())
            .metadata(Map.of(
                "policyNumber", request.getPolicyNumber(),
                "customerId", request.getCustomerId()
            ))
            .build();
        
        // Generate signature
        String signature = generateTrueMoneySignature(trueMoneyRequest);
        trueMoneyRequest.setSignature(signature);
        
        try {
            TrueMoneyPaymentResponse response = trueMoneyAPI.createPayment(trueMoneyRequest);
            
            return PaymentResult.builder()
                .status(mapTrueMoneyStatus(response.getStatus()))
                .transactionId(response.getTrueMoneyTxnId())
                .paymentUrl(response.getPaymentUrl())
                .qrCodeImage(response.getQrCode())
                .expiryTime(response.getExpiryTime())
                .build();
                
        } catch (TrueMoneyException e) {
            throw new PaymentProcessingException("TrueMoney payment failed", e);
        }
    }
    
    private void validateWalletLimits(BigDecimal amount) {
        if (amount.compareTo(new BigDecimal("50000")) > 0) {
            throw new PaymentLimitExceededException("Amount exceeds TrueMoney wallet daily limit");
        }
    }
    
    private String generateTrueMoneySignature(TrueMoneyPaymentRequest request) {
        String signatureString = request.getPartnerCode() +
                                request.getPartnerTxnId() +
                                request.getAmount().toPlainString() +
                                request.getCurrency() +
                                config.getSecretKey();
        
        return DigestUtils.sha256Hex(signatureString);
    }
    
    @EventListener
    public void handleTrueMoneyCallback(TrueMoneyCallbackEvent event) {
        
        TrueMoneyCallback callback = event.getCallback();
        
        // Validate callback signature
        if (!validateCallbackSignature(callback)) {
            log.warn("Invalid TrueMoney callback signature: {}", callback.getPartnerTxnId());
            return;
        }
        
        // Update payment status
        paymentService.updatePaymentStatus(
            callback.getPartnerTxnId(),
            PaymentResult.builder()
                .status(mapTrueMoneyStatus(callback.getStatus()))
                .transactionId(callback.getTrueMoneyTxnId())
                .amount(callback.getAmount())
                .processedAt(callback.getCompletedTime())
                .build()
        );
    }
}
```

## 4. Communication Service Integrations

### 4.1 SMS Service Integration

#### 4.1.1 Multi-Provider SMS Service
```java
@Service
public class SMSService {
    
    private final List<SMSProvider> smsProviders;
    private final SMSConfigurationProperties smsConfig;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    
    @PostConstruct
    public void initializeProviders() {
        smsProviders = List.of(
            new AISSmartMessagingProvider(smsConfig.getAis()),
            new TrueCorpSMSProvider(smsConfig.getTrueCorp()),
            new DTACHappyProvider(smsConfig.getDtac())
        );
    }
    
    public SMSResult sendSMS(SMSRequest request) {
        
        // Validate Thai mobile number format
        if (!isValidThaiMobileNumber(request.getPhoneNumber())) {
            throw new InvalidPhoneNumberException("Invalid Thai mobile number format");
        }
        
        // Determine best provider based on network
        SMSProvider provider = selectOptimalProvider(request.getPhoneNumber());
        
        // Add Thai-specific formatting
        request = formatForThaiAudience(request);
        
        return executeWithFailover(request, provider);
    }
    
    private SMSProvider selectOptimalProvider(String phoneNumber) {
        
        // Detect network operator from phone number
        String networkOperator = detectNetworkOperator(phoneNumber);
        
        return smsProviders.stream()
            .filter(provider -> provider.supportsNetwork(networkOperator))
            .filter(provider -> circuitBreakerRegistry.circuitBreaker(provider.getName()).getState() != CircuitBreaker.State.OPEN)
            .findFirst()
            .orElse(smsProviders.get(0)); // Fallback to first available
    }
    
    private SMSResult executeWithFailover(SMSRequest request, SMSProvider primaryProvider) {
        
        try {
            return primaryProvider.sendSMS(request);
            
        } catch (SMSException e) {
            log.warn("Primary SMS provider failed, attempting failover: {}", e.getMessage());
            
            // Try other providers
            for (SMSProvider provider : smsProviders) {
                if (!provider.equals(primaryProvider)) {
                    try {
                        SMSResult result = provider.sendSMS(request);
                        log.info("SMS sent successfully via failover provider: {}", provider.getName());
                        return result;
                    } catch (SMSException fallbackException) {
                        log.warn("Failover provider {} also failed: {}", provider.getName(), fallbackException.getMessage());
                    }
                }
            }
            
            throw new SMSDeliveryException("All SMS providers failed", e);
        }
    }
    
    private SMSRequest formatForThaiAudience(SMSRequest request) {
        
        String message = request.getMessage();
        
        // Add company branding for Thai audience
        if (!message.startsWith("บริษัท")) {
            message = "บริษัท " + smsConfig.getCompanyNameThai() + "\n" + message;
        }
        
        // Add opt-out instructions (PDPA compliance)
        if (!message.contains("ยกเลิก")) {
            message = message + "\n\nตอบ STOP เพื่อยกเลิกการรับ SMS";
        }
        
        // Ensure message length doesn't exceed Thai SMS limits
        if (message.length() > 160) {
            message = message.substring(0, 157) + "...";
        }
        
        return request.toBuilder()
            .message(message)
            .build();
    }
    
    private String detectNetworkOperator(String phoneNumber) {
        
        // Thai mobile number patterns
        if (phoneNumber.matches("^(\\+66|0)?[68]\\d{8}$")) {
            return "AIS";
        } else if (phoneNumber.matches("^(\\+66|0)?[9]\\d{8}$")) {
            return "DTAC";
        } else if (phoneNumber.matches("^(\\+66|0)?[6]\\d{8}$")) {
            return "TRUE";
        }
        
        return "UNKNOWN";
    }
    
    @EventListener
    public void handleSMSDeliveryReport(SMSDeliveryReportEvent event) {
        
        SMSDeliveryReport report = event.getReport();
        
        // Update delivery status in database
        smsLogRepository.updateDeliveryStatus(
            report.getMessageId(),
            report.getDeliveryStatus(),
            report.getDeliveredAt()
        );
        
        // Handle failures
        if (report.getDeliveryStatus() == DeliveryStatus.FAILED) {
            
            // Check if retry is needed
            if (report.getRetryCount() < smsConfig.getMaxRetries()) {
                
                // Schedule retry
                SMSRetryTask retryTask = SMSRetryTask.builder()
                    .messageId(report.getMessageId())
                    .phoneNumber(report.getPhoneNumber())
                    .message(report.getMessage())
                    .retryCount(report.getRetryCount() + 1)
                    .retryAt(Instant.now().plus(smsConfig.getRetryDelay(), ChronoUnit.MINUTES))
                    .build();
                
                smsRetryQueue.send(retryTask);
            }
        }
    }
}
```

#### 4.1.2 AIS Smart Messaging Provider
```java
@Component
public class AISSmartMessagingProvider implements SMSProvider {
    
    private final RestTemplate restTemplate;
    private final AISConfigurationProperties aisConfig;
    
    @Override
    public SMSResult sendSMS(SMSRequest request) {
        
        // Authenticate with AIS API
        String accessToken = authenticateWithAIS();
        
        AISBulkSMSRequest aisRequest = AISBulkSMSRequest.builder()
            .destination(List.of(normalizePhoneNumber(request.getPhoneNumber())))
            .message(request.getMessage())
            .sender(aisConfig.getSenderId())
            .messageType("text")
            .encoding("utf-8")
            .scheduledTime(request.getScheduledTime())
            .callbackUrl(aisConfig.getCallbackUrl())
            .build();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        
        HttpEntity<AISBulkSMSRequest> httpEntity = new HttpEntity<>(aisRequest, headers);
        
        try {
            ResponseEntity<AISBulkSMSResponse> response = restTemplate.postForEntity(
                aisConfig.getApiUrl() + "/sms/bulk",
                httpEntity,
                AISBulkSMSResponse.class
            );
            
            AISBulkSMSResponse responseBody = response.getBody();
            
            if (responseBody.getStatus().equals("success")) {
                return SMSResult.builder()
                    .messageId(responseBody.getMessageId())
                    .status(SMSStatus.SENT)
                    .provider("AIS")
                    .cost(calculateSMSCost(request.getMessage().length()))
                    .sentAt(Instant.now())
                    .build();
            } else {
                throw new SMSException("AIS SMS failed: " + responseBody.getErrorMessage());
            }
            
        } catch (HttpClientErrorException e) {
            throw new SMSException("AIS API client error: " + e.getResponseBodyAsString(), e);
        } catch (HttpServerErrorException e) {
            throw new SMSException("AIS API server error", e);
        }
    }
    
    private String authenticateWithAIS() {
        
        AISAuthRequest authRequest = AISAuthRequest.builder()
            .username(aisConfig.getUsername())
            .password(aisConfig.getPassword())
            .build();
        
        try {
            ResponseEntity<AISAuthResponse> response = restTemplate.postForEntity(
                aisConfig.getAuthUrl(),
                authRequest,
                AISAuthResponse.class
            );
            
            return response.getBody().getAccessToken();
            
        } catch (Exception e) {
            throw new SMSException("AIS authentication failed", e);
        }
    }
    
    @Override
    public boolean supportsNetwork(String networkOperator) {
        return "AIS".equals(networkOperator);
    }
    
    @Override
    public String getName() {
        return "AIS_SMART_MESSAGING";
    }
}
```

### 4.2 Email Service Integration

#### 4.2.1 Multi-Template Email Service
```java
@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final EmailConfigurationProperties emailConfig;
    private final S3Client s3Client;
    
    public EmailResult sendEmail(EmailRequest request) {
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            // Set basic email properties
            helper.setFrom(emailConfig.getFromAddress(), emailConfig.getFromName());
            helper.setTo(request.getToAddress());
            helper.setSubject(request.getSubject());
            
            // Process template with context
            String htmlContent = processTemplate(request.getTemplate(), request.getContext());
            helper.setText(htmlContent, true);
            
            // Add attachments if any
            if (request.getAttachments() != null) {
                for (EmailAttachment attachment : request.getAttachments()) {
                    addAttachment(helper, attachment);
                }
            }
            
            // Send email
            mailSender.send(mimeMessage);
            
            // Log successful send
            EmailLog emailLog = EmailLog.builder()
                .toAddress(request.getToAddress())
                .subject(request.getSubject())
                .template(request.getTemplate())
                .status(EmailStatus.SENT)
                .sentAt(Instant.now())
                .build();
            
            emailLogRepository.save(emailLog);
            
            return EmailResult.builder()
                .status(EmailStatus.SENT)
                .messageId(UUID.randomUUID().toString())
                .sentAt(Instant.now())
                .build();
            
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", request.getToAddress(), e);
            throw new EmailDeliveryException("Failed to send email", e);
        }
    }
    
    private String processTemplate(String templateName, Map<String, Object> context) {
        
        // Add common Thai context variables
        context.put("companyName", "บริษัท ประกันภัยรถยนต์ไทย จำกัด");
        context.put("companyNameEn", "Thai Auto Insurance Company Limited");
        context.put("supportPhone", "+66-2-123-4567");
        context.put("supportEmail", "support@autoinsurance.co.th");
        context.put("currentYear", LocalDate.now().getYear());
        
        // Set language-specific formatting
        String language = (String) context.getOrDefault("language", "th");
        context.put("dateFormat", "th".equals(language) ? "dd/MM/yyyy" : "MM/dd/yyyy");
        context.put("currencySymbol", "฿");
        
        return templateEngine.process(templateName, new Context(Locale.forLanguageTag(language), context));
    }
    
    private void addAttachment(MimeMessageHelper helper, EmailAttachment attachment) throws MessagingException {
        
        if (attachment.getS3Key() != null) {
            // Download from S3
            try {
                GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(emailConfig.getAttachmentsBucket())
                    .key(attachment.getS3Key())
                    .build();
                
                ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
                
                helper.addAttachment(
                    attachment.getFileName(),
                    new ByteArrayDataSource(s3Object.readAllBytes(), attachment.getContentType())
                );
                
            } catch (Exception e) {
                log.error("Failed to attach file from S3: {}", attachment.getS3Key(), e);
            }
            
        } else if (attachment.getContent() != null) {
            helper.addAttachment(
                attachment.getFileName(),
                new ByteArrayDataSource(attachment.getContent(), attachment.getContentType())
            );
        }
    }
    
    // Email templates for different scenarios
    public void sendPolicyCreatedEmail(Policy policy, Customer customer) {
        
        Map<String, Object> context = new HashMap<>();
        context.put("customer", customer);
        context.put("policy", policy);
        context.put("language", customer.getPreferredLanguage());
        
        EmailRequest request = EmailRequest.builder()
            .toAddress(customer.getEmail())
            .subject(getLocalizedSubject("policy.created", customer.getPreferredLanguage()))
            .template("policy-created")
            .context(context)
            .attachments(List.of(
                EmailAttachment.builder()
                    .fileName("policy-certificate.pdf")
                    .s3Key("policies/" + policy.getId() + "/certificate.pdf")
                    .contentType("application/pdf")
                    .build()
            ))
            .build();
        
        sendEmail(request);
    }
    
    public void sendClaimApprovedEmail(Claim claim, Customer customer) {
        
        Map<String, Object> context = new HashMap<>();
        context.put("customer", customer);
        context.put("claim", claim);
        context.put("language", customer.getPreferredLanguage());
        context.put("approvedAmount", claim.getApprovedAmount());
        context.put("settlementDate", claim.getSettlementDate());
        
        EmailRequest request = EmailRequest.builder()
            .toAddress(customer.getEmail())
            .subject(getLocalizedSubject("claim.approved", customer.getPreferredLanguage()))
            .template("claim-approved")
            .context(context)
            .build();
        
        sendEmail(request);
    }
    
    private String getLocalizedSubject(String key, String language) {
        
        Map<String, Map<String, String>> subjects = Map.of(
            "policy.created", Map.of(
                "th", "กรมธรรม์ประกันภัยของท่านถูกสร้างเรียบร้อยแล้ว",
                "en", "Your Insurance Policy Has Been Created"
            ),
            "claim.approved", Map.of(
                "th", "การเคลมของท่านได้รับการอนุมัติแล้ว",
                "en", "Your Insurance Claim Has Been Approved"
            )
        );
        
        return subjects.getOrDefault(key, Map.of("th", "แจ้งเตือนจากระบบประกันภัย"))
                      .getOrDefault(language, "Insurance System Notification");
    }
}
```

### 4.3 Push Notification Service

#### 4.3.1 Firebase Cloud Messaging Integration
```java
@Service
public class PushNotificationService {
    
    private final FirebaseMessaging firebaseMessaging;
    private final DeviceTokenRepository deviceTokenRepository;
    private final NotificationTemplateService templateService;
    
    public PushNotificationResult sendPushNotification(PushNotificationRequest request) {
        
        List<String> deviceTokens = getDeviceTokensForCustomer(request.getCustomerId());
        
        if (deviceTokens.isEmpty()) {
            return PushNotificationResult.builder()
                .status(NotificationStatus.NO_DEVICES)
                .message("No device tokens found for customer")
                .build();
        }
        
        // Build notification payload
        Map<String, String> data = buildNotificationData(request);
        
        // Create platform-specific notifications
        List<Message> messages = new ArrayList<>();
        
        for (String token : deviceTokens) {
            
            DeviceInfo deviceInfo = getDeviceInfo(token);
            
            Message.Builder messageBuilder = Message.builder()
                .setToken(token)
                .putAllData(data);
            
            // Platform-specific configuration
            if (deviceInfo.getPlatform() == Platform.ANDROID) {
                messageBuilder.setAndroidConfig(buildAndroidConfig(request));
            } else if (deviceInfo.getPlatform() == Platform.IOS) {
                messageBuilder.setApnsConfig(buildApnsConfig(request));
            }
            
            messages.add(messageBuilder.build());
        }
        
        // Send batch notifications
        try {
            BatchResponse response = firebaseMessaging.sendAll(messages);
            
            // Process responses
            processBatchResponse(response, deviceTokens);
            
            return PushNotificationResult.builder()
                .status(NotificationStatus.SENT)
                .successCount(response.getSuccessCount())
                .failureCount(response.getFailureCount())
                .build();
                
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notifications", e);
            throw new PushNotificationException("Failed to send push notifications", e);
        }
    }
    
    private AndroidConfig buildAndroidConfig(PushNotificationRequest request) {
        
        return AndroidConfig.builder()
            .setNotification(AndroidNotification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .setIcon("ic_notification")
                .setColor("#FF6B35") // Brand color
                .setSound("default")
                .build())
            .setPriority(AndroidConfig.Priority.HIGH)
            .setTtl(Duration.ofHours(24).toMillis())
            .build();
    }
    
    private ApnsConfig buildApnsConfig(PushNotificationRequest request) {
        
        return ApnsConfig.builder()
            .setAps(Aps.builder()
                .setAlert(ApsAlert.builder()
                    .setTitle(request.getTitle())
                    .setBody(request.getBody())
                    .build())
                .setSound("default")
                .setBadge(1)
                .setCategory(request.getCategory())
                .build())
            .build();
    }
    
    private void processBatchResponse(BatchResponse response, List<String> deviceTokens) {
        
        List<SendResponse> responses = response.getResponses();
        
        for (int i = 0; i < responses.size(); i++) {
            
            SendResponse sendResponse = responses.get(i);
            String deviceToken = deviceTokens.get(i);
            
            if (sendResponse.isSuccessful()) {
                // Update delivery status
                updateNotificationStatus(deviceToken, NotificationStatus.DELIVERED);
                
            } else {
                // Handle failure
                FirebaseMessagingException exception = sendResponse.getException();
                
                if (exception.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED ||
                    exception.getMessagingErrorCode() == MessagingErrorCode.INVALID_ARGUMENT) {
                    
                    // Remove invalid token
                    deviceTokenRepository.deleteByToken(deviceToken);
                    log.info("Removed invalid device token: {}", deviceToken);
                    
                } else {
                    log.error("Failed to send notification to token: {}", deviceToken, exception);
                }
            }
        }
    }
    
    // Notification templates for different scenarios
    public void sendPolicyExpiryNotification(UUID customerId, Policy policy) {
        
        PushNotificationRequest request = PushNotificationRequest.builder()
            .customerId(customerId)
            .title("กรมธรรม์ใกล้หมดอายุ")
            .body("กรมธรรม์ " + policy.getPolicyNumber() + " จะหมดอายุในอีก 30 วัน")
            .category("policy_expiry")
            .data(Map.of(
                "type", "policy_expiry",
                "policyId", policy.getId().toString(),
                "expiryDate", policy.getEndDate().toString()
            ))
            .build();
        
        sendPushNotification(request);
    }
    
    public void sendClaimUpdateNotification(UUID customerId, Claim claim) {
        
        String title, body;
        
        switch (claim.getStatus()) {
            case APPROVED:
                title = "เคลมได้รับการอนุมัติ";
                body = "การเคลม " + claim.getClaimNumber() + " ได้รับการอนุมัติแล้ว";
                break;
            case SETTLED:
                title = "เคลมชำระเงินแล้ว";
                body = "การเคลม " + claim.getClaimNumber() + " ได้รับการชำระเงินแล้ว";
                break;
            default:
                title = "อัพเดทสถานะเคลม";
                body = "การเคลม " + claim.getClaimNumber() + " มีการอัพเดท";
        }
        
        PushNotificationRequest request = PushNotificationRequest.builder()
            .customerId(customerId)
            .title(title)
            .body(body)
            .category("claim_update")
            .data(Map.of(
                "type", "claim_update",
                "claimId", claim.getId().toString(),
                "status", claim.getStatus().toString()
            ))
            .build();
        
        sendPushNotification(request);
    }
}
```

## 5. Document Management Integration

### 5.1 Document Generation Service

#### 5.1.1 PDF Document Generator
```java
@Service
public class DocumentGenerationService {
    
    private final S3Client s3Client;
    private final TemplateEngine templateEngine;
    private final DocumentConfigurationProperties documentConfig;
    private final DigitalSignatureService signatureService;
    
    public DocumentResult generatePolicyDocument(Policy policy, Customer customer, String language) {
        
        try {
            // Prepare document context
            Map<String, Object> context = buildPolicyDocumentContext(policy, customer, language);
            
            // Generate HTML from template
            String htmlContent = templateEngine.process("policy-document", 
                new Context(Locale.forLanguageTag(language), context));
            
            // Convert HTML to PDF
            byte[] pdfContent = convertHtmlToPdf(htmlContent);
            
            // Add digital signature if required
            if (policy.getStatus() == PolicyStatus.ACTIVE) {
                pdfContent = signatureService.signDocument(pdfContent, "POLICY_DOCUMENT");
            }
            
            // Generate document metadata
            DocumentMetadata metadata = DocumentMetadata.builder()
                .documentType("POLICY")
                .policyId(policy.getId())
                .customerId(customer.getId())
                .language(language)
                .generatedAt(Instant.now())
                .version(1)
                .fileSize(pdfContent.length)
                .checksum(calculateChecksum(pdfContent))
                .build();
            
            // Store document in S3
            String s3Key = generateDocumentKey(metadata);
            storeDocumentInS3(s3Key, pdfContent, metadata);
            
            // Save document record
            PolicyDocument document = PolicyDocument.builder()
                .id(UUID.randomUUID())
                .policyId(policy.getId())
                .documentType(DocumentType.POLICY)
                .documentName(generateDocumentName(policy, language))
                .filePath(s3Key)
                .fileSize((long) pdfContent.length)
                .mimeType("application/pdf")
                .language(language)
                .isOfficial(true)
                .generatedAt(Instant.now())
                .build();
            
            policyDocumentRepository.save(document);
            
            return DocumentResult.builder()
                .documentId(document.getId())
                .documentUrl(generateSignedUrl(s3Key))
                .fileSize(pdfContent.length)
                .generatedAt(Instant.now())
                .build();
            
        } catch (Exception e) {
            log.error("Failed to generate policy document for policy: {}", policy.getId(), e);
            throw new DocumentGenerationException("Failed to generate policy document", e);
        }
    }
    
    private Map<String, Object> buildPolicyDocumentContext(Policy policy, Customer customer, String language) {
        
        Map<String, Object> context = new HashMap<>();
        
        // Company information
        context.put("companyName", "th".equals(language) ? 
            "บริษัท ประกันภัยรถยนต์ไทย จำกัด" : 
            "Thai Auto Insurance Company Limited");
        context.put("companyAddress", getCompanyAddress(language));
        context.put("companyLicense", "ใบอนุญาตประกันภัย เลขที่ นภ.001/2567");
        
        // Policy information
        context.put("policy", policy);
        context.put("policyNumber", policy.getPolicyNumber());
        context.put("effectiveDate", formatDate(policy.getStartDate(), language));
        context.put("expiryDate", formatDate(policy.getEndDate(), language));
        context.put("premium", formatCurrency(policy.getTotalPremium(), language));
        
        // Customer information
        context.put("customer", customer);
        context.put("customerName", formatCustomerName(customer, language));
        context.put("customerAddress", formatAddress(customer.getAddress(), language));
        
        // Vehicle information
        CustomerVehicle vehicle = vehicleRepository.findById(policy.getVehicleId())
            .orElseThrow(() -> new VehicleNotFoundException(policy.getVehicleId()));
        context.put("vehicle", vehicle);
        context.put("vehicleDescription", formatVehicleDescription(vehicle, language));
        
        // Coverage details
        context.put("coverage", policy.getCoverageDetails());
        context.put("coverageDescription", formatCoverageDescription(policy.getCoverageDetails(), language));
        
        // Terms and conditions
        context.put("termsAndConditions", getTermsAndConditions(policy.getPolicyType(), language));
        
        // Generated metadata
        context.put("generationDate", formatDate(LocalDate.now(), language));
        context.put("documentVersion", "1.0");
        context.put("language", language);
        
        return context;
    }
    
    private byte[] convertHtmlToPdf(String htmlContent) {
        
        try {
            // Use Flying Saucer with iTextPDF for HTML to PDF conversion
            ITextRenderer renderer = new ITextRenderer();
            
            // Set Thai font for proper rendering
            ITextFontResolver fontResolver = renderer.getFontResolver();
            fontResolver.addFont("/fonts/THSarabunNew.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            renderer.createPDF(outputStream);
            
            return outputStream.toByteArray();
            
        } catch (Exception e) {
            throw new DocumentGenerationException("Failed to convert HTML to PDF", e);
        }
    }
    
    private void storeDocumentInS3(String s3Key, byte[] content, DocumentMetadata metadata) {
        
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(documentConfig.getS3Bucket())
                .key(s3Key)
                .contentType("application/pdf")
                .contentLength((long) content.length)
                .metadata(Map.of(
                    "document-type", metadata.getDocumentType(),
                    "policy-id", metadata.getPolicyId().toString(),
                    "customer-id", metadata.getCustomerId().toString(),
                    "language", metadata.getLanguage(),
                    "generated-at", metadata.getGeneratedAt().toString(),
                    "checksum", metadata.getChecksum()
                ))
                .build();
            
            s3Client.putObject(putRequest, RequestBody.fromBytes(content));
            
        } catch (Exception e) {
            throw new DocumentStorageException("Failed to store document in S3", e);
        }
    }
    
    private String generateSignedUrl(String s3Key) {
        
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(documentConfig.getS3Bucket())
            .key(s3Key)
            .build();
        
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofHours(1))
            .getObjectRequest(getObjectRequest)
            .build();
        
        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        
        return presignedRequest.url().toString();
    }
}
```

### 5.2 Digital Signature Integration

#### 5.2.1 Digital Signature Service
```java
@Service
public class DigitalSignatureService {
    
    private final KeyStore keyStore;
    private final DigitalSignatureConfigurationProperties signatureConfig;
    
    public byte[] signDocument(byte[] documentContent, String documentType) {
        
        try {
            // Load signing certificate
            PrivateKey privateKey = (PrivateKey) keyStore.getKey(
                signatureConfig.getKeyAlias(),
                signatureConfig.getKeyPassword().toCharArray()
            );
            
            Certificate[] certificateChain = keyStore.getCertificateChain(signatureConfig.getKeyAlias());
            
            // Create PDF document
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(new ByteArrayInputStream(documentContent)));
            ByteArrayOutputStream signedPdfStream = new ByteArrayOutputStream();
            PdfDocument signedPdfDoc = new PdfDocument(pdfDoc, new PdfWriter(signedPdfStream));
            
            // Create signature appearance
            PdfSignatureAppearance appearance = new PdfSignatureAppearance(signedPdfDoc, new Rectangle(36, 748, 200, 100), 1);
            appearance.setReason("Official document signature");
            appearance.setLocation("Bangkok, Thailand");
            appearance.setContact(signatureConfig.getContactInfo());
            
            // Signature field information
            Map<String, Object> signatureInfo = Map.of(
                "documentType", documentType,
                "signatureDate", LocalDateTime.now().toString(),
                "signerName", signatureConfig.getSignerName(),
                "organizationName", signatureConfig.getOrganizationName()
            );
            
            // Create digital signature
            IExternalSignature externalSignature = new PrivateKeySignature(privateKey, DigestAlgorithms.SHA256, BouncyCastleProvider.PROVIDER_NAME);
            
            PdfSigner signer = new PdfSigner(pdfDoc, signedPdfStream, new StampingProperties());
            signer.setFieldName("signature_" + UUID.randomUUID().toString());
            signer.signDetached(externalSignature, certificateChain, null, null, null, 0, PdfSigner.CryptoStandard.CMS);
            
            signedPdfDoc.close();
            
            return signedPdfStream.toByteArray();
            
        } catch (Exception e) {
            log.error("Failed to digitally sign document", e);
            throw new DigitalSignatureException("Failed to sign document", e);
        }
    }
    
    public SignatureVerificationResult verifySignature(byte[] signedDocumentContent) {
        
        try {
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(new ByteArrayInputStream(signedDocumentContent)));
            SignatureUtil signatureUtil = new SignatureUtil(pdfDoc);
            
            List<String> signatureNames = signatureUtil.getSignatureNames();
            
            if (signatureNames.isEmpty()) {
                return SignatureVerificationResult.builder()
                    .isValid(false)
                    .reason("No signatures found in document")
                    .build();
            }
            
            for (String signatureName : signatureNames) {
                PdfPKCS7 signature = signatureUtil.readSignatureData(signatureName);
                
                // Verify signature
                boolean isSignatureValid = signature.verifySignatureIntegrityAndAuthenticity();
                
                // Verify certificate chain
                Certificate[] certificates = signature.getSignCertificateChain();
                boolean isCertificateValid = verifyCertificateChain(certificates);
                
                if (isSignatureValid && isCertificateValid) {
                    return SignatureVerificationResult.builder()
                        .isValid(true)
                        .signatureName(signatureName)
                        .signerName(signature.getSignName())
                        .signatureDate(signature.getSignDate().toInstant())
                        .certificateInfo(extractCertificateInfo(certificates[0]))
                        .build();
                }
            }
            
            return SignatureVerificationResult.builder()
                .isValid(false)
                .reason("Invalid signature or certificate")
                .build();
            
        } catch (Exception e) {
            log.error("Failed to verify document signature", e);
            return SignatureVerificationResult.builder()
                .isValid(false)
                .reason("Signature verification failed: " + e.getMessage())
                .build();
        }
    }
    
    private boolean verifyCertificateChain(Certificate[] certificateChain) {
        
        try {
            // Build certificate path
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            List<Certificate> certificates = Arrays.asList(certificateChain);
            CertPath certPath = certificateFactory.generateCertPath(certificates);
            
            // Create trust anchors (root CA certificates)
            Set<TrustAnchor> trustAnchors = loadTrustAnchors();
            
            // Validate certificate path
            PKIXParameters pkixParams = new PKIXParameters(trustAnchors);
            pkixParams.setRevocationEnabled(true); // Enable CRL/OCSP checking
            
            CertPathValidator validator = CertPathValidator.getInstance("PKIX");
            validator.validate(certPath, pkixParams);
            
            return true;
            
        } catch (Exception e) {
            log.warn("Certificate chain validation failed", e);
            return false;
        }
    }
    
    private Set<TrustAnchor> loadTrustAnchors() {
        
        Set<TrustAnchor> trustAnchors = new HashSet<>();
        
        try {
            // Load Thai CA certificates
            String[] caCertificatePaths = {
                "/certificates/thai-ca-root.crt",
                "/certificates/govt-ca-root.crt",
                "/certificates/commercial-ca-root.crt"
            };
            
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            
            for (String certPath : caCertificatePaths) {
                try (InputStream certStream = getClass().getResourceAsStream(certPath)) {
                    if (certStream != null) {
                        X509Certificate caCert = (X509Certificate) cf.generateCertificate(certStream);
                        trustAnchors.add(new TrustAnchor(caCert, null));
                    }
                }
            }
            
        } catch (Exception e) {
            log.error("Failed to load trust anchors", e);
        }
        
        return trustAnchors;
    }
}
```

## 6. Event-Driven Integration Architecture

### 6.1 Apache Kafka Integration

#### 6.1.1 Event Publisher Service
```java
@Service
public class EventPublisherService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final EventConfigurationProperties eventConfig;
    
    @EventListener
    public void handlePolicyCreated(PolicyCreatedEvent event) {
        publishEvent("policy.created", event.getPolicy().getId().toString(), event);
    }
    
    @EventListener
    public void handleClaimReported(ClaimReportedEvent event) {
        publishEvent("claim.reported", event.getClaim().getId().toString(), event);
    }
    
    @EventListener
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        publishEvent("payment.processed", event.getPayment().getId().toString(), event);
    }
    
    private void publishEvent(String eventType, String entityId, Object eventData) {
        
        try {
            // Create event envelope
            EventEnvelope envelope = EventEnvelope.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(eventType)
                .entityId(entityId)
                .timestamp(Instant.now())
                .version("1.0")
                .source("auto-insurance-app")
                .data(eventData)
                .build();
            
            // Determine topic based on event type
            String topic = getTopicForEvent(eventType);
            
            // Publish to Kafka
            ListenableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, entityId, envelope);
            
            future.addCallback(
                result -> log.info("Event published successfully: {} to topic: {}", eventType, topic),
                failure -> log.error("Failed to publish event: {} to topic: {}", eventType, topic, failure)
            );
            
        } catch (Exception e) {
            log.error("Failed to publish event: {}", eventType, e);
        }
    }
    
    private String getTopicForEvent(String eventType) {
        
        String baseTopicName = eventConfig.getTopicPrefix();
        
        if (eventType.startsWith("policy.")) {
            return baseTopicName + ".policy-events";
        } else if (eventType.startsWith("claim.")) {
            return baseTopicName + ".claim-events";
        } else if (eventType.startsWith("payment.")) {
            return baseTopicName + ".payment-events";
        } else {
            return baseTopicName + ".general-events";
        }
    }
}
```

#### 6.1.2 Event Consumer Service
```java
@Service
public class EventConsumerService {
    
    private final NotificationService notificationService;
    private final ReportingService reportingService;
    private final AuditService auditService;
    
    @KafkaListener(topics = "${app.events.topic-prefix}.policy-events")
    public void handlePolicyEvent(ConsumerRecord<String, EventEnvelope> record) {
        
        EventEnvelope envelope = record.value();
        
        try {
            switch (envelope.getEventType()) {
                case "policy.created":
                    handlePolicyCreatedEvent(envelope);
                    break;
                case "policy.renewed":
                    handlePolicyRenewedEvent(envelope);
                    break;
                case "policy.cancelled":
                    handlePolicyCancelledEvent(envelope);
                    break;
                default:
                    log.warn("Unknown policy event type: {}", envelope.getEventType());
            }
            
            // Acknowledge processing
            auditService.logEventProcessed(envelope);
            
        } catch (Exception e) {
            log.error("Failed to process policy event: {}", envelope.getEventType(), e);
            
            // Send to dead letter queue for retry
            handleEventProcessingFailure(envelope, e);
        }
    }
    
    @KafkaListener(topics = "${app.events.topic-prefix}.claim-events")
    public void handleClaimEvent(ConsumerRecord<String, EventEnvelope> record) {
        
        EventEnvelope envelope = record.value();
        
        try {
            switch (envelope.getEventType()) {
                case "claim.reported":
                    handleClaimReportedEvent(envelope);
                    break;
                case "claim.approved":
                    handleClaimApprovedEvent(envelope);
                    break;
                case "claim.settled":
                    handleClaimSettledEvent(envelope);
                    break;
                default:
                    log.warn("Unknown claim event type: {}", envelope.getEventType());
            }
            
        } catch (Exception e) {
            log.error("Failed to process claim event: {}", envelope.getEventType(), e);
            handleEventProcessingFailure(envelope, e);
        }
    }
    
    private void handlePolicyCreatedEvent(EventEnvelope envelope) {
        
        PolicyCreatedEvent event = objectMapper.convertValue(envelope.getData(), PolicyCreatedEvent.class);
        Policy policy = event.getPolicy();
        Customer customer = event.getCustomer();
        
        // Send welcome email
        notificationService.sendPolicyCreatedEmail(policy, customer);
        
        // Generate policy documents
        documentGenerationService.generatePolicyDocument(policy, customer, customer.getPreferredLanguage());
        
        // Update customer statistics
        reportingService.updateCustomerStats(customer.getId());
        
        // Send push notification
        notificationService.sendPolicyCreatedNotification(customer.getId(), policy);
    }
    
    private void handleClaimReportedEvent(EventEnvelope envelope) {
        
        ClaimReportedEvent event = objectMapper.convertValue(envelope.getData(), ClaimReportedEvent.class);
        Claim claim = event.getClaim();
        
        // Assign claim to available adjuster
        claimAssignmentService.assignClaim(claim.getId());
        
        // Send confirmation to customer
        notificationService.sendClaimReportedNotification(claim.getPolicy().getCustomerId(), claim);
        
        // Trigger fraud detection analysis
        fraudDetectionService.analyzeClaim(claim);
        
        // Update claims statistics
        reportingService.updateClaimsStats(claim.getPolicy().getId());
    }
    
    private void handleEventProcessingFailure(EventEnvelope envelope, Exception exception) {
        
        // Create failure record
        EventProcessingFailure failure = EventProcessingFailure.builder()
            .eventId(envelope.getEventId())
            .eventType(envelope.getEventType())
            .entityId(envelope.getEntityId())
            .failureReason(exception.getMessage())
            .failureTimestamp(Instant.now())
            .retryCount(0)
            .build();
        
        // Send to dead letter queue
        kafkaTemplate.send("auto-insurance.dead-letter-queue", envelope.getEntityId(), failure);
    }
}
```

### 6.2 Dead Letter Queue Handler

#### 6.2.1 Failed Event Retry Service
```java
@Service
public class FailedEventRetryService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final EventProcessingFailureRepository failureRepository;
    
    @KafkaListener(topics = "auto-insurance.dead-letter-queue")
    public void handleFailedEvent(ConsumerRecord<String, EventProcessingFailure> record) {
        
        EventProcessingFailure failure = record.value();
        
        // Check retry count
        if (failure.getRetryCount() >= 5) {
            // Max retries exceeded, send alert
            sendMaxRetriesExceededAlert(failure);
            return;
        }
        
        // Calculate retry delay (exponential backoff)
        long retryDelay = calculateRetryDelay(failure.getRetryCount());
        
        // Schedule retry
        scheduleEventRetry(failure, retryDelay);
    }
    
    @Scheduled(fixedDelay = 60000) // Check every minute
    public void processScheduledRetries() {
        
        List<EventProcessingFailure> retriesToProcess = failureRepository
            .findByNextRetryTimeBeforeAndRetryCountLessThan(Instant.now(), 5);
        
        for (EventProcessingFailure failure : retriesToProcess) {
            
            try {
                // Republish the original event
                republishOriginalEvent(failure);
                
                // Mark as successfully retried
                failureRepository.delete(failure);
                
            } catch (Exception e) {
                // Increment retry count and reschedule
                failure.setRetryCount(failure.getRetryCount() + 1);
                failure.setLastRetryAttempt(Instant.now());
                failure.setNextRetryTime(Instant.now().plus(calculateRetryDelay(failure.getRetryCount()), ChronoUnit.MINUTES));
                failure.setLastFailureReason(e.getMessage());
                
                failureRepository.save(failure);
            }
        }
    }
    
    private long calculateRetryDelay(int retryCount) {
        // Exponential backoff: 1min, 2min, 4min, 8min, 16min
        return (long) Math.pow(2, retryCount);
    }
    
    private void republishOriginalEvent(EventProcessingFailure failure) {
        
        // Reconstruct original event envelope
        EventEnvelope envelope = EventEnvelope.builder()
            .eventId(failure.getEventId())
            .eventType(failure.getEventType())
            .entityId(failure.getEntityId())
            .timestamp(failure.getOriginalTimestamp())
            .version("1.0")
            .source("auto-insurance-app")
            .data(failure.getOriginalEventData())
            .retryCount(failure.getRetryCount())
            .build();
        
        // Determine original topic
        String topic = getTopicForEvent(failure.getEventType());
        
        // Republish event
        kafkaTemplate.send(topic, failure.getEntityId(), envelope);
        
        log.info("Republished failed event: {} (retry #{})", failure.getEventType(), failure.getRetryCount());
    }
    
    private void sendMaxRetriesExceededAlert(EventProcessingFailure failure) {
        
        AlertNotification alert = AlertNotification.builder()
            .alertType("MAX_RETRIES_EXCEEDED")
            .severity(AlertSeverity.HIGH)
            .title("Event Processing Failed - Max Retries Exceeded")
            .message(String.format("Event %s (ID: %s) failed processing after 5 retry attempts. " +
                                  "Last failure: %s", 
                                  failure.getEventType(), 
                                  failure.getEventId(),
                                  failure.getLastFailureReason()))
            .timestamp(Instant.now())
            .build();
        
        alertNotificationService.sendAlert(alert);
    }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-27  
**Integration Architecture**: Event-Driven Microservices  
**Review Schedule**: Quarterly  
**Contact**: integration-team@autoinsurance.co.th