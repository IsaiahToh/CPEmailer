# Email Campaign Manager

A modern, responsive web application for managing bulk email campaigns with drag-and-drop file uploads and real-time progress tracking. Now powered by **Nodemailer** for enhanced reliability and performance.

## Features

- **Excel & CSV Support**: Upload email lists from .xlsx, .xls, or .csv files
- **Dual Flyer Types**: Support for both image flyers and HTML email templates
- **Drag & Drop Interface**: Intuitive file upload
- **Real-time Progress**: Tracking of completion of email sending
- **Email Validation**: Automatic validation and duplicate removal
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Nodemailer Integration**: Reliable email sending with Gmail
- **Test Email Feature**: Verify your configuration before sending campaigns
- **Image Attachments**: Proper email attachments
- **Deliverability**: Reduced spam filter triggers with proper attachments

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Gmail Settings** (Required):
   ```bash
   cp .env.example .env
   # Edit .env file with your Gmail configuration (see Email Configuration section below)
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Open the App**: Visit http://localhost:3000

**Note**: Gmail configuration is required before the application can send emails. The app will not function without proper email credentials.

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
| `EMAIL_SERVICE` | Email provider (use gmail) | `gmail` |
| `EMAIL_USER` | Your Gmail address | `user@gmail.com` |
| `EMAIL_PASS` | Your Gmail app password | `abcd efgh ijkl mnop` |
| `EMAIL_DELAY` | Delay between emails (ms) | `1000` |
| `PORT` | Server port | `3000` |

## File Formats Supported

### Email Lists
- **Excel Files**: .xlsx, .xls (emails should be in the first column)
- **CSV Files**: .csv (one email per line)

### Flyer Images
- **Image Types**: .jpg, .jpeg, .png, .gif, .webp
- **Recommended Size**: 600px width for optimal email display

## Technical Features

- **Modern Tech Stack**: HTML5, CSS3 (Tailwind), Vanilla JavaScript, Node.js
- **External Libraries**: 
  - XLSX.js for Excel file parsing
  - Nodemailer for Gmail email delivery
  - Font Awesome for icons
  - Tailwind CSS for styling
- **Backend Server**: Express.js server for email processing
- **Rate Limiting**: Built-in delays to prevent Gmail rate limits
- **Error Handling**: Comprehensive error catching and user feedback

## Demo Files

- `sample_emails.csv`: A sample CSV file with test email addresses for demonstration

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
