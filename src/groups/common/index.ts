import { cors } from '@elysiajs/cors';
import Elysia from 'elysia';
import { Database } from '../../services/database';
import { FeedbackService } from '../../services/feedback';

export const common = new Elysia({ name: 'common' })
    .use(cors())
    .decorate(() => {
        const database = new Database();

        return {
            services: {
                feedback: new FeedbackService(database),
            },
        };
    })
    .onError({ as: 'global' }, ({ set, error }) => {
        console.error(error);

        set.status = 500;

        return;
    });