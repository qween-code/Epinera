'use client';

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
  joinDate?: string;
  avatarUrl?: string;
  onEdit?: () => void;
}

export default function ProfileHeader({
  userName = 'User',
  userEmail,
  joinDate,
  avatarUrl,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <header className="flex p-4 @container border-b border-white/10 pb-8 mb-8">
      <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
        <div className="flex gap-4 items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24"
            data-alt={`${userName}'s profile picture`}
            style={{
              backgroundImage: avatarUrl || 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName + '")',
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">{userName}</p>
            {userEmail && <p className="text-gray-400 text-base font-normal leading-normal">{userEmail}</p>}
            {joinDate && <p className="text-gray-400 text-base font-normal leading-normal">Joined: {joinDate}</p>}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#223d49] hover:bg-[#315768] text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto transition-colors"
        >
          <span className="truncate">Edit Profile</span>
        </button>
      </div>
    </header>
  );
}

