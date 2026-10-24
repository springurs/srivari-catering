CREATE TABLE IF NOT EXISTS site_activity (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('page_view', 'package_view', 'plan_preview', 'enquiry_sent')),
  path TEXT NOT NULL,
  package_name TEXT NOT NULL DEFAULT '',
  guests INTEGER NOT NULL DEFAULT 0,
  choices_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS site_activity_day ON site_activity(day);

CREATE TABLE IF NOT EXISTS daily_report_delivery (
  day TEXT PRIMARY KEY,
  state TEXT NOT NULL CHECK (state IN ('sending', 'sent', 'failed')),
  claim_token TEXT NOT NULL,
  claimed_at INTEGER NOT NULL,
  message_id TEXT,
  sent_at INTEGER
);
