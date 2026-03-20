const moodEmojis = { 1: '😫', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
const trendIcons = { improving: '📈', declining: '📉', stable: '➡️' };
const trendColors = { improving: 'text-green-400', declining: 'text-red-400', stable: 'text-yellow-400' };

const TeamMoodGrid = ({ team = [] }) => {
  if (team.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {team.map((member) => (
        <div key={member.user._id} className="card-hover">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                {member.user.name?.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{member.user.name}</p>
                <p className={`text-xs ${trendColors[member.trend]}`}>
                  {trendIcons[member.trend]} {member.trend}
                </p>
              </div>
            </div>

            {/* Current Mood */}
            <div className="text-center">
              <span className="text-2xl">
                {member.latestMood ? moodEmojis[member.latestMood] : '❓'}
              </span>
              <p className="text-xs text-dark-500 mt-0.5">
                {member.avgMood > 0 ? `avg: ${member.avgMood}` : 'no data'}
              </p>
            </div>
          </div>

          {/* Recent Moods Mini Bar */}
          {member.recentMoods && member.recentMoods.length > 0 && (
            <div className="flex gap-1 mt-2">
              {member.recentMoods.slice(0, 7).reverse().map((m, i) => (
                <div
                  key={i}
                  className="flex-1 h-6 rounded-md flex items-center justify-center text-xs"
                  style={{
                    backgroundColor:
                      m.mood >= 4 ? '#22c55e20' :
                      m.mood >= 3 ? '#eab30820' :
                      '#ef444420'
                  }}
                  title={`${moodEmojis[m.mood]} on ${new Date(m.date).toLocaleDateString()}`}
                >
                  {moodEmojis[m.mood]}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-dark-500 mt-2">
            {member.totalCheckIns} check-ins in last 30 days
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeamMoodGrid;