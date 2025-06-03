import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     console.log("\tSIGNIN CALLBACK");
  //     console.log(user, account, profile, email, credentials);
  //     return true;
  //   },
  //   async jwt({ token, user, account, profile }) {
  //     console.log("\tJWT CALLBACK");
  //     console.log(token, user, account, profile);
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     console.log("\tSESSION CALLBACK");
  //     console.log(session, token);
  //     return session;
  //   },
  // },
});
