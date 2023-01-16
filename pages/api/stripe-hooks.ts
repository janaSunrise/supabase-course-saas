import { buffer } from 'micro';

import { stripe } from '../../lib/stripe';
import { getServiceSupabase } from '../../lib/supabase';

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers['stripe-signature'] as string;

  const signingSecret = process.env.STRIPE_SIGNING_SECRET! as string;

  const reqBuffer = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as any).message}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('triggered', (event.data.object as any).customer);
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          interval: (event.data.object as any).items.data[0].plan.interval,
        })
        .eq('stripe_customer', (event.data.object as any).customer);
      break;
  }

  res.status(200).json({ received: true });
};

export default handler;
