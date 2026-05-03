import Template from '../models/Template.js';

// @desc    Get all templates (with optional category filter)
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single template by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      res.status(404);
      throw new Error('Template not found');
    }
    res.json(template);
  } catch (error) {
    next(error);
  }
};
