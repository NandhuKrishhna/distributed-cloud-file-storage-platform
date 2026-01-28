import jwt from "jsonwebtoken";
import crypto from "crypto";
const a = jwt.sign({name:"Nandhu"}, "secret" , { expiresIn: '1h' })
const b = jwt.sign({name:"Nanddhu"}, "secrssdet" )
console.log({jwt:a})


const isVerified = jwt.verify(a, "secret", (err, decoded) => {
    if (err) {
        console.log(err)
    } else {
        console.log(decoded)
    }
})


