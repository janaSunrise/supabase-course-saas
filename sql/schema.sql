CREATE TABLE lesson (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE profile (
    -- `id` references the uuid `id` field in the `auth.users` table
    -- supabase has the authentication table. this can be customized/changed based
    -- on the custom implementation built, or another provider used.
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    interval VARCHAR(255),  -- monthly, yearly, etc. empty for none.

    stripe_customer VARCHAR(255),  -- set later using realtime INSERT trigger on signup

    CONSTRAINT fk_profile_user FOREIGN KEY (id) REFERENCES auth.users (id)
);

CREATE TABLE premium_content (
    id SERIAL PRIMARY KEY,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    video_url VARCHAR(255) NOT NULL,

    -- ID foreign key to the lesson table
    CONSTRAINT fk_premium_content_lesson FOREIGN KEY (id) REFERENCES lesson (id)
)

-- Define a function - `create_profile_for_user`
-- This function will be called when a new user is created
-- It will create a new profile for the user
CREATE FUNCTION create_profile_for_user() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO public.profile (id, email) VALUES (NEW.id, NEW.email);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

-- Trigger that runs after a new user is created
-- It will call the `create_profile_for_user` function
CREATE TRIGGER create_profile_for_user AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- Enable RLS for public.lesson and public.profile
ALTER TABLE public.lesson ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_content ENABLE ROW LEVEL SECURITY;

-- The policies for row-level security in supabase
CREATE POLICY "select_lesson_for_all" ON "public"."lesson"
AS PERMISSIVE FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "select_profile_for_respective_user" ON "public"."profile"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "premium_content_for_subscribed_users" ON "public"."premium_content"
AS PERMISSIVE FOR SELECT
TO public
USING (
    exists( SELECT 1 FROM profile WHERE auth.uid() = profile.id AND profile.is_subscribed = true )
)
