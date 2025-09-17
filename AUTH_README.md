# Password Authentication

This application is protected by a password authentication system.

## Default Password
The default password is: `data2024`

## Changing the Password

### Method 1: Environment Variable (Recommended for Production)
Set the `VITE_APP_PASSWORD` environment variable:

```bash
# For development
VITE_APP_PASSWORD=your_new_password npm run dev

# For production
VITE_APP_PASSWORD=your_new_password npm run build
```

### Method 2: Direct Code Change
Edit `src/config/auth.ts` and change the `PASSWORD` value:

```typescript
export const AUTH_CONFIG = {
  PASSWORD: "your_new_password",
  // ... rest of config
};
```

## Security Features

- **Session Management**: Users stay logged in for 24 hours
- **Automatic Logout**: Sessions expire after 24 hours
- **Secure Storage**: Authentication state is stored in localStorage
- **Password Visibility Toggle**: Users can show/hide password while typing
- **Error Handling**: Clear feedback for incorrect passwords

## Session Behavior

- Users remain authenticated for 24 hours after login
- Sessions persist across browser refreshes
- Users are automatically logged out after 24 hours
- Logout button is available in the top-right corner

## For Administrators

To change the password in production:
1. Set the `VITE_APP_PASSWORD` environment variable
2. Rebuild and redeploy the application
3. Notify users of the new password

## Security Notes

- This is a simple password-based authentication
- For production use, consider implementing more robust authentication
- The password is stored in plain text in the code
- Consider using environment variables for better security
