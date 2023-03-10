export interface Lesson {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
  is_subscribed: boolean;
  interval: string;
  stripe_customer: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  price: number;
  interval?: string;
  currency: string;
}
