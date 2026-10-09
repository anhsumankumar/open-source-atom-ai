import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Edit2, RotateCw, X } from 'lucide-react';
import './ChatRenderer.css';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header">
          <span>{language}</span>
          <button className="copy-btn" onClick={handleCopy} title="Copy code">
            {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          className="code-block-highlighter"
          customStyle={{ margin: 0, borderRadius: '0 0 12px 12px' }}
          {...props}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="inline-code" {...props}>
      {children}
    </code>
  );
};

interface ChatRendererProps {
  content: string;
  isUser: boolean;
  reasoning?: string;
  onEdit?: (newContent: string) => void;
  onRegenerate?: () => void;
}

export const ChatRenderer: React.FC<ChatRendererProps> = ({ content, isUser, reasoning, onEdit, onRegenerate }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(content);

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== content && onEdit) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  if (isUser) {
    return (
      <div className="message user-message group">
        <div className="message-content handwriting-text">
          {isEditing ? (
            <div className="message-edit-container">
              <textarea 
                className="message-edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
              <div className="message-edit-actions">
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSaveEdit}>Save & Send</button>
              </div>
            </div>
          ) : (
            <div className="message-bubble-wrapper">
              <div className="message-bubble">
                {content}
              </div>
              {onEdit && (
                <button className="edit-btn" onClick={() => setIsEditing(true)} title="Edit Message">
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          )}
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
            code: CodeBlock,
            p: ({ children }) => <div className="markdown-p">{children}</div>,
            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          }}
        >
          {content}
        </ReactMarkdown>
        {onRegenerate && (
          <div className="message-footer">
            <button className="regenerate-btn" onClick={onRegenerate} title="Regenerate Response">
              <RotateCw size={14} />
              <span>Regenerate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
