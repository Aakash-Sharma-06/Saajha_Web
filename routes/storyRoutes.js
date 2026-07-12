const storyController = require('../controllers/storyController');

module.exports = function storyRoutes(app, { requireAuth, logActivity, models }) {
  app.get('/stories', requireAuth, (req, res, next) => storyController.renderStories(req, res, next, models, logActivity));
  app.get('/stories/:id', requireAuth, (req, res, next) => storyController.renderStoryDetail(req, res, next, models, logActivity));
  app.post('/stories/:id/play', requireAuth, (req, res, next) => storyController.playStory(req, res, next, models, logActivity));
};
