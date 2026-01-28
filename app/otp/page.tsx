"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SuccessToast from "@/components/SuccessToast";
import Button from "@/components/Button";

const OTP_INPUT_KEYS = ["otp-0", "otp-1", "otp-2", "otp-3", "otp-4", "otp-5"];

export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "michaelsmith@bucksfield.com";
  const source = searchParams.get("source") || "registration"; // "registration" or "forgot-password"
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showToast, setShowToast] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValues = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedValues.forEach((val, i) => {
        if (index + i < 6) {
          newOtp[index + i] = val;
        }
      });
      setOtp(newOtp);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + pastedValues.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      // Show success toast
      setShowToast(true);
      // Redirect based on source: registration goes to dashboard, forgot-password goes to reset-password
      setTimeout(() => {
        if (source === "forgot-password") {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } else {
          // Registration flow - go to dashboard after OTP verification
          router.push("/dashboard");
        }
      }, 3000);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <>
      <SuccessToast
        title="OTP verification success!"
        message={source === "forgot-password" 
          ? "Your OTP has been successfully verified. You will be redirected to reset your password."
          : "Your account has been successfully verified. You will be redirected to your dashboard."}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
      <div className="flex h-screen overflow-hidden">
        {/* Left Section - Red Background - Fixed */}
        <div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 fixed left-0 top-0 h-screen overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FF5461 0%, #970A14 100%)' }}
        >
          <div className="text-white ">
            <Image
              src="/bucksfield-logo.svg"
              alt="Bucksfield - ASSET MANAGEMENT LIMITED"
              width={200}
              height={40}
              className="mb-8"
              priority
            />
            <h1 className="text-white font-sofia text-[32px] font-semibold leading-normal mb-6">
              Welcome to BucksInvest Admin
            </h1>
            <p className="text-lg leading-relaxed max-w-md">
              Manage users, monitor investments, and oversee platform
              performance—all in one secure place. Please log in with your
              administrator credentials to continue.
            </p>
          </div>
          {/* Onboarding Illustration */}
          <div className="absolute bottom-0 right-0 w-96 h-96">
            <Image
              src="/onboarding-illustration.svg"
              alt="Admin onboarding illustration"
              width={384}
              height={384}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Section - White Background with Form - Scrollable */}
        <div className="w-full lg:w-1/2 lg:ml-[50%] bg-white flex flex-col h-screen overflow-y-auto scrollbar-hide">
          <div className="flex-1 flex flex-col w-full mx-auto py-8 px-4 lg:w-[608px] lg:py-[100px] ">
            <div className="mb-8">
              <Image
                src="/bucksfield-logo-dark.svg"
                alt="Bucksfield - ASSET MANAGEMENT LIMITED"
                width={200}
                height={40}
                priority
              />
            </div>

            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M44.8 25.6H19.2V19.2C19.2 12.1301 24.9301 6.4 32 6.4C39.0698 6.4 44.8 12.1301 44.8 19.2V25.6Z" stroke="url(#paint0_linear_365_7012)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M51.2 23.4667H12.8C10.4427 23.4667 8.53333 25.376 8.53333 27.7333V53.3333C8.53333 55.6907 10.4427 57.6 12.8 57.6H51.2C53.5573 57.6 55.4667 55.6907 55.4667 53.3333V27.7333C55.4667 25.376 53.5573 23.4667 51.2 23.4667ZM32 44.8C29.6427 44.8 27.7333 42.8885 27.7333 40.5333C27.7333 38.176 29.6427 36.2667 32 36.2667C34.3573 36.2667 36.2667 38.176 36.2667 40.5333C36.2667 42.8885 34.3573 44.8 32 44.8ZM44.8 44.8C42.4427 44.8 40.5333 42.8885 40.5333 40.5333C40.5333 38.176 42.4427 36.2667 44.8 36.2667C47.1573 36.2667 49.0667 38.176 49.0667 40.5333C49.0667 42.8885 47.1573 44.8 44.8 44.8ZM19.2 44.8C16.8427 44.8 14.9333 42.8885 14.9333 40.5333C14.9333 38.176 16.8427 36.2667 19.2 36.2667C21.5573 36.2667 23.4667 38.176 23.4667 40.5333C23.4667 42.8885 21.5573 44.8 19.2 44.8Z" fill="url(#paint1_linear_365_7012)"/>
              <defs>
                <linearGradient id="paint0_linear_365_7012" x1="32" y1="6.4" x2="32" y2="25.6" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF5461"/>
                  <stop offset="1" stopColor="#970A14"/>
                </linearGradient>
                <linearGradient id="paint1_linear_365_7012" x1="32" y1="23.4667" x2="32" y2="57.6" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF5461"/>
                  <stop offset="1" stopColor="#970A14"/>
                </linearGradient>
              </defs>
            </svg>
            </div>

            <h1 className="text-center font-sofia text-[24px] font-bold leading-normal mb-2 text-(--color-primary-black)">
              OTP Verification
            </h1>

            <p className="text-center text-gray-600 mb-8 font-sofia text-sm">
              Enter the 6 digit one time verification code sent to{" "} <br/>
              <span className="font-semibold">{email}</span>
            </p>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => {
                const inputKey = OTP_INPUT_KEYS[index];
                return (
                  <input
                    key={inputKey}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-lg font-semibold border-2 border-input-border rounded-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                );
              })}
            </div>

            {/* Resend Code */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm font-sofia">
                Didn&apos;t get any code?{" "}
                <button 
                  className="font-medium hover:underline"
                  style={{ color: 'var(--Primary-Red, #BB0613)' }}
                >
                  Resend Code
                </button>
              </p>
            </div>

            {/* Verify OTP Button */}
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!isOtpComplete}
            >
              Verify OTP
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
