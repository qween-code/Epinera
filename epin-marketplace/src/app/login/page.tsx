import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
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
                <h1 className="font-display text-5xl font-bold leading-tight">Your Gateway to the Digital Universe.</h1>
                <p className="font-display max-w-md text-lg text-white/80">Securely own, trade, and engage with your favorite games and digital assets.</p>
              </div>
            </div>
            {/* Right Login Panel */}
            <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-1/2">
              <LoginForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
