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

