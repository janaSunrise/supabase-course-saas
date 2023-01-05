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
    id UUID PRIMARY KEY REFERENCES auth.users (id),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    interval VARCHAR(255) NOT NULL,  -- monthly, yearly, etc.

    stripe_customer VARCHAR(255),
);

-- Define a function - `create_profile_for_user`
-- This function will be called when a new user is created
-- It will create a new profile for the user
CREATE FUNCTION create_profile_for_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profile (id) VALUES (NEW.id);
    RETURN NEW;
END;

-- Trigger that runs after a new user is created
-- It will call the `create_profile_for_user` function
CREATE TRIGGER create_profile_for_user AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE create_profile_for_user();
