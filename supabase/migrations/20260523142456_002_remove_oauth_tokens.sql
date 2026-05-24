/*
  # Security Fix: Remove OAuth tokens from social_accounts

  1. Changes
    - Remove `access_token` column from `social_accounts` table
    - Remove `refresh_token` column from `social_accounts` table

  2. Security Impact
    - OAuth tokens should NEVER be stored in a client-accessible table
    - Even with RLS, storing tokens in the DB exposes them via the Supabase client
    - Tokens should only be stored server-side (edge functions / vault)
    - The `social_accounts` table should only store connection metadata

  3. Notes
    - Existing rows will have their token columns removed
    - Social account connections (platform, username, connected status) are preserved
*/

ALTER TABLE social_accounts DROP COLUMN IF EXISTS access_token;
ALTER TABLE social_accounts DROP COLUMN IF EXISTS refresh_token;
