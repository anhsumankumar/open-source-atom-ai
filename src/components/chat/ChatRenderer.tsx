import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Edit2, RotateCw, X } from 'lucide-react';
import './ChatRenderer.css';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline) {
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
  siblingCount?: number;
  currentIndex?: number;
  onNextBranch?: () => void;
  onPrevBranch?: () => void;
  onEdit?: (newContent: string) => void;
  onRegenerate?: () => void;
}

export const ChatRenderer = React.memo<ChatRendererProps>(({ 
  content, 
  isUser, 
  reasoning, 
  siblingCount = 1,
  currentIndex = 0,
  onNextBranch,
  onPrevBranch,
  onEdit, 
  onRegenerate 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(content);
  const [isThinkingOpen, setIsThinkingOpen] = React.useState(false);

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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{content}</span>
                  {onEdit && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)} title="Edit Message">
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {siblingCount > 1 && (
                    <div className="branch-controls">
                      <button className="branch-btn" onClick={onPrevBranch} disabled={currentIndex === 0}>{'<'}</button>
                      <span className="branch-text">{currentIndex + 1} / {siblingCount}</span>
                      <button className="branch-btn" onClick={onNextBranch} disabled={currentIndex === siblingCount - 1}>{'>'}</button>
                    </div>
                  )}
                  {onRegenerate && (
                    <button className="regenerate-btn" onClick={onRegenerate} title="Regenerate Response">
                      <RotateCw size={12} />
                      <span>Regenerate</span>
                    </button>
                  )}
                </div>
              </div>
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
          <details 
            className="thinking-block" 
            open={isThinkingOpen} 
            onToggle={(e: any) => setIsThinkingOpen(e.currentTarget.open)}
          >
            <summary className="thinking-summary">ATOM's Thought Process</summary>
            <div className="thinking-content">
              {isThinkingOpen && <ReactMarkdown>{reasoning}</ReactMarkdown>}
            </div>
          </details>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkBreaks]}
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
        {!isUser && siblingCount > 1 && (
          <div className="branch-controls atom-branch">
            <button onClick={onPrevBranch} disabled={currentIndex === 0}>{'<'}</button>
            <span>{currentIndex + 1} / {siblingCount}</span>
            <button onClick={onNextBranch} disabled={currentIndex === siblingCount - 1}>{'>'}</button>
          </div>
        )}
      </div>
    </div>
  );
}, (prev, next) => {
  return prev.content === next.content &&
         prev.reasoning === next.reasoning &&
         prev.currentIndex === next.currentIndex &&
         prev.siblingCount === next.siblingCount &&
         prev.isUser === next.isUser;
});
