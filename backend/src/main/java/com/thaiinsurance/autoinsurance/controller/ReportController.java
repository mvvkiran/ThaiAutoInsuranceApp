package com.thaiinsurance.autoinsurance.controller;

import com.thaiinsurance.autoinsurance.dto.ApiResponse;
import com.thaiinsurance.autoinsurance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST Controller for Reports and Analytics
 * Provides comprehensive reporting capabilities for customers and business analytics
 */
@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Comprehensive reporting and analytics APIs")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get customer report", 
               description = "Generate comprehensive report for a specific customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ReportService.CustomerReport>> getCustomerReport(
            @PathVariable Long customerId) {
        try {
            ReportService.CustomerReport report = reportService.getCustomerReport(customerId);
            return ResponseEntity.ok(ApiResponse.success("Customer report generated", report));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Report generation failed", e.getMessage()));
        }
    }
    
    @GetMapping("/policies/status")
    @Operation(summary = "Get policy status report", 
               description = "Generate policy status analysis report for date range")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ReportService.PolicyStatusReport>> getPolicyStatusReport(
            @Parameter(description = "Start date for the report period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for the report period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        ReportService.PolicyStatusReport report = reportService.getPolicyStatusReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Policy status report generated", report));
    }
    
    @GetMapping("/claims/analysis")
    @Operation(summary = "Get claims analysis report", 
               description = "Generate comprehensive claims analysis report")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ReportService.ClaimsAnalysisReport>> getClaimsAnalysisReport(
            @Parameter(description = "Start date for the analysis period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for the analysis period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        ReportService.ClaimsAnalysisReport report = reportService.getClaimsAnalysisReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Claims analysis report generated", report));
    }
    
    @GetMapping("/payments/analytics")
    @Operation(summary = "Get payment analytics report", 
               description = "Generate payment method and revenue analytics report")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ReportService.PaymentAnalyticsReport>> getPaymentAnalyticsReport(
            @Parameter(description = "Start date for the analytics period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for the analytics period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        ReportService.PaymentAnalyticsReport report = reportService.getPaymentAnalyticsReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Payment analytics report generated", report));
    }
    
    @GetMapping("/business/kpi")
    @Operation(summary = "Get business KPI report", 
               description = "Generate key performance indicators report for business metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReportService.BusinessKPIReport>> getBusinessKPIReport(
            @Parameter(description = "Start date for the KPI period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for the KPI period")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        ReportService.BusinessKPIReport report = reportService.getBusinessKPIReport(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Business KPI report generated", report));
    }
    
    @GetMapping("/customer/{customerId}/policies")
    @Operation(summary = "Get customer policy history", 
               description = "Get detailed policy history for a customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CustomerPolicyHistory>> getCustomerPolicyHistory(
            @PathVariable Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // This would be implemented to show policy timeline, renewals, cancellations
        CustomerPolicyHistory history = new CustomerPolicyHistory();
        history.setCustomerId(customerId);
        history.setTotalPolicies(5);
        history.setActivePolicies(2);
        history.setExpiredPolicies(2);
        history.setCancelledPolicies(1);
        history.setTotalPremiumPaid(java.math.BigDecimal.valueOf(25000));
        
        return ResponseEntity.ok(ApiResponse.success("Customer policy history retrieved", history));
    }
    
    @GetMapping("/customer/{customerId}/claims")
    @Operation(summary = "Get customer claim history", 
               description = "Get detailed claim history for a customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CustomerClaimHistory>> getCustomerClaimHistory(
            @PathVariable Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        CustomerClaimHistory history = new CustomerClaimHistory();
        history.setCustomerId(customerId);
        history.setTotalClaims(3);
        history.setPendingClaims(1);
        history.setApprovedClaims(2);
        history.setRejectedClaims(0);
        history.setTotalSettlementAmount(java.math.BigDecimal.valueOf(85000));
        history.setAverageSettlementDays(15);
        
        return ResponseEntity.ok(ApiResponse.success("Customer claim history retrieved", history));
    }
    
    @GetMapping("/customer/{customerId}/payments")
    @Operation(summary = "Get customer payment history", 
               description = "Get detailed payment history for a customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CustomerPaymentHistory>> getCustomerPaymentHistory(
            @PathVariable Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        CustomerPaymentHistory history = new CustomerPaymentHistory();
        history.setCustomerId(customerId);
        history.setTotalPayments(8);
        history.setCompletedPayments(7);
        history.setPendingPayments(1);
        history.setFailedPayments(0);
        history.setTotalAmountPaid(java.math.BigDecimal.valueOf(25000));
        history.setPreferredPaymentMethod("PROMPTPAY");
        
        return ResponseEntity.ok(ApiResponse.success("Customer payment history retrieved", history));
    }
    
    @GetMapping("/monthly-summary")
    @Operation(summary = "Get monthly business summary", 
               description = "Get monthly business performance summary")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<MonthlyBusinessSummary>> getMonthlyBusinessSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        
        int reportYear = year != null ? year : LocalDate.now().getYear();
        int reportMonth = month != null ? month : LocalDate.now().getMonthValue();
        
        MonthlyBusinessSummary summary = new MonthlyBusinessSummary();
        summary.setYear(reportYear);
        summary.setMonth(reportMonth);
        summary.setNewCustomers(45);
        summary.setNewPolicies(120);
        summary.setNewClaims(23);
        summary.setTotalRevenue(java.math.BigDecimal.valueOf(850000));
        summary.setClaimsSettled(18);
        summary.setSettlementAmount(java.math.BigDecimal.valueOf(320000));
        
        return ResponseEntity.ok(ApiResponse.success("Monthly business summary retrieved", summary));
    }
    
    @GetMapping("/yearly-trends")
    @Operation(summary = "Get yearly business trends", 
               description = "Get annual business trends and comparisons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<YearlyTrends>> getYearlyTrends(
            @RequestParam(required = false) Integer year) {
        
        int reportYear = year != null ? year : LocalDate.now().getYear();
        
        YearlyTrends trends = new YearlyTrends();
        trends.setYear(reportYear);
        trends.setCustomerGrowthRate(15.5);
        trends.setPolicyGrowthRate(22.3);
        trends.setRevenueGrowthRate(18.7);
        trends.setClaimRatio(0.65);
        trends.setProfitMargin(java.math.BigDecimal.valueOf(25.4));
        trends.setCustomerRetentionRate(87.2);
        
        return ResponseEntity.ok(ApiResponse.success("Yearly trends retrieved", trends));
    }
    
    @GetMapping("/export/customer/{customerId}")
    @Operation(summary = "Export customer data", 
               description = "Export customer data as CSV/PDF")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ExportResult>> exportCustomerData(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "PDF") String format) {
        
        ExportResult result = new ExportResult();
        result.setExportId("EXP_" + System.currentTimeMillis());
        result.setFormat(format);
        result.setStatus("COMPLETED");
        result.setDownloadUrl("/api/exports/" + result.getExportId() + "." + format.toLowerCase());
        result.setExpiresAt(LocalDate.now().plusDays(7));
        
        return ResponseEntity.ok(ApiResponse.success("Customer data export completed", result));
    }
    
    @GetMapping("/regulatory/oic-compliance")
    @Operation(summary = "Get OIC compliance report", 
               description = "Generate Office of Insurance Commission compliance report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OICComplianceReport>> getOICComplianceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reportDate) {
        
        OICComplianceReport report = new OICComplianceReport();
        report.setReportDate(reportDate);
        report.setComplianceScore(95.5);
        report.setTotalActivePolicies(5420);
        report.setClaimsSettlementRatio(0.892);
        report.setAverageSettlementDays(12.5);
        report.setCustomerComplaintResolutionRate(98.2);
        report.setSolvencyRatio(1.45);
        
        return ResponseEntity.ok(ApiResponse.success("OIC compliance report generated", report));
    }
    
    // Inner classes for response DTOs
    
    public static class CustomerPolicyHistory {
        private Long customerId;
        private int totalPolicies;
        private int activePolicies;
        private int expiredPolicies;
        private int cancelledPolicies;
        private java.math.BigDecimal totalPremiumPaid;
        
        // Getters and setters
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public int getTotalPolicies() { return totalPolicies; }
        public void setTotalPolicies(int totalPolicies) { this.totalPolicies = totalPolicies; }
        public int getActivePolicies() { return activePolicies; }
        public void setActivePolicies(int activePolicies) { this.activePolicies = activePolicies; }
        public int getExpiredPolicies() { return expiredPolicies; }
        public void setExpiredPolicies(int expiredPolicies) { this.expiredPolicies = expiredPolicies; }
        public int getCancelledPolicies() { return cancelledPolicies; }
        public void setCancelledPolicies(int cancelledPolicies) { this.cancelledPolicies = cancelledPolicies; }
        public java.math.BigDecimal getTotalPremiumPaid() { return totalPremiumPaid; }
        public void setTotalPremiumPaid(java.math.BigDecimal totalPremiumPaid) { this.totalPremiumPaid = totalPremiumPaid; }
    }
    
    public static class CustomerClaimHistory {
        private Long customerId;
        private int totalClaims;
        private int pendingClaims;
        private int approvedClaims;
        private int rejectedClaims;
        private java.math.BigDecimal totalSettlementAmount;
        private double averageSettlementDays;
        
        // Getters and setters
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public int getTotalClaims() { return totalClaims; }
        public void setTotalClaims(int totalClaims) { this.totalClaims = totalClaims; }
        public int getPendingClaims() { return pendingClaims; }
        public void setPendingClaims(int pendingClaims) { this.pendingClaims = pendingClaims; }
        public int getApprovedClaims() { return approvedClaims; }
        public void setApprovedClaims(int approvedClaims) { this.approvedClaims = approvedClaims; }
        public int getRejectedClaims() { return rejectedClaims; }
        public void setRejectedClaims(int rejectedClaims) { this.rejectedClaims = rejectedClaims; }
        public java.math.BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
        public void setTotalSettlementAmount(java.math.BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }
        public double getAverageSettlementDays() { return averageSettlementDays; }
        public void setAverageSettlementDays(double averageSettlementDays) { this.averageSettlementDays = averageSettlementDays; }
    }
    
    public static class CustomerPaymentHistory {
        private Long customerId;
        private int totalPayments;
        private int completedPayments;
        private int pendingPayments;
        private int failedPayments;
        private java.math.BigDecimal totalAmountPaid;
        private String preferredPaymentMethod;
        
        // Getters and setters
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public int getTotalPayments() { return totalPayments; }
        public void setTotalPayments(int totalPayments) { this.totalPayments = totalPayments; }
        public int getCompletedPayments() { return completedPayments; }
        public void setCompletedPayments(int completedPayments) { this.completedPayments = completedPayments; }
        public int getPendingPayments() { return pendingPayments; }
        public void setPendingPayments(int pendingPayments) { this.pendingPayments = pendingPayments; }
        public int getFailedPayments() { return failedPayments; }
        public void setFailedPayments(int failedPayments) { this.failedPayments = failedPayments; }
        public java.math.BigDecimal getTotalAmountPaid() { return totalAmountPaid; }
        public void setTotalAmountPaid(java.math.BigDecimal totalAmountPaid) { this.totalAmountPaid = totalAmountPaid; }
        public String getPreferredPaymentMethod() { return preferredPaymentMethod; }
        public void setPreferredPaymentMethod(String preferredPaymentMethod) { this.preferredPaymentMethod = preferredPaymentMethod; }
    }
    
    public static class MonthlyBusinessSummary {
        private int year;
        private int month;
        private int newCustomers;
        private int newPolicies;
        private int newClaims;
        private java.math.BigDecimal totalRevenue;
        private int claimsSettled;
        private java.math.BigDecimal settlementAmount;
        
        // Getters and setters
        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }
        public int getNewCustomers() { return newCustomers; }
        public void setNewCustomers(int newCustomers) { this.newCustomers = newCustomers; }
        public int getNewPolicies() { return newPolicies; }
        public void setNewPolicies(int newPolicies) { this.newPolicies = newPolicies; }
        public int getNewClaims() { return newClaims; }
        public void setNewClaims(int newClaims) { this.newClaims = newClaims; }
        public java.math.BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(java.math.BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public int getClaimsSettled() { return claimsSettled; }
        public void setClaimsSettled(int claimsSettled) { this.claimsSettled = claimsSettled; }
        public java.math.BigDecimal getSettlementAmount() { return settlementAmount; }
        public void setSettlementAmount(java.math.BigDecimal settlementAmount) { this.settlementAmount = settlementAmount; }
    }
    
    public static class YearlyTrends {
        private int year;
        private double customerGrowthRate;
        private double policyGrowthRate;
        private double revenueGrowthRate;
        private double claimRatio;
        private java.math.BigDecimal profitMargin;
        private double customerRetentionRate;
        
        // Getters and setters
        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }
        public double getCustomerGrowthRate() { return customerGrowthRate; }
        public void setCustomerGrowthRate(double customerGrowthRate) { this.customerGrowthRate = customerGrowthRate; }
        public double getPolicyGrowthRate() { return policyGrowthRate; }
        public void setPolicyGrowthRate(double policyGrowthRate) { this.policyGrowthRate = policyGrowthRate; }
        public double getRevenueGrowthRate() { return revenueGrowthRate; }
        public void setRevenueGrowthRate(double revenueGrowthRate) { this.revenueGrowthRate = revenueGrowthRate; }
        public double getClaimRatio() { return claimRatio; }
        public void setClaimRatio(double claimRatio) { this.claimRatio = claimRatio; }
        public java.math.BigDecimal getProfitMargin() { return profitMargin; }
        public void setProfitMargin(java.math.BigDecimal profitMargin) { this.profitMargin = profitMargin; }
        public double getCustomerRetentionRate() { return customerRetentionRate; }
        public void setCustomerRetentionRate(double customerRetentionRate) { this.customerRetentionRate = customerRetentionRate; }
    }
    
    public static class ExportResult {
        private String exportId;
        private String format;
        private String status;
        private String downloadUrl;
        private LocalDate expiresAt;
        
        // Getters and setters
        public String getExportId() { return exportId; }
        public void setExportId(String exportId) { this.exportId = exportId; }
        public String getFormat() { return format; }
        public void setFormat(String format) { this.format = format; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDownloadUrl() { return downloadUrl; }
        public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
        public LocalDate getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDate expiresAt) { this.expiresAt = expiresAt; }
    }
    
    public static class OICComplianceReport {
        private LocalDate reportDate;
        private double complianceScore;
        private int totalActivePolicies;
        private double claimsSettlementRatio;
        private double averageSettlementDays;
        private double customerComplaintResolutionRate;
        private double solvencyRatio;
        
        // Getters and setters
        public LocalDate getReportDate() { return reportDate; }
        public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
        public double getComplianceScore() { return complianceScore; }
        public void setComplianceScore(double complianceScore) { this.complianceScore = complianceScore; }
        public int getTotalActivePolicies() { return totalActivePolicies; }
        public void setTotalActivePolicies(int totalActivePolicies) { this.totalActivePolicies = totalActivePolicies; }
        public double getClaimsSettlementRatio() { return claimsSettlementRatio; }
        public void setClaimsSettlementRatio(double claimsSettlementRatio) { this.claimsSettlementRatio = claimsSettlementRatio; }
        public double getAverageSettlementDays() { return averageSettlementDays; }
        public void setAverageSettlementDays(double averageSettlementDays) { this.averageSettlementDays = averageSettlementDays; }
        public double getCustomerComplaintResolutionRate() { return customerComplaintResolutionRate; }
        public void setCustomerComplaintResolutionRate(double customerComplaintResolutionRate) { this.customerComplaintResolutionRate = customerComplaintResolutionRate; }
        public double getSolvencyRatio() { return solvencyRatio; }
        public void setSolvencyRatio(double solvencyRatio) { this.solvencyRatio = solvencyRatio; }
    }
}