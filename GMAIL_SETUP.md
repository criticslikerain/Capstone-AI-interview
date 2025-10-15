# Gmail SMTP Setup Guide

To enable the forgot password email functionality, you need to configure Gmail SMTP settings.

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" 
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate App Password

1. In Google Account settings, go to "Security"
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter "InterviewPro" as the device name
5. Copy the generated 16-character app password

## Step 3: Update Environment Variables

Update your `.env.local` file with your Gmail credentials:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from Step 2

## Step 4: Test the Functionality

1. Start your development server: `npm run dev`
2. Go to the login page: http://localhost:3000/login
3. Click "Forgot password?"
4. Enter a valid email address
5. Check your email for the reset link

## Security Notes

- Never commit your actual Gmail credentials to version control
- Use environment variables for all sensitive configuration
- The app password is different from your regular Gmail password
- App passwords are more secure than using your main password

## Troubleshooting

If emails are not being sent:

1. Verify your Gmail credentials are correct
2. Check that 2FA is enabled on your Google account
3. Ensure the app password was generated correctly
4. Check the server console for error messages
5. Verify your Gmail account allows "Less secure app access" (though app passwords are preferred)

## Production Deployment

For production, make sure to:
1. Set the environment variables on your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Consider using a dedicated email service like SendGrid or AWS SES for better deliverability