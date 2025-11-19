import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { updateUserTrustScore, batchUpdateTrustScores } from '@/utils/trust-score';

export async function POST(request: Request) {
    try {
        const { userId, batchUpdate } = await request.json();

        // Get authenticated user
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin (for batch updates)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        if (batchUpdate) {
            // Batch update all users
            await batchUpdateTrustScores();
            return NextResponse.json({ success: true, message: 'Batch update completed' });
        } else if (userId) {
            // Update single user
            await updateUserTrustScore(userId);
            return NextResponse.json({ success: true, message: 'Trust score updated' });
        } else {
            return NextResponse.json(
                { error: 'Missing userId or batchUpdate parameter' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error in update-trust-score API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
