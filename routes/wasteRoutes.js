const router = require("express").Router()
const WasteController = require("../controllers/wasteController")
const { authGuardAdmin, authGuard } = require("../middleware/authGuard")
const Waste = require("../model/WasteModel")


//Create Waste Produts
router.post('/create_waste_product', authGuardAdmin, WasteController.createWasteProduct)

//Get single Produts
router.get('/waste_product/:id', WasteController.getSingleWasteProduct)

//Get all Produts
router.get('/all_waste_product', WasteController.getAllWasteProducts)

//Update Waste Produts
router.put('/update_waste_product/:waste_id', authGuardAdmin, WasteController.updateWasteProduct)

//Delete Waste Produts
router.delete('/delete/:id', authGuardAdmin, WasteController.deleteWasteProduct)

module.exports = router
