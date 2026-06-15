import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoSource } from '../types';
import { getVideoSourceById } from '../services/firebase';
import MarkdownRenderer from '../components/MarkdownRenderer';

const VideoSourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [source, setSource] = useState<VideoSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getVideoSourceById(id).then(data => {
        if (data) {
          setSource(data);
          document.title = `${data.title} - Sources | Vakya`;
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white font-serif text-2xl">Loading...</div>;
  }

  if (!source) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="font-serif text-4xl mb-4">Source Document Not Found</h1>
        <button onClick={() => navigate('/')} className="text-vakya-salmon hover:underline font-sans font-bold">Return Home</button>
      </div>
    );
  }

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = source.videoUrl ? extractYouTubeId(source.videoUrl) : null;

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-sans text-gray-500 mb-4 uppercase tracking-widest text-xs font-bold">
            Video Source Document
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-6">
            {source.title}
          </h1>
          <p className="font-sans text-gray-500 text-sm">
            Published {new Date(source.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {ytId && (
          <div className="mb-12 aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${ytId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
          <div className="prose prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-gray-900 prose-p:font-serif prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-vakya-salmon hover:prose-a:text-vakya-black prose-li:font-sans prose-li:text-gray-700">
            <MarkdownRenderer content={source.content} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default VideoSourceDetail;
