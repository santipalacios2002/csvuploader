const router = require('express').Router();

const fileRoutes = require('./upload-route');

router.use('/file', fileRoutes);

module.exports = router;