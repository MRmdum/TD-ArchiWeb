import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("jwt");

  if (!token) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
