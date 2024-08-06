import { Elysia } from 'elysia';
import { Config } from '../../config';
import { common } from '../common';
import { identify } from '../identify';
import { FeedbackModel } from './model';

export const feedback = new Elysia({ prefix: '/feedback' })
    .use(common)
    .use(identify)
    .use(FeedbackModel)
    .guard({
        beforeHandle: async ({ set, services, store }) => {
            const count = await services.feedback
                .networkIdCountByHour({ networkId: store.networkId });

            set.headers['X-RateLimit-Limit'] = Config.RateLimit.feedback.toString();
            set.headers['X-RateLimit-Remaining'] =
                Math.max(0, Config.RateLimit.feedback - count).toString();

            if (count >= Config.RateLimit.feedback) return set.status = 429;
        }
    }, feedback => feedback.put('/:userId/:messageId', async ({
        params,
        body,
        store,
        services
    }) => {
        if (body.label == null) {
            return await services.feedback.delete({
                userId: params.userId,
                messageId: params.messageId
            });
        }

        return services.feedback.upsert({
            userId: params.userId,
            messageId: params.messageId,
            networkId: store.networkId,
            ...body,
            label: true,
            updatedAt: new Date()
        });
    },
        {
            params: 'feedback.params',
            body: 'feedback.model',
            response: 'feedback.response',
            detail: {
                summary: 'Send Feedback',
                description: 'Allows users to submit feedback based on their generated model context.',
                tags: ['Feedback']
            }
        },
    ));