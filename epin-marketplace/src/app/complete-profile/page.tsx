import type { NextPage } from 'next';

const CompleteProfilePage: NextPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnLq0aVbjLXyJC4TgmXsb6KP7YmnRnify9fSAmqDolSMmzrM2WyX7DU-H627KxJSB0Pqq5nC4x670dHv9z5J3EmMsBb_k90XbACuL7nQsUHuGGwpQumffaIY_-yxDLWD1_j-m8StWaBmypWmdXJPBuDa1yET02bE4DHPjhylrD56kLpOIQ8ibL5kvOr30HantW-ETniu-2i0UgYixwUMm4Br6BI6W8rSaY7d9A5443FIfjjOVcBeUdXZwyOZjBqsmYgrXxf4NpLlC4')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
      </div>
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center rounded-xl bg-white/50 p-6 shadow-2xl backdrop-blur-lg dark:bg-[#1A1C20]/50 sm:p-8">
        <div className="w-full">
          {/* PageHeading */}
          <div className="mb-6 flex flex-wrap justify-between gap-3 text-center sm:text-left">
            <div className="flex w-full flex-col gap-3 sm:w-auto">
              <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-800 dark:text-white">
                Enhance Your Experience
              </p>
              <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">
                Unlock personalized offers and build your community presence.
              </p>
            </div>
          </div>
          {/* ProgressBar */}
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex justify-between gap-6">
              <p className="text-base font-medium leading-normal text-black dark:text-white">Profile 60% Complete</p>
            </div>
            <div className="h-2 rounded-full bg-gray-300 dark:bg-[#315768]">
              <div className="h-2 rounded-full bg-primary" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {/* Profile Identity */}
            <section>
              <h2 className="border-b border-gray-200 px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:border-b-[#223d49] dark:text-white">
                Show Who You Are
              </h2>
              <div className="mt-4 flex p-4">
                <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 min-h-24 items-center justify-center rounded-full bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                        person
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-black dark:text-white">
                        Upload a Profile Photo
                      </p>
                      <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#90b8cb]">
                        Let others recognize you.
                      </p>
                    </div>
                  </div>
                  <button className="flex h-10 min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black hover:bg-gray-300 dark:bg-[#223d49] dark:text-white dark:hover:bg-primary/20 sm:w-auto">
                    <span className="truncate">Upload</span>
                  </button>
                </div>
              </div>
              <div className="mt-2 p-4">
                <p className="mb-4 font-bold text-black dark:text-white">Connect your accounts</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {/* Social Buttons */}
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] p-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                    <svg className="h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>Discord</title>
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2882-2.058-.2977-4.2262-.2977-6.2842 0-.2203-.4637-.4557-.9129-.6667-1.2882a.077.077 0 00-.0785-.0371A19.8186 19.8186 0 003.6831 4.3698a.077.077 0 00-.0371.0785v11.5833a16.4913 16.4913 0 005.0615 2.511.077.077 0 00.0864-.0215c.4217-.4217.8184-.871 1.189-1.3425a.077.077 0 00-.0128-.1025c-.2436-.1455-.4745-.3033-.6925-.4745a.077.077 0 00-.0864-.0043c-.9328.5328-1.8344.97-2.6953 1.272-.2542.0864-.5127.151-.767.2076v-1.1848a.077.077 0 00.0043-.017c.0128-.0215.0215-.043.0343-.0645.0128-.017.0256-.0343.043-.0512.0043-.0043.0043-.0043.0043-.0043l.0043-.0043a.077.077 0 00.0128-.017c.0043-.0043.0086-.0128.0128-.017.0128-.0128.0215-.0215.0343-.0343a.077.077 0 00.0256-.0215c.0128-.0128.0256-.0215.0343-.0343.017-.0128.0343-.0256.0512-.0343.0043-.0043.0086-.0086.0128-.0128.017-.0128.03-.0215.0472-.03.017-.0086.0343-.017.0512-.0215l.0043-.0043a.077.077 0 00.0215-.0086c.017-.0086.0343-.0128.0512-.017.0215-.0086.043-.017.0645-.0215.017-.0043.0343-.0086.0512-.0128.0215-.0043.043-.0086.0645-.0128.0215-.0043.043-.0043.0645-.0086.017-.0043.0343-.0043.0512-.0086.0215-.0043.043-.0043.0645-.0086.0215-.0043.043-.0043.0645-.0043.0215-.0043.043-.0043.0645-.0043.0215 0 .043.0043.0645.0043s.043.0043.0645.0043c.0215.0043.043.0043.0645.0043.0215.0043.043.0043.0645.0086.017.0043.0343.0043.0512.0086.0215.0043.043.0043.0645.0086.0215.0043.043.0086.0645.0128.017.0043.0343.0086.0512.0128.0215.0043.043.0086.0645.0128.017.0043.0343.0128.0512.017.0215.0086.043.0128.0645.0215.017.0043.0343.0128.0512.017.0128.0086.03.017.0472.03.017.0086.0343.017.0512.0256.0043.0043.0086.0086.0128.0128.017.0128.0343.0215.0512.0343.0128.0128.0256.0215.0343.0343a.077.077 0 00.0256.0215c.0128.0128.0215.0215.0343.0343.0086.0086.017.0215.0256.03.0086.0128.017.0256.0215.0386l.0043.0043a.077.077 0 00.0128.017c.0043.0043.0086.0086.0128.0128.0086.0128.017.0215.0256.0343.0086.0128.0128.0256.017.0386v.0043a.077.077 0 00.0043.0128c-.218.1709-.4488.3286-.6925.4745a.077.077 0 00-.0864.0043c.3707.4715.7674.9207 1.189 1.3425a.077.077 0 00.0864.0215 16.4913 16.4913 0 005.0615-2.511V4.4483a.077.077 0 00-.0371-.0785zM8.021 15.3312c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7628 2.2625-1.7042 2.2625zm7.958 0c-.9414 0-1.7042-1.0125-1.7042-2.2625s.7628-2.2625 1.7042-2.2625c.9499 0 1.7127 1.0125 1.7042 2.2625.0086 1.25-.7543 2.2625-1.7042 2.2625z" fill="currentColor"></path>
                    </svg>
                    <span>Discord</span>
                  </button>
                  {/* ... other social buttons */}
                </div>
              </div>
            </section>
            {/* ... other sections */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
