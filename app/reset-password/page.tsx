"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/Button";
import SuccessToast from "@/components/SuccessToast";

// Zod validation schema
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
    .regex(/[#%&*!\]}]/, { error: "Password must contain at least one special character from {#%&*!]}" }),
  confirmPassword: z.string().min(1, { error: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ResetPasswordData) => {
    console.log("Reset password submitted:", data);
    // Show success toast
    setShowToast(true);
    // Redirect to sign in after 3 seconds
    setTimeout(() => {
      router.push("/signin");
    }, 3000);
  };

  return (
    <>
      <SuccessToast
        title="Password Reset Successful!"
        message="Password has been successfully updated. Sign In with your new password"
        isVisible={showToast}
        onClose={() => {
          setShowToast(false);
          router.push("/signin");
        }}
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
            <h1 className="flex items-center gap-2 font-sofia text-[24px] font-bold leading-normal mb-2 text-(--color-primary-black)">
              <span className="text-center font-sofia text-[24px] font-bold leading-normal text-(--color-primary-black)">Reset Password</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#BB0613"/>
              </svg>
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your new password
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 font-sofia text-base font-medium leading-5 text-secondary-text"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password")}
                    placeholder="Enter your secure password"
                    className={`w-full px-4 py-3 pr-12 border rounded-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.password ? "border-red-500" : "border-input-border"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-sofia text-base font-medium leading-5 text-secondary-text"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    placeholder="Enter your secure password"
                    className={`w-full px-4 py-3 pr-12 border rounded-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.confirmPassword ? "border-red-500" : "border-input-border"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="rounded-[12px] border border-dashed border-neutral-grey-100 bg-neutral-grey-50 p-4">
                <p 
                  className="font-sofia text-xs font-normal leading-4 tracking-[-0.12px] text-secondary-text"
                  style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                >
                  Your password must be at least 8 characters long and include at
                  least one uppercase letter and one special character from{" "}
                  <span className="font-mono">{"{#%&*!]}"}</span>.
                </p>
              </div>

              {/* Reset Password Button */}
              <Button
                type="submit"
                disabled={!isValid}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
