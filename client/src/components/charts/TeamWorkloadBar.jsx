import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TeamWorkloadBar = ({ data = [] }) => {
  if (data.length === 0) return null;

  const chartData = data.map((m) => ({
    name: m.user.name.split(' ')[0],
    completed: m.completed,
    inProgress: m.inProgress,
    overdue: m.overdue,
    total: m.total
  }));

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Team Workload</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ bottom: 5 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
            <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="inProgress" name="In Progress" fill="#eab308" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="overdue" name="Overdue" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamWorkloadBar;