const Tenant = require('../models/Tenant');

const upgradeTenant = async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug, _id: req.user.tenantId });
  if (tenant) {
    tenant.plan = 'PRO';
    await tenant.save();
    res.json({ message: `Tenant ${tenant.name} upgraded to PRO plan.` });
  } else {
    res.status(404).json({ message: 'Tenant not found or access denied' });
  }
};

module.exports = { upgradeTenant };