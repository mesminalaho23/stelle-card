import { useState, useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import './Notifications.css';

const defaultNotifs = [
  { id: 1, title: 'Bienvenue !', message: 'Bienvenue sur Stelle Card. Explorez notre flotte premium.', time: 'Maintenant', read: false },
  { id: 2, title: 'Offre spéciale', message: '-20% sur votre première location avec le code STELLE20.', time: 'Il y a 2h', read: false },
  { id: 3, title: 'Nouveauté', message: 'La Tesla Model 3 est maintenant disponible !', time: 'Hier', read: true }
];

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : defaultNotifs;
  });
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifs)); }, [notifs]);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}>
        <FiBell />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <>
          <div className="notif-overlay" onClick={() => setIsOpen(false)} />
          <div className="notif-panel slide-up">
            <div className="notif-panel-header">
              <h3>Notifications</h3>
              <button onClick={() => setIsOpen(false)}><FiX /></button>
            </div>
            {notifs.length > 0 ? (
              <div className="notif-list">
                {notifs.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}>
                    <div className="notif-item-content">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                    <button className="notif-remove" onClick={() => removeNotif(n.id)}><FiX size={14} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notif-empty"><span>🔔</span><p>Aucune notification</p></div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
