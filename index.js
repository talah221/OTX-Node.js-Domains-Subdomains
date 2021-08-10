const express = require('express')
const app = express()
const http = require('http').createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


const otxRoutes = require('./api/otx.routes')
app.use('/api/otx', otxRoutes)


const port = process.env.PORT || 3030;
http.listen(port, () => {
    console.log('| SERVER | Running on port: ' + port)
});
