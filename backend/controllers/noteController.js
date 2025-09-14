const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

const FREE_PLAN_NOTE_LIMIT = 3;

const getNotes = async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
  res.json(notes);
};

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const tenant = await Tenant.findById(req.user.tenantId);
  if (tenant.plan === 'FREE') {
    const noteCount = await Note.countDocuments({ tenantId: req.user.tenantId });
    if (noteCount >= FREE_PLAN_NOTE_LIMIT) {
      return res.status(403).json({ message: 'Note limit reached. Please upgrade.' });
    }
  }
  const note = await Note.create({ title, content, userId: req.user._id, tenantId: req.user.tenantId });
  res.status(201).json(note);
};

const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  if (note.tenantId.toString() !== req.user.tenantId.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  await note.deleteOne();
  res.json({ message: 'Note removed' });
};

module.exports = { getNotes, createNote, deleteNote };