const mathController = require('../controllers/mathController');

module.exports = function mathRoutes(app, { requireAuth, logActivity, models }) {
  app.get('/math', requireAuth, (req, res, next) => mathController.renderMath(req, res, next, models, logActivity));
  app.get('/math/quiz', requireAuth, (req, res, next) => mathController.renderQuiz(req, res, next, models, logActivity));
  app.post('/math/quiz/submit', requireAuth, (req, res, next) => mathController.submitQuiz(req, res, next, models, logActivity));
};
