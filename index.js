const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const edge = require("edge.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectFlash = require("connect-flash");
const logoutController = require("./controllers/logout");
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const connectMongo = require('connect-mongo');

const app = new express();

mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,})
    .then(() => 'You are now connected to MongoDB!')
    .catch(err => console.error('Something went wrong', err))
 
app.use(connectFlash()); 

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
        mongooseConnection: mongoose.connection
        })
    }));
   
app.use(fileUpload());
app.use(express.static('public'));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
    
}));

const storePost = require('./middleware/storePost');
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

app.use('/posts/store', storePost)
 
app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", createPostController);
app.post("/posts/store", storePostController);
app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);
app.get("/auth/register", createUserController);
app.post("/users/register", storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);


app.listen(4000, () => {
    console.log('App listening on port 4000')
});
