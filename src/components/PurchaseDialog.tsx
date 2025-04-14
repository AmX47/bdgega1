import React, { useState, useEffect } from 'react';
import { PayPalButton } from './PayPalButton/PayPalButton';

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

    const purchaseOptions: PurchaseOption[] = [
        { games: 1, priceKWD: 1 },
        { games: 2, priceKWD: 2 },
        { games: 5, priceKWD: 5 },
        { games: 10, priceKWD: 10 }
    ];

    const handlePayPalSuccess = async (details: any) => {
        console.log('Payment successful:', details);
        if (selectedOption) {
            onPurchaseComplete(selectedOption.games);
            onClose();
        }
    };

    const handlePayPalError = (error: any) => {
        setError('حدث خطأ في عملية الدفع. يرجى المحاولة مرة أخرى.');
        console.error('PayPal error:', error);
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
                                <div
                                    key={option.games}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedOption?.games === option.games 
                                        ? 'border-[#F5DEB3] bg-[#F5DEB3]/10 text-[#F5DEB3]' 
                                        : 'border-[#F5DEB3]/20 text-[#F5DEB3]/80 hover:border-[#F5DEB3]/50'
                                    }`}
                                    onClick={() => setSelectedOption(option)}
                                >
                                    <div className="text-lg font-bold">{option.games} ألعاب</div>
                                    <div className="opacity-80">{option.priceKWD} د.ك</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-span-4">
                        <div className="bg-[#2a2a2a] rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#F5DEB3] mb-4">ملخص الطلب</h3>
                            
                            {selectedOption ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[#F5DEB3]">
                                        <span>الباقة المختارة:</span>
                                        <span>{selectedOption.games} ألعاب</span>
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
                                                onClick={() => console.log('Applying promo code:', promoCode)}
                                                className="px-4 py-2 bg-[#800020] text-[#F5DEB3] rounded-lg hover:bg-[#600018] transition-colors"
                                            >
                                                تطبيق
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#F5DEB3]/20 pt-4">
                                        <div className="flex justify-between text-[#F5DEB3] font-bold mb-4">
                                            <span>الإجمالي:</span>
                                            <span>{selectedOption.priceKWD} د.ك</span>
                                        </div>
                                        
                                        {/* PayPal Button */}
                                        <div className="mt-4">
                                            <PayPalButton
                                                amount={selectedOption.priceKWD.toString()}
                                                description={`شراء ${selectedOption.games} ${selectedOption.games === 1 ? 'لعبة' : 'ألعاب'}`}
                                                onSuccess={handlePayPalSuccess}
                                                onError={handlePayPalError}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-[#F5DEB3]/60 text-center">
                                    الرجاء اختيار باقة للمتابعة
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
