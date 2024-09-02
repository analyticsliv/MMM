import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import { compare } from "bcryptjs"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        console.log(profile);
        if (!profile.id) {
          // Log the received profile and potentially investigate why the "id" field is missing
          console.error('Google OAuthProfile is missing the "id" field:', profile);
        }
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
        email: {
          label: "email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          // Find the user by email
          const user = null
          // await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with the entered email');
          }

          // Validate the password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return user;
        }
        catch (err) {
          return err;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       return {
  //         ...token,
  //       };
  //     }

  //     return token;
  //   },

  // async session({ session, token }) {
  //     if(session.user){
  //         session.user = token.accessToken;
  //     }

  //   return session;
  // },
  // },
});

export { handler as GET, handler as POST };
