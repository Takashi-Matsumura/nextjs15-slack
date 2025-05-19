import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Determine current user from cookie (stub)
  const cookieStore = await cookies();
  const cookieUser = cookieStore.get('user')?.value;
  let user;
  if (cookieUser === 'bob') {
    user = { id: 2, name: 'Bob', email: 'bob@example.com' };
  } else {
    user = { id: 1, name: 'Alice', email: 'alice@example.com' };
  }
  return NextResponse.json(user);
}