import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { contactRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

router.post('/', contactRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = ContactSchema.parse(req.body);
    
    // In production, send via Nodemailer / Resend / SendGrid API
    console.log('[NEW INQUIRY RECEIVED]', {
      timestamp: new Date().toISOString(),
      ...validatedData
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! Dharmik Tarasaka will get back to you within 24 hours.',
      data: {
        receivedAt: new Date().toISOString(),
        referenceId: `TAR-${Math.floor(100000 + Math.random() * 900000)}`
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      });
      return;
    }
    
    console.error('[CONTACT API ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try emailing directly at dharmik@tarasakadigital.com.'
    });
  }
});

export default router;
