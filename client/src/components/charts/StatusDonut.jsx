import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  backlog: '#64748b', todo: '#3b82f6', 'in-progress': '#eab308',
  'in-review': '#a855f7', testing: '#f97316', done: '#22c55e'
};

const LABELS = {
  backlog: '📋 Backlog', todo: '📝 To Do', 'in-progress': '🔄 In Progress',
  'in-review': '👀 Review', testing: '🧪 Testing', done: '✅ Done'
};

const StatusDonut = ({ data = [] }) => {
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((s, d) => s + d.count, 0);

  if (total === 0) return <p className="text-dark-500 text-sm text-center py-8">No tasks yet</p>;

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Task Status Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filtered} dataKey="count" nameKey="status" cx="50%" cy="50%"
                innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                {filtered.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || '#6366f1'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                formatter={(value, name) => [value, LABELS[name] || name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.status] }} />
                <span className="text-dark-300">{LABELS[item.status] || item.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{item.count}</span>
                <span className="text-dark-500 text-xs">
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDonut;