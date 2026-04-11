import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types';
import { getBlogs } from '../services/firebase';

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blogs | Vakya";
    const fetchBlogs = async () => {
      const fetchedBlogs = await getBlogs();
      setBlogs(fetchedBlogs);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white font-serif text-2xl">Loading Blogs...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-5xl md:text-6xl mb-16 text-vakya-black">Blogs</h1>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {blogs.map((blog) => (
            <div key={blog.id} onClick={() => navigate(`/blogs/${blog.id}`)} className="cursor-pointer group flex flex-col h-full">
              <div className="overflow-hidden mb-6 aspect-video bg-gray-100 rounded-lg">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1">
                <span className="font-sans text-sm text-gray-500 mb-2 block">{blog.domain}</span>
                <h2 className="font-sans font-bold text-2xl mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4 text-gray-900">{blog.title}</h2>
                <p className="font-sans text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>

                <div className="flex items-center gap-3 mt-auto">
                  {blog.authorImage ? (
                    <img src={blog.authorImage} alt={blog.author} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {blog.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-sans text-sm text-gray-900">{blog.author}</p>
                    {blog.authorRole && (
                      <p className="font-sans text-xs text-gray-500">{blog.authorRole}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-2 text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
              <h3 className="font-serif text-3xl text-gray-400 mb-2">No blogs yet.</h3>
              <p className="font-sans text-gray-500">Check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
