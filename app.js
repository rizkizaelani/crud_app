var express = require('express')
var app = express()

var mysql = require('mysql')

var myConnection = require('express-myconnection')

var config = require('./config')
var dbOptions = {
	host:		config.database.host,
	user:		config.database.user,
	password:	config.database.password,
	port:		config.database.port, 
	database:	config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))

//Template app
app.set('view engine', 'ejs')

//Route url
var index = require('./routes/index')
var users = require('./routes/users')

//Validasi Form
var expressValidator = require('express-validator')
app.use(expressValidator())

//Read HTTP POST data
var bodyParser = require('body-parser')

//url encoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//use HTTP such DELETE or PUT
var methodOverride = require('method-override')

//using custom logic for override method
app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method
		delete req.body._method
		return method
	}
}))

//show flash messages for success or error messages
//and store in session
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
 
app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


app.use('/', index)
app.use('/users', users)

app.listen(4300, function(){
	console.log('Server running at port 4300: http://127.0.0.1:4300')
})


//This is test for git