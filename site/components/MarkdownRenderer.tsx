import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="font-serif text-4xl md:text-5xl mb-6 mt-12 leading-tight font-normal" {...props} />,
          h2: ({ node, ...props }) => <h2 className="font-serif text-3xl md:text-4xl mb-4 mt-10 leading-tight font-normal" {...props} />,
          h3: ({ node, ...props }) => <h3 className="font-serif text-2xl md:text-3xl mb-3 mt-8 leading-tight font-normal" {...props} />,
          h4: ({ node, ...props }) => <h4 className="font-serif text-xl md:text-2xl mb-2 mt-6 font-bold" {...props} />,
          p: ({ node, ...props }) => <p className="font-sans text-lg leading-8 mb-6" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-vakya-accent pl-6 py-2 my-8 bg-black/5 rounded-r-lg">
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed m-0 opacity-80" {...props} />
            </blockquote>
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 font-sans text-lg marker:text-vakya-salmon" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 font-sans text-lg marker:text-vakya-salmon" {...props} />,
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          a: ({ node, ...props }) => <a className="text-vakya-salmon hover:text-red-600 underline underline-offset-4 decoration-2 font-bold transition-colors cursor-pointer" target="_blank" rel="noopener noreferrer" {...props} />,
          img: ({ node, ...props }) => (
            <figure className="my-10">
              <img className="w-full h-auto rounded-sm shadow-sm" {...props} alt={props.alt || 'Article Image'} />
              {props.alt && <figcaption className="text-center text-sm font-sans opacity-60 mt-3 uppercase tracking-widest">{props.alt}</figcaption>}
            </figure>
          ),
          hr: ({ node, ...props }) => <hr className="border-black/10 my-10" {...props} />,
          pre: ({ node, ...props }) => <pre className="bg-vakya-black text-white p-6 rounded-lg overflow-x-auto my-8 text-sm font-mono shadow-inner" {...props} />,
          code: ({ node, ...props }) => {
            // Simple check: if inside a pre, the parent renderer handles the block container.
            // React Markdown passes no special prop to distinguish, but the DOM structure differs.
            // We'll style the inline code here. If it's a block, it's wrapped in 'pre' which we styled above.
            return <code className="bg-gray-200 text-red-700 px-1.5 py-0.5 rounded font-mono text-sm font-medium" {...props} />
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;