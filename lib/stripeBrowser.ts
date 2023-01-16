import { loadStripe } from '@stripe/stripe-js';

export const stripeJS = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY! as string);
