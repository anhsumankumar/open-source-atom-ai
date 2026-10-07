import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import './ContextManager.css'; // Reusing the same CSS for modals

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => Promise<void>;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearData
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete ALL your chat history? This cannot be undone.")) {
      setIsDeleting(true);
      try {
        await onClearData();
        setHasDeleted(true);
        setTimeout(() => {
          onClose();
          window.location.reload(); // Reload to clear local state
        }, 1500);
      } catch (e) {
        console.error(e);
        alert("Failed to delete data. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="modal-content scale-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', color: '#ca8a04' }}>
              <ShieldCheck size={20} />
            </div>
            <h2>Data & Privacy</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#ca8a04" /> Your Data
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All your conversations and engineering contexts are securely stored. You can request to delete all your data at any time. Once deleted, it cannot be recovered.
            </p>
          </div>

          <button 
            className="delete-data-btn"
            onClick={handleDelete}
            disabled={isDeleting || hasDeleted}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              backgroundColor: hasDeleted ? '#22c55e' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: (isDeleting || hasDeleted) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isDeleting ? 0.7 : 1
            }}
          >
            {isDeleting ? 'Deleting...' : hasDeleted ? 'Deleted Successfully!' : <><Trash2 size={18} /> Delete All Chat History</>}
          </button>
        </div>
      </div>
    </div>
  );
};
