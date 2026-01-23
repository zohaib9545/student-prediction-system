function safeAvg(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sum = arr.reduce((s, v) => s + Number(v || 0), 0);
  return sum / arr.length;
}

function calculatePerformance({ assignmentMarks, quizMarks, midtermMarks }) {
  const assignmentAvg = safeAvg(assignmentMarks);
  const quizAvg = safeAvg(quizMarks);
  const performanceScore = Number(
    (assignmentAvg * 0.2 + quizAvg * 0.2 + midtermMarks * 0.3).toFixed(2)
  );
  let predictedFinal = Number((performanceScore + midtermMarks * 0.3).toFixed(2));
  if (predictedFinal > 100) predictedFinal = 100;

  let level = 'Low';
  if (predictedFinal >= 75) level = 'High';
  else if (predictedFinal >= 50) level = 'Medium';

  return { assignmentAvg, quizAvg, performanceScore, predictedFinal, level };
}

function generateSuggestions({ assignmentAvg, quizAvg, midtermMarks, subject }) {
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
  if (suggestions.length === 0) suggestions.push(`Keep up the good work${subjText}. Maintain consistent study habits.`);
  return suggestions;
}

module.exports = { safeAvg, calculatePerformance, generateSuggestions };
