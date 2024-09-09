import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import { compare } from "bcryptjs";
import User from "@/Models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id || profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          // Find the user by email
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with the entered email');
          }

          // Validate the password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return user; 
        } catch (error) {
          // Throw the error to be caught by NextAuth
          throw new Error(error.message);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async signIn({ account, profile, user }) {
      await connectToDatabase();

      const existingUser = await User.findOne({ email: user.email });

      if (account.provider === 'google') {
        if (existingUser) {
          return true;
        }

        const newUser = new User({
          email: user.email,
          name: profile.name,
          image: profile.picture,
        });

        await newUser.save();
        return true;
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };

