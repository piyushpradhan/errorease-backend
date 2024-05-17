import passport from "passport";
import dotenv from "dotenv";
import { Strategy } from "passport-github2";

dotenv.config();

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(obj, done) {
  // TODO: Deserialize user using the database schema
  // try {
  //   const findUser = await DiscordUser.findById(id);
  //   return findUser ? done(null, findUser) : done(null, null);
  // } catch (err) {
  //   done(err, null);
  // }
  done(null, obj as Express.User);
});

export default passport.use(new Strategy({
  clientID: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackURL: "https://errorease.vercel.app/api/auth/callback/github"
}, function(accessToken: string, refreshToken: string, profile: any, done: any) {
  process.nextTick(function() {
    return done(null, profile)
  })
}))

