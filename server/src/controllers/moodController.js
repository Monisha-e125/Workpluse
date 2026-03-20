const MoodCheckIn = require('../models/MoodCheckIn');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination } = require('../utils/pagination');
const dayjs = require('dayjs');
const logger = require('../utils/logger');

// ═══ SUBMIT MOOD CHECK-IN ═══
exports.submitMood = async (req, res) => {
  try {
    const { mood, factors, note, project, isAnonymous } = req.body;

    // Check if already submitted today
    const today = dayjs().startOf('day').toDate();
    const tomorrow = dayjs().endOf('day').toDate();

    const existing = await MoodCheckIn.findOne({
      user: req.user._id,
      date: { $gte: today, $lte: tomorrow }
    });

    if (existing) {
      // Update existing
      existing.mood = mood;
      existing.factors = factors || [];
      existing.note = note || '';
      existing.project = project || null;
      existing.isAnonymous = isAnonymous || false;
      await existing.save();

      return ApiResponse.success(res, existing, 'Mood updated for today');
    }

    const checkIn = await MoodCheckIn.create({
      user: req.user._id,
      project: project || null,
      mood,
      factors: factors || [],
      note: note || '',
      isAnonymous: isAnonymous || false,
      date: new Date()
    });

    logger.info(`💚 Mood check-in: ${req.user.email} → ${mood}/5`);
    return ApiResponse.created(res, checkIn, 'Mood recorded!');
  } catch (error) {
    logger.error(`Mood submit error: ${error.message}`);
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET MY MOOD HISTORY ═══
exports.getMyMoodHistory = async (req, res) => {
  try {
    const { range = '30' } = req.query;
    const daysAgo = dayjs().subtract(parseInt(range), 'day').toDate();

    const moods = await MoodCheckIn.find({
      user: req.user._id,
      date: { $gte: daysAgo }
    })
      .populate('project', 'name icon')
      .sort({ date: -1 });

    // Calculate stats
    const avgMood = moods.length > 0
      ? Math.round((moods.reduce((s, m) => s + m.mood, 0) / moods.length) * 10) / 10
      : 0;

    // Factor frequency
    const factorCount = {};
    moods.forEach((m) => {
      (m.factors || []).forEach((f) => {
        factorCount[f] = (factorCount[f] || 0) + 1;
      });
    });

    const topFactors = Object.entries(factorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([factor, count]) => ({ factor, count }));

    // Trend (compare last 7 days vs previous 7 days)
    const last7 = moods.filter((m) => dayjs(m.date).isAfter(dayjs().subtract(7, 'day')));
    const prev7 = moods.filter((m) =>
      dayjs(m.date).isAfter(dayjs().subtract(14, 'day')) &&
      dayjs(m.date).isBefore(dayjs().subtract(7, 'day'))
    );

    const last7Avg = last7.length > 0
      ? last7.reduce((s, m) => s + m.mood, 0) / last7.length : 0;
    const prev7Avg = prev7.length > 0
      ? prev7.reduce((s, m) => s + m.mood, 0) / prev7.length : 0;

    let trend = 'stable';
    if (last7Avg > prev7Avg + 0.3) trend = 'improving';
    if (last7Avg < prev7Avg - 0.3) trend = 'declining';

    // Check if already submitted today
    const today = dayjs().startOf('day').toDate();
    const todayMood = await MoodCheckIn.findOne({
      user: req.user._id,
      date: { $gte: today }
    });

    return ApiResponse.success(res, {
      history: moods,
      stats: {
        avgMood,
        totalCheckIns: moods.length,
        topFactors,
        trend,
        last7DaysAvg: Math.round(last7Avg * 10) / 10,
        todaySubmitted: !!todayMood,
        todayMood: todayMood?.mood || null
      }
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// ═══ GET TEAM MOOD (for a project) ═══
exports.getTeamMood = async (req, res) => {
  try {
    const { projectId } = req.params;
    const daysAgo = dayjs().subtract(30, 'day').toDate();

    const project = await Project.findById(projectId)
      .populate('members.user', 'firstName lastName avatar');

    if (!project) return ApiResponse.notFound(res, 'Project not found');

    const teamMood = await Promise.all(
      project.members.map(async (member) => {
        if (!member.user) return null;

        const moods = await MoodCheckIn.find({
          user: member.user._id,
          date: { $gte: daysAgo }
        }).sort({ date: -1 });

        const avgMood = moods.length > 0
          ? Math.round((moods.reduce((s, m) => s + m.mood, 0) / moods.length) * 10) / 10
          : 0;

        const latestMood = moods[0]?.mood || null;

        // Trend
        const last7 = moods.filter((m) => dayjs(m.date).isAfter(dayjs().subtract(7, 'day')));
        const prev7 = moods.filter((m) =>
          dayjs(m.date).isAfter(dayjs().subtract(14, 'day')) &&
          dayjs(m.date).isBefore(dayjs().subtract(7, 'day'))
        );
        const l7 = last7.length > 0 ? last7.reduce((s, m) => s + m.mood, 0) / last7.length : 0;
        const p7 = prev7.length > 0 ? prev7.reduce((s, m) => s + m.mood, 0) / prev7.length : 0;
        let trend = 'stable';
        if (l7 > p7 + 0.3) trend = 'improving';
        if (l7 < p7 - 0.3) trend = 'declining';

        return {
          user: {
            _id: member.user._id,
            name: `${member.user.firstName} ${member.user.lastName}`,
            avatar: member.user.avatar
          },
          avgMood,
          latestMood,
          totalCheckIns: moods.length,
          trend,
          recentMoods: moods.slice(0, 7).map((m) => ({
            mood: m.mood,
            date: m.date,
            factors: m.factors
          }))
        };
      })
    );

    const validTeam = teamMood.filter(Boolean);
    const teamAvg = validTeam.length > 0
      ? Math.round((validTeam.reduce((s, t) => s + t.avgMood, 0) / validTeam.length) * 10) / 10
      : 0;

    return ApiResponse.success(res, {
      team: validTeam,
      summary: {
        teamAvgMood: teamAvg,
        totalMembers: validTeam.length,
        happyCount: validTeam.filter((t) => t.avgMood >= 4).length,
        neutralCount: validTeam.filter((t) => t.avgMood >= 3 && t.avgMood < 4).length,
        unhappyCount: validTeam.filter((t) => t.avgMood > 0 && t.avgMood < 3).length,
        noDataCount: validTeam.filter((t) => t.avgMood === 0).length
      }
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};