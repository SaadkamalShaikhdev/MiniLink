// app/api/auth/[...nextauth]/route.js
import GoogleProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth';
import dbConnect from '@/libs/dbConnect';
import UserModel from '@/models/UserModel';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // THIS IS CRITICAL!
  callbacks: {
    async signIn({user}){
      await dbConnect();
      
      try {
        const existingUser = await UserModel.findOne({email: user.email})
        if(!existingUser){
          const newUser = new UserModel({
            username: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
          })
          await newUser.save();
        }
        return true;

      } catch (error) {
        console.error("Error saving user:", error)
        return false;
      }
    },
    async jwt({token, user}) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({session, token}){
      await dbConnect();
      
      if (token.email) {
        session.user.email = token.email;
      }
      
      const dbUser = await UserModel.findOne({ email: session.user.email });
      if(dbUser) {
        session.user.id = dbUser._id.toString();
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };