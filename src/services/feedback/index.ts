import { and, count, eq, gte, inArray, sql } from 'drizzle-orm';
import { Database } from '../database';
import { feedback, feedbackTags, tags } from '../database/schema';

export type FeedbackType = typeof feedback.$inferInsert;

export class FeedbackService {
    database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async upsert(body: FeedbackType & { tags?: string[] }) {
        return await this.database.instance.transaction(async tx => {
            const row = (await tx
                .insert(feedback)
                .values(body)
                .onConflictDoUpdate({
                    target: [
                        feedback.userId,
                        feedback.messageId
                    ],
                    set: body
                })
                .returning())[0];

            if (!body.tags?.length) return row;

            // Upsert tags
            await tx
                .delete(feedbackTags)
                .where(eq(feedbackTags.feedbackId, row.id));

            await tx
                .insert(tags)
                .values(body.tags.map(tag => ({ name: tag.toLowerCase() })))
                .onConflictDoNothing();

            const existing = (await tx.query.tags
                .findMany({
                    where: inArray(
                        tags.name,
                        body.tags.map(tag => tag.toLowerCase())
                    )
                }))
                .reduce((map, tag) => {
                    map[tag.name] = tag.id;

                    return map;
                }, {} as Record<string, number>);

            await tx
                .insert(feedbackTags)
                .values(body.tags.map(tag => ({
                    feedbackId: row.id,
                    tagId: existing[tag]
                })));

            return row;
        });
    }

    async delete({
        userId, messageId
    }: Pick<FeedbackType, 'userId' | 'messageId'> & Partial<FeedbackType>) {
        await this.database.instance
            .delete(feedback)
            .where(
                and(
                    eq(feedback.userId, userId),
                    eq(feedback.messageId, messageId),
                )
            );
    }

    async networkIdCountByHour({ networkId }: Pick<FeedbackType, 'networkId'>) {
        return (await this.database.instance
            .select({ count: count(feedback.id) })
            .from(feedback)
            .where(
                and(
                    eq(feedback.networkId, networkId),
                    gte(
                        feedback.createdAt,
                        sql`NOW() - INTERVAL '1:00:00'`
                    )
                )
            ))?.[0].count;
    }
}