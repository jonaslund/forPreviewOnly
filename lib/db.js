/*
 * DB Module.
 */
var db;
var hostname = require("os").hostname();
var mysql = require('mysql'),
    dbhost = "localhost",
    dbuser = "previewer",
    dbpassword = "OOkhfs84LLozPjfO",
    dbdatabase = "forPreviewOnly";

    if(hostname === "airbiz.local") {
      dbuser = "root";
      dbpassword = "";
      dbdatabase = "lima";
    }

    var pool  = mysql.createPool({
      host     : dbhost,
      user     : dbuser,
      password : dbpassword,
      database: dbdatabase
    });


exports.query = function(qry, values, callback) {
  
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(qry, values, function(err, results, fields) {
      // And done with the connection.
      connection.release();
      //console.log(err, results, fields);

      if(err) {
        console.log(err);
      }

      if(results instanceof Array) {
        if(results.length > 0) {
          callback(results);
        } else {
          callback(null);
        }
      
      } else {  
        callback(results);
      }

      // Don't use the connection here, it has been returned to the pool.
    });
  });      

};
