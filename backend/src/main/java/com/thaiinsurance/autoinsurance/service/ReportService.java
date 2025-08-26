package com.thaiinsurance.autoinsurance.service;

import com.thaiinsurance.autoinsurance.model.*;
import com.thaiinsurance.autoinsurance.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating reports and analytics
 */
@Service
@Transactional(readOnly = true)
public class ReportService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private ClaimRepository claimRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    /**
     * Generate customer summary report
     */
    public CustomerReport getCustomerReport(Long customerId) {
        logger.info("Generating customer report for customer {}", customerId);
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        
        CustomerReport report = new CustomerReport();
        report.setCustomer(customer);
        report.setGeneratedAt(LocalDateTime.now());
        
        // Get customer's policies
        List<Policy> policies = policyRepository.findByCustomerId(customerId);
        report.setPolicies(policies);
        report.setTotalPolicies(policies.size());
        report.setActivePolicies(policies.stream()
            .mapToInt(p -> p.getStatus() == Policy.PolicyStatus.ACTIVE ? 1 : 0)
            .sum());
        
        // Get customer's claims
        List<Claim> claims = claimRepository.findByPolicyCustomerId(customerId);
        report.setClaims(claims);
        report.setTotalClaims(claims.size());
        report.setPendingClaims(claims.stream()
            .mapToInt(c -> c.getStatus() == Claim.ClaimStatus.SUBMITTED || 
                          c.getStatus() == Claim.ClaimStatus.UNDER_REVIEW ? 1 : 0)
            .sum());
        
        // Get customer's payments
        List<Payment> payments = paymentRepository.findByPolicyCustomerId(customerId);
        report.setPayments(payments);
        report.setTotalPayments(payments.size());
        report.setTotalAmountPaid(payments.stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        // Get customer's vehicles
        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(customerId);
        report.setVehicles(vehicles);
        report.setTotalVehicles(vehicles.size());
        
        return report;
    }
    
    /**
     * Generate policy status report
     */
    public PolicyStatusReport getPolicyStatusReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating policy status report for period {} to {}", startDate, endDate);
        
        PolicyStatusReport report = new PolicyStatusReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setGeneratedAt(LocalDateTime.now());
        
        // Policy counts by status
        Map<String, Long> policyCountsByStatus = new HashMap<>();
        for (Policy.PolicyStatus status : Policy.PolicyStatus.values()) {
            long count = policyRepository.countByStatusAndDateRange(status, startDate, endDate);
            policyCountsByStatus.put(status.name(), count);
        }
        report.setPolicyCountsByStatus(policyCountsByStatus);
        
        // Policy counts by type
        Map<String, Long> policyCountsByType = new HashMap<>();
        for (Policy.PolicyType type : Policy.PolicyType.values()) {
            long count = policyRepository.countByTypeAndDateRange(type, startDate, endDate);
            policyCountsByType.put(type.name(), count);
        }
        report.setPolicyCountsByType(policyCountsByType);
        
        // Policy counts by coverage
        Map<String, Long> policyCountsByCoverage = new HashMap<>();
        for (Policy.CoverageType coverage : Policy.CoverageType.values()) {
            long count = policyRepository.countByCoverageTypeAndDateRange(coverage, startDate, endDate);
            policyCountsByCoverage.put(coverage.name(), count);
        }
        report.setPolicyCountsByCoverage(policyCountsByCoverage);
        
        // Premium statistics
        report.setTotalPremiumCollected(paymentRepository.sumCompletedPaymentAmountsByDateRange(startDate, endDate));
        report.setPendingPremium(paymentRepository.sumPendingPaymentAmountsByDateRange(startDate, endDate));
        
        // Monthly breakdown
        report.setMonthlyPolicyCounts(getMonthlyPolicyCounts(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate claims analysis report
     */
    public ClaimsAnalysisReport getClaimsAnalysisReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating claims analysis report for period {} to {}", startDate, endDate);
        
        ClaimsAnalysisReport report = new ClaimsAnalysisReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setGeneratedAt(LocalDateTime.now());
        
        // Claims counts by status
        Map<String, Long> claimsCountsByStatus = new HashMap<>();
        for (Claim.ClaimStatus status : Claim.ClaimStatus.values()) {
            long count = claimRepository.countByStatusAndDateRange(status, startDate, endDate);
            claimsCountsByStatus.put(status.name(), count);
        }
        report.setClaimsCountsByStatus(claimsCountsByStatus);
        
        // Claims counts by incident type
        Map<String, Long> claimsCountsByIncidentType = new HashMap<>();
        for (Claim.IncidentType type : Claim.IncidentType.values()) {
            long count = claimRepository.countByIncidentTypeAndDateRange(type, startDate, endDate);
            claimsCountsByIncidentType.put(type.name(), count);
        }
        report.setClaimsCountsByIncidentType(claimsCountsByIncidentType);
        
        // Claims counts by priority
        Map<String, Long> claimsCountsByPriority = new HashMap<>();
        for (Claim.PriorityLevel priority : Claim.PriorityLevel.values()) {
            long count = claimRepository.countByPriorityAndDateRange(priority, startDate, endDate);
            claimsCountsByPriority.put(priority.name(), count);
        }
        report.setClaimsCountsByPriority(claimsCountsByPriority);
        
        // Settlement statistics
        report.setTotalSettlementAmount(claimRepository.sumSettledAmountByDateRange(startDate, endDate));
        report.setAverageSettlementAmount(claimRepository.getAverageSettlementAmount(startDate, endDate));
        report.setAverageSettlementDays(claimRepository.getAverageSettlementDays(startDate, endDate));
        
        // Top claim causes
        report.setTopClaimCauses(getTopClaimCauses(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate payment analytics report
     */
    public PaymentAnalyticsReport getPaymentAnalyticsReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating payment analytics report for period {} to {}", startDate, endDate);
        
        PaymentAnalyticsReport report = new PaymentAnalyticsReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setGeneratedAt(LocalDateTime.now());
        
        // Payment counts by method
        Map<String, Long> paymentCountsByMethod = new HashMap<>();
        Map<String, BigDecimal> revenueByMethod = new HashMap<>();
        for (Payment.PaymentMethod method : Payment.PaymentMethod.values()) {
            long count = paymentRepository.countByPaymentMethodAndDateRange(method, startDate, endDate);
            BigDecimal revenue = paymentRepository.sumRevenueByPaymentMethodAndDateRange(method, startDate, endDate);
            paymentCountsByMethod.put(method.name(), count);
            revenueByMethod.put(method.name(), revenue != null ? revenue : BigDecimal.ZERO);
        }
        report.setPaymentCountsByMethod(paymentCountsByMethod);
        report.setRevenueByPaymentMethod(revenueByMethod);
        
        // Payment counts by status
        Map<String, Long> paymentCountsByStatus = new HashMap<>();
        for (Payment.PaymentStatus status : Payment.PaymentStatus.values()) {
            long count = paymentRepository.countByStatusAndDateRange(status, startDate, endDate);
            paymentCountsByStatus.put(status.name(), count);
        }
        report.setPaymentCountsByStatus(paymentCountsByStatus);
        
        // Overall statistics
        report.setTotalRevenue(paymentRepository.sumRevenueByDateRange(startDate, endDate));
        report.setAveragePaymentAmount(paymentRepository.getAveragePaymentAmount(startDate, endDate));
        report.setPaymentSuccessRate(calculatePaymentSuccessRate(startDate, endDate));
        
        // Daily revenue trend
        report.setDailyRevenue(getDailyRevenue(startDate, endDate));
        
        return report;
    }
    
    /**
     * Generate business KPIs
     */
    public BusinessKPIReport getBusinessKPIReport(LocalDate startDate, LocalDate endDate) {
        logger.info("Generating business KPI report for period {} to {}", startDate, endDate);
        
        BusinessKPIReport report = new BusinessKPIReport();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setGeneratedAt(LocalDateTime.now());
        
        // Customer metrics
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        report.setNewCustomers(customerRepository.countNewCustomersBetween(startDateTime, endDateTime));
        report.setActiveCustomers(customerRepository.countActiveCustomersByDateRange(startDateTime, endDateTime));
        report.setCustomerRetentionRate(calculateCustomerRetentionRate(startDate, endDate));
        
        // Policy metrics
        report.setNewPolicies(policyRepository.countNewPoliciesBetween(startDate, endDate));
        report.setPolicyRenewalRate(calculatePolicyRenewalRate(startDate, endDate));
        report.setPolicyCancellationRate(calculatePolicyCancellationRate(startDate, endDate));
        
        // Claims metrics
        report.setClaimFrequency(calculateClaimFrequency(startDate, endDate));
        report.setClaimSeverity(calculateClaimSeverity(startDate, endDate));
        report.setClaimSettlementRatio(calculateClaimSettlementRatio(startDate, endDate));
        
        // Financial metrics
        report.setTotalRevenue(paymentRepository.sumRevenueByDateRange(startDate, endDate));
        report.setTotalClaims(claimRepository.sumSettledAmountByDateRange(startDate, endDate));
        report.setProfitMargin(calculateProfitMargin(report.getTotalRevenue(), report.getTotalClaims()));
        
        // Growth metrics
        report.setRevenueGrowthRate(calculateRevenueGrowthRate(startDate, endDate));
        report.setPolicyGrowthRate(calculatePolicyGrowthRate(startDate, endDate));
        
        return report;
    }
    
    // Private helper methods
    
    private List<MonthlyCount> getMonthlyPolicyCounts(LocalDate startDate, LocalDate endDate) {
        // In real implementation, this would query the database for monthly aggregates
        List<MonthlyCount> monthlyCounts = new ArrayList<>();
        LocalDate current = startDate.withDayOfMonth(1);
        
        while (!current.isAfter(endDate)) {
            long count = policyRepository.countNewPoliciesBetween(
                current, current.plusMonths(1).minusDays(1));
            monthlyCounts.add(new MonthlyCount(current.toString(), count));
            current = current.plusMonths(1);
        }
        
        return monthlyCounts;
    }
    
    private List<ClaimCause> getTopClaimCauses(LocalDate startDate, LocalDate endDate) {
        List<ClaimCause> causes = new ArrayList<>();
        
        for (Claim.IncidentType type : Claim.IncidentType.values()) {
            long count = claimRepository.countByIncidentTypeAndDateRange(type, startDate, endDate);
            causes.add(new ClaimCause(type.name(), count));
        }
        
        return causes.stream()
            .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
            .limit(10)
            .collect(Collectors.toList());
    }
    
    private List<DailyRevenue> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        List<DailyRevenue> dailyRevenues = new ArrayList<>();
        LocalDate current = startDate;
        
        while (!current.isAfter(endDate)) {
            BigDecimal revenue = paymentRepository.sumRevenueByDateRange(current, current);
            dailyRevenues.add(new DailyRevenue(current, revenue != null ? revenue : BigDecimal.ZERO));
            current = current.plusDays(1);
        }
        
        return dailyRevenues;
    }
    
    private double calculatePaymentSuccessRate(LocalDate startDate, LocalDate endDate) {
        long totalPayments = paymentRepository.countByDateRange(startDate, endDate);
        long successfulPayments = paymentRepository.countByStatusAndDateRange(
            Payment.PaymentStatus.COMPLETED, startDate, endDate);
        
        return totalPayments > 0 ? (double) successfulPayments / totalPayments * 100.0 : 0.0;
    }
    
    private double calculateCustomerRetentionRate(LocalDate startDate, LocalDate endDate) {
        // Simplified calculation - in real implementation would be more complex
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        long activeCustomers = customerRepository.countActiveCustomersByDateRange(startDateTime, endDateTime);
        long totalCustomers = customerRepository.countByDateRange(startDateTime, endDateTime);
        
        return totalCustomers > 0 ? (double) activeCustomers / totalCustomers * 100.0 : 0.0;
    }
    
    private double calculatePolicyRenewalRate(LocalDate startDate, LocalDate endDate) {
        long expiredPolicies = policyRepository.countExpiredPoliciesByDateRange(startDate, endDate);
        long renewedPolicies = policyRepository.countRenewedPoliciesByDateRange(startDate, endDate);
        
        return expiredPolicies > 0 ? (double) renewedPolicies / expiredPolicies * 100.0 : 0.0;
    }
    
    private double calculatePolicyCancellationRate(LocalDate startDate, LocalDate endDate) {
        long totalPolicies = policyRepository.countByDateRange(startDate, endDate);
        long cancelledPolicies = policyRepository.countByStatusAndDateRange(
            Policy.PolicyStatus.CANCELLED, startDate, endDate);
        
        return totalPolicies > 0 ? (double) cancelledPolicies / totalPolicies * 100.0 : 0.0;
    }
    
    private double calculateClaimFrequency(LocalDate startDate, LocalDate endDate) {
        long totalClaims = claimRepository.countByDateRange(startDate, endDate);
        long activePolicies = policyRepository.countActiveByDateRange(startDate, endDate);
        
        return activePolicies > 0 ? (double) totalClaims / activePolicies * 100.0 : 0.0;
    }
    
    private BigDecimal calculateClaimSeverity(LocalDate startDate, LocalDate endDate) {
        BigDecimal totalSettlement = claimRepository.sumSettledAmountByDateRange(startDate, endDate);
        long settledClaims = claimRepository.countSettledByDateRange(startDate, endDate);
        
        return settledClaims > 0 ? 
            totalSettlement.divide(BigDecimal.valueOf(settledClaims), 2, BigDecimal.ROUND_HALF_UP) : 
            BigDecimal.ZERO;
    }
    
    private double calculateClaimSettlementRatio(LocalDate startDate, LocalDate endDate) {
        long totalClaims = claimRepository.countByDateRange(startDate, endDate);
        long settledClaims = claimRepository.countSettledByDateRange(startDate, endDate);
        
        return totalClaims > 0 ? (double) settledClaims / totalClaims * 100.0 : 0.0;
    }
    
    private BigDecimal calculateProfitMargin(BigDecimal revenue, BigDecimal claims) {
        if (revenue == null || revenue.equals(BigDecimal.ZERO)) return BigDecimal.ZERO;
        
        BigDecimal profit = revenue.subtract(claims != null ? claims : BigDecimal.ZERO);
        return profit.divide(revenue, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100));
    }
    
    private double calculateRevenueGrowthRate(LocalDate startDate, LocalDate endDate) {
        // Compare with same period in previous year - simplified implementation
        LocalDate previousYearStart = startDate.minusYears(1);
        LocalDate previousYearEnd = endDate.minusYears(1);
        
        BigDecimal currentRevenue = paymentRepository.sumRevenueByDateRange(startDate, endDate);
        BigDecimal previousRevenue = paymentRepository.sumRevenueByDateRange(previousYearStart, previousYearEnd);
        
        if (previousRevenue == null || previousRevenue.equals(BigDecimal.ZERO)) return 0.0;
        
        return currentRevenue.subtract(previousRevenue)
                           .divide(previousRevenue, 4, BigDecimal.ROUND_HALF_UP)
                           .multiply(BigDecimal.valueOf(100))
                           .doubleValue();
    }
    
    private double calculatePolicyGrowthRate(LocalDate startDate, LocalDate endDate) {
        LocalDate previousYearStart = startDate.minusYears(1);
        LocalDate previousYearEnd = endDate.minusYears(1);
        
        long currentPolicies = policyRepository.countNewPoliciesBetween(startDate, endDate);
        long previousPolicies = policyRepository.countNewPoliciesBetween(previousYearStart, previousYearEnd);
        
        return previousPolicies > 0 ? 
            ((double) (currentPolicies - previousPolicies) / previousPolicies) * 100.0 : 0.0;
    }
    
    // Inner classes for report DTOs
    
    public static class CustomerReport {
        private Customer customer;
        private LocalDateTime generatedAt;
        private List<Policy> policies;
        private List<Claim> claims;
        private List<Payment> payments;
        private List<Vehicle> vehicles;
        private int totalPolicies;
        private int activePolicies;
        private int totalClaims;
        private int pendingClaims;
        private int totalPayments;
        private BigDecimal totalAmountPaid;
        private int totalVehicles;
        
        // Getters and setters
        public Customer getCustomer() { return customer; }
        public void setCustomer(Customer customer) { this.customer = customer; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
        public List<Policy> getPolicies() { return policies; }
        public void setPolicies(List<Policy> policies) { this.policies = policies; }
        public List<Claim> getClaims() { return claims; }
        public void setClaims(List<Claim> claims) { this.claims = claims; }
        public List<Payment> getPayments() { return payments; }
        public void setPayments(List<Payment> payments) { this.payments = payments; }
        public List<Vehicle> getVehicles() { return vehicles; }
        public void setVehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; }
        public int getTotalPolicies() { return totalPolicies; }
        public void setTotalPolicies(int totalPolicies) { this.totalPolicies = totalPolicies; }
        public int getActivePolicies() { return activePolicies; }
        public void setActivePolicies(int activePolicies) { this.activePolicies = activePolicies; }
        public int getTotalClaims() { return totalClaims; }
        public void setTotalClaims(int totalClaims) { this.totalClaims = totalClaims; }
        public int getPendingClaims() { return pendingClaims; }
        public void setPendingClaims(int pendingClaims) { this.pendingClaims = pendingClaims; }
        public int getTotalPayments() { return totalPayments; }
        public void setTotalPayments(int totalPayments) { this.totalPayments = totalPayments; }
        public BigDecimal getTotalAmountPaid() { return totalAmountPaid; }
        public void setTotalAmountPaid(BigDecimal totalAmountPaid) { this.totalAmountPaid = totalAmountPaid; }
        public int getTotalVehicles() { return totalVehicles; }
        public void setTotalVehicles(int totalVehicles) { this.totalVehicles = totalVehicles; }
    }
    
    public static class PolicyStatusReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime generatedAt;
        private Map<String, Long> policyCountsByStatus;
        private Map<String, Long> policyCountsByType;
        private Map<String, Long> policyCountsByCoverage;
        private BigDecimal totalPremiumCollected;
        private BigDecimal pendingPremium;
        private List<MonthlyCount> monthlyPolicyCounts;
        
        // Getters and setters
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
        public Map<String, Long> getPolicyCountsByStatus() { return policyCountsByStatus; }
        public void setPolicyCountsByStatus(Map<String, Long> policyCountsByStatus) { this.policyCountsByStatus = policyCountsByStatus; }
        public Map<String, Long> getPolicyCountsByType() { return policyCountsByType; }
        public void setPolicyCountsByType(Map<String, Long> policyCountsByType) { this.policyCountsByType = policyCountsByType; }
        public Map<String, Long> getPolicyCountsByCoverage() { return policyCountsByCoverage; }
        public void setPolicyCountsByCoverage(Map<String, Long> policyCountsByCoverage) { this.policyCountsByCoverage = policyCountsByCoverage; }
        public BigDecimal getTotalPremiumCollected() { return totalPremiumCollected; }
        public void setTotalPremiumCollected(BigDecimal totalPremiumCollected) { this.totalPremiumCollected = totalPremiumCollected; }
        public BigDecimal getPendingPremium() { return pendingPremium; }
        public void setPendingPremium(BigDecimal pendingPremium) { this.pendingPremium = pendingPremium; }
        public List<MonthlyCount> getMonthlyPolicyCounts() { return monthlyPolicyCounts; }
        public void setMonthlyPolicyCounts(List<MonthlyCount> monthlyPolicyCounts) { this.monthlyPolicyCounts = monthlyPolicyCounts; }
    }
    
    public static class ClaimsAnalysisReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime generatedAt;
        private Map<String, Long> claimsCountsByStatus;
        private Map<String, Long> claimsCountsByIncidentType;
        private Map<String, Long> claimsCountsByPriority;
        private BigDecimal totalSettlementAmount;
        private BigDecimal averageSettlementAmount;
        private double averageSettlementDays;
        private List<ClaimCause> topClaimCauses;
        
        // Getters and setters
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
        public Map<String, Long> getClaimsCountsByStatus() { return claimsCountsByStatus; }
        public void setClaimsCountsByStatus(Map<String, Long> claimsCountsByStatus) { this.claimsCountsByStatus = claimsCountsByStatus; }
        public Map<String, Long> getClaimsCountsByIncidentType() { return claimsCountsByIncidentType; }
        public void setClaimsCountsByIncidentType(Map<String, Long> claimsCountsByIncidentType) { this.claimsCountsByIncidentType = claimsCountsByIncidentType; }
        public Map<String, Long> getClaimsCountsByPriority() { return claimsCountsByPriority; }
        public void setClaimsCountsByPriority(Map<String, Long> claimsCountsByPriority) { this.claimsCountsByPriority = claimsCountsByPriority; }
        public BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
        public void setTotalSettlementAmount(BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }
        public BigDecimal getAverageSettlementAmount() { return averageSettlementAmount; }
        public void setAverageSettlementAmount(BigDecimal averageSettlementAmount) { this.averageSettlementAmount = averageSettlementAmount; }
        public double getAverageSettlementDays() { return averageSettlementDays; }
        public void setAverageSettlementDays(double averageSettlementDays) { this.averageSettlementDays = averageSettlementDays; }
        public List<ClaimCause> getTopClaimCauses() { return topClaimCauses; }
        public void setTopClaimCauses(List<ClaimCause> topClaimCauses) { this.topClaimCauses = topClaimCauses; }
    }
    
    public static class PaymentAnalyticsReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime generatedAt;
        private Map<String, Long> paymentCountsByMethod;
        private Map<String, Long> paymentCountsByStatus;
        private Map<String, BigDecimal> revenueByPaymentMethod;
        private BigDecimal totalRevenue;
        private BigDecimal averagePaymentAmount;
        private double paymentSuccessRate;
        private List<DailyRevenue> dailyRevenue;
        
        // Getters and setters
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
        public Map<String, Long> getPaymentCountsByMethod() { return paymentCountsByMethod; }
        public void setPaymentCountsByMethod(Map<String, Long> paymentCountsByMethod) { this.paymentCountsByMethod = paymentCountsByMethod; }
        public Map<String, Long> getPaymentCountsByStatus() { return paymentCountsByStatus; }
        public void setPaymentCountsByStatus(Map<String, Long> paymentCountsByStatus) { this.paymentCountsByStatus = paymentCountsByStatus; }
        public Map<String, BigDecimal> getRevenueByPaymentMethod() { return revenueByPaymentMethod; }
        public void setRevenueByPaymentMethod(Map<String, BigDecimal> revenueByPaymentMethod) { this.revenueByPaymentMethod = revenueByPaymentMethod; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public BigDecimal getAveragePaymentAmount() { return averagePaymentAmount; }
        public void setAveragePaymentAmount(BigDecimal averagePaymentAmount) { this.averagePaymentAmount = averagePaymentAmount; }
        public double getPaymentSuccessRate() { return paymentSuccessRate; }
        public void setPaymentSuccessRate(double paymentSuccessRate) { this.paymentSuccessRate = paymentSuccessRate; }
        public List<DailyRevenue> getDailyRevenue() { return dailyRevenue; }
        public void setDailyRevenue(List<DailyRevenue> dailyRevenue) { this.dailyRevenue = dailyRevenue; }
    }
    
    public static class BusinessKPIReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime generatedAt;
        private long newCustomers;
        private long activeCustomers;
        private double customerRetentionRate;
        private long newPolicies;
        private double policyRenewalRate;
        private double policyCancellationRate;
        private double claimFrequency;
        private BigDecimal claimSeverity;
        private double claimSettlementRatio;
        private BigDecimal totalRevenue;
        private BigDecimal totalClaims;
        private BigDecimal profitMargin;
        private double revenueGrowthRate;
        private double policyGrowthRate;
        
        // Getters and setters
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
        public long getNewCustomers() { return newCustomers; }
        public void setNewCustomers(long newCustomers) { this.newCustomers = newCustomers; }
        public long getActiveCustomers() { return activeCustomers; }
        public void setActiveCustomers(long activeCustomers) { this.activeCustomers = activeCustomers; }
        public double getCustomerRetentionRate() { return customerRetentionRate; }
        public void setCustomerRetentionRate(double customerRetentionRate) { this.customerRetentionRate = customerRetentionRate; }
        public long getNewPolicies() { return newPolicies; }
        public void setNewPolicies(long newPolicies) { this.newPolicies = newPolicies; }
        public double getPolicyRenewalRate() { return policyRenewalRate; }
        public void setPolicyRenewalRate(double policyRenewalRate) { this.policyRenewalRate = policyRenewalRate; }
        public double getPolicyCancellationRate() { return policyCancellationRate; }
        public void setPolicyCancellationRate(double policyCancellationRate) { this.policyCancellationRate = policyCancellationRate; }
        public double getClaimFrequency() { return claimFrequency; }
        public void setClaimFrequency(double claimFrequency) { this.claimFrequency = claimFrequency; }
        public BigDecimal getClaimSeverity() { return claimSeverity; }
        public void setClaimSeverity(BigDecimal claimSeverity) { this.claimSeverity = claimSeverity; }
        public double getClaimSettlementRatio() { return claimSettlementRatio; }
        public void setClaimSettlementRatio(double claimSettlementRatio) { this.claimSettlementRatio = claimSettlementRatio; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public BigDecimal getTotalClaims() { return totalClaims; }
        public void setTotalClaims(BigDecimal totalClaims) { this.totalClaims = totalClaims; }
        public BigDecimal getProfitMargin() { return profitMargin; }
        public void setProfitMargin(BigDecimal profitMargin) { this.profitMargin = profitMargin; }
        public double getRevenueGrowthRate() { return revenueGrowthRate; }
        public void setRevenueGrowthRate(double revenueGrowthRate) { this.revenueGrowthRate = revenueGrowthRate; }
        public double getPolicyGrowthRate() { return policyGrowthRate; }
        public void setPolicyGrowthRate(double policyGrowthRate) { this.policyGrowthRate = policyGrowthRate; }
    }
    
    public static class MonthlyCount {
        private String month;
        private long count;
        
        public MonthlyCount(String month, long count) {
            this.month = month;
            this.count = count;
        }
        
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }
    
    public static class ClaimCause {
        private String cause;
        private long count;
        
        public ClaimCause(String cause, long count) {
            this.cause = cause;
            this.count = count;
        }
        
        public String getCause() { return cause; }
        public void setCause(String cause) { this.cause = cause; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }
    
    public static class DailyRevenue {
        private LocalDate date;
        private BigDecimal amount;
        
        public DailyRevenue(LocalDate date, BigDecimal amount) {
            this.date = date;
            this.amount = amount;
        }
        
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}