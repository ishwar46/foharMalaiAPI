const router = require("express").Router()
const WasteController = require("../controllers/wasteController")

router.post('/create', WasteController.createProduct)

module.exports = router
