const express = require('express');
const router = express.Router();
const { upgradeTenant } = require('../controllers/tenantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:slug/upgrade').post(protect, admin, upgradeTenant);

module.exports = router;