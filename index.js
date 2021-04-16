const express = require( 'express' );

const fs = require( 'fs' );
const path = require( 'path' );
const React = require( 'react' );

const sqlliteDB = require('./db.js');
const cache = require('./cache.js');
const hCart = require('./hcart.js');
const {respondHTML} = require('./utility.js');


global.React = React;
const hCardComponent = require('./public/main.js').default;

const app = express();
const db = sqlliteDB();
const userCache = cache(db);
const cart = hCart(db, userCache);
// load `index.html` file
const indexHTML = fs.readFileSync( path.resolve( __dirname, './public/index.html' ), {
  encoding: 'utf8',
} );

app.use(express.urlencoded({
  extended: true
}));

app.use( (req, res, next) => {
  //simulate get user id
  req.userId = (() => {
    return 'userId';
  })();
  next();
});

app.use((req, res, next) => {
  req.hCardComponent = hCardComponent;
  req.indexHTML = indexHTML;
  next();
});

// serve static assets
app.get( /\.(js|css|png)$/, express.static( path.resolve( __dirname, './public/' ) ) );

app.post('/update', cart.update, respondHTML);

app.post('/submit', cart.submit, respondHTML);

// for any other requests, send `index.html` as a response
app.get( '*', cart.current, respondHTML);

// run express server on port 9000
const server = app.listen( '9000', () => {
    console.log( 'Express server started at http://localhost:9000' );
} );


process.on('SIGINT', () => {
  console.log('quit');
  // saveCacheToDB is async
  userCache.saveCacheToDB();
  // todo: db shouldn't be closed before cache data is written to DB
  db.close();
  server.close();
});