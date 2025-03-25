import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PurchaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseComplete: (gamesCount: number) => void;
}

interface PurchaseOption {
    games: number;
    priceKWD: number;
    priceUSD: number;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({ isOpen, onClose, onPurchaseComplete }) => {
    const [selectedOption, setSelectedOption] = React.useState<PurchaseOption | null>(null);

    const purchaseOptions: PurchaseOption[] = [
        { games: 1, priceKWD: 1, priceUSD: 3.25 },
        { games: 2, priceKWD: 2, priceUSD: 6.50 },
        { games: 5, priceKWD: 5, priceUSD: 16.25 },
        { games: 10, priceKWD: 10, priceUSD: 32.50 }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full" dir="rtl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#F5DEB3]">شراء ألعاب إضافية</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#F5DEB3] hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {purchaseOptions.map((option) => (
                        <button
                            key={option.games}
                            onClick={() => setSelectedOption(option)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedOption?.games === option.games
                                    ? 'border-[#800020] bg-[#800020]/20'
                                    : 'border-[#F5DEB3]/20 hover:border-[#F5DEB3]/40'
                            }`}
                        >
                            <div className="text-lg font-bold text-[#F5DEB3]">{option.games} {option.games === 1 ? 'لعبة' : 'ألعاب'}</div>
                            <div className="text-sm text-[#F5DEB3]/80">{option.priceKWD} د.ك</div>
                        </button>
                    ))}
                </div>

                {selectedOption && (
                    <div className="space-y-4">
                        <div dir="ltr">
                            <PayPalScriptProvider options={{ 
                                "client-id": "test",
                                currency: "USD"
                            }}>
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: selectedOption.priceUSD.toString()
                                                }
                                            }]
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            onPurchaseComplete(selectedOption.games);
                                            onClose();
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>

                        <button 
                            className="w-full py-3 px-4 bg-[#F5DEB3] text-[#800020] rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors flex items-center justify-center gap-2"
                            onClick={() => {
                                // Implement credit card payment logic
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                            الدفع بالبطاقة البنكية
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseDialog;
