import express from "express";
import 'dotenv/config';
import webRouters from "./routers/web";
// import getConnection from "./config/config";
import initDatabase from "./config/seed";
import passport from "passport";
import configPassportLocal from "./middleware/passportLocal";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 1080;

// config view engine 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
//config req.body 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// config static files ( image , css ,js )
app.use(express.static('public')) ;

// config session 
app.use(session({
  secret : "aaaaaa" ,
  resave : false ,
  saveUninitialized : true
}))

// config passport
app.use(passport.initialize()) ;
app.use(passport.authenticate('session'))
configPassportLocal(  )

// config routers
webRouters(app);

// seeding data 
initDatabase()

// handle 404 not found (middleware)
app.use((req , res) => {
  res.send("404 Not Found")
})

app.listen(PORT, () => {
  console.log(`lang nghe tai ssss http://localhost:${PORT}`)

});
