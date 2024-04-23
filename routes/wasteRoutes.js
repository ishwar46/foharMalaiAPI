const router = require("express").Router()
const WasteController = require("../controllers/wasteController")
const { authGuardAdmin, authGuard } = require("../middleware/authGuard")
const Waste = require("../model/WasteModel")

router.post('/create_waste_product', authGuardAdmin, WasteController.createWasteProduct)
router.get('/waste_product/:id', authGuard, WasteController.getSingleWasteProduct)
router.get('/all_waste_product', authGuard, WasteController.getAllWasteProducts)
router.put('/update_waste_product/:waste_id', authGuardAdmin, WasteController.updateWasteProduct)
router.delete('/delete/:id', authGuardAdmin, WasteController.deleteWasteProduct)

module.exports = router
