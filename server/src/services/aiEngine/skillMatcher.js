const dayjs = require('dayjs');

class SkillMatcher {
  /**
   * Calculate how well a developer's skills match task requirements
   * Returns 0-1 score
   */
  static calculate(developerSkills = [], requiredSkills = []) {
    if (!requiredSkills.length) return 0.5;

    let matchScore = 0;
    let totalWeight = 0;

    requiredSkills.forEach((required) => {
      const weight = required.weight || 0.5;
      totalWeight += weight;

      const devSkill = developerSkills.find(
        (s) => s.name.toLowerCase() === required.name.toLowerCase()
      );

      if (devSkill) {
        const proficiency = devSkill.proficiency / 5;

        // Recency bonus
        const daysSinceUsed = devSkill.lastUsed
          ? dayjs().diff(dayjs(devSkill.lastUsed), 'day')
          : 180;
        const recencyBonus = Math.max(0, 0.2 * (1 - daysSinceUsed / 365));

        matchScore += (proficiency + recencyBonus) * weight;
      }
    });

    return totalWeight > 0 ? Math.min(1, matchScore / totalWeight) : 0;
  }

  /**
   * Find best matching developers for a task
   */
  static findBestMatches(developers, requiredSkills, topN = 5) {
    const scores = developers.map((dev) => ({
      developer: {
        _id: dev._id,
        name: `${dev.firstName} ${dev.lastName}`,
        avatar: dev.avatar,
        skills: dev.skills
      },
      matchScore: this.calculate(dev.skills, requiredSkills),
      matchedSkills: this.getMatchedSkills(dev.skills, requiredSkills),
      missingSkills: this.getMissingSkills(dev.skills, requiredSkills)
    }));

    scores.sort((a, b) => b.matchScore - a.matchScore);
    return scores.slice(0, topN);
  }

  static getMatchedSkills(devSkills = [], requiredSkills = []) {
    return requiredSkills
      .filter((req) =>
        devSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase())
      )
      .map((req) => {
        const devSkill = devSkills.find(
          (s) => s.name.toLowerCase() === req.name.toLowerCase()
        );
        return {
          name: req.name,
          proficiency: devSkill?.proficiency || 0,
          required: true
        };
      });
  }

  static getMissingSkills(devSkills = [], requiredSkills = []) {
    return requiredSkills
      .filter(
        (req) =>
          !devSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase())
      )
      .map((req) => req.name);
  }
}

module.exports = SkillMatcher;