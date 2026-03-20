import { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService';

const ActivityHeatmap = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyticsService.getActivityHeatmap(userId);
        setData(res.data.data || []);
      } catch { setData([]); }
    };
    fetch();
  }, [userId]);

  if (data.length === 0) return null;

  const getColor = (count) => {
    if (count === 0) return 'bg-dark-700';
    if (count <= 2) return 'bg-green-900';
    if (count <= 5) return 'bg-green-700';
    if (count <= 10) return 'bg-green-500';
    return 'bg-green-400';
  };

  // Show last 90 days
  const last90 = data.slice(-90);

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Activity Heatmap</h3>
      <div className="flex flex-wrap gap-1">
        {last90.map((day) => (
          <div
            key={day.date}
            className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors`}
            title={`${day.date}: ${day.count} actions`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-dark-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-dark-700" />
        <div className="w-3 h-3 rounded-sm bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-500" />
        <div className="w-3 h-3 rounded-sm bg-green-400" />
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;