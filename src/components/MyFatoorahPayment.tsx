import React from 'react';

interface MyFatoorahPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const MyFatoorahPayment: React.FC<MyFatoorahPaymentProps> = ({ amount, onSuccess, onError }) => {
  const handlePayment = async () => {
    try {
      // Create payment request
      const response = await fetch('https://apitest.myfatoorah.com/v2/SendPayment', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          NotificationOption: "LNK",
          CustomerName: "Guest",
          DisplayCurrencyIso: "KWD",
          MobileCountryCode: "+965",
          CustomerMobile: "12345678",
          CustomerEmail: "guest@example.com",
          InvoiceValue: amount,
          CallBackUrl: window.location.origin + window.location.pathname,
          ErrorUrl: window.location.origin + window.location.pathname,
          Language: "ar",
          CustomerReference: "ref_" + Date.now(),
          CustomerCivilId: "12345678",
          UserDefinedField: "Games Purchase",
          InvoiceItems: [
            {
              ItemName: "شراء ألعاب إضافية",
              Quantity: 1,
              UnitPrice: amount
            }
          ]
        })
      });

      const data = await response.json();
      console.log('Payment response:', data);
      
      if (data.IsSuccess) {
        // Save payment details before redirect
        localStorage.setItem('myfatoorah_payment_amount', amount.toString());
        localStorage.setItem('myfatoorah_payment_id', data.Data.InvoiceId);
        
        // Redirect to payment page
        window.location.href = data.Data.InvoiceURL;
      } else {
        console.error('Error creating payment:', data);
        onError(data.Message || 'حدث خطأ أثناء إنشاء الفاتورة');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      onError('حدث خطأ أثناء الاتصال بخدمة الدفع');
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