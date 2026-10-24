/**
 * Manna App - Central Logger
 * ---------------------------
 * Provides structured, tagged logging for every error/warning in the app.
 * All catch blocks should use these helpers instead of raw console.log/error.
 *
 * Usage:
 *   import { logError, logWarn, logInfo } from '../utils/logger';
 *   logError('AuthContext', 'signIn', error);
 */

const IS_DEV = __DEV__;

/**
 * Log a caught error with full structured context.
 * @param {string} module  - File/module name, e.g. 'AuthContext'
 * @param {string} context - Function or action name, e.g. 'signIn'
 * @param {any}    error   - The caught error object
 * @param {object} [extra] - Any additional key/value context
 */
export const logError = (module, context, error, extra = {}) => {
    const payload = {
        module,
        context,
        code: error?.code ?? '-',
        message: error?.message ?? String(error),
        nativeErrorMessage: error?.nativeErrorMessage ?? undefined,
        stack: IS_DEV ? error?.stack : undefined,
        ...extra,
    };
    console.error(`🔴 [${module}] ${context} →`, payload);
};

/**
 * Log a non-fatal warning.
 * @param {string} module
 * @param {string} context
 * @param {string} message
 * @param {object} [extra]
 */
export const logWarn = (module, context, message, extra = {}) => {
    console.warn(`⚠️  [${module}] ${context} → ${message}`, Object.keys(extra).length ? extra : '');
};

/**
 * Log general informational events (no-op in production to keep logs clean).
 * @param {string} module
 * @param {string} context
 * @param {string} message
 * @param {object} [extra]
 */
export const logInfo = (module, context, message, extra = {}) => {
    if (IS_DEV) {
        console.log(`ℹ️  [${module}] ${context} → ${message}`, Object.keys(extra).length ? extra : '');
    }
};
