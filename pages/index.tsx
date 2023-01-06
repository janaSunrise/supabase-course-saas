import Link from 'next/link';

import { supabase } from '../lib/supabase';
import { useUser } from '../context/user';

import type { Lesson } from '../types';

interface Props {
  lessons: Lesson[];
}

const Home = ({ lessons }: Props) => {
  const {user} = useUser();

  console.log(user);

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-2">
      {lessons.map(lesson => (
        <Link href={`/lesson/${lesson.id}`} key={lesson.id}>
          <div className="block bg-white shadow-md rounded-lg overflow-hidden my-4">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{lesson.title}</div>
              <p className="text-gray-700 text-base">{lesson.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export const getServerSideProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*');

  return {
    props: {
      lessons
    }
  };
};

export default Home;
