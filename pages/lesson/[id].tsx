import { supabase } from '../../lib/supabase';

import type { GetServerSidePropsContext } from 'next';
import type { Lesson } from '../../types';

interface Props {
  lesson: Lesson;
}

const Lesson = ({ lesson }: Props) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-8">
      <div className="block bg-white overflow-hidden my-4">
        <div className="px-6 py-4">
          <h1 className="font-bold text-4xl mb-2 text-center">
            {lesson.title}
          </h1>
          <p className="text-gray-700 text-lg text-center">
            {lesson.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params
}: GetServerSidePropsContext) => {
  const { data: lesson } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', params?.id)
    .single();

  if (!lesson) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      lesson
    }
  };
};

export default Lesson;
