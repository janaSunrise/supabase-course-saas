import {createContext, useContext, useState, useEffect} from 'react';

import { supabase } from '../lib/supabase';

import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

const UserContext = createContext(
  {} as {
    user: User | null;
  }
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;

        setUser(user);
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
}
