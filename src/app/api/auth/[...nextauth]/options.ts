import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser {
    id: string;
    name: string;
    password: string;
    buddy: string;
    // Add other properties if needed
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "johndoe" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = { id: "42", name: "Dave", password: "1234", buddy: "ssup" };
                if (credentials?.username === user.name && credentials?.password === user.password) {
                    console.log(user)
                    return user;
                } else {
                    return null;
                }
            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_APP_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_APP_SECRET as string,
        }),
    ],
   
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
              return { ...token, ...user };
            }
            return token;
          },
          async session({ session, token }) {
            session.user = token.user as any;// you can also declare type
            return session;
          },
    }
   
}

export default authOptions;