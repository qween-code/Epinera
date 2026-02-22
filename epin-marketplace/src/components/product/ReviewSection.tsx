'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import StarRating from '@/components/ui/StarRating';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    setReviews(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase.from('reviews').upsert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    }, { onConflict: 'product_id,user_id' });

    if (!error) {
      setComment('');
      setRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading">
          <span className="text-gradient">Değerlendirmeler</span>
          <span className="text-sm text-[var(--text-ghost)] ml-2">({reviews.length})</span>
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-sm stat-number text-[var(--neon-amber)]">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="neo rounded-xl p-6 space-y-4">
          <div className="terminal-label text-[0.6rem] mb-2">// YORUM YAZ</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">Puanınız:</span>
            <StarRating rating={rating} interactive onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi paylaşın..."
            className="input"
            rows={3}
          />
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="neo-inset-sm rounded-xl p-8 text-center">
          <p className="text-sm text-[var(--text-ghost)]">Henüz değerlendirme yok. İlk yorumu siz yazın!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="neo-flat rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full neo-inset-sm flex items-center justify-center text-xs font-bold text-[var(--neon-cyan)]">
                    {(review.profiles?.full_name || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{review.profiles?.full_name || 'Anonim'}</div>
                    <div className="text-[0.65rem] text-[var(--text-ghost)] font-mono-accent">
                      {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.comment && (
                <p className="text-sm text-[var(--text-secondary)] mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
