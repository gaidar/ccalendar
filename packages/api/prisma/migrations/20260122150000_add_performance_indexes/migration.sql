-- Add index on users.created_at for admin listing queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- Add index on oauth_accounts.user_id for foreign key lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "oauth_accounts_user_id_idx" ON "oauth_accounts"("user_id");

-- Add compound index on support_tickets for user ticket queries with date ordering
CREATE INDEX CONCURRENTLY IF NOT EXISTS "support_tickets_user_id_created_at_idx" ON "support_tickets"("user_id", "created_at");
