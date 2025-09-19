import { compareSync } from 'bcrypt-ts-edge';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { prisma } from '@/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { cookies } from 'next/headers';

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          // Check if user exists and password is correct
          if (user && user.password) {
            const isMatch = compareSync(
              credentials.password as string,
              user.password
            );
            // If password is correct, return user object
            if (isMatch) {
              // Check if user is admin
              const isAdmin = user.email === process.env.ADMIN_EMAIL;
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: isAdmin ? 'admin' : user.role,
              };
            }
          }
          // If user doesn't exist or password is incorrect, return null
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session ({ session, user, trigger, token }: any) {
      // Set the user id and role on the session
      session.user.id = token.sub;
      session.user.role = token.role;
      // If there is an update, set the name on the session
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    },

    async jwt({ token, user, trigger }: any) {
      if (user) {
        // Assign user properties to the token
        token.id = user.id;
        token.role = user.role;

        if (trigger === 'signIn' || trigger === 'signUp') {
          try {
            const cookiesObject = await cookies();
            const sessionCartId = cookiesObject.get('sessionCartId')?.value;

            if (sessionCartId) {
              // Find cart by sessionCartId
              const cart = await prisma.cart.findFirst({
                where: { sessionCartId }
              });

              if (cart) {
                // Delete existing user carts
                await prisma.cart.deleteMany({
                  where: { userId: user.id }
                });
                
                // Update the cart with user ID
                await prisma.cart.update({
                  where: { id: cart.id },
                  data: { userId: user.id }
                });
              }
            }
          } catch (error) {
            console.error("Cart update error:", error);
            // Continue authentication even if cart update fails
          }
        }
      } 
      // Handle session updates (e.g., name change)
      if (trigger === 'update' && user?.name) {
        token.name = user.name;
      }
      return token;
    },
    
    authorized({request, auth}: any) {
      // Array of regex patterns of protected paths
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      
      // Get pathname from the req URL object
      const {pathname} = request.nextUrl;
      
      // Check if user is not authenticated and on a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check admin routes
      if (pathname.startsWith('/admin') && auth?.user?.role !== 'admin') {
        return false;
      }
      
      // Check seller routes
      if (pathname.startsWith('/seller') && !pathname.startsWith('/seller/sign-in') && auth?.user?.role !== 'seller') {
        return false;
      }

      // Check for cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        
        // Set newly generated sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);

        // Return the response with the sessionCartId set
        return response;
      } else {
        return true;
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
