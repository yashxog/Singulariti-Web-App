import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    jwt?: JWT
  }

  interface User {
    id: string;
  }

  declare module 'next-auth/jwt' {
    interface JWT {
      accessToken?: string;
      id?: string;
      email?: string;
      name?: string;
    }
  }
}