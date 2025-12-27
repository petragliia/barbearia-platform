import { NextResponse } from 'next/server';
import { PaymentService } from '@/features/payments/services/paymentService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json(
                { message: 'Session ID is required' },
                { status: 400 }
            );
        }

        // Delegate complex business logic and verification to the service layer.
        // This keeps the controller (route) clean and focused on HTTP concerns.
        const result = await PaymentService.verifyPaymentAndCreateBarbershop(sessionId);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Payment Confirmation Error:', error);

        // Distinguish between client errors (bad request) vs server errors if possible,
        // or keep it simple for security (don't leak too much info).
        // If the error message is known/safe, return it, otherwise generic 500.
        const isClientError = error.message.includes("required") || error.message.includes("Payment not completed") || error.message.includes("Missing");

        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: isClientError ? 400 : 500 }
        );
    }
}
