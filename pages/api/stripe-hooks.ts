import { buffer } from 'micro';

import { stripe } from '../../lib/stripe';

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

  console.log({ event });

  res.status(200).json({ received: true });
};

export default handler;
