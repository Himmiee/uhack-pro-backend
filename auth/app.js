const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user-route');
const postRoutes = require('./routes/posts')
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
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(cors({
  
    origin: '*',
}))
app.use('/users',userRoutes)
app.use('/posts',postRoutes)



app.get('/', (req, res) => {
    res.send("works lola")
})



app.listen(port, (err) => {
    if (err) {
        console.log("err", err);
    } else {
        console.log("listening", port);
    }
})