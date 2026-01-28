"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/Button";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .refine((val) => z.email().safeParse(val).success, {
      error: "Please enter a valid email address",
    }),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ForgotPasswordData) => {
    console.log("Forgot password submitted:", data);
    // Navigate to OTP page with email and source parameter
    router.push(`/otp?email=${encodeURIComponent(data.email)}&source=forgot-password`);
  };

  return (
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
            <path d="M16.8002 9.6H7.2002V7.2C7.2002 4.5488 9.349 2.4 12.0002 2.4C14.6514 2.4 16.8002 4.5488 16.8002 7.2V9.6Z" stroke="url(#paint0_linear_392_52077)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.2002 8.8H4.8002C3.9162 8.8 3.2002 9.516 3.2002 10.4V20C3.2002 20.884 3.9162 21.6 4.8002 21.6H19.2002C20.0842 21.6 20.8002 20.884 20.8002 20V10.4C20.8002 9.516 20.0842 8.8 19.2002 8.8ZM12.0002 16.8C11.1162 16.8 10.4002 16.0832 10.4002 15.2C10.4002 14.316 11.1162 13.6 12.0002 13.6C12.8842 13.6 13.6002 14.316 13.6002 15.2C13.6002 16.0832 12.8842 16.8 12.0002 16.8ZM16.8002 16.8C15.9162 16.8 15.2002 16.0832 15.2002 15.2C15.2002 14.316 15.9162 13.6 16.8002 13.6C17.6842 13.6 18.4002 14.316 18.4002 15.2C18.4002 16.0832 17.6842 16.8 16.8002 16.8ZM7.2002 16.8C6.3162 16.8 5.6002 16.0832 5.6002 15.2C5.6002 14.316 6.3162 13.6 7.2002 13.6C8.0842 13.6 8.8002 14.316 8.8002 15.2C8.8002 16.0832 8.0842 16.8 7.2002 16.8Z" fill="url(#paint1_linear_392_52077)"/>
            <defs>
              <linearGradient id="paint0_linear_392_52077" x1="12.0002" y1="2.4" x2="12.0002" y2="9.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF5461"/>
                <stop offset="1" stopColor="#970A14"/>
              </linearGradient>
              <linearGradient id="paint1_linear_392_52077" x1="12.0002" y1="8.8" x2="12.0002" y2="21.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF5461"/>
                <stop offset="1" stopColor="#970A14"/>
              </linearGradient>
            </defs>
          </svg>
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your email address to reset your password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-sofia text-base font-medium leading-5 text-secondary-text"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-input-border"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Verify Email Address Button */}
            <Button
              type="submit"
              disabled={!isValid}
            >
              Verify Email Address
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
