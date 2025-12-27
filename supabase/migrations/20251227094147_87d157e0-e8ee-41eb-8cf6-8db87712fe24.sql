
-- Add image_url column update for menu items and add stock column
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS stock integer DEFAULT 100;
