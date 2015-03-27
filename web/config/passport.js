// load required modules
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

// load models
var User = require(path.join(__dirname, '../models/user'));

// expose function to configure an instance of the passport module properly
module.exports = function(passport) {

  // passport session setup ===================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of a session

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  // local register ===========================================================
  // ('local' is used to distinguish from oauth registration)
  passport.use(
    'local-register',
    new LocalStrategy(
      {
        usernameField: 'email', // override username with email
        passwordField: 'password',
        passReqToCallback: true // allow us to pass the entire request to the
                                // callback
      },
      function(req, email, password, done){
        console.log('in passport handler');
        // process.nextTick is used to allow for any async operations
        // LocalStrategy might have, esp since calls to database are all async
        process.nextTick(function(){
          User.findOne({'local.email': email}, function(err, user){
            if(err){
              return done(err);
            }

            // check if a user with that email already exists
            if(user){
              return done(null, false, req.flash('registerMessage',
                'That email is already taken.'));
            } else {
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);

              console.log("about to save");
              newUser.save(function(err){
                if(err){
                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};
