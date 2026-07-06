const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analytics.controllers'); 
const auth = require("../middlewares/auth");

// Definimos la ruta GET para las estadísticas
router.get('/', auth, getAnalytics);

module.exports = router;