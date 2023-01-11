import { stripe } from "../lib/stripe"

import type { StripeProduct } from "../types"

interface PricingProps {
  plans: StripeProduct[]
}

const Pricing = ({ plans }: PricingProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4 bg-white">
      {plans.map(plan => (
        <div key={plan.id} className="p-4 border border-gray-200 rounded shadow hover:shadow-md transition-shadow duration-200">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">{plan.price / 100} {plan.currency} / {plan.interval}</p>
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps = async () => {
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(prices.map(async price => {
    const product = await stripe.products.retrieve(price.product as string);

    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
    };
  }));

  plans.sort((a, b) => a.price! - b.price!);

  return {
    props: {
      plans,
    }
  }
};

export default Pricing
