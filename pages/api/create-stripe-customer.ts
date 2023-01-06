import { supabase } from '../../lib/supabase';
import { stripe } from '../../lib/stripe';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.API_SECRET !== process.env.API_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  const customer = await stripe.customers.create({
    email: req.body.email
  });

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id
    })
    .eq('id', req.body.user_id);

  res.send({
    message: `Customer created: ${customer.id}. User ID: ${req.body.user_id}`
  });
};

export default handler;
