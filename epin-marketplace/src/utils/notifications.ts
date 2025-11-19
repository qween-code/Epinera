import { createClient } from '@/utils/supabase/client';

export interface NotificationData {
    user_id: string;
    type: 'moderation_approved' | 'moderation_rejected' | 'moderation_appeal';
    title: string;
    message: string;
    metadata?: {
        item_type?: string;
        item_id?: string;
        reason?: string;
        [key: string]: any;
    };
}

export async function sendModerationNotification(
    data: NotificationData
): Promise<void> {
    try {
        const supabase = createClient();

        const { error } = await supabase.from('notifications').insert({
            user_id: data.user_id,
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata || {},
        });

        if (error) {
            console.error('Failed to send notification:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        // Don't throw - notification failure should not break moderation workflow
    }
}

export function buildModerationNotification(
    action: 'approved' | 'rejected',
    itemType: string,
    itemId: string,
    reason?: string
): Pick<NotificationData, 'type' | 'title' | 'message' | 'metadata'> {
    if (action === 'approved') {
        return {
            type: 'moderation_approved',
            title: 'Content Approved',
            message: `Your ${itemType} has been approved and is now public.`,
            metadata: {
                item_type: itemType,
                item_id: itemId,
            },
        };
    } else {
        return {
            type: 'moderation_rejected',
            title: 'Content Rejected',
            message: `Your ${itemType} has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
            metadata: {
                item_type: itemType,
                item_id: itemId,
                reason: reason,
            },
        };
    }
}
