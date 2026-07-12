exports.renderDashboard = async (req, res, next, models) => {
  try {
    const { ActivityLog, Story, MathQuestion, User } = models;
    const isHost = req.session.user.role === 'host';
    const searchTerm = (req.query.search || '').trim();
    let recentActivities = [];
    let selectedStudent = null;

    if (isHost) {
      if (searchTerm) {
        selectedStudent = await User.findOne({
          role: 'student',
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } }
          ]
        });

        if (selectedStudent) {
          recentActivities = await ActivityLog.find({ user: selectedStudent._id }).sort({ createdAt: -1 }).limit(12);
        }
      }
    } else {
      recentActivities = await ActivityLog.find({ user: req.session.user._id }).sort({ createdAt: -1 }).limit(8);
    }

    const storyCount = await Story.countDocuments();
    const questionCount = await MathQuestion.countDocuments();

    res.render('pages/dashboard/dashboard', {
      title: 'डैशबोर्ड',
      storyCount,
      questionCount,
      recentActivities,
      isHost,
      searchTerm,
      selectedStudent
    });
  } catch (error) {
    next(error);
  }
};

exports.renderActivity = async (req, res, next, models) => {
  try {
    const { ActivityLog } = models;
    const activities = await ActivityLog.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('pages/dashboard/activity', { title: 'गतिविधि', activities });
  } catch (error) {
    next(error);
  }
};
