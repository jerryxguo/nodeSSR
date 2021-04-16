const sqlite3 = require( 'sqlite3' );
const HCARD_TABLE_NAME = 'hcart';

// assume the user can be identified by userId, thus mutiple users can use the app simulteniously  
const sqlliteDB = () => {
  const db =  new sqlite3.Database('./hcart.db', (err) => {
    if (err) {
      console.log(err.message);
    } else {
      db.run(`
        CREATE TABLE  ${HCARD_TABLE_NAME}( \
        userId NVARCHAR(20) PRIMARY KEY NOT NULL,\
        givenName NVARCHAR(20),\
        surname NVARCHAR(20),\
        email NVARCHAR(20),\
        phone NVARCHAR(20),\
        houseNumber NVARCHAR(20),\
        street NVARCHAR(20),\
        suburb NVARCHAR(20),\
        state NVARCHAR(20),\
        postcode NVARCHAR(20),\
        country NVARCHAR(20)
      )`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
  const saveDB = async (userId, hcart) => {
    const commandString = `INSERT OR REPLACE INTO ${HCARD_TABLE_NAME} (userId, givenName, surname, email, phone,  houseNumber,
      street, suburb, state, postcode, country) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    const writeData = () => {
      return new Promise(function(resolve, reject) {
        db.run(commandString, [
          userId, hcart.givenName, hcart.surname, hcart.email, hcart.phone, hcart.houseNumber,
          hcart.street, hcart.suburb, hcart.state, hcart.postcode, hcart.country
        ], function(err, data) {
            if (err !== null) reject(err);
            else resolve(data);
        });
      });
    }
    const result = await writeData();
    return result;
  };

  const getDB = async (userId) => {
    const queryString = `SELECT * FROM ${HCARD_TABLE_NAME} WHERE userId = "${userId}"`;
    const getData = () => {
      return new Promise(function(resolve, reject) {
        db.all(queryString, function(err, data) {
          if (err !== null) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
    const data = await getData();
    return data;
  };
  
  const close = () => {
    console.log('db close');
    db.close();
  }

  return {
    saveDB,
    getDB,
    close,
  };
};

module.exports = sqlliteDB;