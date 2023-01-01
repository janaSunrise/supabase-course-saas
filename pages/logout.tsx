import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '../lib/supabase';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      supabase.auth.signOut();

      router.push('/');
    };
    logout();
  }, []);

  return <p>Logging out</p>;
};

export default Logout;
