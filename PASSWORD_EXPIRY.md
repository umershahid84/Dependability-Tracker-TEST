# Password Expiry Feature

## Overview

This application now includes automatic password expiry tracking to enhance security by ensuring passwords are changed regularly.

## Configuration

The password expiry period is controlled by the `PASSWORD_EXPIRY_DAYS` environment variable in your `.env` file:

```
PASSWORD_EXPIRY_DAYS=90
```

**Default Value:** 90 days

## How It Works

### Password Change Tracking

- Every login credential has a `password_changed_at` field that tracks when the password was last changed
- This field is automatically set when:
  - A new credential is created
  - A password is updated

### Login Validation

When a user attempts to log in:
1. The system checks if the credentials are valid
2. If valid, it calculates the age of the password based on `password_changed_at`
3. If the password age exceeds `PASSWORD_EXPIRY_DAYS`, the login is rejected with a 403 status
4. The user receives a message: "Password expired. Please reset your password."

### Monitoring

The `removeExpired.ts` script (which runs every 5 minutes by default) now also:
- Scans for expired passwords
- Reports the count of accounts with expired passwords to the console
- Provides visibility into accounts that need password resets

## Usage

### For Administrators

1. **Configure Expiry Period**: Set `PASSWORD_EXPIRY_DAYS` in your `.env` file to your desired value (e.g., 30, 60, 90, or 180 days)
2. **Monitor Logs**: Check the application logs to see when expired passwords are detected
3. **User Assistance**: When users report login issues with "Password expired" messages, guide them to the password reset flow

### For Users

When your password expires:
1. You'll receive an error message during login: "Password expired. Please reset your password."
2. Use the password reset functionality to create a new password
3. Your password will be valid for another `PASSWORD_EXPIRY_DAYS` days

## Security Benefits

- **Regular Password Updates**: Forces users to change passwords periodically
- **Reduced Credential Exposure**: Limits the window of opportunity for compromised credentials
- **Compliance**: Helps meet security compliance requirements that mandate periodic password changes

## Technical Details

### Database Schema

The `login_credentials` table includes:
- `password_changed_at`: DATETIME field with default value of NOW()

### Helper Functions

- `isPasswordExpired(passwordChangedAt: Date): boolean` - Checks if a password has expired based on the change date

### Modified Files

- `src/lib/db/models/LoginCredential/index.ts` - Model definition with password_changed_at field
- `src/lib/db/controller/LoginCredential/helpers.ts` - Helper function for expiry checking
- `src/pages/api/login.ts` - Login endpoint with expiry validation
- `src/scripts/removeExpired.ts` - Enhanced monitoring script
- `src/scripts/createEnv.ts` - Environment variable generation

## Migration Notes

For existing databases, ensure the database is synced to add the `password_changed_at` column to existing `login_credentials` records. Sequelize will handle this automatically when the application starts with the updated model.
