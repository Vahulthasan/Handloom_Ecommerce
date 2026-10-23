import { PaymentProvider, PaymentResult, Order } from '@/types';

export class MockPaymentProvider implements PaymentProvider {
  name = 'Instant Test Payment (Mock Provider)';

  async processPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _order: Omit<Order, 'id' | 'created_at' | 'order_number'>
  ): Promise<PaymentResult> {
    // Simulate instant secure processing for development / testing
    await new Promise((resolve) => setTimeout(resolve, 800));
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      success: true,
      transaction_id: `TXN-MOCK-${Date.now()}-${randomHex}`,
    };
  }
}
