import React, { useState } from 'react';

interface UPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
  paymentMethod: string;
}

const UPayment: React.FC<UPaymentProps> = ({ amount, onSuccess, onError, paymentMethod }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create payment request
      const response = await fetch('https://sandboxapi.upayments.com/api/v1/payment-request', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer e66a94d579cf75fba327ff716ad68c53aae11528',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          merchant: {
            name: "Test Company",
            id: "jtest123"
          },
          order: {
            amount: amount,
            currency: "KWD",
            reference: `order_${Date.now()}`,
            description: "شراء ألعاب إضافية"
          },
          payment: {
            type: paymentMethod
          },
          redirect: {
            url: window.location.origin + window.location.pathname
          }
        })
      });

      const data = await response.json();
      console.log('Payment response:', data);
      
      if (data && data.redirect_url) {
        // Save payment details before redirect
        localStorage.setItem('upayments_amount', amount.toString());
        localStorage.setItem('upayments_order_id', Date.now().toString());
        
        // Redirect to payment page
        window.location.href = data.redirect_url;
      } else {
        throw new Error('لم يتم استلام رابط الدفع');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      onError('حدث خطأ أثناء الاتصال بخدمة الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-3 px-4 bg-[#F5DEB3] text-[#800020] rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-[#800020]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      )}
      {loading ? 'جاري التحميل...' : 'ادفع الآن'}
    </button>
  );
};

export default UPayment;
