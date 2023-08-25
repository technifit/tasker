import { createCookieSessionStorage } from "@vercel/remix";
import { createThemeSessionResolver } from "remix-themes";

// TODO: tighten domain & secure before release
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__theme",
    // domain: 'remix.run',
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // secure: true,
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
