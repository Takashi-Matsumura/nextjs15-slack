import { NextResponse } from 'next/server';

// Stub endpoint to return current logged-in user
export async function GET() {
  // TODO: integrate with real auth/session
  // TODO: integrate with real auth/session
  // Stub user data
  const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
  return NextResponse.json(user);
}