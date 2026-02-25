import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LuBell, LuX } from 'react-icons/lu';
import './Notifications.css';

const Notifications = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const defaultNotifs = [
    { id: 1, title: t('notifications.welcome'), message: t('notifications.welcomeMsg'), time: t('notifications.now'), read: false },
    { id: 2, title: t('notifications.specialOffer'), message: t('notifications.specialOfferMsg'), time: t('notifications.2hAgo'), read: false },
    { id: 3, title: t('notifications.newArrival'), message: t('notifications.newArrivalMsg'), time: t('notifications.yesterday'), read: true }
  ];

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
        <LuBell />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <>
          <div className="notif-overlay" onClick={() => setIsOpen(false)} />
          <div className="notif-panel slide-up">
            <div className="notif-panel-header">
              <h3>{t('notifications.title')}</h3>
              <button onClick={() => setIsOpen(false)}><LuX /></button>
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
                    <button className="notif-remove" onClick={() => removeNotif(n.id)}><LuX size={14} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notif-empty"><span>🔔</span><p>{t('notifications.empty')}</p></div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;