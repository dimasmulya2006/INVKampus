import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

export const proxy = withAuth(
  function proxy(request: NextRequestWithAuth) {
    console.log(
      "User mengakses dashboard:",
      request.nextauth.token?.username ??
        request.nextauth.token?.email ??
        "unknown"
    );
  },
  {
    pages: {
      signIn: "/login",
    },

    callbacks: {
      authorized: ({ token }) => {
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};