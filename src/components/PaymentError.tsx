import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentError: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect back to home after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#F5DEB3] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-[#800020] mb-4">فشلت عملية الدفع</h1>
        <p className="text-[#800020] mb-4">حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.</p>
        <p className="text-[#800020]/60">جاري تحويلك إلى الصفحة الرئيسية...</p>
      </div>
    </div>
  );
};
