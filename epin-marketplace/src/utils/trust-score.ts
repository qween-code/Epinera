import { createClient } from '@/utils/supabase/client';

/**
 * Dynamic Trust Score Calculation System
 * 
 * Trust score is calculated based on user behavior:
 * - Base score: 50
 * - Approved content: +2 per item (max +30)
 * - Rejected content: -5 per item (max -30)
 * - Positive reviews received: +1 per review (max +20)
 * - Negative reviews received: -2 per review (max -20)
 * - Account age: +1 per 30 days (max +20)
 * 
 * Final score is clamped between 0 and 100
 */

interface TrustScoreFactors {
    approvedContent: number;
    rejectedContent: number;
    positiveReviews: number;
    negativeReviews: number;
    accountAgeDays: number;
}

export async function calculateTrustScore(userId: string): Promise<number> {
    const supabase = createClient();

    try {
        // Get user's profile for account age
        const { data: profile } = await supabase
            .from('profiles')
            .select('updated_at')
            .eq('id', userId)
            .single();

        if (!profile) return 50;

        // Get approved content count (reviews + products)
        const { count: approvedReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('moderation_status', 'approved');

        const { count: approvedProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', userId)
            .eq('moderation_status', 'approved');

        // Get rejected content count
        const { count: rejectedReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('moderation_status', 'rejected');

        const { count: rejectedProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', userId)
            .eq('moderation_status', 'rejected');

        // Get reviews received (for sellers/creators)
        const { data: receivedReviews } = await supabase
            .from('reviews')
            .select('rating')
            .in('product_id',
                supabase.from('products').select('id').eq('seller_id', userId)
            );

        const positiveReviews = (receivedReviews || []).filter(r => r.rating >= 4).length;
        const negativeReviews = (receivedReviews || []).filter(r => r.rating <= 2).length;

        // Calculate account age in days
        const accountCreated = new Date(profile.updated_at);
        const accountAgeDays = Math.floor(
            (Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
        );

        const factors: TrustScoreFactors = {
            approvedContent: (approvedReviews || 0) + (approvedProducts || 0),
            rejectedContent: (rejectedReviews || 0) + (rejectedProducts || 0),
            positiveReviews,
            negativeReviews,
            accountAgeDays,
        };

        return computeTrustScore(factors);
    } catch (error) {
        console.error('Error calculating trust score:', error);
        return 50; // Return default score on error
    }
}

function computeTrustScore(factors: TrustScoreFactors): number {
    let score = 50; // Base score

    // Approved content bonus (max +30)
    score += Math.min(factors.approvedContent * 2, 30);

    // Rejected content penalty (max -30)
    score -= Math.min(factors.rejectedContent * 5, 30);

    // Positive reviews bonus (max +20)
    score += Math.min(factors.positiveReviews * 1, 20);

    // Negative reviews penalty (max -20)
    score -= Math.min(factors.negativeReviews * 2, 20);

    // Account age bonus (max +20)
    score += Math.min(Math.floor(factors.accountAgeDays / 30), 20);

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
}

export async function updateUserTrustScore(userId: string): Promise<void> {
    const supabase = createClient();

    try {
        const trustScore = await calculateTrustScore(userId);

        const { error } = await supabase
            .from('profiles')
            .update({ trust_score: trustScore })
            .eq('id', userId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating trust score:', error);
    }
}

/**
 * Batch update trust scores for all users
 * This should be run periodically (e.g., daily via cron job)
 */
export async function batchUpdateTrustScores(): Promise<void> {
    const supabase = createClient();

    try {
        const { data: users } = await supabase
            .from('profiles')
            .select('id')
            .limit(1000); // Process in batches

        if (!users) return;

        for (const user of users) {
            await updateUserTrustScore(user.id);
        }
    } catch (error) {
        console.error('Error in batch trust score update:', error);
    }
}
