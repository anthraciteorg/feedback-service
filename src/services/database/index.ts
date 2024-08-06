import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { Config } from '../../config';
import { schema } from './schema';

export class Database {
    client: ReturnType<typeof postgres>;
    instance: ReturnType<typeof drizzle<typeof schema>>;

    constructor() {
        this.client = postgres(Config.Database.URL);

        this.instance = drizzle(this.client, { schema });
    }

    static async initialize() {
        const client = postgres(Config.Database.URL, { max: 1 });

        try {
            await migrate(drizzle(client), { migrationsFolder: './drizzle' });
        } finally {
            client.end();
        }
    }
}