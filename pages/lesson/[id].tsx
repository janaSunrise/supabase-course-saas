import { useState, useEffect } from 'react';
import Video from 'react-player';

import { supabase } from '../../lib/supabase';

import type { GetServerSidePropsContext } from 'next';
import type { Lesson } from '../../types';

interface Props {
  lesson: Lesson;
}

const Lesson = ({ lesson }: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const getPremiumContent = async () => {
    const { data: premiumContent } = await supabase
      .from('premium_content')
      .select('video_url')
      .eq('id', lesson.id)
      .single();

    setVideoUrl(premiumContent?.video_url);
  };

  useEffect(() => {
    getPremiumContent();
  }, []);

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

          <div className="mt-4">
            {videoUrl ? (
              <Video url={videoUrl} controls  />
            ) : (
              <div className="text-center">
                <p className="text-gray-700 text-lg">
                  This is a premium lesson. Please subscribe to access this
                  content.
                </p>
              </div>
            )}
          </div>
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
