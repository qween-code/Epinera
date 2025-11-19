import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { moderateContent, shouldAutoFlag, getModerationReason } from '@/utils/ai-moderation';

export async function POST(request: Request) {
    try {
        const { content, itemType, itemId } = await request.json();

        if (!content || !itemType || !itemId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
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

        // Perform AI moderation
        const moderationResult = await moderateContent(content);

        if (!moderationResult) {
            return NextResponse.json({
                flagged: false,
                message: 'AI moderation not available',
            });
        }

        const shouldFlag = shouldAutoFlag(moderationResult);
        const table = itemType === 'review' ? 'reviews' : 'products';

        // Update item with AI moderation result
        if (shouldFlag) {
            const reason = getModerationReason(moderationResult);

            await supabase
                .from(table)
                .update({
                    moderation_status: 'pending',
                    moderation_reason: reason,
                    ai_moderation_result: moderationResult,
                })
                .eq('id', itemId);
        } else {
            await supabase
                .from(table)
                .update({
                    ai_moderation_result: moderationResult,
                })
                .eq('id', itemId);
        }

        return NextResponse.json({
            flagged: shouldFlag,
            result: moderationResult,
        });
    } catch (error) {
        console.error('Error in moderate-content API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
