import Stripe from 'stripe';

import { supabase } from '../../lib/supabase';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
    apiVersion: '2022-11-15'
  });

  const customer = await stripe.customers.create({
    email: req.body.email
  });

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id
    })
    .eq('id', req.body.user_id);

  res.send({ message: `Customer created: ${customer.id}` });
};

export default handler;
