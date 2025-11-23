import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard/wallet");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // In local dev, this redirect might need to be localhost:3000
        // But Supabase client usually handles the configured site URL
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-0)] p-4">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-[var(--color-surface-1)] border border-white/5 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
          <p className="text-slate-400">EPINERA'ya giriş yapın veya kayıt olun.</p>
        </div>

        <form action={signIn} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Email Adresi</label>
            <input
              name="email"
              type="email"
              placeholder="ornek@mail.com"
              required
              className="w-full p-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-900/20">
             Giriş Bağlantısı Gönder
          </button>

          {searchParams?.message && (
            <p className="p-4 bg-white/5 rounded text-center text-sm text-slate-300">
              {searchParams.message}
            </p>
          )}
        </form>

        <div className="text-center text-xs text-slate-500">
          Giriş yaparak <a href="#" className="text-blue-400 hover:underline">Kullanım Koşulları</a>'nı kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  );
}
