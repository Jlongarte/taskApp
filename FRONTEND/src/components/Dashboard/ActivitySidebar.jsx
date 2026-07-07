

const ActivitySidebar = ({ showHistory, setShowHistory, activityLog }) => (
  <div className={`activity-sidebar ${showHistory ? "open" : ""}`}>
    <div className="sidebar-history-header">
      <h3>Activity History</h3>
      <button onClick={() => setShowHistory(false)} className="close-history-btn">X</button>
    </div>
    <div className="sidebar-history-content">
      {activityLog.length === 0 ? (
        <p className="empty-history-text">No activity recorded in this session.</p>
      ) : (
        <ul className="history-list">
          {activityLog.map((log) => (
            <li key={log.id} className="history-item">
              <span className="history-time">{log.time}</span>
              <p className="history-item-text">{log.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default ActivitySidebar;