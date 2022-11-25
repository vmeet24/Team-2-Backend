/**
 * @file Based on advice from: https://github.com/expressjs/session/issues/792
 * This allows us to access the saved session from the Express request objects
 */

import { Session } from 'express-session'

declare module 'express-session' {
    interface Session {
        profile: { [key: string]: any };
    }
}