'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatorGiveawaySetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [giveawayType, setGiveawayType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [prizes, setPrizes] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const giveawayTypes = [
    {
      id: 'live_stream',
      name: 'Live Stream Giveaway',
      description: 'Engage your live audience with chat-triggered prizes.',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    },
    {
      id: 'activity_milestone',
      name: 'Activity Milestone',
      description: 'Reward your community for hitting goals like follows or subs.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    },
    {
      id: 'social_media',
      name: 'Social Media Post',
      description: 'Boost your reach on platforms like Twitter or Instagram.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/creator/giveaways/new');
        return;
      }

      // TODO: Create giveaway in campaigns table
      const { error } = await supabase.from('campaigns').insert({
        creator_id: user.id,
        name: title,
        campaign_type: 'giveaway',
        status: 'draft',
        metadata: {
          type: giveawayType,
          prizes,
        },
      });

      if (error) throw error;

      router.push('/creator/campaigns');
    } catch (error) {
      console.error('Error creating giveaway:', error);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* PageHeading */}
        <header className="flex flex-wrap justify-between gap-3 mb-6">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Create a New Giveaway</p>
            <p className="text-[#90b8cb] text-base font-normal leading-normal">
              Guide your audience through an exciting giveaway experience from start to finish.
            </p>
          </div>
        </header>

        {/* ProgressBar */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex gap-6 justify-between">
            <p className="text-white text-base font-medium leading-normal">
              Step {currentStep} of {totalSteps}: {currentStep === 1 ? 'Type & Prize' : currentStep === 2 ? 'Rules & Entry' : currentStep === 3 ? 'Schedule' : 'Review'}
            </p>
          </div>
          <div className="rounded-full h-2 bg-[#315768]">
            <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Step 1: Form Content */}
        <div className="space-y-10">
          {currentStep === 1 && (
            <>
              {/* Section 1: Giveaway Type */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  1. Select Giveaway Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {giveawayTypes.map((type) => {
                    const isSelected = giveawayType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setGiveawayType(type.id)}
                        className={`flex flex-col gap-3 pb-3 rounded-xl p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-2 border-primary bg-primary/20'
                            : 'border-2 border-transparent hover:border-primary/50'
                        }`}
                      >
                        <div
                          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                          style={{ backgroundImage: `url('${type.image}')` }}
                        ></div>
                        <div>
                          <p className="text-white text-base font-medium leading-normal">{type.name}</p>
                          <p className="text-[#90b8cb] text-sm font-normal leading-normal">{type.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 2: Details */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  2. Enter Giveaway Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2" htmlFor="giveaway-title">
                      Giveaway Title
                    </label>
                    <input
                      className="w-full bg-[#1F2937] border border-[#374151] text-white rounded-lg focus:ring-primary focus:border-primary px-4 py-2"
                      id="giveaway-title"
                      placeholder="e.g., Epic 24-Hour Stream VALORANT Points Giveaway!"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Prize Item(s)</label>
                    {prizes.length > 0 ? (
                      <div className="space-y-3">
                        {prizes.map((prize, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border border-[#374151] rounded-lg bg-[#1F2937]">
                            <div
                              className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg"
                              style={{ backgroundImage: `url('${prize.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}')` }}
                            ></div>
                            <div className="flex-1">
                              <p className="font-bold text-white">{prize.name}</p>
                              <p className="text-sm text-[#90b8cb]">{prize.type}</p>
                            </div>
                            <button
                              onClick={() => setPrizes(prizes.filter((_, i) => i !== index))}
                              className="text-[#90b8cb] hover:text-white transition-colors"
                            >
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 border border-[#374151] rounded-lg bg-[#1F2937]">
                        <div className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg bg-gray-700"></div>
                        <div className="flex-1">
                          <p className="font-bold text-white">No prizes added</p>
                          <p className="text-sm text-[#90b8cb]">Add a prize from your inventory</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        // TODO: Open inventory modal
                        setPrizes([
                          ...prizes,
                          {
                            name: '1050 VALORANT Points',
                            type: 'Epin / Digital Code',
                            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
                          },
                        ]);
                      }}
                      className="mt-4 flex items-center justify-center w-full gap-2 px-4 py-2 border-2 border-dashed border-[#374151] rounded-lg text-[#90b8cb] hover:bg-[#374151]/50 hover:text-white transition-colors duration-200"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      <span>Add Another Prize from Inventory</span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                3. Rules & Entry Requirements
              </h2>
              <p className="text-[#90b8cb] text-base mb-6">Rules and entry form will be here...</p>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">4. Schedule</h2>
              <p className="text-[#90b8cb] text-base mb-6">Schedule form will be here...</p>
            </section>
          )}

          {currentStep === 4 && (
            <section>
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">5. Review</h2>
              <p className="text-[#90b8cb] text-base mb-6">Review form will be here...</p>
            </section>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-12 border-t border-[#315768] pt-6">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                router.push('/creator/campaigns');
              }
            }}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-6 bg-transparent border border-[#315768] text-white/80 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#315768]/50 transition-colors"
          >
            <span className="truncate">{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              disabled={!giveawayType || !title}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Next Step: Rules & Entry</span>
            </button>
          )}
          {currentStep === totalSteps && (
            <button
              onClick={handleSubmit}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Create Giveaway</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

