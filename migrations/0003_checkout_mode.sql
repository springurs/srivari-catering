ALTER TABLE checkout_orders ADD COLUMN stripe_mode TEXT NOT NULL DEFAULT 'sandbox' CHECK (stripe_mode IN ('sandbox', 'live'));
CREATE INDEX IF NOT EXISTS checkout_orders_mode_status ON checkout_orders(stripe_mode, status);
