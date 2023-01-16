import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '../../../lib/stripe';

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

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

  const stripeCustomer = data?.stripe_customer;

  const {priceId} = req.query;

  const lineItems = [{
    price: priceId as string,
    quantity: 1,
  }];

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    customer: stripeCustomer,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${process.env.APP_URL!}/payment/success`,
    cancel_url: `${process.env.APP_URL!}/payment/cancelled`,
  });

  return res.send({
    id: session.id,
  });
};

export default handler;
