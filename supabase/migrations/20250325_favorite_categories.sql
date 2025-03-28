-- Create favorite_categories table
CREATE TABLE favorite_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, category_id)
);

-- Create likes_count table to track total likes per category
CREATE TABLE category_likes (
    category_id TEXT PRIMARY KEY,
    likes_count INTEGER DEFAULT 0
);

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_category_likes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO category_likes (category_id, likes_count)
        VALUES (NEW.category_id, 1)
        ON CONFLICT (category_id)
        DO UPDATE SET likes_count = category_likes.likes_count + 1;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE category_likes
        SET likes_count = likes_count - 1
        WHERE category_id = OLD.category_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating likes count
CREATE TRIGGER update_category_likes_trigger
AFTER INSERT OR DELETE ON favorite_categories
FOR EACH ROW
EXECUTE FUNCTION update_category_likes();

-- Create RLS policies
ALTER TABLE favorite_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can add their own favorites"
ON favorite_categories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON favorite_categories FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Everyone can read favorites"
ON favorite_categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Everyone can read likes count"
ON category_likes FOR SELECT
TO authenticated
USING (true);
