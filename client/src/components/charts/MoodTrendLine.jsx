import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const moodEmojis = { 1: '😫', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const mood = payload[0]?.value;
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm">
      <p className="text-dark-400">{label}</p>
      <p className="text-white font-medium">
        {mood ? `${moodEmojis[Math.round(mood)] || ''} ${mood}/5` : 'No data'}
      </p>
    </div>
  );
};

const MoodTrendLine = ({ data = [] }) => {
  const filtered = data.filter((d) => d.avgMood !== null);
  if (filtered.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Team Mood Trend (30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false}
              interval={Math.floor(data.length / 6)} />
            <YAxis stroke="#64748b" fontSize={12} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(v) => moodEmojis[v] || v} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={3} stroke="#334155" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="avgMood" stroke="#22c55e" strokeWidth={2}
              dot={{ fill: '#22c55e', r: 3 }} connectNulls activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodTrendLine;