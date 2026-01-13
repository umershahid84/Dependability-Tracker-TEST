# Password Expiry and Email Notification Analysis

## Current System Status

After analyzing the codebase, here's what the Dependability Tracker application **currently has**:

### ✅ What EXISTS in the Codebase:

#### 1. **Credential Invite System with Expiry**
- **File**: `src/lib/db/models/CreateCredentialsInvite/index.ts`
- **Functionality**: 
  - Creates temporary invite tokens for new supervisors to set up their login credentials
  - These invites **automatically expire after 96 hours (4 days)**
  - Expired invites are automatically removed by the `removeExpired.ts` script that runs every 5 minutes

#### 2. **Email Notification System**
- **File**: `src/lib/email/sendCredentialInvite/index.ts`
- **Functionality**:
  - Sends emails to supervisors/admins with credential invite links
  - Email contains a link to create their login credentials
  - Uses SMTP configuration from environment variables

#### 3. **Password Reset Functionality**
- **Files**: 
  - `src/pages/reset-password/index.tsx` - Reset password page
  - `src/components/Forms/ResetPassword.tsx` - Reset password form
  - `src/client-api/supervisors/resetPassword.ts` - API client
- **Functionality**: Manual password reset feature exists for users

#### 4. **Automated Cleanup Script**
- **File**: `src/scripts/removeExpired.ts`
- **Functionality**:
  - Runs every 5 minutes by default
  - Automatically removes expired credential invites from the database
  - Prevents old/expired invites from being used

### ❌ What DOES NOT EXIST:

#### 1. **Automatic Password Expiry After X Days**
- The system does NOT have automatic password expiration
- User passwords do NOT expire after a certain number of days
- There is NO `password_changed_at` or similar tracking field in the `LoginCredential` model

#### 2. **Automatic Email for Password Reset**
- The system does NOT automatically send emails to remind users to reset their passwords
- There is NO scheduled job to check password age and notify users
- The email system only sends credential invite emails for new accounts

#### 3. **Password Age Tracking**
- The `LoginCredential` model only has `createdAt` and `updatedAt` fields
- There is NO specific tracking of when a password was last changed
- The system cannot determine password age

## Summary

**Current State**: 
- ✅ Credential invites expire after 4 days
- ✅ Email notifications are sent for new credential invites
- ✅ Manual password reset functionality exists
- ❌ Passwords do NOT automatically expire after a set number of days
- ❌ NO automatic email reminders for password resets
- ❌ NO tracking of password age

**Answer to Your Question**: 
**No**, the admin and supervisor passwords are **NOT** currently set to automatically reset after a few days, and the system does **NOT** send automatic email reminders to reset credentials based on password age.

The only expiry mechanism is for **credential invites** (which expire after 4 days), not for the **passwords themselves**.
