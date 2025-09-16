// src/components/EventFeed.jsx
import React, { memo } from 'react';
import { ShieldAlert, Bot, Truck, Info } from 'lucide-react';

const eventTypeDetails = {
  critical: { icon: <ShieldAlert size={16} className="text-red-500" />, style: 'border-red-500' },
  'ai-update': { icon: <Bot size={16} className="text-purple-500" />, style: 'border-purple-500' },
  dispatch: { icon: <Truck size={16} className="text-blue-500" />, style: 'border-blue-500' },
  info: { icon: <Info size={16} className="text-gray-500" />, style: 'border-gray-400' },
};

// Memo is safe to use here as props are simple
const EventFeed = memo(function EventFeed({ events, onEventSelect }) {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-900">Live Event Feed</h3>
      </div>
      <ul className="overflow-y-auto px-2 py-2 flex-grow min-h-0">
        {events.map((event) => {
          const details = eventTypeDetails[event.type] || eventTypeDetails.info;
          return (
            <li
              key={event.id}
              onClick={() => event.incidentId && onEventSelect(event.incidentId)}
              className={`
                p-3 mb-2 rounded-md border-l-4 ${details.style} bg-gray-50
                ${event.incidentId ? 'cursor-pointer hover:bg-gray-100' : ''}
                transition-colors flex items-start gap-3
              `}
            >
              <span className="mt-0.5">{details.icon}</span>
              <div>
                <span className="font-mono text-gray-500 text-sm mr-2">{event.time}</span>
                <span className="text-sm text-gray-800">{event.text}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default EventFeed;