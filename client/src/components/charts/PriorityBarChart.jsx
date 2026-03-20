import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
const LABELS = { critical: '🔴 Critical', high: '🟠 High', medium: '🟡 Medium', low: '🟢 Low' };

const PriorityBarChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({ ...d, label: LABELS[d.priority] || d.priority }));

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Priority Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="label" stroke="#94a3b8" fontSize={12} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
              {chartData.map((entry) => (
                <Cell key={entry.priority} fill={COLORS[entry.priority] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityBarChart;