import React from 'react';

interface TapPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const TapPayment: React.FC<TapPaymentProps> = ({ amount, onSuccess, onError }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch('https://api.tap.company/v2/charges/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ',
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'KWD',
          customer_initiated: true,
          threeDSecure: true,
          save_card: false,
          description: 'شراء ألعاب إضافية',
          metadata: {
            udf1: 'Games Purchase',
            udf2: amount.toString()
          },
          receipt: {
            email: false,
            sms: false
          },
          reference: {
            transaction: 'trx_' + Date.now(),
            order: 'ord_' + Date.now()
          },
          customer: {
            first_name: 'Guest',
            middle_name: '',
            last_name: 'User',
            email: 'guest@example.com',
            phone: {
              country_code: 965,
              number: 51234567
            }
          },
          merchant: {
            id: "1234"
          },
          source: {
            id: "src_all"
          },
          redirect: {
            url: window.location.origin + window.location.pathname
          },
          post: {
            url: window.location.origin + window.location.pathname
          }
        })
      });

      const data = await response.json();
      
      if (data.transaction && data.transaction.url) {
        // Save payment details before redirect
        localStorage.setItem('tap_payment_amount', amount.toString());
        localStorage.setItem('tap_payment_id', data.id);
        
        // Redirect to payment page
        window.location.href = data.transaction.url;
      } else {
        console.error('Error creating payment:', data);
        onError(data);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      onError(error);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      className="w-full py-3 px-4 bg-[#F5DEB3] text-[#800020] rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
      ادفع الآن
    </button>
  );
};

export default TapPayment;
