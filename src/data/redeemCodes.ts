import { supabase } from '../lib/supabase';

// دالة لتوليد كود عشوائي
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// توليد 50 كود
export const generateCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 50; i++) {
    codes.push(`BDGEEGA-${generateRandomString(10)}`);
  }
  return codes;
};

// الأكواد المولدة
export const redeemCodes = [
  'BDGEEGA-K7M9P4N2X5',
  'BDGEEGA-H3R8T6W9Y1',
  'BDGEEGA-Q5V2L4J7B9',
  'BDGEEGA-Z8C1F6D4G3',
  'BDGEEGA-X2Y5N7M4K1',
  'BDGEEGA-W9B3H6T8R4',
  'BDGEEGA-L5P2V7J4Q8',
  'BDGEEGA-F1D8G3C6Z9',
  'BDGEEGA-M4K7X2Y5N1',
  'BDGEEGA-T8R3W9B6H4',
  // ... المزيد من الأكواد (50 كود)
];

// التحقق من صلاحية الكود
export const isValidCode = async (code: string): Promise<boolean> => {
  try {
    // التحقق من وجود الكود في قاعدة البيانات
    const { data, error } = await supabase
      .from('redeem_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_used', false)
      .single();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
};

// تحديث حالة الكود بعد استخدامه
export const markCodeAsUsed = async (code: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('redeem_codes')
      .update({ 
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('code', code.toUpperCase());

    return !error;
  } catch {
    return false;
  }
};