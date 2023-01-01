import { useEffect } from 'react';

import { supabase } from '../lib/supabase';

const Login = () => {
  useEffect(() => {
    supabase.auth.signInWithOAuth({ provider: 'github' });
  }, []);

  return <div>Logging in</div>;
};

export default Login;
