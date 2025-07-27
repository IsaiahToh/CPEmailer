# Email Campaign Manager

A modern, responsive web application for managing bulk email campaigns with drag-and-drop file uploads and real-time progress tracking. Now powered by **Nodemailer** for enhanced reliability and performance.

## Features

- ✅ **Excel & CSV Support**: Upload email lists from .xlsx, .xls, or .csv files
- ✅ **Dual Flyer Types**: Support for both image flyers and HTML email templates
- ✅ **Drag & Drop Interface**: Modern, intuitive file upload experience
- ✅ **Real-time Progress**: Live tracking of email sending progress
- ✅ **Email Validation**: Automatic validation and duplicate removal
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Nodemailer Integration**: Reliable email sending with major providers
- ✅ **Test Email Feature**: Verify your configuration before sending campaigns
- ✅ **Enhanced Security**: Environment-based configuration
- ✅ **Image Attachments**: Proper email attachments instead of embedded base64
- ✅ **Production Ready**: Optimized for deployment on platforms like Render.com
- ✅ **Better Deliverability**: Reduced spam filter triggers with proper attachments

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Email Settings**:
   ```bash
   cp .env.example .env
   # Edit .env file with your email configuration
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Open the App**: Visit http://localhost:3000

## Email Configuration

### Gmail Setup:
1. Enable 2-Factor Authentication in your Google account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Configure your `.env` file:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### Outlook/Hotmail Setup:
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_regular_password
```

### Yahoo Setup:
1. Enable 2-Factor Authentication
2. Generate an App Password: Yahoo Account → Security → Generate app password
3. Configure your `.env` file:
   ```env
   EMAIL_SERVICE=yahoo
   EMAIL_USER=your_email@yahoo.com
   EMAIL_PASS=your_app_password
   ```

### Custom SMTP:
```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your_email@yourprovider.com
EMAIL_PASS=your_password
```

## How to Use

1. **Upload Email List**: Drag & drop or browse for your Excel/CSV file containing email addresses
2. **Create Flyer**: Choose between:
   - **Image Flyer**: Upload a promotional image (no size restrictions)
   - **HTML Flyer**: Create custom HTML email content
3. **Test Configuration**: Use the test email feature to verify your setup
4. **Configure Settings**: Set sender name, email, subject, and reply-to address
5. **Send Campaign**: Click "Send Emails" to start your campaign
6. **Monitor Progress**: Watch real-time sending status and success/failure rates

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_SERVICE` | Email provider | `gmail`, `outlook`, `yahoo`, `custom` |
| `EMAIL_USER` | Your email address | `user@gmail.com` |
| `EMAIL_PASS` | Your app password | `abcd efgh ijkl mnop` |
| `SMTP_HOST` | SMTP server (for custom) | `smtp.example.com` |
| `SMTP_PORT` | SMTP port (for custom) | `587` |
| `SMTP_SECURE` | Use SSL/TLS (for custom) | `false` |
| `EMAIL_DELAY` | Delay between emails (ms) | `1000` |
| `PORT` | Server port | `3000` |

⚠️ **Security Note**: Never commit your actual EmailJS credentials to GitHub!

## File Formats Supported

### Email Lists
- **Excel Files**: .xlsx, .xls (emails should be in the first column)
- **CSV Files**: .csv (one email per line)

### Flyer Images
- **Image Types**: .jpg, .jpeg, .png, .gif, .webp
- **Recommended Size**: 600px width for optimal email display

## Technical Features

- **Modern Tech Stack**: HTML5, CSS3 (Tailwind), Vanilla JavaScript
- **External Libraries**: 
  - XLSX.js for Excel file parsing
  - EmailJS for email delivery
  - Font Awesome for icons
  - Tailwind CSS for styling
- **No Backend Required**: Runs entirely in the browser
- **Rate Limiting**: Built-in delays to prevent email service rate limits
- **Error Handling**: Comprehensive error catching and user feedback

## Demo Files

- `sample_emails.csv`: A sample CSV file with test email addresses for demonstration

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- Email addresses are processed locally in your browser
- No data is sent to external servers (except through EmailJS when configured)
- Consider privacy regulations (GDPR, CAN-SPAM) when sending bulk emails
- Always include unsubscribe options in your campaigns

## License

This project is open source and available under the MIT License.
