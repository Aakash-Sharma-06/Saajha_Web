const bcrypt = require('bcryptjs');

exports.renderLanding = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('pages/auth/landing', { title: 'Saajha Learning Portal' });
};

exports.renderLogin = (req, res) => {
  res.render('pages/auth/login', { title: 'लॉगिन' });
};

exports.login = async (req, res, next, models, logActivity) => {
  try {
    const { User } = models;
    const { emailOrPhone, password, role } = req.body;
    const identifier = (emailOrPhone || '').trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.render('pages/auth/login', { title: 'लॉगिन', error: 'उपयोगकर्ता नहीं मिला।' });
    }

    if (user.role !== (role || 'student')) {
      return res.render('pages/auth/login', { title: 'लॉगिन', error: 'यह अकाउंट इस भूमिका से मेल नहीं खाता।' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('pages/auth/login', { title: 'लॉगिन', error: 'पासवर्ड गलत है।' });
    }

    req.session.user = { _id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role };
    await logActivity(user._id, 'Login', `${user.role === 'host' ? 'Host' : 'Student'} logged in successfully`);
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

exports.renderRegister = (req, res) => {
  res.render('pages/auth/register', { title: 'रजिस्टर' });
};

exports.register = async (req, res, next, models, logActivity) => {
  try {
    const { User } = models;
    const { name, email, phone, password, role } = req.body;
    const normalizedEmail = (email || '').toLowerCase();
    const normalizedPhone = (phone || '').trim();
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])]
    });

    if (existingUser) {
      return res.render('pages/auth/register', { title: 'रजिस्टर', error: 'यह ईमेल या फोन पहले से उपयोग में है।' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      role: role || 'student',
      password: hashedPassword
    });

    req.session.user = { _id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role };
    await logActivity(user._id, 'Login', `Account created and ${user.role === 'host' ? 'host' : 'student'} signed in`);
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next, logActivity) => {
  try {
    await logActivity(req.session.user._id, 'Logout', 'User logged out');
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } catch (error) {
    next(error);
  }
};
