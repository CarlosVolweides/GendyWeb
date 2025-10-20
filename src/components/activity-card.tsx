import React from 'react';

interface ActivityCardProps {
  date: string;
  title: string;
  description: string;
}

export function ActivityCard({ date, title, description }: ActivityCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3">
        <div className="text-cyan-500 flex-shrink-0">
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
