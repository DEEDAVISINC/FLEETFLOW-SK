import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    // Only include GoogleProvider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For demo purposes - in production, verify against your Supabase database
        if (credentials?.email === 'admin@fleetflow.com' && credentials?.password === 'admin123') {
          return {
            id: '1',
            email: 'admin@fleetflow.com',
            name: 'FleetFlow Admin',
            role: 'admin'
          };
        }
        if (credentials?.email === 'dispatch@fleetflow.com' && credentials?.password === 'dispatch123') {
          return {
            id: '2',
            email: 'dispatch@fleetflow.com',
            name: 'Dispatch Manager',
            role: 'dispatcher'
          };
        }
        if (credentials?.email === 'driver@fleetflow.com' && credentials?.password === 'driver123') {
          return {
            id: '3',
            email: 'driver@fleetflow.com',
            name: 'John Smith',
            role: 'driver'
          };
        }
        if (credentials?.email === 'broker@fleetflow.com' && credentials?.password === 'broker123') {
          return {
            id: '4',
            email: 'broker@fleetflow.com',
            name: 'Sarah Wilson',
            role: 'broker'
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);
