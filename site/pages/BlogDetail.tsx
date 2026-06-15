import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Blog } from '../types';
import { getBlogById } from '../services/firebase';
import MarkdownRenderer from '../components/MarkdownRenderer';

const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return String(dateInput);
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (id) {
        const fetchedBlog = await getBlogById(id);
        if (fetchedBlog) {
          setBlog(fetchedBlog);
          document.title = `${fetchedBlog.title} | Vakya`;
        }
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white font-serif text-2xl">Loading Blog...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="font-serif text-4xl mb-4">Blog Not Found</h1>
        <button onClick={() => navigate('/blogs')} className="text-vakya-salmon hover:underline font-sans font-bold">Return to Blogs</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-24">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="font-sans text-gray-500 mb-4">
            Published {formatDate(blog.publishedAt)} in <span className="underline decoration-1 underline-offset-4">{blog.domain}</span>
          </p>
          <h1 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-8 tracking-tight">
            {blog.title}
          </h1>

          <Link to={`/staff/${blog.author.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="flex items-center gap-4 group/author w-max">
            {blog.authorImage ? (
              <img src={blog.authorImage} alt={blog.author} className="w-12 h-12 rounded-lg object-cover group-hover/author:ring-2 ring-vakya-salmon transition-all" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl group-hover/author:ring-2 ring-vakya-salmon transition-all">
                {blog.author.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-sans text-gray-900 group-hover/author:text-vakya-salmon transition-colors">By {blog.author}</p>
              {blog.authorRole && (
                <p className="font-sans text-sm text-gray-500">{blog.authorRole}</p>
              )}
            </div>
          </Link>
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-gray-900 prose-p:font-serif prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-vakya-salmon hover:prose-a:text-vakya-black prose-img:rounded-xl">
          <MarkdownRenderer content={blog.content} />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
