import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// MongoDB-তে connect। Better Auth এই database-এ user, session, account তথ্য রাখে।
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  // Email + password দিয়ে রেজিস্টার ও লগইন
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // রেজিস্টারের পর Login পেজে পাঠানো হয়
  },

  // Google দিয়ে লগইন (.env.local-এর GOOGLE_CLIENT_ID ও GOOGLE_CLIENT_SECRET থেকে)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // আগে একই email দিয়ে email/password রেজিস্টার থাকলে Google-এর সাথে যুক্ত হয়
  account: {
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },

  // Backend এর জন্য JWT token ও public key (/api/auth/jwks)
  plugins: [jwt()],
});
