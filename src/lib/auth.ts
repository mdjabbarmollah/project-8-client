import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { mongoClientProxy, mongoDbProxy } from "./mongodb";


export const auth = betterAuth({
  database: mongodbAdapter(mongoDbProxy, { client: mongoClientProxy }),

 
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, 
  },

  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },


  account: {
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },


  plugins: [jwt()],
});
