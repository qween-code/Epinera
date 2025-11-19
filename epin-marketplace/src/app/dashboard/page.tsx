import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-red-600 rounded-md"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
