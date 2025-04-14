import React from "react";

interface TapPaymentProps {
  amount: number;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const TapPayment: React.FC<TapPaymentProps> = ({ amount, onSuccess, onError }) => {
  const initiatePayment = async () => {
    try {
      // استخدام CORS proxy
      const corsProxy = 'https://corsproxy.io/?';
      const tapApiUrl = 'https://api.tap.company/v2/charges/';
      
      const response = await fetch(corsProxy + encodeURIComponent(tapApiUrl), {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_TAP_SECRET_KEY}`
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'KWD',
          customer_initiated: true,
          threeDSecure: true,
          save_card: false,
          description: 'شراء ألعاب',
          metadata: { udf1: 'game_purchase' },
          receipt: { email: false, sms: false },
          reference: {
            transaction: `txn_${Date.now()}`,
            order: `ord_${Date.now()}`
          },
          customer: {
            first_name: 'test',
            middle_name: 'test',
            last_name: 'test',
            email: 'test@test.com',
            phone: { country_code: 965, number: 51234567 }
          },
          source: { id: 'src_all' },
          redirect: {
            url: window.location.origin + window.location.pathname
          }
        })
      });

      const result = await response.json();
      console.log('Payment initiation response:', result);

      if (result.transaction && result.transaction.url) {
        // تخزين مبلغ الدفع في localStorage للتحقق لاحقاً
        localStorage.setItem('tap_payment_amount', amount.toString());
        
        if (onSuccess) {
          onSuccess(result);
        }

        // التوجيه إلى صفحة الدفع
        window.location.href = result.transaction.url;
      } else {
        throw new Error('لم يتم استلام رابط الدفع');
      }
    } catch (error) {
      console.error('خطأ في الدفع:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={initiatePayment}
      className="w-full bg-[#800020] text-white py-3 px-6 rounded-lg hover:bg-[#600018] transition-colors font-bold"
    >
      ادفع الآن
    </button>
  );
};

export default TapPayment;
