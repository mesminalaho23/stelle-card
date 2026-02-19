import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, icon, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', onConfirm, onCancel, variant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="confirm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={`confirm-icon-circle confirm-icon-circle--${variant}`}>
              {icon || (variant === 'danger' ? <FiAlertTriangle size={28} /> : <FiCheck size={28} />)}
            </div>
            <h3 className="confirm-title">{title}</h3>
            {message && <p className="confirm-message">{message}</p>}
            <div className="confirm-actions">
              <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
                <FiX size={16} />
                {cancelLabel}
              </button>
              <button className={`confirm-btn confirm-btn--${variant}`} onClick={onConfirm}>
                {variant === 'danger' ? '🗑️' : '✓'}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
