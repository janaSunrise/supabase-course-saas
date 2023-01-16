import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { useUser } from '../context/user';

import type { GetServerSidePropsContext } from 'next';

const Dashboard = () => {
  const { user, isLoading } = useUser();

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-700 text-lg mb-4">
        Welcome back, {user?.profile?.email}!
      </p>
      {!isLoading && (
        <p className="text-gray-700 text-lg mb-4">
          {user?.profile?.is_subscribed
            ? `Subscribed: ${user?.profile?.interval}`
            : 'Not subscribed'}
        </p>
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
