import { relations, sql } from 'drizzle-orm';
import { boolean, char, index, integer, pgTable, pgView, primaryKey, serial, text, timestamp, unique, uniqueIndex } from 'drizzle-orm/pg-core';

export const feedback = pgTable(
    'feedback',
    {
        id: serial('id').primaryKey(),
        userId: char('user_id', { length: 64 }).notNull(),
        messageId: char('message_id', { length: 64 }).notNull(),
        networkId: char('network_id', { length: 64 }).notNull(),
        prompt: text('prompt').notNull(),
        completion: text('completion').notNull(),
        model: text('model').notNull(),
        label: boolean('label').notNull(),
        explanation: text('explanation'),
        createdAt: timestamp('created_at')
            .notNull()
            .default(sql`timezone('UTC', now())`),
        updatedAt: timestamp('updated_at').notNull(),
    },
    table => ({
        uniqueIdx: unique('user_id_message_id_idx')
            .on(table.userId, table.messageId),
        networkIdcreatedAtIdx: index('network_id_created_at_idx')
            .on(table.networkId, table.createdAt),
    })
);

export const feedbackRelations = relations(feedback, ({ many }) => ({
    tags: many(tags),
}));

export const tags = pgTable(
    'tags',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
    },
    table => ({
        nameIdx: uniqueIndex('name_idx').on(table.name),
    }));

export const feedbackTags = pgTable(
    'feedback_tags',
    {
        feedbackId: serial('feedback_id')
            .notNull()
            .references(() => feedback.id, { onDelete: 'cascade' }),
        tagId: serial('tag_id')
            .notNull()
            .references(() => tags.id, { onDelete: 'cascade' }),
    },
    table => ({
        pk: primaryKey({ columns: [table.feedbackId, table.tagId] }),
    }),
);

export const tagRelations = relations(tags, ({ many }) => ({
    feedback: many(feedback),
}));

export const feedbackTagsRelations = relations(feedbackTags, ({ one }) => ({
    feedback: one(feedback, {
        fields: [feedbackTags.feedbackId],
        references: [feedback.id],
    }),
    tag: one(tags, {
        fields: [feedbackTags.tagId],
        references: [tags.id],
    }),
}));

export const feedbackStatsSeries = pgView('stats_feedback_series', {
    time: timestamp('time').notNull(),
    feedbackCount: integer('feedback_count').notNull(),
    userCount: integer('user_count').notNull(),
}).existing();

export const schema = {
    feedback,
    tags,
    feedbackTags,
    feedbackStatsSeries,
};