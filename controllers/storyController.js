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

exports.renderAddStoryForm = (req, res) => {
  res.render('pages/stories/add-story', { title: 'नई कहानी जोड़ें', error: null, formData: {} });
};

exports.renderEditStoryForm = async (req, res, next, models) => {
  try {
    const { Story } = models;
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).render('pages/shared/404', { title: 'Not Found' });
    }

    res.render('pages/stories/add-story', {
      title: 'कहानी संपादित करें',
      error: null,
      formData: {
        title: story.title,
        summary: story.summary,
        transcript: story.transcript,
        category: story.category,
        audioUrl: story.audioUrl
      },
      isEdit: true,
      storyId: story._id
    });
  } catch (error) {
    next(error);
  }
};

exports.createStory = async (req, res, next, models) => {
  try {
    const { Story } = models;
    const { title, summary, transcript, category, audioUrl } = req.body;

    const trimmedTitle = (title || '').trim();
    const trimmedSummary = (summary || '').trim();
    const trimmedTranscript = (transcript || '').trim();
    const trimmedCategory = (category || '').trim();
    const trimmedAudioUrl = (audioUrl || '').trim();

    const allowedCategories = ['ज्ञानवर्धक', 'शिक्षाप्रद', 'लोककथा', 'पौराणिक', 'हास्य', 'अन्य', 'सामान्य', 'मजेदार'];

    if (!trimmedTitle || !trimmedSummary || !trimmedTranscript) {
      return res.render('pages/stories/add-story', {
        title: 'नई कहानी जोड़ें',
        error: 'कृपया शीर्षक, सारांश और पूरी कहानी भरें।',
        formData: { title, summary, transcript, category, audioUrl }
      });
    }

    if (!trimmedCategory || !allowedCategories.includes(trimmedCategory)) {
      return res.render('pages/stories/add-story', {
        title: 'नई कहानी जोड़ें',
        error: 'कृपया एक मान्य श्रेणी चुनें।',
        formData: { title, summary, transcript, category, audioUrl }
      });
    }

    if (trimmedAudioUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(trimmedAudioUrl);
      } catch (error) {
        return res.render('pages/stories/add-story', {
          title: 'नई कहानी जोड़ें',
          error: 'ऑडियो लिंक एक valid HTTP/HTTPS URL होना चाहिए।',
          formData: { title, summary, transcript, category, audioUrl }
        });
      }

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.render('pages/stories/add-story', {
          title: 'नई कहानी जोड़ें',
          error: 'ऑडियो लिंक एक valid HTTP/HTTPS URL होना चाहिए।',
          formData: { title, summary, transcript, category, audioUrl }
        });
      }
    }

    const newStory = await Story.create({
      title: trimmedTitle,
      summary: trimmedSummary,
      transcript: trimmedTranscript,
      category: trimmedCategory,
      audioUrl: trimmedAudioUrl || '/sample-audio.mp3'
    });

    res.redirect(`/stories/${newStory._id}`);
  } catch (error) {
    next(error);
  }
};

exports.updateStory = async (req, res, next, models) => {
  try {
    const { Story } = models;
    const { title, summary, transcript, category, audioUrl } = req.body;

    const trimmedTitle = (title || '').trim();
    const trimmedSummary = (summary || '').trim();
    const trimmedTranscript = (transcript || '').trim();
    const trimmedCategory = (category || '').trim();
    const trimmedAudioUrl = (audioUrl || '').trim();

    const allowedCategories = ['ज्ञानवर्धक', 'शिक्षाप्रद', 'लोककथा', 'पौराणिक', 'हास्य', 'अन्य', 'सामान्य', 'मजेदार'];

    if (!trimmedTitle || !trimmedSummary || !trimmedTranscript) {
      return res.render('pages/stories/add-story', {
        title: 'कहानी संपादित करें',
        error: 'कृपया शीर्षक, सारांश और पूरी कहानी भरें।',
        formData: { title, summary, transcript, category, audioUrl },
        isEdit: true,
        storyId: req.params.id
      });
    }

    if (!trimmedCategory || !allowedCategories.includes(trimmedCategory)) {
      return res.render('pages/stories/add-story', {
        title: 'कहानी संपादित करें',
        error: 'कृपया एक मान्य श्रेणी चुनें।',
        formData: { title, summary, transcript, category, audioUrl },
        isEdit: true,
        storyId: req.params.id
      });
    }

    if (trimmedAudioUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(trimmedAudioUrl);
      } catch (error) {
        return res.render('pages/stories/add-story', {
          title: 'कहानी संपादित करें',
          error: 'ऑडियो लिंक एक valid HTTP/HTTPS URL होना चाहिए।',
          formData: { title, summary, transcript, category, audioUrl },
          isEdit: true,
          storyId: req.params.id
        });
      }

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.render('pages/stories/add-story', {
          title: 'कहानी संपादित करें',
          error: 'ऑडियो लिंक एक valid HTTP/HTTPS URL होना चाहिए।',
          formData: { title, summary, transcript, category, audioUrl },
          isEdit: true,
          storyId: req.params.id
        });
      }
    }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      {
        title: trimmedTitle,
        summary: trimmedSummary,
        transcript: trimmedTranscript,
        category: trimmedCategory,
        audioUrl: trimmedAudioUrl || '/sample-audio.mp3'
      },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).render('pages/shared/404', { title: 'Not Found' });
    }

    res.redirect(`/stories/${updatedStory._id}`);
  } catch (error) {
    next(error);
  }
};
