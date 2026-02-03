function safeAvg(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sum = arr.reduce((s, v) => s + Number(v || 0), 0);
  return sum / arr.length;
}

function getGradeFromPercent(percent) {
  // Returns { letter, points }
  const p = Number(percent);
  if (isNaN(p)) return { letter: 'N/A', points: null };
  if (p >= 90 && p <= 100) return { letter: 'A+', points: 4.0 };
  if (p >= 85) return { letter: 'A', points: 4.0 };
  if (p >= 80) return { letter: 'A-', points: 3.7 };
  if (p >= 75) return { letter: 'B+', points: 3.3 };
  if (p >= 70) return { letter: 'B', points: 3.0 };
  if (p >= 67) return { letter: 'B-', points: 2.7 };
  if (p >= 64) return { letter: 'C+', points: 2.3 };
  if (p >= 60) return { letter: 'C', points: 2.0 };
  if (p >= 57) return { letter: 'C-', points: 1.7 };
  if (p >= 54) return { letter: 'D+', points: 1.3 };
  if (p >= 50) return { letter: 'D', points: 1.0 };
  return { letter: 'F', points: 0.0 };
}

function calculatePerformance({ assignmentMarks = [], quizMarks = [], presentationMarks = [], projectPercent, participationMarks = [], midtermMarks = 0 }) {
  const assignmentAvg = safeAvg(assignmentMarks);
  const quizAvg = safeAvg(quizMarks);
  const presentationAvg = safeAvg(presentationMarks);
  const participationAvg = safeAvg(participationMarks);

  // Combine project percent (single value) with presentation marks if provided
  const projectInputs = [];
  if (typeof projectPercent === 'number') projectInputs.push(projectPercent);
  if (Array.isArray(presentationMarks) && presentationMarks.length) projectInputs.push(...presentationMarks);
  const projectPresentationAvg = projectInputs.length ? safeAvg(projectInputs) : 0;

  // Weights (as decimals)
  // Assignments: 5%, Quizzes: 10%, Project+Presentations: 10%, Midterm: 30%, Participation: 5%, Final: 40%
  const performanceScore = Number(
    (
      assignmentAvg * 0.05 +
      quizAvg * 0.10 +
      projectPresentationAvg * 0.10 +
      midtermMarks * 0.30 +
      participationAvg * 0.05
    ).toFixed(2)
  );

  // Predict final overall mark by estimating final exam performance using midterm as a proxy
  let predictedFinal = Number((performanceScore + midtermMarks * 0.4).toFixed(2));
  if (predictedFinal > 100) predictedFinal = 100;

  // Map predicted final to grade
  const grade = getGradeFromPercent(predictedFinal);

  let level = 'Low';
  if (predictedFinal >= 75) level = 'High';
  else if (predictedFinal >= 50) level = 'Medium';

  return { assignmentAvg, quizAvg, projectPresentationAvg, participationAvg, performanceScore, predictedFinal, predictedGrade: grade.letter, predictedGradePoint: grade.points, level };
}

function generateSuggestions({ assignmentAvg, quizAvg, midtermMarks, projectPresentationAvg, participationAvg, subject }) {
  const suggestions = [];
  const subjText = subject ? ` in ${subject}` : '';
  if (quizAvg < 50) {
    suggestions.push(`Improve quiz preparation${subjText}: frequent short revision sessions and practice tests.`);
  }
  if (assignmentAvg < 50) {
    suggestions.push(`Increase assignment effort${subjText}: start earlier, ask for clarifications, and review feedback.`);
  }
  if (Number(midtermMarks) < 50) {
    suggestions.push(`Midterm performance low${subjText}: review core concepts, attend office hours, and form study groups.`);
  }
  if (projectPresentationAvg < 50) {
    suggestions.push(`Improve project/presentation quality${subjText}: allocate time for research, rehearse presentations, and seek feedback from peers/teachers.`);
  }
  if (participationAvg < 50) {
    suggestions.push(`Increase class participation${subjText}: engage in discussions, ask questions and attend extra activities to improve engagement.`);
  }
  if (suggestions.length === 0) suggestions.push(`Keep up the good work${subjText}. Maintain consistent study habits.`);
  return suggestions;
}

module.exports = { safeAvg, calculatePerformance, generateSuggestions, getGradeFromPercent };
