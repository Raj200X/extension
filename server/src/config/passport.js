import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import { mockStore, useMockStore } from "../utils/mockStore.js";

// Serialize user for the session (we might not need sessions if using JWT, but Passport requires this for session support)
// Since we are using JWTs, we will strictly use the stateless callback approach, 
// but let's define these to prevent errors if sessions are enabled.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    if (useMockStore()) {
        const user = mockStore.users.find(u => u.id === id);
        return done(null, user);
    }
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;
            const name = profile.displayName;
            const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : "";

            // 1. MOCK STORE HANDLING
            if (useMockStore()) {
                let user = mockStore.users.find(u => u.email === email || u.googleId === googleId);

                if (!user) {
                    // Create new user in mock store
                    user = await mockStore.createUser({
                        name,
                        username: email.split("@")[0] + Math.floor(Math.random() * 1000), // temp username
                        email,
                        password: "", // No password for OAuth users
                        handles: {},
                        googleId,
                        avatar
                    });
                }
                return done(null, user);
            }

            // 2. MONGODB HANDLING
            let user = await User.findOne({
                $or: [{ googleId }, { email }]
            });

            if (user) {
                // If user exists but doesn't have googleId linked (e.g. signed up with email/pass), link it
                if (!user.googleId) {
                    user.googleId = googleId;
                    if (!user.avatar) user.avatar = avatar;
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user
            const username = email.split("@")[0] + Math.floor(Math.random() * 1000); // Strategy to ensure uniqueness?

            user = await User.create({
                name,
                username,
                email,
                googleId,
                avatar,
                passwordHash: "", // flag or empty for OAuth
                handles: {}
            });

            return done(null, user);

        } catch (error) {
            console.error("Google Auth Error:", error);
            return done(error, null);
        }
    }
);

passport.use(googleStrategy);

export default passport;
