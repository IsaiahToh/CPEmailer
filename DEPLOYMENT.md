# Deployment Guide for Email Campaign Manager

## Render.com Deployment

This guide will help you deploy the Email Campaign Manager to Render.com with proper email attachment support.

### Prerequisites

1. **Email Provider Setup**: Choose one of the following:
   - **Gmail**: Enable 2FA and generate an App Password
   - **Outlook**: Use your regular credentials
   - **Yahoo**: Enable 2FA and generate an App Password
   - **Custom SMTP**: Have your SMTP credentials ready

### Step 1: Prepare Your Repository

1. Ensure your code is in a Git repository (GitHub, GitLab, etc.)
2. Verify `package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

### Step 2: Deploy to Render

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **New Web Service**: Click "New" → "Web Service"
3. **Connect Repository**: Link your Git repository
4. **Configure Service**:
   - **Name**: `email-campaign-manager` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: `Yes` (recommended)

### Step 3: Set Environment Variables

In your Render dashboard, go to "Environment" and add these variables:

#### For Gmail:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_DELAY=1000
PORT=3000
```

#### For Outlook:
```
EMAIL_SERVICE=outlook
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password_here
EMAIL_DELAY=1000
PORT=3000
```

#### For Yahoo:
```
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password_here
EMAIL_DELAY=1000
PORT=3000
```

#### For Custom SMTP:
```
EMAIL_SERVICE=custom
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your_email@your-domain.com
EMAIL_PASS=your_password_here
EMAIL_DELAY=1000
PORT=3000
```

### Step 4: Advanced Configuration (Optional)

#### Rate Limiting
- `EMAIL_DELAY`: Milliseconds between emails (default: 1000)
- Lower values = faster sending, higher risk of rate limiting
- Higher values = slower sending, safer for providers

#### Security Headers (Add to environment variables)
```
NODE_ENV=production
TRUST_PROXY=true
```

### Step 5: Verify Deployment

1. **Access Your App**: Use the URL provided by Render
2. **Test Configuration**: Use the "Test Email" feature to verify email sending
3. **Upload Test Files**: Try uploading a small email list and image
4. **Send Test Campaign**: Send to a few test addresses

## Features Now Supported

✅ **Proper Image Attachments**: Images are sent as email attachments, not embedded base64
✅ **Better Deliverability**: Reduced spam filter triggers
✅ **Multiple Email Providers**: Gmail, Outlook, Yahoo, custom SMTP
✅ **Rate Limiting**: Configurable delays to respect provider limits
✅ **Error Handling**: Comprehensive error reporting and recovery
✅ **Test Functionality**: Verify setup before sending campaigns
✅ **Attachment Support**: Images are properly attached and embedded
✅ **File Type Detection**: Automatic MIME type detection for attachments

## Performance Considerations

### Image Optimization
- **Recommended Size**: 600px width for email display
- **File Size**: Keep under 1-2MB per image for best performance
- **Format**: JPEG for photos, PNG for graphics with transparency

### Batch Sending
- **Large Lists**: For 1000+ emails, consider splitting into batches
- **Provider Limits**: 
  - Gmail: ~500 emails/day for new accounts, up to 2000/day for established
  - Outlook: ~300 emails/day
  - Yahoo: ~500 emails/day

### Memory Usage
- **Large Images**: Processed in memory, ensure sufficient RAM
- **Render Resources**: Free tier has 512MB RAM, paid tiers have more

## Troubleshooting

### Common Issues

1. **"Authentication Failed"**
   - Check EMAIL_USER and EMAIL_PASS are correct
   - For Gmail/Yahoo: Ensure you're using App Password, not regular password
   - For Gmail: Verify 2FA is enabled

2. **"Images Not Displaying"**
   - Images are sent as attachments and should display in most email clients
   - Some clients block images by default (user can enable)

3. **"Rate Limited"**
   - Increase EMAIL_DELAY value
   - Reduce batch size
   - Wait before sending more emails

4. **"Memory Issues"**
   - Use smaller images
   - Upgrade Render plan if needed
   - Process emails in smaller batches

## Security Best Practices

1. **Never commit credentials** to your repository
2. **Use App Passwords** instead of regular passwords when possible
3. **Monitor usage** to prevent abuse
4. **Include unsubscribe links** in your campaigns
5. **Respect privacy laws** (GDPR, CAN-SPAM, etc.)

## Support

For issues specific to:
- **Render Platform**: Check [Render Documentation](https://render.com/docs)
- **Email Providers**: Check your provider's SMTP documentation
- **This Application**: Check the main README.md for usage instructions

---

Your Email Campaign Manager is now production-ready with proper image attachment support! 🚀
