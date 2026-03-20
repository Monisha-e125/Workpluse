import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CompletionLineChart = ({ data = [] }) => {
  if (data.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Tasks Completed (Last 30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false}
              interval={Math.floor(data.length / 6)} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2}
              fill="url(#completionGradient)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionLineChart;