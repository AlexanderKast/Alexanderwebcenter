declare namespace NodeJS {
  interface ProcessEnv {
    // Sitio
    readonly NEXT_PUBLIC_SITE_URL: string;
    readonly NEXT_PUBLIC_CAL_LINK: string;

    // Resend
    readonly RESEND_API_KEY: string;
    readonly RESEND_AUDIENCE_ID: string;
    readonly RESEND_FROM: string;

    // Supabase server
    readonly SUPABASE_URL: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;

    // Supabase client (browser)
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    // Upstash Redis (rate limiting)
    readonly UPSTASH_REDIS_REST_URL: string;
    readonly UPSTASH_REDIS_REST_TOKEN: string;
  }
}

export {};
