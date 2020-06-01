const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcrypt');

module.exports = function(passport,client, nazivMongoBaze) {

  
    passport.use(new LocalStrategy(

      function(username, password, done) {       

        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(err1,result){

            if(err1) { return done(err1); }

            if(result.length == 0){ return done(null,false, {message:"Neispravni pristupni podaci!"}); }

            else{
                //Ovaj dio ispod VRATITI
                /* bcrypt.compare(password, result[0].password, function(err, res) {
                  // res == true
                  if(res == true) return done(null, result[0]);
                  else return done(null,false, {message:"Neispravni pristupni podaci!"});
                });  */
                if(password == result[0].password) { return done(null,result[0]); }
                else { return done(null,false, {message:"Neispravni pristupni podaci!"}); }
            }                
            
        });       
      }
    ));

    passport.serializeUser(function(user, done) {
      
      done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
 
         client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(err1,result){

            if(err1) { done(err1,null); }

            else{ done(err1, result[0]) }
        });     
     });
};