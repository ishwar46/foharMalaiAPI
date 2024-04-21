const router = require("express").Router()
const WasteController = require("../controllers/wasteController")
const Waste = require("../model/WasteModel")

router.post('/create_waste_product', WasteController.createWasteProduct)
router.get('/waste_product/:id', WasteController.getSingleWasteProduct)
router.get('/all_waste_product', WasteController.getAllWasteProducts)
router.put('/update_waste_product/:waste_id', WasteController.updateWasteProduct)
router.delete('/delete/:id', WasteController.deleteWasteProduct)

module.exports = router
