CREATE TABLE IF NOT EXISTS checkout_orders (
  id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  lines_json TEXT NOT NULL,
  tax_rate TEXT NOT NULL DEFAULT '',
  expires_at INTEGER NOT NULL,
  session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_json TEXT,
  updated_at INTEGER
);
CREATE INDEX IF NOT EXISTS checkout_orders_status ON checkout_orders(status);
