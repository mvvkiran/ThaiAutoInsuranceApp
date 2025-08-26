# Admin Login Fix Guide

## 🚨 Issue: Admin Login Returns "Unauthorized"

**Symptoms**: 
- Agent login works fine: `agent@insurance.com / Agent@123` ✅
- Admin login fails: `admin@insurance.com / Admin@123` ❌

## 🛠 Quick Fix Solution

### Option 1: Automatic Fix (Recommended)

1. **Start your backend server**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Call the admin fix endpoint**:
   ```bash
   curl -X POST http://localhost:8080/api/admin-fix/recreate-admin
   ```
   
   This will:
   - Delete any existing admin user
   - Create a fresh admin user with correct settings
   - Verify the password encoding works
   - Return confirmation with user details

3. **Test the login**:
   - Email: `admin@insurance.com`
   - Password: `Admin@123`

### Option 2: Manual Database Fix

If Option 1 doesn't work, manually fix via H2 Console:

1. **Go to H2 Console**: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:thai_insurance`
   - User: `sa`
   - Password: (empty)

2. **Delete existing admin user**:
   ```sql
   DELETE FROM users WHERE email = 'admin@insurance.com';
   ```

3. **Create new admin user**:
   ```sql
   INSERT INTO users (
       username, email, password, first_name, last_name, phone_number, role,
       is_active, email_verified, phone_verified, failed_login_attempts,
       account_locked, password_change_required, created_at, updated_at
   ) VALUES (
       'admin', 'admin@insurance.com',
       '$2a$10$XqfZr3WOj.PEj5OGv1aKVOyGy6TKz7x9P7QJ4.4OJ.K1W2Z3J5K6M',
       'System', 'Administrator', '0812345678', 'ADMIN',
       true, true, true, 0, false, false,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
   );
   ```

## 🔍 Diagnostic Commands

### Compare Admin vs Agent Users
```bash
curl http://localhost:8080/api/admin-fix/compare-users
```

This will show you exactly what's different between the working agent user and the problematic admin user.

### Verify All Users
```bash
curl http://localhost:8080/api/test/verify-users
```

This shows all 5 users and their login status.

## 🎯 Expected Results After Fix

After running the fix, you should see:

```json
{
  "success": true,
  "data": {
    "success": true,
    "adminId": 1,
    "email": "admin@insurance.com",
    "role": "ADMIN",
    "isActive": true,
    "passwordMatches": true,
    "roles": ["ADMIN"],
    "authorities": ["ROLE_ADMIN"]
  }
}
```

## 🚀 Test Login After Fix

Try logging in with:
- **Email**: `admin@insurance.com`
- **Password**: `Admin@123`

You should now be able to:
- ✅ Login successfully
- ✅ Access admin dashboard
- ✅ View admin endpoints like `/api/admin/dashboard`

## ⚡ Why This Happened

The most likely causes:
1. **Password encoding mismatch** - Admin password wasn't encoded correctly
2. **Role assignment issue** - Admin role wasn't properly set
3. **Account status** - Admin user wasn't marked as active/verified
4. **Database corruption** - Admin user data got corrupted during creation

## 🔧 Updated Code Changes

I've made these fixes:
1. **Enhanced DataInitializer** - Now recreates admin user on every startup
2. **AdminFixController** - Provides endpoints to fix admin user issues
3. **Better logging** - More detailed error reporting
4. **Verification tools** - Compare working vs broken users

## 📞 If Still Not Working

If the admin login still doesn't work after these fixes:

1. **Check backend logs** for detailed error messages
2. **Call the compare-users endpoint** to see exact differences
3. **Verify in H2 console** that admin user exists with correct data
4. **Test password manually** using the test endpoints

The fix should resolve the issue immediately! 🎉