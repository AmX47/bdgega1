import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface AuthComponentProps {
  onClose: () => void;
}

export default function AuthComponent({ onClose }: AuthComponentProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة')
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone
            }
          }
        })

        if (signUpError) throw signUpError

        if (signUpData?.user) {
          setSuccess('تم إنشاء الحساب بنجاح!')
          setTimeout(() => {
            setIsSignUp(false)
            setFormData({
              email: '',
              password: '',
              name: '',
              phone: '',
              confirmPassword: ''
            })
            onClose()
          }, 2000)
        }
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) throw signInError

        if (signInData.user) {
          onClose()
        }
      }
    } catch (error: any) {
      if (error.message.includes('Password should be at least 6 characters')) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      } else if (error.message.includes('User already registered')) {
        setError('البريد الإلكتروني مسجل بالفعل')
      } else if (error.message.includes('Invalid login credentials')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <PhoneInput
                country={'kw'}
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone: phone })}
                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020]"
                containerClass="direction-ltr"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020]"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020]"
            dir="ltr"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020]"
              dir="ltr"
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center">{success}</div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-gradient-to-r from-[#800020] to-[#A0455A] text-white rounded-md font-medium shadow-lg hover:from-[#A0455A] hover:to-[#800020] transition-all duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            'جاري التحميل...'
          ) : isSignUp ? (
            'إنشاء حساب'
          ) : (
            'تسجيل الدخول'
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
                phone: '',
                confirmPassword: ''
              })
            }}
            className="text-[#800020] hover:text-[#A0455A] text-sm"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساب جديد'}
          </button>
        </div>
      </form>
    </div>
  )
}
