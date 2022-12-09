import express from 'express'
import applicataionErrors from './controllers/errorHandleController.js'
import productRoute from './routes/productRoutes.js'
import userRoute from './routes/userRoutes.js'
import { rateLimit } from 'express-rate-limit'

const app = express()

const limit = rateLimit({
    max: 100,
    windowMs: 1000,
    message: 'Overloaded with requests from an IP.'
})

app.use('/api', limit)
// Try doing forgot password

app.use(express.json()) // body parser
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/api/v1/product', productRoute)
app.use('/api/v1/user', userRoute)
app.use(applicataionErrors)

export default app

// rate limiting
// Web sockets

// client (trigger) --> http req --> server 
             // <--  response (data)  <--- (one way communication)
             // closed
             // --> http req 

// client (computer)  --> http --> 1 server (stateless phase)
// 1 --> server (user details)
    //  closed
// 2 --> http --> server (id user)
    // closed

// security purpose
// abc company 
// 1000 users ---> 1 server 
// 10000 users ---> 1 server
// 100000 ---> (recommended 3 servers) 1 server
// vertical scaling (Incre CPU/Memory) 
// horizontal scaling (Increase the number of servers)
// A  ---> load balancer --> 20 servers 25
// 3
// 8 
// CPU max out // Memory maxes out 
// websockets
// 20000 --> http --> 6
 // <--- ws  ----> 6
 // Not closed. 