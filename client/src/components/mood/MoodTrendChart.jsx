import { formatDate } from '../../utils/helpers';

const moodEmojis = { 1: '😫', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
const moodColors = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#4ade80', 5: '#22c55e' };

const MoodTrendChart = ({ history = [] }) => {
  if (history.length === 0) return null;

  const last14 = history.slice(0, 14).reverse();

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Mood Trend</h3>

      {/* Simple bar chart */}
      <div className="flex items-end gap-1.5 h-32">
        {last14.map((entry, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs">{moodEmojis[entry.mood]}</span>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{
                height: `${(entry.mood / 5) * 100}%`,
                backgroundColor: moodColors[entry.mood],
                opacity: 0.8
              }}
            />
            <span className="text-[9px] text-dark-500 -rotate-45 origin-center">
              {formatDate(entry.date, 'M/D')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTrendChart;