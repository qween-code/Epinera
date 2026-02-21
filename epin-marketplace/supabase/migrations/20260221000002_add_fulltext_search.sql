-- Add text search column and index for full-text search
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector on insert/update
CREATE TRIGGER product_search_vector_update
  BEFORE INSERT OR UPDATE OF title, description ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- GIN index for full-text search (much faster than regular indexes for text search)
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING GIN (search_vector);

-- Update existing rows to populate search_vector
UPDATE public.products SET search_vector =
  setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(description, '')), 'B');

-- RPC function for searching products with full-text search
CREATE OR REPLACE FUNCTION search_products(search_query TEXT)
RETURNS SETOF public.products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.products
  WHERE status = 'active'
    AND search_vector @@ plainto_tsquery('simple', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('simple', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_products IS 'Full-text search across product titles and descriptions, returns results ranked by relevance';
