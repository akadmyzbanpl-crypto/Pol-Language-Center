import { Order } from '../types';
import { store } from './storeService';

/**
 * Payment Gateway Service
 * 
 * Note: Real Iranian gateways (Zarinpal, IDPay, NextPay, etc.) plug in here.
 * In a production backend, payment requests are initiated server-side using:
 * process.env.PAYMENT_MERCHANT_ID or process.env.ZARINPAL_KEY
 * 
 * In this client environment, we provide an interactive simulated gateway
 * with realistic processing delay and success/failure handling.
 */

export interface PaymentRequestResult {
  success: boolean;
  authority: string;
  paymentUrl: string;
  message?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  refId: string;
  orderId: string;
  message: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  refId: string;
  amount: number;
  gateway: string;
  cardPanMasked: string;
  status: 'success' | 'failed';
  createdAt: string;
}

export const paymentService = {
  listTransactions(): PaymentTransaction[] {
    const orders = store.getOrders();
    return orders.map((o, idx) => ({
      id: 'tx_' + o.id,
      orderId: o.id,
      refId: o.authority || 'SHP_' + (10850230 + idx * 7421),
      amount: o.total,
      gateway: idx % 2 === 0 ? 'زرین‌پال شاپرک' : 'به‌پرداخت ملت',
      cardPanMasked: '۶۰۳۷-۹۹**-****-۴۱' + (10 + idx),
      status: o.paymentStatus === 'paid' ? 'success' : 'failed',
      createdAt: o.createdAt,
    }));
  },

  async requestPayment(order: Order): Promise<PaymentRequestResult> {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const authority = 'POL_AUTH_' + Date.now();
    return {
      success: true,
      authority,
      paymentUrl: `/checkout/verify?authority=${authority}&orderId=${order.id}`,
      message: 'هدایت به درگاه پرداخت شاپرک / زرین‌پال',
    };
  },

  async verifyPayment(authority: string, orderId: string): Promise<PaymentVerifyResult> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // 95% simulated success rate
    const isSuccess = Math.random() > 0.05;
    const refId = 'SHP_' + Math.floor(10000000 + Math.random() * 90000000);

    return {
      success: isSuccess,
      refId,
      orderId,
      message: isSuccess
        ? 'پرداخت شما با موفقیت در شبکه شاپرک تأیید گردید.'
        : 'تراکنش توسط کاربر یا بانک لغو گردید.',
    };
  },

  getStatus(orderId: string): Promise<'paid' | 'failed' | 'pending'> {
    return Promise.resolve('paid');
  },
};
