import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import './ContextManager.css';

interface ContextManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext: string;
  onSave: (context: string) => Promise<void>;
}

export const ContextManager: React.FC<ContextManagerProps> = ({ 
  isOpen, 
  onClose, 
  initialContext,
  onSave 
}) => {
  const [contextText, setContextText] = useState(initialContext);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setContextText(initialContext);
      setError(null);
    }
  }, [isOpen, initialContext]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(contextText);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save context');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content context-modal">
        <div className="modal-header">
          <h2>My Engineering Context</h2>
          <button className="icon-btn" onClick={onClose} disabled={isSaving}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="context-description">
            Tell ATOM about your course, branch, semester, subjects, units, syllabus, current topics, study preferences, exam preparation and anything else ATOM should remember.
          </p>
          
          <textarea
            className="context-textarea"
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder="E.g. Degree: B.Tech&#10;Branch: ECE&#10;Semester: 5th&#10;Subjects: Engineering Mathematics, Digital Electronics..."
            disabled={isSaving}
          />
          
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : (
              <>
                <Save size={16} />
                <span>Save Context</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
