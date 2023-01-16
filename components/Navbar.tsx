import Link from 'next/link';

import { useUser } from '../context/user';

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex py-4 px-8 border-b border-gray-200">
      <Link href="/">Home</Link>

      {!!user && (
        <Link href="/dashboard" className="ml-4">
          Dashboard
        </Link>
      )}

      <Link href="/pricing" className="ml-4">
        Pricing
      </Link>

      <Link href={user ? '/logout' : '/login'} className="ml-auto">
        {user ? 'Logout' : 'Login'}
      </Link>
    </div>
  );
};

export default Navbar;
