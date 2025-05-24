import React from 'react';

export interface ActivityLogProps {
  log: Array<{ action: string; timestamp: string }>;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ log }) => (
  <div className="bg-gray-50 rounded p-3 mt-2 text-xs">
    <div className="font-semibold mb-2">Activity Log</div>
    <ul className="space-y-1">
      {log.length === 0 ? (
        <li className="text-gray-400">No activity yet.</li>
      ) : (
        log.slice().reverse().map((entry, idx) => (
          <li key={idx}>
            <span className="text-gray-700">{entry.action}</span>
            <span className="ml-2 text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default ActivityLog;
