const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const storyRoutes = require('./storyRoutes');
const mathRoutes = require('./mathRoutes');

module.exports = function registerRoutes(app, deps) {
  authRoutes(app, deps);
  dashboardRoutes(app, deps);
  storyRoutes(app, deps);
  mathRoutes(app, deps);
};
