package com.thaiinsurance.autoinsurance.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service for managing notifications (email, SMS, push notifications)
 */
@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Value("${app.notification.email.enabled:false}")
    private boolean emailEnabled;
    
    @Value("${app.notification.sms.enabled:false}")
    private boolean smsEnabled;
    
    @Value("${app.base.url:http://localhost:4200}")
    private String baseUrl;
    
    /**
     * Send email notification
     */
    public void sendEmail(String to, String subject, String body) {
        if (!emailEnabled) {
            logger.info("Email notification disabled. Would send to: {} with subject: {}", to, subject);
            return;
        }
        
        try {
            // TODO: Implement actual email sending using a service like:
            // - SendGrid
            // - AWS SES
            // - Thai local email service
            
            logger.info("Sending email to: {} with subject: {}", to, subject);
            // emailClient.send(to, subject, body);
            
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email notification", e);
        }
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String email, String resetToken) {
        String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
        
        String subject = "Reset Your Password - Thai Auto Insurance";
        String body = buildPasswordResetEmailBody(resetUrl);
        
        sendEmail(email, subject, body);
        
        logger.info("Password reset email sent to: {}", email);
    }
    
    /**
     * Send email verification
     */
    public void sendEmailVerification(String email, String verificationToken) {
        String verificationUrl = baseUrl + "/verify-email?token=" + verificationToken;
        
        String subject = "Verify Your Email - Thai Auto Insurance";
        String body = buildEmailVerificationBody(verificationUrl);
        
        sendEmail(email, subject, body);
        
        logger.info("Email verification sent to: {}", email);
    }
    
    /**
     * Send welcome email after registration
     */
    public void sendWelcomeEmail(String email, String firstName) {
        String subject = "Welcome to Thai Auto Insurance!";
        String body = buildWelcomeEmailBody(firstName);
        
        sendEmail(email, subject, body);
        
        logger.info("Welcome email sent to: {}", email);
    }
    
    /**
     * Send policy renewal reminder
     */
    public void sendPolicyRenewalReminder(String email, String policyNumber, String expiryDate) {
        String subject = "Policy Renewal Reminder - " + policyNumber;
        String body = buildPolicyRenewalBody(policyNumber, expiryDate);
        
        sendEmail(email, subject, body);
        
        logger.info("Policy renewal reminder sent to: {} for policy: {}", email, policyNumber);
    }
    
    /**
     * Send claim status update
     */
    public void sendClaimStatusUpdate(String email, String claimNumber, String status) {
        String subject = "Claim Status Update - " + claimNumber;
        String body = buildClaimStatusUpdateBody(claimNumber, status);
        
        sendEmail(email, subject, body);
        
        logger.info("Claim status update sent to: {} for claim: {}", email, claimNumber);
    }
    
    /**
     * Send SMS notification
     */
    public void sendSMS(String phoneNumber, String message) {
        if (!smsEnabled) {
            logger.info("SMS notification disabled. Would send to: {} message: {}", phoneNumber, message);
            return;
        }
        
        try {
            // TODO: Implement SMS sending using a service like:
            // - Twilio
            // - AWS SNS
            // - Thai local SMS service
            
            logger.info("Sending SMS to: {} with message: {}", phoneNumber, message);
            // smsClient.send(phoneNumber, message);
            
        } catch (Exception e) {
            logger.error("Failed to send SMS to: {}", phoneNumber, e);
            throw new RuntimeException("Failed to send SMS notification", e);
        }
    }
    
    /**
     * Send verification code via SMS
     */
    public void sendPhoneVerificationCode(String phoneNumber, String code) {
        String message = "Your verification code for Thai Auto Insurance is: " + code + 
                        ". This code expires in 10 minutes.";
        
        sendSMS(phoneNumber, message);
        
        logger.info("Phone verification code sent to: {}", phoneNumber);
    }
    
    /**
     * Send policy document ready notification
     */
    public void sendPolicyDocumentReady(String email, String phoneNumber, String policyNumber) {
        // Email notification
        String emailSubject = "Your Policy Document is Ready - " + policyNumber;
        String emailBody = buildPolicyDocumentReadyBody(policyNumber);
        sendEmail(email, emailSubject, emailBody);
        
        // SMS notification
        String smsMessage = "Your Thai Auto Insurance policy " + policyNumber + 
                           " document is ready for download. Check your email.";
        sendSMS(phoneNumber, smsMessage);
        
        logger.info("Policy document ready notifications sent for policy: {}", policyNumber);
    }
    
    // Private helper methods for building email bodies
    
    private String buildPasswordResetEmailBody(String resetUrl) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Reset Your Password</h2>" +
               "<p>You have requested to reset your password for your Thai Auto Insurance account.</p>" +
               "<p>Please click the link below to reset your password:</p>" +
               "<p><a href=\"" + resetUrl + "\">Reset Password</a></p>" +
               "<p>This link will expire in 1 hour.</p>" +
               "<p>If you did not request this password reset, please ignore this email.</p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
    
    private String buildEmailVerificationBody(String verificationUrl) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Verify Your Email Address</h2>" +
               "<p>Thank you for registering with Thai Auto Insurance!</p>" +
               "<p>Please click the link below to verify your email address:</p>" +
               "<p><a href=\"" + verificationUrl + "\">Verify Email</a></p>" +
               "<p>This verification is required to complete your account setup.</p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
    
    private String buildWelcomeEmailBody(String firstName) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Welcome to Thai Auto Insurance, " + firstName + "!</h2>" +
               "<p>Your account has been successfully created.</p>" +
               "<p>You can now:</p>" +
               "<ul>" +
               "<li>Get instant quotes for auto insurance</li>" +
               "<li>Manage your policies online</li>" +
               "<li>File and track claims</li>" +
               "<li>Access your policy documents anytime</li>" +
               "</ul>" +
               "<p>Get started by logging into your account at: <a href=\"" + baseUrl + "\">" + baseUrl + "</a></p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
    
    private String buildPolicyRenewalBody(String policyNumber, String expiryDate) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Policy Renewal Reminder</h2>" +
               "<p>Your auto insurance policy " + policyNumber + " is expiring on " + expiryDate + ".</p>" +
               "<p>To ensure continuous coverage, please renew your policy before the expiry date.</p>" +
               "<p>Renew now at: <a href=\"" + baseUrl + "/policies/" + policyNumber + "/renew\">Renew Policy</a></p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
    
    private String buildClaimStatusUpdateBody(String claimNumber, String status) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Claim Status Update</h2>" +
               "<p>Your claim " + claimNumber + " status has been updated to: <strong>" + status + "</strong></p>" +
               "<p>You can view full claim details at: <a href=\"" + baseUrl + "/claims/" + claimNumber + "\">View Claim</a></p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
    
    private String buildPolicyDocumentReadyBody(String policyNumber) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset=\"UTF-8\"></head><body>" +
               "<h2>Your Policy Document is Ready!</h2>" +
               "<p>Your insurance policy " + policyNumber + " document has been processed and is now ready for download.</p>" +
               "<p>Download your policy: <a href=\"" + baseUrl + "/policies/" + policyNumber + "/download\">Download Policy</a></p>" +
               "<p>Keep this document safe as it contains important details about your coverage.</p>" +
               "<hr>" +
               "<p><small>Thai Auto Insurance | Thailand's Trusted Insurance Provider</small></p>" +
               "</body></html>";
    }
}