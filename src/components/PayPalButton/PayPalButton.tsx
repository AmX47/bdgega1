import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '../../config/paypal.config';

interface PayPalButtonProps {
    amount: string;
    onSuccess: (details: any) => void;
    onError?: (err: any) => void;
    description?: string;
}

export const PayPalButton = ({ amount, onSuccess, onError, description }: PayPalButtonProps) => {
    return (
        <PayPalScriptProvider options={{ 
            'client-id': PAYPAL_CONFIG.CLIENT_ID,
            currency: PAYPAL_CONFIG.CURRENCY
        }}>
            <PayPalButtons
                style={{ layout: 'horizontal' }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: PAYPAL_CONFIG.INTENT as any,
                        purchase_units: [{
                            amount: {
                                value: amount,
                                currency_code: PAYPAL_CONFIG.CURRENCY
                            },
                            description: description
                        }]
                    });
                }}
                onApprove={async (data, actions) => {
                    if (actions.order) {
                        const details = await actions.order.capture();
                        onSuccess(details);
                    }
                }}
                onError={(err) => {
                    console.error('PayPal Error:', err);
                    if (onError) onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};
