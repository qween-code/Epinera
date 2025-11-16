export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Message List Panel */}
      <main className="flex w-96 flex-col border-x border-slate-200 bg-background-light dark:border-slate-800 dark:bg-background-dark">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Active List Item */}
          <div className="relative flex gap-4 bg-primary/10 px-4 py-3 dark:bg-primary/20">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <div className="flex items-start gap-3 w-full">
              <img className="h-12 w-12 rounded-full object-cover" alt="Avatar of Jane Doe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl6nikjeR0vzEI-FcM6cWXblBbkCg8Hg-pTsD5XAlgS109wVMCo-Hz5kfuDczL-wdKfe3jEH2cA-90jNuMyoaTSdRlgoQqx8-dhihDrgE253mH9FfUoftQbDt7Mt3NNZJRP8BFbBTWBswU2tFz5HaNpyejBgAYBVH4Y5ADRThBfacz4Uu1FaWMCKDCfdKqbDwtwzlRPEDjiYAl20Em9OypvNWYY6uJgTL8PXzLb3REL75D_COsZcQ0Pbco-lFge8B-T9tG0eW_x8jr"/>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Jane Doe</p>
                  <p className="text-primary text-xs font-medium">2 min ago</p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">Regarding Order #12345</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">Hi, I'm having trouble redeeming the key...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Conversation Detail Panel */}
      <section className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-[85px] items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-[#0b1418]">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conversation with Jane Doe</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Regarding <a className="text-primary hover:underline" href="#">Order #12345</a></p>
          </div>
        </header>
        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark">
          <div className="flex flex-col gap-4">
            {/* Buyer Message */}
            <div className="flex items-start gap-3">
              <img className="h-10 w-10 rounded-full object-cover" alt="Avatar of Jane Doe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFYift3pOsB-STPI7X6EdRdJzyWQ7NCx-fa9dLNckSzJEvw3Ht5Juf_79cKIUpNJB81B-9Pp5utIBYujP1QPa0cgdlvCSKi8V19SROLwF4RuCVO3sLf1zjktomK3oHIqJrUOk0VTVH4B6cmK5lZ5GGMkDAZNZdox-_2D8G1rBbH9oNDO1HKWqdSQbZDDIaQ8Ep8PxE5T6wrvfrY-yNa_smfWkejjMkTQyOazzROOKPmpyboVmgvvpDrZT3BH6FDZik46mVfWG16lV4"/>
              <div className="flex flex-col items-start">
                <div className="max-w-md rounded-b-xl rounded-tr-xl bg-white p-3 dark:bg-slate-800">
                  <p className="text-sm text-slate-800 dark:text-slate-200">Hi, I'm having trouble redeeming the key for the game I purchased (Order #12345). It says the key is invalid. Can you please help?</p>
                </div>
                <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">2 minutes ago</span>
              </div>
            </div>
            {/* Seller Message (You) */}
            <div className="flex flex-row-reverse items-start gap-3">
              <img className="h-10 w-10 rounded-full object-cover" alt="Avatar of Mehmet's Game Store" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7H6oas4uCmF-FixQAf3H3252ZQod0PWLSTnrUSQg31rGMXMmTNGwqE6GuPACs42_1Z4yyT28npe42J2A2qasUt2VVPO9I8q01OWlumSYhLBB0yqckSyy1kZJ-xLdpVxx5cCih2p_WlNI4FHl4DiGW9LukH7SZ9OsSX6pbfRYugiR7RYLN5eNwyfovUU4ydTDvSewG-XHXn65PaZj6Gr12QxdhhbPlHVPs9S6v8g72Hu1QEK10hXPI1V6QrVmzkOZUqiDmSK3EHpDd"/>
              <div className="flex flex-col items-end">
                <div className="max-w-md rounded-b-xl rounded-tl-xl bg-primary/20 p-3 dark:bg-primary/30">
                  <p className="text-sm text-slate-800 dark:text-slate-100">Hello Jane, I'm sorry to hear you're having trouble. Could you please double-check if you entered the key correctly, including any dashes?</p>
                </div>
                <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">1 minute ago</span>
              </div>
            </div>
          </div>
        </div>
        {/* Message Composer */}
        <footer className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1418]">
          <div className="relative">
            <textarea className="form-textarea w-full resize-none rounded-lg border-slate-300 bg-slate-100 p-3 pr-28 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500" placeholder="Type your message..." rows="3"></textarea>
          </div>
          <div className="mt-2 flex justify-end">
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90">
                Send
                <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
