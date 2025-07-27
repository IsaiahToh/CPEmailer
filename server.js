const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('.'));

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create transporter based on environment
let transporter;

function createTransporter() {
    // Check if we're in demo mode
    if (process.env.EMAIL_SERVICE === 'demo' || !process.env.EMAIL_SERVICE) {
        console.log('Running in demo mode - emails will be simulated');
        return null;
    }

    const config = {
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };

    // For custom SMTP servers
    if (process.env.SMTP_HOST) {
        config.host = process.env.SMTP_HOST;
        config.port = process.env.SMTP_PORT || 587;
        config.secure = process.env.SMTP_SECURE === 'true';
        delete config.service;
    }

    console.log('Creating transporter with config:', {
        service: config.service,
        host: config.host,
        port: config.port,
        user: config.auth.user
    });

    return nodemailer.createTransporter(config);
}

// Initialize transporter
transporter = createTransporter();

// Verify transporter configuration
if (transporter) {
    transporter.verify(function(error, success) {
        if (error) {
            console.log('Transporter verification failed:', error);
        } else {
            console.log('Email server is ready to send messages');
        }
    });
}

// Rate limiting helper
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    const healthInfo = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        emailService: process.env.EMAIL_SERVICE || 'demo',
        transporterReady: !!transporter,
        nodeEnv: process.env.NODE_ENV || 'development',
        memoryUsage: process.memoryUsage()
    };
    
    res.json(healthInfo);
});

// Render.com health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

// Configuration endpoint
app.get('/api/config', (req, res) => {
    res.json({
        emailService: process.env.EMAIL_SERVICE || 'demo',
        demoMode: !process.env.EMAIL_SERVICE || process.env.EMAIL_SERVICE === 'demo'
    });
});

// Send emails endpoint
app.post('/api/send-emails', async (req, res) => {
    try {
        const { 
            emails, 
            flyerData, 
            fromName = 'Marketing Team',
            fromEmail = 'noreply@example.com',
            subject = 'Exciting News! Check Out Our Latest Offers',
            replyTo = 'contact@example.com',
            includeUnsubscribe = false
        } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ error: 'No valid emails provided' });
        }

        if (!flyerData) {
            return res.status(400).json({ error: 'No flyer data provided' });
        }

        // Check for large payload and warn user
        const payloadSize = JSON.stringify(req.body).length;
        console.log(`Request payload size: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`);
        
        if (payloadSize > 50 * 1024 * 1024) { // 50MB limit
            return res.status(413).json({ 
                error: 'Payload too large', 
                message: 'Please use smaller images or reduce the number of recipients per batch' 
            });
        }

        const results = [];
        const totalEmails = emails.length;
        let successCount = 0;
        let errorCount = 0;

        // Prepare email content and attachments
        let htmlContent = '';
        let attachments = [];
        
        if (flyerData.type === 'image') {
            // For image flyers, we'll use both embedded and attachment approach
            // Embedded for immediate viewing, attachment as fallback
            try {
                const base64Data = flyerData.content.split(',')[1];
                if (!base64Data) {
                    return res.status(400).json({ error: 'Invalid image data format' });
                }
                
                const imageBuffer = Buffer.from(base64Data, 'base64');
                const contentId = 'flyer-image';
                
                // Determine file extension from data URL
                const mimeMatch = flyerData.content.match(/data:image\/([a-zA-Z]*);base64/);
                const extension = mimeMatch ? mimeMatch[1] : 'jpg';
                const contentType = `image/${extension}`;
                
                // Add as attachment with content ID for embedding
                attachments.push({
                    filename: `flyer.${extension}`,
                    content: imageBuffer,
                    contentType: contentType,
                    cid: contentId,
                    contentDisposition: 'inline'
                });
                
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <img src="cid:${contentId}" alt="Promotional Flyer" style="max-width: 100%; height: auto; border-radius: 8px;">
                        ${includeUnsubscribe ? '<p style="font-size: 12px; color: #666; margin-top: 20px;"><a href="#" style="color: #4f46e5;">Unsubscribe</a></p>' : ''}
                    </div>
                `;
            } catch (error) {
                console.error('Error processing image attachment:', error);
                return res.status(400).json({ error: 'Failed to process image attachment' });
            }
        } else {
            htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    ${flyerData.content}
                    ${includeUnsubscribe ? '<p style="font-size: 12px; color: #666; margin-top: 20px;"><a href="#" style="color: #4f46e5;">Unsubscribe</a></p>' : ''}
                </div>
            `;
        }

        // Use flyer subject if available
        const emailSubject = flyerData.subject || subject;

        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];
            
            if (!validateEmail(email)) {
                results.push({
                    email,
                    success: false,
                    message: 'Invalid email format',
                    index: i
                });
                errorCount++;
                continue;
            }

            try {
                if (!transporter || process.env.EMAIL_SERVICE === 'demo') {
                    // Demo mode - simulate sending
                    await delay(100); // Short delay for demo
                    
                    // Simulate 95% success rate
                    const isSuccess = Math.random() > 0.05;
                    
                    if (isSuccess) {
                        results.push({
                            email,
                            success: true,
                            message: 'Demo: Simulated success',
                            index: i
                        });
                        successCount++;
                    } else {
                        results.push({
                            email,
                            success: false,
                            message: 'Demo: Simulated failure',
                            index: i
                        });
                        errorCount++;
                    }
                } else {
                    // Real email sending
                    const mailOptions = {
                        from: `"${fromName}" <${fromEmail}>`,
                        to: email,
                        subject: emailSubject,
                        html: htmlContent,
                        replyTo: replyTo,
                        attachments: attachments
                    };

                    await transporter.sendMail(mailOptions);
                    
                    results.push({
                        email,
                        success: true,
                        message: 'Email sent successfully',
                        index: i
                    });
                    successCount++;
                    
                    console.log(`✅ Email sent successfully to ${email} (${i + 1}/${totalEmails})`);
                }
                
                // Rate limiting - delay between emails
                if (i < emails.length - 1) {
                    await delay(process.env.EMAIL_DELAY || 1000); // 1 second delay by default
                }
                
            } catch (error) {
                console.error(`❌ Error sending email to ${email}:`, error.message);
                
                let errorMessage = error.message;
                if (error.code === 'EAUTH') {
                    errorMessage = 'Authentication failed - check email credentials';
                } else if (error.code === 'ECONNECTION') {
                    errorMessage = 'Connection failed - check SMTP settings';
                } else if (error.responseCode === 550) {
                    errorMessage = 'Recipient rejected - invalid email address';
                }
                
                results.push({
                    email,
                    success: false,
                    message: errorMessage,
                    index: i
                });
                errorCount++;
            }
        }

        console.log(`Campaign completed: ${successCount} sent, ${errorCount} failed`);

        res.json({
            success: true,
            totalEmails,
            successCount,
            errorCount,
            results
        });

    } catch (error) {
        console.error('Campaign error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
    try {
        const { testEmail, flyerData } = req.body;
        
        if (!validateEmail(testEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!transporter || process.env.EMAIL_SERVICE === 'demo') {
            return res.json({
                success: true,
                message: 'Demo mode - test email simulated successfully'
            });
        }

        let htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4f46e5;">Email Campaign Manager Test</h2>
                <p>This is a test email to verify your email configuration is working correctly.</p>
        `;
        
        let attachments = [];

        // Include flyer in test if provided
        if (flyerData) {
            if (flyerData.type === 'image') {
                try {
                    const base64Data = flyerData.content.split(',')[1];
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    const contentId = 'test-flyer';
                    
                    const mimeMatch = flyerData.content.match(/data:image\/([a-zA-Z]*);base64/);
                    const extension = mimeMatch ? mimeMatch[1] : 'jpg';
                    
                    attachments.push({
                        filename: `test-flyer.${extension}`,
                        content: imageBuffer,
                        contentType: `image/${extension}`,
                        cid: contentId,
                        contentDisposition: 'inline'
                    });
                    
                    htmlContent += `
                        <p>Your flyer attachment is working correctly:</p>
                        <img src="cid:${contentId}" alt="Test Flyer" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
                    `;
                } catch (error) {
                    console.error('Error processing test image:', error);
                }
            } else if (flyerData.type === 'html') {
                htmlContent += `
                    <p>Your HTML flyer content:</p>
                    <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 8px;">
                        ${flyerData.content}
                    </div>
                `;
            }
        }

        htmlContent += `
                <p>If you received this email with all content displaying correctly, your setup is ready to send campaigns!</p>
                <p style="font-size: 12px; color: #666; margin-top: 30px;">
                    Sent at: ${new Date().toISOString()}
                </p>
            </div>
        `;

        const mailOptions = {
            from: `"Email Campaign Manager" <${process.env.EMAIL_USER}>`,
            to: testEmail,
            subject: 'Test Email from Email Campaign Manager',
            html: htmlContent,
            attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        
        res.json({
            success: true,
            message: 'Test email sent successfully with attachments'
        });

    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            error: 'Failed to send test email',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Email Campaign Manager server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to access the application`);
    console.log(`Email service: ${process.env.EMAIL_SERVICE || 'demo mode'}`);
});
