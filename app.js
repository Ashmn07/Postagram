const express =require('express');
const app = express();
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/keys');

require('./models/user');
require('./models/post');

app.use(express.json())
app.use(require('./routes/auth'));
app.use(require('./routes/posting'))
app.use(require('./routes/users'))

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected",()=>{
    console.log("Connected to mongo yeahhh");
})
mongoose.connection.on("error",()=>{
    console.log("err connecting",err);
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("Server is running",PORT);
})