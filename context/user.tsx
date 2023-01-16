import { createContext, useContext, useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';

import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../types';

interface UserAndProfile {
  user: User | null;
  profile: Profile | null;
}

interface ContextProps {
  user: UserAndProfile | null;
  isLoading: boolean;
}

const UserContext = createContext({
  user: null,
  isLoading: true
} as ContextProps);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserAndProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  });

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
