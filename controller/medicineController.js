const medicines = require("../model/medicinemodel")
const users = require("../model/usermodel")
const stripe = require('stripe')('sk_test_51RSxz22LjIoQ1c2H6yVtyvIwv1PtlVO1yqkVIjwqEaa8ssQQprsEy1PnstUWkjTx4jeSmUlYJ2TtUfVscK74JVND00e61U3ItQ')


exports.addMedicineController = async (req, res) => {

    console.log(req.body)
    console.log(req.file)
    const { Medname, price, stock, brandname, status, category, description, brought } = req.body
    let imageurl = ""
    imageurl = req.file.filename
    try {

        const existingMedicine = await medicines.findOne({ Medname })
        if (existingMedicine) {
            res.status(400).json("Medicine already added")
        }
        else {
            const newMedicine = new medicines({
                Medname, price, stock, imageurl, brandname, status, category, description, brought
            })
            await newMedicine.save()
            res.status(200).json(newMedicine)
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get home books
exports.getHomeMedicineContoller = async (req, res) => {
    try {
        const allMedicines = await medicines.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allMedicines)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all med
exports.getAllMedicineController = async (req, res) => {
    console.log(req.query)
    const searchkey = req.query.search



    try {
        const query = {
            Medname: {
                $regex: searchkey, $options: "i"
            }



        }
        const allMedicines = await medicines.find(query)
        res.status(200).json(allMedicines)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to get a particullar medicine

exports.getAMedicineController = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(id)
        const amedicine = await medicines.findOne({ _id: id })
        res.status(200).json(amedicine)


    } catch (error) {
        res.status(500).json(error)
    }

}


//---------------------admin
//to get all medicines
exports.getAllMedicineAdminController = async (req, res) => {


    try {

        const allMedicinesAdmin = await medicines.find()
        res.status(200).json(allMedicinesAdmin)

    } catch (error) {
        res.status(500).json(error)
    }
}
//edit a medicine
exports.editMedicineController = async (req, res) => {
    const { _id, Medname, price, stock, brandname, category, description, brought } = req.body
    console.log(_id, Medname, price, stock, brandname, category, description, brought)

    try {

        const existingMedcine = await medicines.findByIdAndUpdate({ _id }, {
            _id,
            Medname, price, stock, brandname, status: "", category, description, brought
        })

        await existingMedcine.save()
        res.status(200).json(existingMedcine)
    } catch (error) {
        res.status(500).json(error)
    }
}

//delete a medicine
exports.deleteMedicineController = async (req, res) => {
    const { id } = req.params
    try {

        await medicines.findByIdAndDelete({ _id: id })
        res.status(200).json('deleted')
    }
    catch (error) {
        res.status(500).jsone(error)
    }
}

//add to cart status updation
exports.addtoCartController = async (req, res) => {
    const email = req.payload
    const { _id, Medname, price, stock, imageurl, brandname, status, category, description, brought } = req.body

    console.log(_id, Medname, price, stock, imageurl, brandname, status, category, description, brought)
    //console.log(quantity)

    try {
        const existAddtocartMedicine = await medicines.find({ _id, status: "Addedtocart", brought: email })
        console.log(existAddtocartMedicine)
        if (existAddtocartMedicine.length == 0) {
            console.log('hai')
            const existingMedicine = await medicines.findByIdAndUpdate
            ({ _id }, {
                _id, Medname, price, stock, imageurl, brandname, status: "Addedtocart", category, description, brought: email
            }, { new: true })
            await existingMedicine.save()
            res.status(200).json(existingMedicine)

        }
        else {
            res.status(404).json("Already Added to cart")

        }





    } catch (error) {
        res.status(500).json(error)
    }
}

//get cart list

exports.getacartController = async (req, res) => {

    const email = req.payload
    console.log(email)
    try {

        console.log("inside cart")
        const allMedicineToCart = await medicines.find({ status: "Addedtocart", brought: email })
        console.log(allMedicineToCart)
        if (allMedicineToCart.length == 0) {
            ///console.log("inside 401")
            res.status(401).json('no data')
        } else {
            //console.log("inside 200")
            res.status(200).json({ cartItems: allMedicineToCart })
        }


    } catch (error) {
        res.status(500).json(error)
    }
}

//payment controller
exports.makePaymentController = async (req, res) => {
    const { medDetails, quantity } = req.body

    // console.log("inside payment")
    /// console.log(medDetails)
    console.log(quantity)
    const email = req.payload
    console.log(email)
    try {

        const soldmed = await medicines.findOne({ status: "sold", brought: email, _id: medDetails._id })
        {
            console.log(soldmed)
            if (soldmed) {
               const quan = soldmed.quantity + quantity

               
                 const existingMed = await medicines.findByIdAndUpdate({ _id: medDetails._id },
                    {
                        Medname: medDetails.Medname,
                        price: medDetails.price,
                        stock: medDetails.stock - quantity,
                        imageurl: medDetails.imageurl,
                        brandname: medDetails.brandname,
                        status: 'sold',
                        description: medDetails.description,
                        brought: email,
                        quantity: quan
                    }, { new: true }
                )
            }
            else {
                console.log("hai")
                const existingMed = await medicines.findByIdAndUpdate({ _id: medDetails._id },
                    {
                        Medname: medDetails.Medname,
                        price: medDetails.price,
                        stock: medDetails.stock - quantity,
                        imageurl: medDetails.imageurl,
                        brandname: medDetails.brandname,
                        status: 'sold',
                        description: medDetails.description,
                        brought: email,
                        quantity: quantity
                    }, { new: true }
                )
            }

        }



        //create stripe check out session
        const line_item = [{

            price_data: {
                currency: "usd",
                product_data: {
                    name: medDetails.Medname,
                    description: medDetails.brandname,
                    images: [medDetails.imageurl],
                    metadata: {
                        Medname: medDetails.Medname,
                        price: `${medDetails.price}`,
                        stock: `${medDetails.stock}`,
                        imageurl: medDetails.imageurl,
                        brandname: medDetails.brandname,
                        status: 'sold',
                        description: medDetails.description,
                        brought: email
                    }
                },
                unit_amount: Math.round(medDetails.price * 100)//cents to us dollar
            },
            quantity: 1

        }]
        console.log(line_item)

        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            //purchase using card
            payment_method_types: ["card"],
            //details of product that is buying
            line_items: line_item,
            mode: 'payment',
            success_url: "https://medstore-frontend-3zz5.vercel.app/payment-succcess",
            cancel_url: "https://medstore-frontend-3zz5.vercel.app/payment-error"
            ///success_url: "http://localhost:5173/payment-succcess",
            ///cancel_url: "http://localhost:5173/payment-error"
        });


        //https://medstore-frontend-o7dr.vercel.app/

        //  success_url: "http://localhost:5173/payment-succcess",
        //  cancel_url: "http://localhost:5173/payment-error"


        console.log(session)
          res.status(200).json({ url: session.url }); 
        //res.status(200).json({ sessionId: session.id })
    } catch (error) {
        res.status(500).json(error)
    }

}

exports.getMedicineOrderController = async (req, res) => {
    const email = req.payload
    console.log(email)
    try {

        const allMedicineOrder = await medicines.find({ status: "sold", brought: email })
        console.log(allMedicineOrder)
        res.status(200).json(allMedicineOrder)

    } catch (error) {
        res.status(500).json(error)
    }
}
//orderlist for admin

exports.getMedicineOrderAdminController = async (req, res) => {

    try {

        const allMedicineOrder = await medicines.find({ status: "sold" })
        console.log(allMedicineOrder)
        res.status(200).json(allMedicineOrder)

    } catch (error) {
        res.status(500).json(error)
    }
}

