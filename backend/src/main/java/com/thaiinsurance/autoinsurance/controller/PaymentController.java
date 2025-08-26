package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.PaymentRequest;
import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.model.Payment;
import com.thaiinsurance.autoinsurance.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Management", description = "Payment processing and management APIs")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    @Operation(summary = "Create new payment", description = "Create a new payment record for policy premium or claims")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> createPayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        Payment payment = convertToPayment(paymentRequest);
        Payment createdPayment = paymentService.createPayment(payment);
        return ResponseEntity.ok(ApiResponse.success("Payment created successfully", createdPayment));
    }
    
    @GetMapping
    @Operation(summary = "Get all payments", description = "Retrieve all payments with pagination")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Payment>>> getAllPayments(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Payment> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID", description = "Retrieve payment details by ID")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
            .map(payment -> ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment)))
            .orElse(ResponseEntity.ok(ApiResponse.error("Payment not found", null)));
    }
    
    @GetMapping("/policy/{policyId}")
    @Operation(summary = "Get payments by policy", description = "Retrieve all payments for a specific policy")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByPolicy(@PathVariable Long policyId) {
        List<Payment> payments = paymentService.getPaymentsByPolicy(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy payments retrieved successfully", payments));
    }
    
    @PostMapping("/{id}/process")
    @Operation(summary = "Process payment", description = "Process a payment through payment gateway")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> processPayment(
            @PathVariable Long id,
            @RequestParam String transactionId,
            @RequestParam(required = false) String gatewayResponse) {
        Payment payment = paymentService.processPayment(id, transactionId, gatewayResponse);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", payment));
    }
    
    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirm payment", description = "Confirm a successful payment")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> confirmPayment(
            @PathVariable Long id,
            @RequestParam Long processedBy) {
        Payment payment = paymentService.confirmPayment(id, processedBy);
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed successfully", payment));
    }
    
    @PostMapping("/{id}/fail")
    @Operation(summary = "Mark payment as failed", description = "Mark payment as failed with reason")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> failPayment(
            @PathVariable Long id,
            @RequestParam String failureReason) {
        Payment payment = paymentService.failPayment(id, failureReason);
        return ResponseEntity.ok(ApiResponse.success("Payment marked as failed", payment));
    }
    
    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund payment", description = "Process a refund for a payment")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> refundPayment(
            @PathVariable Long id,
            @RequestParam BigDecimal refundAmount,
            @RequestParam String reason) {
        Payment refund = paymentService.refundPayment(id, refundAmount, reason);
        return ResponseEntity.ok(ApiResponse.success("Refund processed successfully", refund));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search payments", description = "Search payments by reference, policy number, or customer name")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<Payment>>> searchPayments(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentService.searchPayments(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Payment search completed", payments));
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics", description = "Get payment statistics and analytics")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PaymentService.PaymentStatistics>> getPaymentStatistics() {
        PaymentService.PaymentStatistics stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(ApiResponse.success("Payment statistics retrieved successfully", stats));
    }
    
    // Thai-specific payment methods will be implemented later
    
    // Helper methods
    private Payment convertToPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        // Set policy later based on policyId lookup
        // Other fields will be set by the service
        return payment;
    }
}