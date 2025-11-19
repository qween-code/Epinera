import { createClient } from '@/utils/supabase/client';

export interface ModerationAuditLog {
    moderation_action: 'approve' | 'reject' | 'bulk_approve' | 'bulk_reject';
    item_type: 'review' | 'product' | 'forum_post';
    item_id: string;
    old_status: string;
    new_status: string;
    reason?: string;
}

export async function logModerationAction(
    moderatorId: string,
    auditData: ModerationAuditLog
): Promise<void> {
    try {
        const supabase = createClient();

        const { error } = await supabase.from('audit_logs').insert({
            actor: moderatorId,
            action: `MODERATION_${auditData.moderation_action.toUpperCase()}`,
            resource: `${auditData.item_type}:${auditData.item_id}`,
            moderation_action: auditData.moderation_action,
            item_type: auditData.item_type,
            item_id: auditData.item_id,
            old_status: auditData.old_status,
            new_status: auditData.new_status,
            moderator_id: moderatorId,
            metadata: auditData.reason ? { reason: auditData.reason } : {},
        });

        if (error) {
            console.error('Failed to log moderation action:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error logging moderation action:', error);
        // Don't throw - logging should not break moderation workflow
    }
}
