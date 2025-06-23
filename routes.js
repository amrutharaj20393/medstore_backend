const express = require('express')

const route = new express.Router()
const userController = require('./controller/userController')
const medicineController = require('./controller/medicineController')
const jwtMiddleware = require('./middleware/jwtMiddlware')

route.post('/register', userController.registerController)

//path for login
route.post('/login', userController.loginController)

//path for google login
route.post('/Google-login', userController.googleLoginController)
//user----------------------------------------------------------
route.get('/all-medcines-home',medicineController.getHomeMedicineContoller)

route.get('/get-all-medicines',jwtMiddleware,medicineController.getAllMedicineController)

route.get('/get-amedicine/:id',medicineController.getAMedicineController)

//path to add cart
route.put('/cart',jwtMiddleware,medicineController.addtoCartController)

//path to get cartlist
route.get('/get-cartmedicine',jwtMiddleware,medicineController.getacartController)

//path to emptycart
route.put('/cart',jwtMiddleware,medicineController.addtoCartController)

route.put('/make-payment',jwtMiddleware,medicineController.makePaymentController)
//all order list
route.get('/get-ordermedicine',medicineController.getMedicineOrderController)

//admin--------------------------------------
//path to add medicine by admin
route.post('/add-medicne-admin', jwtMiddleware, medicineController.addMedicineController)

route.get('/get-all-medicines-admin',jwtMiddleware,medicineController.getAllMedicineAdminController)

//edit medicine path
route.put('/edit-medicine',medicineController.editMedicineController)

//path to delete medicine
route.delete('/delete-medicine/:id',medicineController.deleteMedicineController)

//path to get all users
route.get('/get-all-userdet-admin',jwtMiddleware,userController.getAllUserAdminController)

module.exports = route