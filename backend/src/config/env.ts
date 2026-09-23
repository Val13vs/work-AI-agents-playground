import 'dotenv/config';

function requireEnvironmentVariable(
    name: string
): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
}

const portValue =
    process.env.PORT ?? '3000';

const port =
    Number(portValue);

if (Number.isNaN(port)) {
    throw new Error(
        `Invalid PORT value: ${portValue}`
    );
}

export const env = {
    port,

    corsOrigin:
        process.env.CORS_ORIGIN ??
        'http://localhost:4200',

    openAiApiKey:
        requireEnvironmentVariable(
            'OPENAI_API_KEY'
        )
};