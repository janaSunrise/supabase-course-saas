import { useRouter } from 'next/router';
import axios from 'axios';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { useUser } from '../context/user';

import type { GetServerSidePropsContext } from 'next';

const Dashboard = () => {
  const router = useRouter();

  const { user, isLoading } = useUser();

  const loadPortal = async () => {
    const { data } = await axios.get('/api/portal');

    router.push(data.url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      {!isLoading && (
        <>
          <p className="text-gray-700 text-lg mb-4">
            Welcome back, {user?.profile?.email}!
          </p>

          <p className="text-gray-700 text-lg mb-4">
            {user?.profile?.is_subscribed
              ? `Subscribed: ${user?.profile?.interval}`
              : 'Not subscribed'}
          </p>
          {user?.profile?.is_subscribed && (
            <button
              className="font-bold py-2 px-4 rounded shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
              onClick={loadPortal}
            >
              Manage Subscription
            </button>
          )}
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      },
      props: {}
    };
  }

  return {
    props: {}
  };
};

export default Dashboard;
