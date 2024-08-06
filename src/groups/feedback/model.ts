import { Elysia, t } from "elysia";

const params = t.Object({
    userId: t.String({ pattern: '[0-9a-fA-F]{64}' }),
    messageId: t.String({ pattern: '[0-9a-fA-F]{64}' }),
});

const model = t.Object({
    prompt: t.String({ maxLength: 6.4e5 }),
    completion: t.String({ maxLength: 6.4e3 }),
    model: t.String({ maxLength: 6.4e2 }),
    label: t.Nullable(t.Boolean()),
    explanation: t.Optional(t.MaybeEmpty(t.String({ maxLength: 6.4e2 }))),
    tags: t.Optional(
        t.Array(t.String({ maxLength: 6.4e2 }), { maxItems: 64 })
    ),
});

const response = t.Union([model, t.Void()]);

export const FeedbackModel = new Elysia({ name: 'Model.Feedback' })
    .model({
        'feedback.params': params,
        'feedback.model': model,
        'feedback.response': response,
    });