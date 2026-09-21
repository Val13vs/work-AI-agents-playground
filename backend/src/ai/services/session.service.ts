import { MemorySession } from '@openai/agents';
import { randomUUID } from 'node:crypto';

const sessions = new Map<string, MemorySession>();

export function getOrCreateSession(
    conversationId?: string
): {
    conversationId: string;
    session: MemorySession;
} {
    const id = conversationId?.trim() || randomUUID();

    let session = sessions.get(id);

    if (!session) {
        session = new MemorySession({
            sessionId: id
        });

        sessions.set(id, session);
    }

    return {
        conversationId: id,
        session
    };
}

export async function clearSession(
    conversationId: string
): Promise<boolean> {
    const session = sessions.get(conversationId);

    if (!session) {
        return false;
    }

    await session.clearSession();
    sessions.delete(conversationId);

    return true;
}