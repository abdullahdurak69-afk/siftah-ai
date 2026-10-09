import { createAuthClient } from "better-auth/react";

// Panel ile auth API aynı host'ta (app.<ana-domain>) çalıştığı için baseURL gerekmez
export const authClient = createAuthClient();
