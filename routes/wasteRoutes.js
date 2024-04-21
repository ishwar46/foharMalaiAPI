const router = require("express").Router()
const WasteController = require("../controllers/wasteController")
const Waste = require("../model/WasteModel")

router.post('/create_waste_product', WasteController.createWasteProduct)
router.get('/waste_product/:id', WasteController.getSingleWasteProduct)
router.get('/all_waste_product', WasteController.getAllWasteProducts)

module.exports = router
