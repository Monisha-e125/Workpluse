import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const VelocityChart = ({ sprints = [] }) => {
  if (sprints.length === 0) return null;

  const data = sprints.filter((s) => s.status === 'completed').map((s) => ({
    name: s.name,
    velocity: s.velocity || 0
  }));

  if (data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-dark-400">No completed sprints yet for velocity chart</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Sprint Velocity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
            />
            <Bar dataKey="velocity" name="Story Points" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VelocityChart;