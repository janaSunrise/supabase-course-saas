import { useEffect } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';

import { supabase } from '../lib/supabase';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: 'github'
    });
  }, []);

  return <div>Logging in</div>;
};

export const getServerSideProps = async () => {
  // subscribe to the `INSERT` events in `public.profile` table in realtime
  supabase
    .channel('public:profile')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'profile' },
      payload => {
        // call the `/api/create-stripe-customer` route with the user's email, and `process.env.API_SECRET` as query
        // TODO: Fix URL to be universal
        axios
          .get(
            `${process.env.APP_URL}/api/create-stripe-customer?API_SECRET=${process.env.API_SECRET}`,
            {
              data: {
                email: payload.new.email,
                user_id: payload.new.id
              }
            }
          )
          .then(_ => {});
      }
    )
    .subscribe();

  // Return nothing
  return {
    props: {}
  };
};

export default Login;
