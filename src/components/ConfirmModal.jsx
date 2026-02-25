import { LuAlertTriangle, LuCheck, LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, icon, confirmLabel, cancelLabel, onConfirm, onCancel, variant = 'danger' }) => {
  const { t } = useTranslation();
  const effectiveConfirmLabel = confirmLabel || t('confirm.confirm');
  const effectiveCancelLabel = cancelLabel || t('confirm.cancel');

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
              {icon || (variant === 'danger' ? <LuAlertTriangle size={28} /> : <LuCheck size={28} />)}
            </div>
            <h3 className="confirm-title">{title}</h3>
            {message && <p className="confirm-message">{message}</p>}
            <div className="confirm-actions">
              <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
                <LuX size={16} />
                {effectiveCancelLabel}
              </button>
              <button className={`confirm-btn confirm-btn--${variant}`} onClick={onConfirm}>
                {variant === 'danger' ? '🗑️' : '✓'}
                {effectiveConfirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;