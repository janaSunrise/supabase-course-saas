import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '../../lib/stripe';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session: authSession }
  } = await supabase.auth.getSession();

  if (!authSession) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = authSession;

  const { data } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single();

  const session = await stripe.billingPortal.sessions.create({
    customer: data?.stripe_customer,
    return_url: `${process.env.APP_URL!}/dashboard`
  });

  return res.send({
    url: session.url
  });
};

export default handler;
