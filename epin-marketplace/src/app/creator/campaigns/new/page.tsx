'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CampaignFormData {
  name: string;
  description: string;
  campaign_type: 'viral_growth' | 'cross_platform' | 'direct_discount';
  start_date: string;
  end_date: string;
  budget: number;
  products: string[];
  rewards: any;
  audience: any;
  integrations: string[];
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    campaign_type: 'viral_growth',
    start_date: '',
    end_date: '',
    budget: 0,
    products: [],
    rewards: {},
    audience: {},
    integrations: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/campaigns/new');
        return;
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          creator_id: user.id,
          name: formData.name,
          description: formData.description,
          campaign_type: formData.campaign_type,
          status: asDraft ? 'draft' : 'active',
          start_date: formData.start_date,
          end_date: formData.end_date,
          requirements: formData.audience,
          rewards: formData.rewards,
          metadata: {
            budget: formData.budget,
            products: formData.products,
            integrations: formData.integrations,
          },
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/creator/campaigns/${data.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Setup' },
    { number: 2, label: 'Products & Rewards' },
    { number: 3, label: 'Audience & Integrations' },
    { number: 4, label: 'Budget & Goals' },
  ];

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-b-[#223d49] px-6 lg:px-10 py-3 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 text-black dark:text-white">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fillRule="evenodd"
                />
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epin Marketplace</h2>
          </Link>
          <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-gray-500 dark:text-[#90b8cb] flex border-none bg-gray-200 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-black dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-200 dark:bg-[#223d49] focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search"
                value=""
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-6">
            <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/creator">
              Dashboard
            </Link>
            <Link className="text-black dark:text-primary text-sm font-bold leading-normal" href="/creator/campaigns">
              Campaigns
            </Link>
            <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/products">
              Products
            </Link>
            <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/creator/analytics">
              Analytics
            </Link>
            <Link className="text-gray-600 dark:text-white text-sm font-medium leading-normal" href="/creator/settings">
              Settings
            </Link>
          </div>
          <div className="flex gap-2">
            <Link
              href="/notifications"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link
              href="/support"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <span className="material-symbols-outlined">help</span>
            </Link>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User profile avatar"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArVj36E5T3eFgCDwxjNObZnVg-33GW1wcUnNJyEp5S3z7CfYmGFqQKgsNRqpJO2AY_7_3lbtCfJ1d1WQi1hTPb3S1Q99SYmZybYLKtjA8T2R6p17L4nOajUz2JKF8dCXo4XZpPxGqpRPZSwtl0O2r4gGCAiJqil-oqnr55Bg35tctM3N2goE_DFYD0rQJ2k6JgrPfG14KiMh2OZpiaoA6Z3K2AmIqNtNQPBq0EwntyR2_YfK9LWn1kHEKLBdmnlLWX2X9fUNl4GQ_m")',
            }}
          />
        </div>
      </header>

      <main className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-10">
        <div className="flex flex-wrap justify-between gap-4 pb-6">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Create New Campaign</p>
            <p className="text-gray-500 dark:text-[#90b8cb] text-base font-normal leading-normal">Follow the steps below to set up and launch your campaign.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Save as Draft</span>
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || currentStep < 4}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <span className="truncate">Launch Campaign</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 pb-6">
          <div className="flex gap-6 justify-between">
            <p className="text-black dark:text-white text-base font-medium leading-normal">
              Step {currentStep} of 4: {steps[currentStep - 1].label}
            </p>
          </div>
          <div className="rounded-full bg-gray-200 dark:bg-[#315768] h-2">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Step 1: Campaign Setup */}
            {currentStep === 1 && (
              <details className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34] group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 p-4">
                  <div className="flex flex-col">
                    <p className="text-black dark:text-white text-lg font-bold leading-normal">Campaign Setup</p>
                    <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Define your campaign's core details and select a type.</p>
                  </div>
                  <span className="material-symbols-outlined text-black dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-300 dark:border-[#315768]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Campaign Name</p>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-[#315768] bg-background-light dark:bg-[#101d23] focus:border-primary h-12 placeholder:text-gray-500 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal"
                        placeholder="e.g. Summer Sale Kick-off"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Campaign Duration</p>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#90b8cb]">calendar_month</span>
                        <input
                          type="text"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-[#315768] bg-background-light dark:bg-[#101d23] focus:border-primary h-12 placeholder:text-gray-500 dark:placeholder:text-[#90b8cb] pl-10 p-[15px] text-base font-normal leading-normal"
                          placeholder="Select date range"
                          value={formData.start_date && formData.end_date ? `${new Date(formData.start_date).toLocaleDateString()} - ${new Date(formData.end_date).toLocaleDateString()}` : ''}
                          readOnly
                        />
                      </div>
                    </label>
                  </div>
                  <div className="pt-6">
                    <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Campaign Type</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => handleInputChange('campaign_type', 'viral_growth')}
                        className={`flex flex-col gap-3 p-4 rounded-xl cursor-pointer ${
                          formData.campaign_type === 'viral_growth'
                            ? 'border-2 border-primary bg-primary/10'
                            : 'border border-gray-300 dark:border-[#315768] hover:border-primary dark:hover:border-primary bg-background-light dark:bg-[#101d23]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary">group</span>
                        <p className="font-bold text-black dark:text-white">Viral Growth</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Referral ladders, social proof incentives.</p>
                      </div>
                      <div
                        onClick={() => handleInputChange('campaign_type', 'cross_platform')}
                        className={`flex flex-col gap-3 p-4 rounded-xl cursor-pointer ${
                          formData.campaign_type === 'cross_platform'
                            ? 'border-2 border-primary bg-primary/10'
                            : 'border border-gray-300 dark:border-[#315768] hover:border-primary dark:hover:border-primary bg-background-light dark:bg-[#101d23]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">layers</span>
                        <p className="font-bold text-black dark:text-white">Cross-Platform</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Twitch drops, Instagram discounts.</p>
                      </div>
                      <div
                        onClick={() => handleInputChange('campaign_type', 'direct_discount')}
                        className={`flex flex-col gap-3 p-4 rounded-xl cursor-pointer ${
                          formData.campaign_type === 'direct_discount'
                            ? 'border-2 border-primary bg-primary/10'
                            : 'border border-gray-300 dark:border-[#315768] hover:border-primary dark:hover:border-primary bg-background-light dark:bg-[#101d23]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">sell</span>
                        <p className="font-bold text-black dark:text-white">Direct Discount</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Standard percentage or fixed amount off.</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </details>
            )}

            {/* Step 2: Products & Rewards */}
            {currentStep === 2 && (
              <details className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34] group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 p-4">
                  <div className="flex flex-col">
                    <p className="text-black dark:text-white text-lg font-bold leading-normal">Products & Rewards</p>
                    <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Select products and configure the rewards for this campaign.</p>
                  </div>
                  <span className="material-symbols-outlined text-black dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-300 dark:border-[#315768]">
                  <p className="pt-4 text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Content for Products & Rewards goes here.</p>
                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </details>
            )}

            {/* Step 3: Audience & Integrations */}
            {currentStep === 3 && (
              <details className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34] group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 p-4">
                  <div className="flex flex-col">
                    <p className="text-black dark:text-white text-lg font-bold leading-normal">Audience & Integrations</p>
                    <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Define your target audience and connect platforms.</p>
                  </div>
                  <span className="material-symbols-outlined text-black dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-300 dark:border-[#315768]">
                  <p className="pt-4 text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Content for Audience & Integrations goes here.</p>
                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </details>
            )}

            {/* Step 4: Budget & Goals */}
            {currentStep === 4 && (
              <details className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34] group" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 p-4">
                  <div className="flex flex-col">
                    <p className="text-black dark:text-white text-lg font-bold leading-normal">Budget & Goals</p>
                    <p className="text-gray-500 dark:text-[#90b8cb] text-sm font-normal leading-normal">Set your spending limits and performance objectives.</p>
                  </div>
                  <span className="material-symbols-outlined text-black dark:text-white group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-300 dark:border-[#315768]">
                  <div className="pt-4">
                    <label className="flex flex-col">
                      <p className="text-black dark:text-white text-base font-medium leading-normal pb-2">Total Budget</p>
                      <input
                        type="number"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-[#315768] bg-background-light dark:bg-[#101d23] focus:border-primary h-12 placeholder:text-gray-500 dark:placeholder:text-[#90b8cb] p-[15px] text-base font-normal leading-normal"
                        placeholder="5000"
                        value={formData.budget || ''}
                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                      />
                    </label>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#223d49] text-black dark:text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleSubmit(false)}
                      disabled={isSubmitting}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      {isSubmitting ? 'Creating...' : 'Complete'}
                    </button>
                  </div>
                </div>
              </details>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6">
              {/* Live Preview */}
              <div className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34]">
                <div className="p-4 border-b border-gray-300 dark:border-[#315768]">
                  <h3 className="text-lg font-bold text-black dark:text-white">Live Preview</h3>
                  <p className="text-sm text-gray-500 dark:text-[#90b8cb]">See how your campaign will appear to customers.</p>
                </div>
                <div className="p-4">
                  <div className="bg-gray-200 dark:bg-background-dark p-4 rounded-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
                      <img
                        className="w-full h-32 object-cover"
                        alt="Promotional image for a gaming product"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM8MMRYdMEV_fN-Xhp-_1vdNzOhJweSzfcrtVUovQbflytc8aaMXqENN7_zvu0DgG9i4M273z9guuYJwkzwVgjIKeRkIu8xWwQItEYZ7Lur_rUjUkfI6u4EA-XNffs_1agC9n74oihRYNPXdXVlxltKeW65xWEu99cJ5VBocIzqJ0G5V1SatuUPpIkQp_AF8z8oOvSXUDLLK0vhm8-NYC0MHDGzD5pyihdoe8vLhopIpWsG92eoHmf-vWtkxyKoQdVrYGbQWScI5pm"
                      />
                      <div className="p-4">
                        <h4 className="text-black dark:text-white font-bold text-lg">{formData.name || 'Campaign Name'}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          {formData.description || 'Get 20% off on all new titles! Refer a friend and get an extra 5% off for both of you. Join now!'}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm font-semibold text-primary">
                            {formData.end_date ? `Ends in ${Math.ceil((new Date(formData.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : 'Ends in 30 days'}
                          </span>
                          <button className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg">Claim Reward</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-col rounded-xl border border-gray-300 dark:border-[#315768] bg-white dark:bg-[#182b34]">
                <div className="p-4 border-b border-gray-300 dark:border-[#315768]">
                  <h3 className="text-lg font-bold text-black dark:text-white">Summary</h3>
                  <p className="text-sm text-gray-500 dark:text-[#90b8cb]">Key details and projected performance.</p>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-[#90b8cb]">Total Budget</span>
                    <span className="font-bold text-black dark:text-white">${formData.budget.toLocaleString() || '5,000'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-[#90b8cb]">Est. Reach</span>
                    <span className="font-bold text-black dark:text-white">~1.2M users</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-[#90b8cb]">Duration</span>
                    <span className="font-bold text-black dark:text-white">
                      {formData.start_date && formData.end_date
                        ? `${Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days`
                        : '30 Days'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-[#90b8cb]">Primary Goal</span>
                    <span className="font-bold text-black dark:text-white">Drive Conversions</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 dark:text-[#90b8cb] pb-2">Budget Allocation</p>
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-background-dark">
                      <div className="bg-primary" data-alt="60% allocation for social media ads" style={{ width: '60%' }}></div>
                      <div className="bg-teal-500" data-alt="25% allocation for influencer marketing" style={{ width: '25%' }}></div>
                      <div className="bg-sky-300" data-alt="15% allocation for platform rewards" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

