# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "InterviewPro"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
5. Copy the Client ID

## Step 4: Update Environment Variables


Add to your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Step 5: Test the Implementation

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/login
3. Click "Sign in with Google"
4. Complete the Google authentication flow
5. You should be redirected to the dashboard

## Security Notes

- The `NEXT_PUBLIC_` prefix makes the client ID available to the frontend
- Client ID is safe to expose publicly (it's not a secret)
- The actual authentication happens on the server side
- User data is stored in your MariaDB database

## Troubleshooting

### "Invalid Client ID" Error
- Verify the client ID is correct in `.env.local`
- Ensure both `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` are set
- Restart your development server after changing environment variables

### "Unauthorized Origin" Error
- Add `http://localhost:3000` to authorized origins in Google Cloud Console
- For production, add your production domain

### Google Sign-In Button Not Working
- Check browser console for JavaScript errors
- Ensure the Google Sign-In script is loading properly
- Verify your Google Cloud project settings

## Production Deployment

For production:
1. Add your production domain to authorized origins
2. Update environment variables on your hosting platform
3. Ensure HTTPS is enabled (required for Google OAuth)