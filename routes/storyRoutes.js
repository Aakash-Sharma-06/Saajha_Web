const storyController = require('../controllers/storyController');

module.exports = function storyRoutes(app, { requireAuth, requireHost, logActivity, models }) {
  app.get('/stories', requireAuth, (req, res, next) => storyController.renderStories(req, res, next, models, logActivity));
  app.get('/stories/new', requireAuth, requireHost, (req, res) => storyController.renderAddStoryForm(req, res));
  app.post('/stories/new', requireAuth, requireHost, (req, res, next) => storyController.createStory(req, res, next, models));
  app.get('/stories/:id/edit', requireAuth, requireHost, (req, res, next) => storyController.renderEditStoryForm(req, res, next, models));
  app.post('/stories/:id/edit', requireAuth, requireHost, (req, res, next) => storyController.updateStory(req, res, next, models));
  app.get('/stories/:id', requireAuth, (req, res, next) => storyController.renderStoryDetail(req, res, next, models, logActivity));
  app.post('/stories/:id/play', requireAuth, (req, res, next) => storyController.playStory(req, res, next, models, logActivity));
};
