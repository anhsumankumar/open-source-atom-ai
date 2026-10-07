import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './ChatRenderer.css';

interface ChatRendererProps {
  content: string;
  isUser: boolean;
  reasoning?: string;
}

export const ChatRenderer: React.FC<ChatRendererProps> = ({ content, isUser, reasoning }) => {
  if (isUser) {
    return (
      <div className="message user-message">
        <div className="message-content handwriting-text">
          <div className="message-bubble">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message atom-message">
      <div className="message-content handwriting-text">
        {reasoning && (
          <details className="thinking-block">
            <summary className="thinking-summary">ATOM's Thought Process</summary>
            <div className="thinking-content">
              <ReactMarkdown>{reasoning}</ReactMarkdown>
            </div>
          </details>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Custom renderers for specific markdown elements
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <div className="code-block-wrapper">
                  <div className="code-block-header">{match ? match[1] : 'code'}</div>
                  <pre className="code-block" {...props}>
                    <code>{children}</code>
                  </pre>
                </div>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => <div className="markdown-p">{children}</div>,
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
