exports.renderMath = async (req, res, next, models, logActivity) => {
  try {
    const { MathQuestion } = models;
    const categories = await MathQuestion.distinct('category');
    const difficulties = await MathQuestion.distinct('difficulty');
    const classLevels = await MathQuestion.distinct('classLevel');

    await logActivity(req.session.user._id, 'Opening the Math section', 'Viewed math practice options');
    res.render('pages/math/math', { title: 'गणित अभ्यास', categories, difficulties, classLevels });
  } catch (error) {
    next(error);
  }
};

exports.renderQuiz = async (req, res, next, models, logActivity) => {
  try {
    const { MathQuestion } = models;
    const { category, difficulty, classLevel } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (classLevel) filter.classLevel = classLevel;

    let questions = await MathQuestion.find(filter);
    if (questions.length < 5) {
      questions = await MathQuestion.find({});
    }

    const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
    await logActivity(req.session.user._id, 'Starting a quiz', `${selectedQuestions.length} questions selected`);

    res.render('pages/math/quiz', { title: 'क्विज़', questions: selectedQuestions, filter: { category, difficulty, classLevel } });
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next, models, logActivity) => {
  try {
    const { MathQuestion } = models;
    const submittedAnswers = req.body;
    const questionIds = Object.keys(submittedAnswers).filter((key) => key.startsWith('answer-'));
    const questions = await MathQuestion.find({ _id: { $in: questionIds.map((id) => id.replace('answer-', '')) } });

    let score = 0;
    const results = questions.map((question) => {
      const answerKey = `answer-${question._id}`;
      const selected = submittedAnswers[answerKey];
      const isCorrect = selected === question.correctAnswer;
      if (isCorrect) score += 1;
      return { question, selected, isCorrect };
    });

    let badge = '🌱 शुरुआत';
    if (score >= 4) badge = '🏅 उत्कृष्टता';
    else if (score >= 3) badge = '⭐ अच्छा प्रयास';

    await logActivity(req.session.user._id, 'Submitting a quiz', `Score: ${score}/${results.length}`);
    res.render('pages/math/result', { title: 'परिणाम', score, total: results.length, badge, results });
  } catch (error) {
    next(error);
  }
};
