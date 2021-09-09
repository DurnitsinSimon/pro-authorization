const passport = require('passport')

const GoogleStategy = require('passport-google-oauth2').Strategy

passport.use('google',new GoogleStategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    (req, accessToken, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})