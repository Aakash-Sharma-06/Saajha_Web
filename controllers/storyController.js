exports.renderStories = async (req, res, next, models, logActivity) => {
  try {
    const { Story } = models;
    const search = req.query.q || '';
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const stories = await Story.find(query).sort({ createdAt: -1 });

    await logActivity(req.session.user._id, 'Opening the Stories section', `Searched: ${search || 'all'}`);
    res.render('pages/stories/stories', { title: 'कहानियाँ', stories, search });
  } catch (error) {
    next(error);
  }
};

exports.renderStoryDetail = async (req, res, next, models, logActivity) => {
  try {
    const { Story } = models;
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).render('pages/shared/404', { title: 'Not Found' });
    }

    await logActivity(req.session.user._id, 'Reading a story', story.title);
    res.render('pages/stories/story-detail', { title: story.title, story });
  } catch (error) {
    next(error);
  }
};

exports.playStory = async (req, res, next, models, logActivity) => {
  try {
    const { Story } = models;
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    await logActivity(req.session.user._id, 'Playing story audio', story.title);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};
