import type { NextPage } from 'next';
import Link from 'next/link';

const LoginPage: NextPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <main className="flex min-h-screen w-full items-stretch justify-center">
        <div className="flex w-full max-w-7xl flex-row items-stretch">
          {/* Left Branding Panel */}
          <div className="relative hidden w-1/2 flex-col items-start justify-end overflow-hidden p-12 lg:flex">
            <div
              className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbDSMOoCPWuY9X9pvCiJaYmbtW86jzu0pNAeKIBTAzARkEGwq5DmlY6gEeByAHb_KinBCGt4Bkz-UWepWVAiBEKaXbYwwx2135UB9EUpaPhsnPRVGbCaHt5SE0MbmAicy4ocC2TO4Qs7SSXj_I7NXDkihq0WQiYJAwXHNs7NG4vLse2DbyZQOJiAh0Nv4GIrX6h27CgrPjruhdXf3RcWZSHFnxJpkUiil7ax8kuHJvThlBsTeOjfeHlxv64u1FrBXFUBy7BCSz-CvW')",
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative z-10 flex flex-col gap-4 text-white">
              <h1 className="font-display text-5xl font-bold leading-tight">
                Your Gateway to the Digital Universe.
              </h1>
              <p className="font-display max-w-md text-lg text-white/80">
                Securely own, trade, and engage with your favorite games and digital assets.
              </p>
            </div>
          </div>

          {/* Right Login Panel */}
          <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-1/2">
            <div className="flex w-full max-w-md flex-col gap-8 py-10">
              {/* Header */}
              <div className="flex flex-col gap-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-primary text-4xl">stadia_controller</span>
                  <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">EpinMarket</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
                    Welcome Back
                  </p>
                  <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                    Log In to Your Account
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="flex w-full flex-col gap-4">
                {/* Email/Phone Input */}
                <label className="flex flex-col flex-1">
                  <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">
                    Email or Phone Number
                  </p>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
                      placeholder="Enter your email or phone"
                    />
                  </div>
                </label>

                {/* Password Input */}
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">
                      Password
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none rounded-r-none border-x-0 text-base font-normal leading-normal"
                        placeholder="Enter your password"
                        type="password"
                      />
                      <button className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pr-4 rounded-r-lg border-l-0 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </div>
                  </label>
                  <Link href="#" className="font-display text-sm font-normal leading-normal text-right text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                  Login
                </button>
              </div>

              {/* Social Logins */}
              <div className="flex flex-col gap-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-px w-full bg-gray-300 dark:bg-gray-700"></div>
                  <span className="relative bg-background-light dark:bg-background-dark px-2 text-sm text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg className="h-6 w-6" viewBox="0 0 48 48">
                      <g className="nc-icon-wrapper">
                        <path
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          fill="#FFC107"
                        ></path>
                        <path
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          fill="#FF3D00"
                        ></path>
                        <path
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.657-11.303-8H6.306C9.656,35.663,16.318,40,24,40z"
                          fill="#4CAF50"
                        ></path>
                        <path
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          fill="#1976D2"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  <button className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg className="h-6 w-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.885-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8254-.6184 1.2525a17.2963 17.2963 0 00-5.4856 0c-.172-.4271-.4074-.8772-.6184-1.2525a.0741.0741 0 00-.0785-.0371 19.7913 19.7913 0 00-4.885 1.5152.069.069 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0321.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8781-1.2982 1.229-2.0112a.0741.0741 0 00-.041-.1064 13.0784 13.0784 0 01-1.8724-.8911.0741.0741 0 01-.0076-.1277c.0381-.0561.102-.1121.1735-.1682a.0741.0741 0 01.0709-.0112c3.4389 1.4113 7.4654 1.4113 10.8928 0a.0741.0741 0 01.071.0112c.0715.0561.1354.1121.1735.1682a.0741.0741 0 01-.0076.1277 13.0861 13.0861 0 01-1.8724.8911.0741.0741 0 00-.041.1064c.3508.713.7674 1.3808 1.229 2.0112a.0777.0777 0 00.0842.0276c1.9516-.6067 3.9401-1.5218 5.9929-3.0294a.0824.0824 0 00.0321-.0561c.5004-5.284-.833-9.68-.833-9.68a.069.069 0 00-.0321-.0277zM8.0203 15.6269c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c.0001 1.3333-.9744 2.419-2.1569 2.419zm7.9592 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419s2.1569 1.0857 2.1569 2.419c0 1.3333-.9743 2.419-2.1569 2.419z"></path>
                    </svg>
                  </button>
                  <button className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="font-display text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/onboarding" className="font-bold text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
