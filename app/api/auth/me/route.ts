import { NextResponse } from 'next/server';

// Stub endpoint to return current logged-in user
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Determine current user from cookie (stub)
  const cookieUser = request.cookies.get('user')?.value;
  let user;
  if (cookieUser === 'bob') {
    user = { id: 2, name: 'Bob', email: 'bob@example.com' };
  } else {
    user = { id: 1, name: 'Alice', email: 'alice@example.com' };
  }
  return NextResponse.json(user);
}