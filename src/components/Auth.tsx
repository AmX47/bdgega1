import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function AuthComponent() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: 'kw',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('كلمات المرور غير متطابقة')
        setLoading(false)
        return
      }

      try {
        console.log('بدء عملية إنشاء الحساب...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              phone: formData.phone
            }
          }
        })
        
        if (authError) {
          console.error('خطأ في إنشاء الحساب:', authError);
          if (authError.message.includes('Password should be at least 6 characters')) {
            throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          } else if (authError.message.includes('User already registered')) {
            throw new Error('البريد الإلكتروني مسجل بالفعل');
          } else {
            throw new Error('حدث خطأ أثناء إنشاء الحساب: ' + authError.message);
          }
        }

        if (!authData?.user?.id) {
          console.error('لم يتم إنشاء معرف المستخدم');
          throw new Error('حدث خطأ أثناء إنشاء الحساب');
        }

        console.log('تم إنشاء الحساب بنجاح، جاري إضافة اللعبة...');
        
        // إضافة لعبة واحدة للمستخدم الجديد
        const { error: profileError } = await supabase
          .from('user_games')
          .insert([
            { 
              user_id: authData.user.id,
              games_remaining: 1
            }
          ])

        if (profileError) {
          console.error('خطأ في إضافة اللعبة:', profileError);
          throw new Error('تم إنشاء الحساب ولكن حدث خطأ في إضافة اللعبة');
        }

        console.log('تم إضافة اللعبة بنجاح!');
        setSuccess('تم إنشاء الحساب بنجاح!');
        
        // تأخير قصير قبل تسجيل الدخول تلقائياً
        setTimeout(async () => {
          try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            });
            
            if (signInError) throw signInError;
            
            setIsSignUp(false);
            setFormData({
              email: '',
              password: '',
              name: '',
              phone: 'kw',
              confirmPassword: ''
            });
            setSuccess('');
          } catch (error) {
            console.error('خطأ في تسجيل الدخول التلقائي:', error);
          }
        }, 2000);

      } catch (error) {
        console.error('خطأ:', error);
        setError(error.message || 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        console.log('محاولة تسجيل الدخول...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('خطأ في تسجيل الدخول:', error);
          if (error.message.includes('Invalid login credentials')) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
          } else {
            setError('حدث خطأ أثناء تسجيل الدخول');
          }
        } else {
          console.log('تم تسجيل الدخول بنجاح:', data);
        }
      } catch (error) {
        console.error('خطأ غير متوقع:', error);
        setError('حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#800020]">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {isSignUp ? 'قم بإنشاء حسابك للمتابعة' : 'أدخل بياناتك للمتابعة'}
          </p>
        </div>

        {isSignUp && (
          <>
            <div>
              <label className="block text-right text-gray-700 text-sm mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <div>
              <label className="block text-right text-gray-700 text-sm mb-2">رقم الهاتف</label>
              <div dir="ltr">
                <PhoneInput
                  country={'kw'}
                  value={formData.phone}
                  onChange={phone => setFormData({ ...formData, phone })}
                  inputClass="!w-full !py-2 !px-4 !text-base"
                  containerClass="!w-full"
                  buttonClass="!border-gray-300 !bg-gray-50"
                  dropdownClass="!rtl"
                  enableSearch
                  searchPlaceholder="ابحث عن دولة..."
                  searchNotFound="لم يتم العثور على نتائج"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-right text-gray-700 text-sm mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-right text-gray-700 text-sm mb-2">كلمة المرور</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200"
            placeholder="********"
            required
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-right text-gray-700 text-sm mb-2">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200"
              placeholder="********"
              required
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-500 p-3 rounded-lg text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-500 p-3 rounded-lg text-center text-sm"
          >
            {success}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#800020] to-[#A0455A] text-white py-3 rounded-lg font-semibold shadow-lg hover:from-[#A0455A] hover:to-[#800020] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              جاري {isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}...
            </span>
          ) : (
            isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
          )}
        </motion.button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
              setFormData({
                email: '',
                password: '',
                name: '',
                phone: 'kw',
                confirmPassword: ''
              })
            }}
            className="text-[#800020] hover:text-[#A0455A] transition-colors text-sm"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
