import LoginForm from '@/components/auth/LoginForm';

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex min-h-screen w-full items-stretch justify-center">
          <div className="flex w-full max-w-7xl flex-row items-stretch">
            {/* Left Branding Panel */}
            <div className="relative hidden w-1/2 flex-col items-start justify-end overflow-hidden p-12 lg:flex">
              <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                data-alt="Abstract image of a futuristic digital landscape with neon blue and purple lights, representing a gaming universe."
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbDSMOoCPWuY9X9pvCiJaYmbtW86jzu0pNAeKIBTAzARkEGwq5DmlY6gEeByAHb_KinBCGt4Bkz-UWepWVAiBEKaXbYwwx2135UB9EUpaPhsnPRVGbCaHt5SE0MbmAicy4ocC2TO4Qs7SSXj_I7NXDkihq0WQiYJAwXHNs7NG4vLse2DbyZQOJiAh0Nv4GIrX6h27CgrPjruhdXf3RcWZSHFnxJpkUiil7ax8kuHJvThlBsTeOjfeHlxv64u1FrBXFUBy7BCSz-CvW')",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
              </div>
              <div className="relative z-10 flex flex-col gap-4 text-white">
                <h1 className="font-display text-5xl font-bold leading-tight">Reset Your Password</h1>
                <p className="font-display max-w-md text-lg text-white/80">Enter your email to receive a password reset link.</p>
              </div>
            </div>
            {/* Right Form Panel */}
            <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-1/2">
              <div className="flex w-full max-w-md flex-col gap-8 py-10">
                <div className="flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">stadia_controller</span>
                    <span className="font-display text-2xl font-bold text-gray-900 dark:text-white">EpinMarket</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-display text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Forgot Password?</p>
                    <p className="font-display text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Enter your email to reset your password</p>
                  </div>
                </div>
                <form className="flex w-full flex-col gap-4">
                  <label className="flex flex-col flex-1">
                    <p className="font-display text-base font-medium leading-normal pb-2 text-gray-800 dark:text-gray-200">Email</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <div className="flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg border-r-0 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined">email</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
                        placeholder="Enter your email"
                        type="email"
                        required
                      />
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                  >
                    Send Reset Link
                  </button>
                </form>
                <p className="font-display text-center text-sm text-gray-500 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link className="font-bold text-primary hover:underline" href="/login">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

