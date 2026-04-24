const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const supabase = require('./supabaseClient');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        // If not found in DB due to sync issues but user object was valid recently, we could mock or fail.
        // Failing gently:
        return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (process.env.DISCORD_CLIENT_ID) {
    passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ['identify']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Upsert user to Supabase
            const { data, error } = await supabase
                .from('users')
                .upsert({
                    id: profile.id, // Discord ID acts as primary key
                    username: profile.username,
                    avatar_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
                }, { onConflict: 'id' })
                .select()
                .single();
                
            if (error) {
                console.error("Supabase upsert error:", error);
                return done(error, null);
            }
            
            return done(null, data);
        } catch (err) {
            return done(err, null);
        }
    }));
} else {
    console.warn("DISCORD_CLIENT_ID environment variable not set, Discord Strategy will not be registered correctly.");
}
