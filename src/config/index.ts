export abstract class Config {
    static get Database() {
        return {
            URL: process.env.DATABASE_URL!
        }
    }

    static get RateLimit() {
        return {
            feedback: parseInt(process.env.RATELIMIT_FEEDBACK_HOUR!)
        }
    }
}