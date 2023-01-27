const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ngoRoutes = require('./routes/app-routes');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KONECT API",
            version: "1.0.0",
            description: "A simple API for an NGO Application"
        },
        servers: [
            {
                url: "http://localhost:3050"
            }
        ]
    },
    apis:["./routes/*.js"]
}
const specs = swaggerDoc(options)
const app = express();
const port = process.env.PORT || '3050';

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    // origin: 'http://localhost:3000',
    origin: '*',
}))

app.use('/ngo',ngoRoutes)


app.get('/', (req, res) => {
    res.send("it works lol.")
})

app.listen(port, () => {
    console.log("server started with port", port)
})