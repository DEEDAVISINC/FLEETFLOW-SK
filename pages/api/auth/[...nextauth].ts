import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import UserIdentifierService from '../../../app/services/user-identifier-service';

export const authOptions = {
  providers: [
    // Only include GoogleProvider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // For demo purposes - in production, verify against your Supabase database
        if (
          credentials?.email === 'admin@fleetflowapp.com' &&
          credentials?.password === 'admin123'
        ) {
          return {
            id: '1',
            email: 'admin@fleetflowapp.com',
            name: 'FleetFlow Admin',
            role: 'admin',
          };
        }
        if (
          credentials?.email === 'dispatch@fleetflowapp.com' &&
          credentials?.password === 'dispatch123'
        ) {
          return {
            id: '2',
            email: 'dispatch@fleetflowapp.com',
            name: 'Dispatch Manager',
            role: 'dispatcher',
          };
        }
        if (
          credentials?.email === 'driver@fleetflowapp.com' &&
          credentials?.password === 'driver123'
        ) {
          return {
            id: '3',
            email: 'driver@fleetflowapp.com',
            name: 'John Smith',
            role: 'driver',
          };
        }
        if (
          credentials?.email === 'broker@fleetflowapp.com' &&
          credentials?.password === 'broker123'
        ) {
          return {
            id: '4',
            email: 'broker@fleetflowapp.com',
            name: 'Sarah Wilson',
            role: 'broker',
          };
        }
        // VENDOR ACCOUNTS - Unified into main FleetFlow system
        if (
          credentials?.email === 'vendor@abcmanufacturing.com' &&
          credentials?.password === 'temp123'
        ) {
          return {
            id: '5',
            email: 'vendor@abcmanufacturing.com',
            name: 'ABC Manufacturing Corp',
            role: 'vendor',
            companyId: 'ABC-204-070',
          };
        }
        if (
          credentials?.email === 'vendor@retaildist.com' &&
          credentials?.password === 'temp456'
        ) {
          return {
            id: '6',
            email: 'vendor@retaildist.com',
            name: 'Retail Distribution Inc',
            role: 'vendor',
            companyId: 'RDI-204-050',
          };
        }
        if (
          credentials?.email === 'vendor@techsolutions.com' &&
          credentials?.password === 'temp789'
        ) {
          return {
            id: '7',
            email: 'vendor@techsolutions.com',
            name: 'Tech Solutions LLC',
            role: 'vendor',
            companyId: 'TSL-204-085',
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        // Map email to FleetFlow user ID for UserDataService integration
        const userIdMap: Record<string, string> = {
          'admin@fleetflowapp.com': 'FM-MGR-20230115-1', // Frank Miller
          'dispatch@fleetflowapp.com': 'SJ-DC-20240114-1', // Sarah Johnson
          'driver@fleetflowapp.com': 'demo_driver_001',
          'broker@fleetflowapp.com': 'demo_broker_001',
          'vendor@abcmanufacturing.com': 'demo_vendor_001',
          'vendor@retaildist.com': 'demo_vendor_002',
          'vendor@techsolutions.com': 'demo_vendor_003',
        };
        // Use centralized UserIdentifierService for consistent user ID mapping
        const userIdentifierService = UserIdentifierService.getInstance();
        token.fleetflowUserId = userIdentifierService.getUserId(user.email);
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.fleetflowUserId = token.fleetflowUserId;
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
