import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendModerationNotification } from '@/utils/notifications';

export async function POST(request: Request) {
    try {
        const { itemType, itemId, appealReason } = await request.json();

        if (!itemType || !itemId || !appealReason) {
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

        // Create appeal
        const { data: appeal, error: appealError } = await supabase
            .from('moderation_appeals')
            .insert({
                item_type: itemType,
                item_id: itemId,
                user_id: user.id,
                appeal_reason: appealReason,
                status: 'pending',
            })
            .select()
            .single();

        if (appealError) throw appealError;

        // Send notification to admins (in a real app, you'd query for admin users)
        // For now, we'll just return success

        return NextResponse.json({
            success: true,
            appeal,
        });
    } catch (error) {
        console.error('Error creating appeal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const { appealId, status, adminResponse } = await request.json();

        if (!appealId || !status) {
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

        // Update appeal
        const { data: appeal, error: updateError } = await supabase
            .from('moderation_appeals')
            .update({
                status,
                admin_response: adminResponse,
                admin_id: user.id,
                resolved_at: new Date().toISOString(),
            })
            .eq('id', appealId)
            .select('*, item_type, item_id')
            .single();

        if (updateError) throw updateError;

        // If approved, update the original item's moderation status
        if (status === 'approved' && appeal) {
            const table = appeal.item_type === 'review' ? 'reviews' : 'products';
            await supabase
                .from(table)
                .update({
                    moderation_status: 'approved',
                    moderation_reason: null,
                })
                .eq('id', appeal.item_id);

            // Send notification to user
            await sendModerationNotification({
                user_id: appeal.user_id,
                type: 'moderation_approved',
                title: 'Appeal Approved',
                message: `Your appeal for ${appeal.item_type} has been approved. Your content is now live.`,
                metadata: {
                    item_type: appeal.item_type,
                    item_id: appeal.item_id,
                },
            });
        } else if (status === 'rejected' && appeal) {
            // Send notification to user
            await sendModerationNotification({
                user_id: appeal.user_id,
                type: 'moderation_rejected',
                title: 'Appeal Rejected',
                message: `Your appeal was reviewed and rejected. ${adminResponse || ''}`,
                metadata: {
                    item_type: appeal.item_type,
                    item_id: appeal.item_id,
                },
            });
        }

        return NextResponse.json({
            success: true,
            appeal,
        });
    } catch (error) {
        console.error('Error updating appeal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
