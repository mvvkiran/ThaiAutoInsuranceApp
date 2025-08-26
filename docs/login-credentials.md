# Login Credentials - Thai Auto Insurance Application

## 🔐 Default User Accounts

The application comes with pre-configured user accounts for testing and demonstration purposes. These accounts are automatically created when the application starts for the first time.

---

## 👨‍💼 Admin User
```
Email: admin@insurance.com
Password: Admin@123
Role: ADMIN
```
**Capabilities:**
- System administration and configuration
- View dashboard with system-wide statistics
- Manage all users (customers, agents, staff)
- View all policies and claims across the system
- Access system reports and analytics
- User management and role assignment

---

## 🏢 Agent User  
```
Email: agent@insurance.com
Password: Agent@123
Role: AGENT
```
**Capabilities:**
- Customer relationship management
- Policy creation and management
- Claims processing and approval
- Commission tracking and reports
- Customer support and assistance
- Quote generation for customers

---

## 👥 Customer User
```
Email: customer@insurance.com
Password: Customer@123
Role: CUSTOMER
```
**Capabilities:**
- Get insurance quotes
- Purchase and manage policies
- File and track claims
- Update personal information
- View policy documents
- Make premium payments

---

## 📊 Underwriter User
```
Email: underwriter@insurance.com
Password: Underwriter@123
Role: UNDERWRITER
```
**Capabilities:**
- Risk assessment and evaluation
- Policy application review
- Premium calculation and adjustment
- Coverage decision making
- Risk management reports
- Underwriting guidelines enforcement

---

## 🔍 Claims Adjuster User
```
Email: adjuster@insurance.com
Password: Adjuster@123
Role: CLAIMS_ADJUSTER
```
**Capabilities:**
- Claims investigation and processing
- Damage assessment and evaluation  
- Settlement amount determination
- Fraud detection and prevention
- Claims documentation and reporting
- Communication with customers and repair shops

---

## 🚀 Getting Started

### 1. Start the Application
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (in another terminal)
cd frontend
ng serve
```

### 2. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Database Console**: http://localhost:8080/h2-console

### 3. Login Process
1. Navigate to http://localhost:4200
2. Click "Login" or go to the login page
3. Enter the email and password for your desired role
4. You will be redirected to the appropriate dashboard

---

## 🔧 Technical Details

### Password Security
- All passwords are encrypted using BCrypt with strength 10
- Passwords meet security requirements (minimum 6 characters, mixed case, numbers, special characters)
- Password reset functionality is available for all users

### Account Features
- **Email Verification**: All default accounts are pre-verified
- **Phone Verification**: All default accounts are pre-verified
- **Account Status**: All accounts are active by default
- **Failed Login Protection**: Accounts lock after multiple failed attempts

### Database Storage
- Users are stored in the `users` table
- Roles are stored as enum values in the `role` column
- User creation is handled by `DataInitializer.java` component
- Data persistence is maintained across application restarts

---

## 🔒 Security Considerations

### For Development/Testing:
✅ These credentials are suitable for development and testing environments
✅ Passwords are properly encrypted in the database
✅ Role-based access control is enforced

### For Production:
⚠️ **IMPORTANT**: Change all default passwords before deploying to production
⚠️ Consider disabling the DataInitializer in production environments
⚠️ Use environment variables for sensitive configuration
⚠️ Enable additional security features (2FA, stronger password policies)

---

## 📧 Support

If you experience login issues:

1. **Check Application Status**: Ensure both backend and frontend are running
2. **Verify Database**: Check H2 console to confirm users exist
3. **Clear Browser Cache**: Clear cookies and local storage
4. **Check Logs**: Look for authentication errors in backend logs
5. **Reset Password**: Use the "Forgot Password" feature if needed

---

## 🛠 Troubleshooting

### Common Issues:

#### "Invalid credentials" Error
- Verify you're using the exact email and password listed above
- Check for typos in email format
- Ensure Caps Lock is not enabled

#### "Account locked" Message  
- Wait 30 minutes or contact admin to unlock
- Check backend logs for failed login attempts

#### "User not found" Error
- Verify the DataInitializer ran successfully
- Check backend startup logs for user creation messages
- Manually verify users in H2 database console

#### Database Connection Issues
```bash
# H2 Console Access
URL: jdbc:h2:mem:thai_insurance
Driver Class: org.h2.Driver  
User Name: sa
Password: (leave empty)
```

---

## 📝 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-08 | Initial user accounts created |
| 1.0.1 | 2024-08 | Added DataInitializer for automatic user creation |

---

**Last Updated**: August 2024  
**Document Version**: 1.0  
**Application Version**: 1.0.0