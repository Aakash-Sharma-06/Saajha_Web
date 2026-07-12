const authController = require('../controllers/authController');

module.exports = function authRoutes(app, { requireAuth, logActivity, models }) {
  app.get('/', authController.renderLanding);
  app.get('/login', authController.renderLogin);
  app.post('/login', (req, res, next) => authController.login(req, res, next, models, logActivity));
  app.get('/register', authController.renderRegister);
  app.post('/register', (req, res, next) => authController.register(req, res, next, models, logActivity));
  app.get('/logout', requireAuth, (req, res, next) => authController.logout(req, res, next, logActivity));
};
