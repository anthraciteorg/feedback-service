import swaggerPlugin from '@elysiajs/swagger';
import Elysia from 'elysia';

export const swagger = (app: Elysia) =>
    app.use(
        swaggerPlugin({
            documentation: {
                tags: [
                    {
                        name: 'Feedback',
                        description: 'Endpoints related to user feedback on generated model context.'
                    }
                ]
            }
        })
    );
