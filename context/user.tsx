import { createContext, useContext, useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';

import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../types';

interface UserAndProfile {
  user: User | null;
  profile: Profile | null;
}

const UserContext = createContext(
  {} as {
    user: UserAndProfile | null;
  }
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserAndProfile | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;

        if (user) {
          const { data: profile } = await supabase
            .from('profile')
            .select('*')
            .eq('id', user.id)
            .single();

          setUser({
            profile,
            user
          });
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  });

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
