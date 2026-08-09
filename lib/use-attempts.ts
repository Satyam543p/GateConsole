"use client"

/**
 * lib/use-attempts.ts — SHIM
 *
 * This file exists only for backward compatibility.
 * All new code should import from lib/storage/hooks.ts directly.
 *
 * Every component that currently imports from here still works unchanged.
 * The implementation has moved to lib/storage/hooks.ts, which no longer
 * touches localStorage directly.
 */

export {
  useAttempts,
  getAttempt,
  newAttemptId,
} from "./storage/hooks"
