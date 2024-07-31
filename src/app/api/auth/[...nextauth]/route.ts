import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        console.log(profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
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
          placeholder: "Rishabh123",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
        };

        const res = await fetch("https://api.kreomart.com/api/accounts/login/", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json"
          },
        });
        
        console.log("Authentication response status:", res.status);
        
        if (!res.ok) {
          console.error("Authentication failed:", res.statusText);
          return null;
        }
        
        const user = await res.json();
        console.log("Authenticated user:", user);
        return user;

        // const user = await res.json();
        // if (!res.ok) {
        //   throw new Error(user.message);
        // }
        // if (res.ok && user) {
        //   return user;
        // }
        // return null;
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
