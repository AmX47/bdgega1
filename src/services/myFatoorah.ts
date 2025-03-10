const MY_FATOORAH_API_KEY = 'acnq9paJExhiZp6TldqsQvmVOacXWucaZxDzsr9nZawXT2dyxiAVC-6PzPnhMnLOLTjhMAbrXtbPdDpT2cWsRrngJIGnyUepR6rNMGtdVhpJhrT661j-Hre7CpGGb1lZjiw1cZXLvUBswgmXKNmQ8gsRVC-l3i1ulH3K24rOjVj7E95VxK1gUBfOXLmlKOrZl6UHcskqzFxjtHXWnXgPxEeR81KcPsenyTj8BHLGdbe1ww9uAuqtyKg7DplgKg1tEsZjmtxhDY0-W9isKNY1fgo6YUdqEWhIF5qhycWocXqFwj3h2q7b7ba-Ce5DeeeQfw0-N1lk0IQccQjlSSLjRxLeUWOKjproW0VWsIGpegWkZMxeO3yW3-WI_yzrEtP3sp8Rf9-tzGC0I2hlmlN71KSRgazO1oAHNdFARNd0LtjJ6pW7ZBfZZ4ajNA3BW0IfpI2UTMEidlLaX4vvTDS74NWD7lmZLPY0NZUXa_Ngsot1FsGe-c3ZFS4Tt149MAbKXpNmplnJngJNNm9IqvB_DCkH89hsmKOeSWvWF7NJZeHS6GnjFjdwbZwU4TUi6paXj8ouDfffivcxppPDgq96BRpiDWJXzffzKtzfxkcUF7WhDxeLozfydxi8CmKLwpKqjHz314GB5aJusDFLhHAd5WogB48S294yFeljzHZZwwUQmctwZqazxF9Sg6sKM2wNrjJKuQ';
const API_URL = 'https://apitest.myfatoorah.com';

interface PaymentRequest {
  amount: number;
  customerName: string;
  customerEmail: string;
  callbackUrl: string;
  errorUrl: string;
}

export const initiatePayment = async (request: PaymentRequest) => {
  try {
    const response = await fetch(`${API_URL}/v2/InitiatePayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MY_FATOORAH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        InvoiceAmount: request.amount,
        CurrencyIso: 'KWD',
        CustomerName: request.customerName,
        CustomerEmail: request.customerEmail,
        CallBackUrl: request.callbackUrl,
        ErrorUrl: request.errorUrl,
        Language: 'ar',
        DisplayCurrencyIso: 'KWD'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initiate payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

export const executePayment = async (paymentId: string) => {
  try {
    const response = await fetch(`${API_URL}/v2/ExecutePayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MY_FATOORAH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        PaymentMethodId: paymentId,
        CustomerName: 'Guest Customer',
        DisplayCurrencyIso: 'KWD',
        MobileCountryCode: '+965',
        CustomerMobile: '',
        CustomerEmail: '',
        InvoiceValue: 1,
        CallBackUrl: `${window.location.origin}/payment/callback`,
        ErrorUrl: `${window.location.origin}/payment/error`,
        Language: 'ar'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to execute payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment execution error:', error);
    throw error;
  }
};
