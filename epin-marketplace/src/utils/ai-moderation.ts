/**
 * AI Moderation using OpenAI Moderation API
 * 
 * Note: This requires OPENAI_API_KEY environment variable to be set
 * For production use, consider using an Edge Function or API route
 */

export interface AIModerationResult {
    flagged: boolean;
    categories: {
        hate: boolean;
        'hate/threatening': boolean;
        harassment: boolean;
        'harassment/threatening': boolean;
        'self-harm': boolean;
        'self-harm/intent': boolean;
        'self-harm/instructions': boolean;
        sexual: boolean;
        'sexual/minors': boolean;
        violence: boolean;
        'violence/graphic': boolean;
    };
    category_scores: {
        hate: number;
        'hate/threatening': number;
        harassment: number;
        'harassment/threatening': number;
        'self-harm': number;
        'self-harm/intent': number;
        'self-harm/instructions': number;
        sexual: number;
        'sexual/minors': number;
        violence: number;
        'violence/graphic': number;
    };
}

export async function moderateContent(text: string): Promise<AIModerationResult | null> {
    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.warn('OPENAI_API_KEY not set, skipping AI moderation');
            return null;
        }

        const response = await fetch('https://api.openai.com/v1/moderations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                input: text,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error moderating content:', error);
        return null;
    }
}

export function shouldAutoFlag(result: AIModerationResult | null): boolean {
    if (!result) return false;

    // Flag if any category is flagged OR if any high-risk category has score > 0.7
    return result.flagged ||
        result.category_scores.hate > 0.7 ||
        result.category_scores['hate/threatening'] > 0.7 ||
        result.category_scores.harassment > 0.7 ||
        result.category_scores['harassment/threatening'] > 0.7 ||
        result.category_scores['sexual/minors'] > 0.5;
}

export function getModerationReason(result: AIModerationResult): string {
    const flaggedCategories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category);

    if (flaggedCategories.length === 0) {
        return 'AI: Potentially inappropriate content';
    }

    return `AI: ${flaggedCategories.join(', ')}`;
}
