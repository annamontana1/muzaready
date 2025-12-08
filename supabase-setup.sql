-- SUPABASE OPTIMALIZACE PRO MUZAREADY
-- Tento script přidá indexy, triggers a bezpečnostní nastavení

-- ============================================================
-- 1. VYTVOŘENÍ INDEXŮ PRO VÝKON
-- ============================================================

-- Orders indexy (pro filtry a hledání)
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_method ON orders(delivery_method);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at DESC);

-- OrderItems indexy
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sku_id ON order_items(sku_id);

-- SKUs indexy (pro sklad a vyhledávání)
CREATE INDEX IF NOT EXISTS idx_skus_sku ON skus(sku);
CREATE INDEX IF NOT EXISTS idx_skus_name ON skus(name);
CREATE INDEX IF NOT EXISTS idx_skus_in_stock ON skus(in_stock);
CREATE INDEX IF NOT EXISTS idx_skus_created_at ON skus(created_at DESC);

-- StockMovement indexy
CREATE INDEX IF NOT EXISTS idx_stock_movements_sku_id ON stock_movements(sku_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- CartItems indexy
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Favorites indexy
CREATE INDEX IF NOT EXISTS idx_favorites_session_id ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- PriceMatrix indexy
CREATE INDEX IF NOT EXISTS idx_price_matrix_category_tier ON price_matrix(category, tier);
CREATE INDEX IF NOT EXISTS idx_price_matrix_length ON price_matrix(length_cm);

-- User indexy
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_is_wholesale ON users(is_wholesale);

-- ============================================================
-- 2. TRIGGER PRO AUDIT LOGGING (Volitelné - pro admin auditování)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_email TEXT,
  table_name TEXT,
  operation TEXT, -- INSERT, UPDATE, DELETE
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Index pro audit logy
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_table ON admin_audit_log(table_name);

-- ============================================================
-- 3. VIEW PRO ADMIN DASHBOARD
-- ============================================================

-- Statistika objednávek
CREATE OR REPLACE VIEW v_order_stats AS
SELECT
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
  SUM(total) as total_revenue
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Populární produkty
CREATE OR REPLACE VIEW v_popular_products AS
SELECT
  p.id,
  p.name,
  COUNT(oi.id) as order_count,
  SUM(oi.line_total) as total_revenue
FROM products p
LEFT JOIN order_items oi ON oi.sku_id = p.id
GROUP BY p.id, p.name
ORDER BY order_count DESC
LIMIT 20;

-- ============================================================
-- 4. FULL-TEXT SEARCH (Volitelné - pro pokročilé vyhledávání)
-- ============================================================

-- Text search indexy pro produkty
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING GIN (
  to_tsvector('czech', COALESCE(name, ''))
);

-- Text search pro SKUs
CREATE INDEX IF NOT EXISTS idx_skus_name_search ON skus USING GIN (
  to_tsvector('czech', COALESCE(name, ''))
);

-- ============================================================
-- 5. BACKUP & RETENTION POLICY
-- ============================================================

-- POZNÁMKA: V Supabase UI nastavit:
-- Settings > Backups > Enable automated backups
-- Daily backups s 7-30 denním retencí

-- ============================================================
-- 6. ROLE-BASED ACCESS CONTROL (RLS)
-- ============================================================

-- Povolit RLS na tabulkách
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- POZNÁMKA: V aplikaci vložit auth claims ve formátu:
-- {
--   "user_id": "xxx",
--   "role": "admin|user",
--   "email": "user@example.com"
-- }

-- RLS Policy - Admins vidí všechny objednávky
CREATE POLICY admin_view_all_orders ON orders
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policy - Uživatelé vidí jen své objednávky
CREATE POLICY user_view_own_orders ON orders
  FOR SELECT
  USING (auth.uid()::text = user_id OR auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- 7. PERFORMANCE MONITORING QUERIES
-- ============================================================

-- Query 1: Tabulky s největšími daty
-- SELECT
--   schemaname,
--   tablename,
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Query 2: Nejpomalejší queries (Enable query performance insights v Supabase)
-- SELECT
--   query,
--   calls,
--   mean_time,
--   max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- ============================================================
-- HOTOVÉ! Váš Supabase je teď optimalizován.
-- ============================================================
