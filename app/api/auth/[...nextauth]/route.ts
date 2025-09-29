import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import UserIdentifierService from '../../../services/user-identifier-service';

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
        console.log('🔐 NextAuth authorize called with:', {
          email: credentials?.email,
          passwordLength: credentials?.password?.length,
        });
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
        // DEPOINTE PLATFORM - Full Admin Access
        if (
          credentials?.email === 'info@deedavis.biz' &&
          credentials?.password === 'depointe2024!'
        ) {
          console.log('✅ DEPOINTE LOGIN SUCCESS:', credentials?.email);
          return {
            id: '8',
            email: 'info@deedavis.biz',
            name: 'DEPOINTE Platform',
            role: 'admin',
            companyId: 'DEPOINTE-PLATFORM',
            isDepointe: true,
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
    async redirect({ url, baseUrl }) {
      // Don't redirect if user is on landing page or public pages
      if (
        url === baseUrl + '/' ||
        url.includes('landing') ||
        url.includes('carrier') ||
        url.includes('broker')
      ) {
        console.log(`🚨 NextAuth: NOT redirecting public page: ${url}`);
        return url;
      }
      // For auth success, redirect to landing page
      console.log(`🔄 NextAuth redirect: ${url} -> ${baseUrl}/`);
      return baseUrl + '/';
    },
    async jwt({ token, user }: { token: any; user: any }) {
      console.log('🔑 JWT callback:', {
        hasUser: !!user,
        email: user?.email,
        role: user?.role,
      });
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
          'info@deedavis.biz': 'DEPOINTE-ADMIN-001', // DEPOINTE Platform
        };
        // Use centralized UserIdentifierService for consistent user ID mapping
        const userIdentifierService = UserIdentifierService.getInstance();
        token.fleetflowUserId = userIdentifierService.getUserId(user.email);
        console.log('✅ JWT token created for:', {
          email: user.email,
          role: user.role,
          fleetflowUserId: token.fleetflowUserId,
        });
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('📋 Session callback:', {
        hasToken: !!token,
        email: token?.email,
      });
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.fleetflowUserId = token.fleetflowUserId;
        console.log('✅ Session created for:', {
          email: session.user.email,
          role: session.user.role,
        });
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Use proper auth signin page
    error: '/auth/signin', // Redirect errors to signin page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
