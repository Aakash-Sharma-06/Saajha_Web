const dashboardController = require('../controllers/dashboardController');

module.exports = function dashboardRoutes(app, { requireAuth, models }) {
  app.get('/dashboard', requireAuth, (req, res, next) => dashboardController.renderDashboard(req, res, next, models));
  app.get('/activity', requireAuth, (req, res, next) => dashboardController.renderActivity(req, res, next, models));
};
