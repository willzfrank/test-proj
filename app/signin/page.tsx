"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

// Zod validation schema for sign in
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .refine((val) => z.email().safeParse(val).success, {
      error: "Please enter a valid email address",
    }),
  password: z.string().min(1, { error: "Password is required" }),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = (data: SignInData) => {
    console.log("Sign in submitted:", data);
    // Handle sign in - navigate to dashboard or appropriate page
    // OTP verification is only for registration, not sign in
    router.push("/dashboard");
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
            <span className="text-center font-sofia text-[24px] font-bold leading-normal text-(--color-primary-black)">Welcome, Admin</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" className="shrink-0">
              <path d="M22.7724 10.7726C22.7724 16.7204 17.9476 21.5452 11.9998 21.5452C6.0506 21.5452 1.22717 16.7204 1.22717 10.7726C1.22717 4.82343 6.0506 0 11.9998 0C17.9476 0 22.7724 4.82343 22.7724 10.7726Z" fill="#FFCC4D"/>
              <path d="M17.2925 10.8595C17.1915 10.7511 17.0407 10.7444 16.9323 10.84C16.9101 10.8595 14.7085 12.7925 11.9998 12.7925C9.29792 12.7925 7.08954 10.8595 7.06732 10.84C6.95825 10.7444 6.80811 10.7525 6.70711 10.8595C6.60679 10.9673 6.58458 11.145 6.65392 11.2824C6.72664 11.4271 8.47786 14.8124 11.9998 14.8124C15.5218 14.8124 17.2737 11.4271 17.3457 11.2824C17.4151 11.1443 17.3929 10.9673 17.2925 10.8595Z" fill="#664500"/>
              <path d="M8.898 15.5892L7.86181 14.0952C7.86181 14.0952 7.49622 13.5114 6.91181 13.8764C6.32807 14.2406 6.69366 14.825 6.69366 14.825L7.8773 17.1007C7.8773 17.1007 7.97425 17.6178 7.25922 17.0395C6.94749 16.7876 7.12658 16.9297 7.12658 16.9297L6.83034 16.6867L3.13332 13.6515C3.13332 13.6515 2.65596 13.1479 2.21832 13.6798C1.78203 14.2123 2.36847 14.5826 2.36847 14.5826L5.86484 17.4549C5.78405 17.5357 5.54032 17.8144 5.46087 17.9013L1.71942 14.8311C1.71942 14.8311 1.24138 14.3268 0.805093 14.8587C0.367457 15.3912 0.954563 15.7616 0.954563 15.7616L4.69467 18.8331C4.62532 18.9274 4.45027 19.1536 4.38563 19.2465L1.15924 16.5978C1.15924 16.5978 0.681209 16.0942 0.244919 16.6261C-0.193391 17.1586 0.394388 17.5296 0.394388 17.5296L3.82411 20.3466C3.78102 20.4665 3.57971 20.7816 3.54806 20.8987L1.07575 18.8708C1.07575 18.8708 0.598394 18.3645 0.162104 18.8984C-0.275532 19.431 0.311574 19.8013 0.311574 19.8013L4.30417 23.0788L4.57011 23.2983C6.33413 24.7466 8.93907 24.4907 10.3873 22.7267C11.7144 21.1088 11.6107 18.786 10.2257 17.294C9.7349 16.7674 9.31005 16.181 8.898 15.5892ZM23.8382 18.8991C23.402 18.3652 22.9246 18.8715 22.9246 18.8715L20.4523 20.8994C20.4206 20.7823 20.2193 20.4665 20.1762 20.3473L23.606 17.5303C23.606 17.5303 24.1937 17.1593 23.7561 16.6267C23.3198 16.0948 22.8418 16.5985 22.8418 16.5985L19.6154 19.2472C19.5507 19.1536 19.375 18.9274 19.3063 18.8338L23.0465 15.7622C23.0465 15.7622 23.6342 15.3919 23.1966 14.8593C22.7603 14.3275 22.2829 14.8317 22.2829 14.8317L18.5408 17.9019C18.462 17.8151 18.2183 17.5363 18.1368 17.4555L21.6332 14.5833C21.6332 14.5833 22.219 14.213 21.7834 13.6804C21.3457 13.1485 20.8684 13.6521 20.8684 13.6521L17.1714 16.6873L16.8758 16.9304C16.8758 16.9304 17.5423 16.3641 16.7431 17.0401C15.9433 17.7161 16.1251 17.1014 16.1251 17.1014L17.3087 14.8257C17.3087 14.8257 17.6743 14.2413 17.0906 13.877C16.5055 13.5121 16.1406 14.0958 16.1406 14.0958L15.105 15.5899C14.6923 16.1817 14.2675 16.7681 13.776 17.2953C12.3903 18.788 12.2867 21.1101 13.6151 22.7281C15.0626 24.4921 17.6682 24.7479 19.4323 23.2997L19.6989 23.0802L23.6915 19.8026C23.6881 19.802 24.2752 19.4316 23.8382 18.8991Z" fill="#F4900C"/>
              <path d="M18.5151 7.39465C18.4808 7.31251 17.65 5.38623 15.9425 5.38623C14.2364 5.38623 13.4056 7.31251 13.3712 7.39465C13.3174 7.52122 13.3524 7.668 13.454 7.75553C13.5544 7.84171 13.6998 7.8444 13.8062 7.76361C13.8129 7.75755 14.534 7.21421 15.9425 7.21421C17.3423 7.21421 18.0627 7.75082 18.0795 7.76361C18.13 7.80333 18.1906 7.82353 18.2512 7.82353C18.3152 7.82353 18.3785 7.80064 18.431 7.75688C18.534 7.67002 18.569 7.52122 18.5151 7.39465ZM11.109 7.39465C11.074 7.31251 10.2438 5.38623 8.53635 5.38623C6.83024 5.38623 5.99941 7.31251 5.9644 7.39465C5.91121 7.52122 5.94554 7.668 6.04788 7.75553C6.14888 7.84171 6.29431 7.8444 6.40001 7.76361C6.40742 7.75755 7.12783 7.21421 8.53635 7.21421C9.93679 7.21421 10.6565 7.75082 10.6727 7.76361C10.7239 7.80333 10.7838 7.82353 10.8444 7.82353C10.9083 7.82353 10.9716 7.80064 11.0241 7.75688C11.1278 7.67002 11.1622 7.52122 11.109 7.39465Z" fill="#664500"/>
              <path d="M7.40949 17.1541C7.40949 17.1541 5.66366 19.3853 7.73536 22.1768C7.8781 22.3687 8.24033 22.2751 8.08614 22.0502C7.91782 21.8051 6.2346 19.4271 7.81683 17.2988C7.81683 17.2988 7.56031 17.2672 7.40949 17.1541ZM16.5547 17.22C16.5547 17.22 18.3013 19.4513 16.2289 22.2428C16.0861 22.4346 15.7239 22.3411 15.8781 22.1162C16.0464 21.8711 17.7296 19.4931 16.1474 17.3648C16.1467 17.3655 16.4039 17.3338 16.5547 17.22Z" fill="#B55005"/>
            </svg>
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your details to sign in to your account
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-sofia text-base font-medium leading-5 text-secondary-text"
              >
                Password
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--Primary-Red, #BB0613)' }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={!isValid}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
