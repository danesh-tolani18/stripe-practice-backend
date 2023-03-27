const cors = require("cors")
const express = require("express")

const stripe = require("stripe")("sk_test_51MqFUqSIdzNyWzsLEXhQvDNw1LQHa0LHG1RkFOiNAvatpNZMXhNxTpbExElbfI1Lj0PYUPWWDlHIwQZP0beyFvRj00GqM3K3HG")
const uuid = require("uuid")


const app = express();


// middlewares
app.use(express.json()) 
app.use(cors())


// routes
app.get("/", (req, res) => {
    res.send("IT WORKS AT LEARNCODEONLINE")
})


app.post("/payment", (req, res) => {
    const {product, token} = req.body
    console.log("PRODUCT: ", product);
    console.log("PRICE: ", product.price);

    const idempontencykey = uuid()

    stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges({
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, {idempontencykey})
    })
    .then(result => res.status(200).json(result))
    .catch((err) => console.log(err))
})

// listen
app.listen(8282, () => {
    console.log("Listening at port 8282")
})
