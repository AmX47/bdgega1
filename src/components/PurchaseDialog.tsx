import React, { useState } from 'react';
import UPayment from './UPayment';

interface PurchaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchaseComplete: (gamesCount: number) => void;
}

interface PurchaseOption {
    games: number;
    priceKWD: number;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({ isOpen, onClose, onPurchaseComplete }) => {
    const [selectedOption, setSelectedOption] = React.useState<PurchaseOption | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'KNET' | 'VISA' | 'MASTERCARD' | 'APPLEPAY' | null>(null);

    const purchaseOptions: PurchaseOption[] = [
        { games: 1, priceKWD: 1 },
        { games: 2, priceKWD: 2 },
        { games: 5, priceKWD: 5 },
        { games: 10, priceKWD: 10 }
    ];

    const paymentMethods = [
        { id: 'KNET', name: 'KNET' },
        { id: 'VISA', name: 'VISA'},
        { id: 'MASTERCARD', name: 'MASTERCARD' },
        { id: 'APPLEPAY', name: 'Apple Pay'}
    ];

    // Check for payment status when component mounts
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');

        if (reference && status) {
            const verifyPayment = async () => {
                try {
                    const response = await fetch('https://sandboxapi.upayments.com/api/v1/charge/status', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer e66a94d579cf75fba327ff716ad68c53aae11528',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            reference: reference
                        })
                    });

                    const data = await response.json();
                    console.log('Payment verification response:', data);

                    if (data.status === 'success' && data.charge.status === 'Captured') {
                        // Get the saved games count
                        const savedGames = localStorage.getItem('upayments_amount');
                        if (savedGames) {
                            const gamesCount = Math.floor(parseFloat(savedGames));
                            onPurchaseComplete(gamesCount);
                            
                            // Clean up localStorage
                            localStorage.removeItem('upayments_amount');
                            localStorage.removeItem('upayments_reference');
                            
                            // Close the dialog
                            onClose();
                        }
                    } else {
                        setError(`حالة الدفع: ${data.charge?.status || 'فشل'}`);
                    }

                    // Clean up URL parameters
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (error) {
                    console.error('Error verifying payment:', error);
                    setError('حدث خطأ أثناء التحقق من حالة الدفع');
                }
            };

            verifyPayment();
        }
    }, [onPurchaseComplete, onClose]);

    const handlePaymentSuccess = () => {
        setError(null);
    };

    const handlePaymentError = (error: any) => {
        console.error('Payment error:', error);
        setError('حدث خطأ أثناء عملية الدفع');
    };

    const handleApplyPromoCode = () => {
        // هنا يمكنك إضافة منطق التحقق من كود الخصم
        console.log('Applying promo code:', promoCode);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-5xl w-full" dir="rtl">
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

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Game Packages */}
                    <div className="col-span-8">
                        <h3 className="text-lg font-semibold text-[#F5DEB3] mb-4">اختر الباقة المناسبة</h3>
                        <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Order Summary */}
                    <div className="col-span-4">
                        <div className="bg-[#2a2a2a] rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#F5DEB3] mb-4">ملخص الطلب</h3>
                            
                            {selectedOption && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[#F5DEB3]">
                                        <span>الباقة المختارة:</span>
                                        <span>{selectedOption.games} {selectedOption.games === 1 ? 'لعبة' : 'ألعاب'}</span>
                                    </div>
                                    <div className="flex justify-between text-[#F5DEB3]">
                                        <span>السعر:</span>
                                        <span>{selectedOption.priceKWD} د.ك</span>
                                    </div>
                                    
                                    {/* Promo Code */}
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="كود الخصم"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#F5DEB3]/20 rounded-lg text-[#F5DEB3] placeholder-[#F5DEB3]/50"
                                            />
                                            <button
                                                onClick={handleApplyPromoCode}
                                                className="px-4 py-2 bg-[#800020] text-[#F5DEB3] rounded-lg hover:bg-[#600018] transition-colors"
                                            >
                                                تطبيق
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#F5DEB3]/20 pt-4">
                                        <div className="flex justify-between text-[#F5DEB3] font-bold">
                                            <span>الإجمالي:</span>
                                            <span>{selectedOption.priceKWD} د.ك</span>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-2">
                                        <h4 className="text-[#F5DEB3] font-semibold">اختر طريقة الدفع</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedPaymentMethod(method.id as any)}
                                                    className={`p-2 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                                        selectedPaymentMethod === method.id
                                                            ? 'border-[#800020] bg-[#800020]/20 text-[#F5DEB3]'
                                                            : 'border-[#F5DEB3]/20 text-[#F5DEB3]/80 hover:border-[#F5DEB3]/40'
                                                    }`}
                                                >
                                                    <span>{method.icon}</span>
                                                    <span>{method.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedPaymentMethod && (
                                        <UPayment
                                            amount={selectedOption.priceKWD}
                                            onSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                            paymentMethod={selectedPaymentMethod}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDialog;
