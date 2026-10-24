'use client';

import React, { useState, useRef, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Mascot, { MascotState } from './Mascot';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthMascotFormProps {
  initialTab?: 'login' | 'register';
  onSuccessRedirect?: string;
}

export default function AuthMascotForm({
  initialTab = 'login',
  onSuccessRedirect = '/shop',
}: AuthMascotFormProps) {
  const router = useRouter();

  // Tab state: 'login' | 'register'
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Mascot state machine
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [lookX, setLookX] = useState<number>(0.5);
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & UI state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardShake, setCardShake] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Security / Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Unique accessible IDs
  const loginEmailId = useId();
  const loginPasswordId = useId();
  const regNameId = useId();
  const regEmailId = useId();
  const regPhoneId = useId();
  const regPasswordId = useId();
  const regConfirmPasswordId = useId();
  const termsId = useId();
  const rememberId = useId();

  // Rate limit countdown timer
  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLockout = () => {
    setLockoutRemaining(60);
    if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    lockoutTimerRef.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Password strength calculation (0 to 4)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-gray-300 dark:bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-[#c68a24]' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
  };

  const passwordStrength = getPasswordStrength(regPassword);
  const passwordsMatch = regConfirmPassword.length > 0 && regPassword === regConfirmPassword;

  // Mascot Event Handlers
  const handleEmailFocus = (val: string) => {
    setIsConfirmingPassword(false);
    setMascotState('email');
    updateLookX(val);
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const val = e.target.value;
    setter(val);
    updateLookX(val);
  };

  const updateLookX = (val: string) => {
    // Map text length to 0..1 ratio clamped safely
    const ratio = Math.max(0, Math.min(1, val.length / 28));
    setLookX(ratio);
  };

  const handlePasswordFocus = () => {
    setIsConfirmingPassword(false);
    if (showPassword) {
      setMascotState('peek');
    } else {
      setMascotState('password');
    }
  };

  const handleConfirmPasswordFocus = () => {
    setIsConfirmingPassword(true);
    if (showConfirmPassword) {
      setMascotState('peek');
    } else {
      setMascotState('password');
    }
  };

  const handleBlur = () => {
    // Return to idle state unless actively submitting or showing success/error
    if (!isSubmitting && mascotState !== 'success' && mascotState !== 'error') {
      setMascotState('idle');
      setIsConfirmingPassword(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => {
      const next = !prev;
      if (mascotState === 'password' || mascotState === 'peek') {
        setMascotState(next ? 'peek' : 'password');
      }
      return next;
    });
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => {
      const next = !prev;
      if (mascotState === 'password' || mascotState === 'peek') {
        setMascotState(next ? 'peek' : 'password');
      }
      return next;
    });
  };

  // Tab switch handler
  const handleTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    setErrors({});
    setMascotState('idle');
    setIsConfirmingPassword(false);
  };

  // Trigger error animation and mascot reaction
  const triggerErrorState = (newErrors: { [key: string]: string }) => {
    setErrors(newErrors);
    setMascotState('error');
    setCardShake(true);

    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);
    if (newFails >= 5) {
      startLockout();
    }

    setTimeout(() => {
      setCardShake(false);
    }, 700);

    setTimeout(() => {
      setMascotState('idle');
    }, 1900);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!loginEmail || !/^\S+@\S+\.\S+$/.test(loginEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!loginPassword) {
      newErrors.password = 'Password is required.';
    } else if (loginPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      triggerErrorState(newErrors);
      return;
    }

    // Realistic API call simulation
    setIsSubmitting(true);
    setMascotState('loading');

    setTimeout(() => {
      // Mock failure trigger for testing: "fail@test.com" or password === "wrong"
      if (loginEmail === 'fail@test.com' || loginPassword === 'wrong123') {
        setIsSubmitting(false);
        triggerErrorState({ form: 'Invalid email or password credentials. Please try again.' });
        return;
      }

      // Success
      setIsSubmitting(false);
      setMascotState('success');
      setAuthSuccessMessage('Sign in successful! Welcome back to Vintage Collections.');

      setTimeout(() => {
        router.push(onSuccessRedirect);
      }, 1600);
    }, 1100);
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!regName.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!regEmail || !/^\S+@\S+\.\S+$/.test(regEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!regPassword || regPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (regPassword !== regConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Service to continue.';
    }

    if (Object.keys(newErrors).length > 0) {
      triggerErrorState(newErrors);
      return;
    }

    // Realistic registration simulation
    setIsSubmitting(true);
    setMascotState('loading');

    setTimeout(() => {
      setIsSubmitting(false);
      setMascotState('success');
      setAuthSuccessMessage('Account created successfully! Welcome to the family.');

      setTimeout(() => {
        router.push(onSuccessRedirect);
      }, 1700);
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto pt-16 sm:pt-20 px-2 sm:px-0">
      {/* 1. Circular Mascot Anchor atop Form Card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-[#122e25] via-[#173f34] to-[#0c1f19] border-4 border-[#c68a24] shadow-2xl p-2 flex items-center justify-center transition-transform hover:scale-105">
          <Mascot
            state={mascotState}
            lookX={lookX}
            isConfirmPassword={isConfirmingPassword}
            passwordsMatch={passwordsMatch}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 2. Glassmorphic Form Card with Shake on Error */}
      <div
        className={`bg-white/95 dark:bg-[#17241f]/95 backdrop-blur-xl border border-gray-200 dark:border-[#273b33] rounded-3xl shadow-2xl pt-16 sm:pt-20 pb-8 px-5 sm:px-8 transition-all ${
          cardShake ? 'animate-card-shake' : ''
        }`}
      >
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#c68a24]/15 text-[#c68a24] border border-[#c68a24]/30 mb-2">
            <Sparkles className="w-3 h-3" />
            Handmade Artisan Lighting
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-[family-name:var(--font-heading)]">
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            {tab === 'login'
              ? 'Sign in to track European orders and saved lamps'
              : 'Join to order custom bamboo lamp dimensions & direct exports'}
          </p>
        </div>

        {/* Global Success Banner */}
        {authSuccessMessage && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-start gap-3 shadow-sm animate-fadeIn"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">{authSuccessMessage}</p>
              <p className="text-[11px] opacity-80 mt-0.5">Redirecting you seamlessly...</p>
            </div>
          </div>
        )}

        {/* Global Lockout Banner */}
        {lockoutRemaining > 0 && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-500/40 text-red-800 dark:text-red-200 flex items-center gap-3 text-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>
              Too many failed login attempts. For security, please wait <strong>{lockoutRemaining}s</strong> before
              trying again.
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {errors.form && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Tabs: Login / Register with animated indicator */}
        <div className="relative flex rounded-xl bg-gray-100 dark:bg-[#0f1a15] p-1 mb-6 border border-gray-200/60 dark:border-[#223d33]">
          {/* Animated sliding background pill */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white dark:bg-[#1f3a30] shadow-sm transition-transform duration-300 ease-out ${
              tab === 'login' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'
            }`}
          />
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors z-10 min-h-[44px] ${
              tab === 'login'
                ? 'text-[#173f34] dark:text-[#f3b853]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            aria-selected={tab === 'login'}
            role="tab"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors z-10 min-h-[44px] ${
              tab === 'register'
                ? 'text-[#173f34] dark:text-[#f3b853]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            aria-selected={tab === 'register'}
            role="tab"
          >
            Register
          </button>
        </div>

        {/* 3. LOGIN TAB FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
            {/* Email Field with Floating Label & Pupil Tracking */}
            <div className="relative">
              <input
                id={loginEmailId}
                type="email"
                value={loginEmail}
                onChange={(e) => handleEmailInput(e, setLoginEmail)}
                onFocus={() => handleEmailFocus(loginEmail)}
                onBlur={handleBlur}
                autoComplete="email"
                placeholder=" "
                disabled={isSubmitting || lockoutRemaining > 0}
                className={`peer w-full h-12 px-3.5 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                  errors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${loginEmailId}-error` : undefined}
              />
              <label
                htmlFor={loginEmailId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Email Address
              </label>
              {errors.email && (
                <p id={`${loginEmailId}-error`} role="alert" className="text-red-500 text-xs mt-1 px-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field with Covering Eyes & Peek Toggle */}
            <div className="relative">
              <input
                id={loginPasswordId}
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onFocus={handlePasswordFocus}
                onBlur={handleBlur}
                autoComplete="current-password"
                placeholder=" "
                disabled={isSubmitting || lockoutRemaining > 0}
                className={`peer w-full h-12 pl-3.5 pr-11 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                  errors.password
                    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                }`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? `${loginPasswordId}-error` : undefined}
              />
              <label
                htmlFor={loginPasswordId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Password
              </label>

              {/* Show/Hide Password Eye Toggle (Triggers Peek) */}
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword ? 'Hide password and cover mascot eyes' : 'Show password and peek through fingers'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-[#c68a24]" /> : <Eye className="w-4 h-4" />}
              </button>

              {errors.password && (
                <p id={`${loginPasswordId}-error`} role="alert" className="text-red-500 text-xs mt-1 px-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor={rememberId} className="flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-gray-300 min-h-[36px]">
                <input
                  id={rememberId}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#173f34] focus:ring-[#c68a24] accent-[#173f34] cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[#c68a24] hover:text-[#9e6d1b] dark:text-[#f3b853] dark:hover:text-amber-300 font-semibold transition-colors underline-offset-2 hover:underline p-1 min-h-[36px] flex items-center"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || lockoutRemaining > 0}
              className="w-full h-12 bg-gradient-to-r from-[#173f34] via-[#1f4f42] to-[#173f34] hover:from-[#13352c] hover:to-[#1a4438] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base border border-[#2b6354] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#f3b853]" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#f3b853]" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#273b33]" />
              </div>
              <span className="relative bg-white dark:bg-[#17241f] px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                or continue with
              </span>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() => {
                setMascotState('loading');
                setTimeout(() => {
                  setMascotState('success');
                  setAuthSuccessMessage('Google Account connected successfully!');
                  setTimeout(() => router.push(onSuccessRedirect), 1500);
                }, 1000);
              }}
              className="w-full h-12 bg-white dark:bg-[#101b16] hover:bg-gray-50 dark:hover:bg-[#14231d] text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-[#273b33] rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow active:scale-[0.985]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* 4. REGISTER TAB FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
            {/* Full Name */}
            <div className="relative">
              <input
                id={regNameId}
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                onFocus={() => {
                  setIsConfirmingPassword(false);
                  setMascotState('idle');
                }}
                onBlur={handleBlur}
                autoComplete="name"
                placeholder=" "
                disabled={isSubmitting}
                className={`peer w-full h-12 px-3.5 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                  errors.name
                    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                }`}
                aria-invalid={!!errors.name}
              />
              <label
                htmlFor={regNameId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Full Name
              </label>
              {errors.name && <p className="text-red-500 text-xs mt-1 px-1">{errors.name}</p>}
            </div>

            {/* Email Address with Pupil Tracking */}
            <div className="relative">
              <input
                id={regEmailId}
                type="email"
                value={regEmail}
                onChange={(e) => handleEmailInput(e, setRegEmail)}
                onFocus={() => handleEmailFocus(regEmail)}
                onBlur={handleBlur}
                autoComplete="email"
                placeholder=" "
                disabled={isSubmitting}
                className={`peer w-full h-12 px-3.5 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                  errors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                }`}
                aria-invalid={!!errors.email}
              />
              <label
                htmlFor={regEmailId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Email Address
              </label>
              {errors.email && <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>}
            </div>

            {/* Phone (Optional) */}
            <div className="relative">
              <input
                id={regPhoneId}
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                onFocus={() => {
                  setIsConfirmingPassword(false);
                  setMascotState('idle');
                }}
                onBlur={handleBlur}
                autoComplete="tel"
                placeholder=" "
                disabled={isSubmitting}
                className="peer w-full h-12 px-3.5 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30 transition-all outline-none"
              />
              <label
                htmlFor={regPhoneId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Phone Number <span className="text-[10px] opacity-75">(Optional)</span>
              </label>
            </div>

            {/* Password with Strength Meter & Eye Toggle */}
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  id={regPasswordId}
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  onFocus={handlePasswordFocus}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  placeholder=" "
                  disabled={isSubmitting}
                  className={`peer w-full h-12 pl-3.5 pr-11 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                  }`}
                  aria-invalid={!!errors.password}
                />
                <label
                  htmlFor={regPasswordId}
                  className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
                >
                  Password (8+ chars)
                </label>
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#c68a24]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter Bar */}
              {regPassword.length > 0 && (
                <div className="px-1 pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    <span>Password Strength:</span>
                    <span
                      className={
                        passwordStrength.score >= 3
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : passwordStrength.score === 2
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full rounded-full transition-all duration-300 ${
                          step <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200 dark:bg-[#273b33]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1 px-1">{errors.password}</p>}
            </div>

            {/* Confirm Password with Match Indicator & Mascot Thumbs Up */}
            <div className="relative">
              <input
                id={regConfirmPasswordId}
                type={showConfirmPassword ? 'text' : 'password'}
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                onFocus={handleConfirmPasswordFocus}
                onBlur={handleBlur}
                autoComplete="new-password"
                placeholder=" "
                disabled={isSubmitting}
                className={`peer w-full h-12 pl-3.5 pr-11 pt-4 pb-1 text-sm bg-gray-50/70 dark:bg-[#121f1a]/80 text-gray-900 dark:text-white rounded-xl border transition-all outline-none ${
                  passwordsMatch
                    ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-400'
                    : errors.confirmPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-300 dark:border-[#2a453b] focus:border-[#c68a24] focus:ring-2 focus:ring-[#c68a24]/30'
                }`}
                aria-invalid={!!errors.confirmPassword}
              />
              <label
                htmlFor={regConfirmPasswordId}
                className="absolute text-xs sm:text-sm text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#c68a24] dark:peer-focus:text-[#e5a439] pointer-events-none"
              >
                Confirm Password
              </label>

              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[#c68a24]" /> : <Eye className="w-4 h-4" />}
              </button>

              {passwordsMatch && (
                <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1 px-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passwords match! The mascot gives a thumbs-up 👍
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 px-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label htmlFor={termsId} className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 dark:text-gray-300 select-none">
                <input
                  id={termsId}
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#173f34] focus:ring-[#c68a24] accent-[#173f34] cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/policies/terms" className="text-[#c68a24] dark:text-[#f3b853] underline font-medium hover:text-[#9e6d1b]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/policies/privacy" className="text-[#c68a24] dark:text-[#f3b853] underline font-medium hover:text-[#9e6d1b]">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs mt-1 px-1">{errors.terms}</p>}
            </div>

            {/* Create Account Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || lockoutRemaining > 0}
              className="w-full h-12 bg-gradient-to-r from-[#173f34] via-[#1f4f42] to-[#173f34] hover:from-[#13352c] hover:to-[#1a4438] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base border border-[#2b6354] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#f3b853]" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-[#f3b853]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Trust Footnote */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#223d33] flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <ShieldCheck className="w-4 h-4 text-[#c68a24]" />
          <span>256-Bit SSL Encrypted • Zero Password Logging</span>
        </div>
      </div>

      {/* 5. FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
        >
          <div className="bg-white dark:bg-[#17241f] border border-gray-200 dark:border-[#273b33] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 id="forgot-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Enter your registered email address. We will send a secure one-time password reset link to your inbox.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Password reset link sent! Check your inbox and spam folder.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSent(true);
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full h-11 px-3 text-sm rounded-xl border border-gray-300 dark:border-[#273b33] bg-gray-50 dark:bg-[#101b16] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c68a24]"
                />
                <button
                  type="submit"
                  className="w-full h-11 bg-[#173f34] text-white font-bold rounded-xl hover:bg-[#122e25] transition-colors text-xs sm:text-sm"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                  setForgotEmail('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 p-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
