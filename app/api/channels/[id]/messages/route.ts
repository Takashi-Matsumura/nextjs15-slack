/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// Get messages for a channel
export async function GET(_request: NextRequest, context: { params: any }) {
  // params is a Promise-like proxy; await to access
  const { id: channelIdStr } = await context.params;
  const channelId = Number(channelIdStr);
  if (isNaN(channelId)) {
    return NextResponse.json({ error: 'Invalid channel id' }, { status: 400 });
  }
  try {
    // @ts-ignore: Message model may not be generated yet
    const messages = await prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true } } },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Post a new message to a channel
export async function POST(request: NextRequest, context: { params: any }) {
  // params.id should be awaited before use
  const { id: channelIdStr } = await context.params;
  const channelId = Number(channelIdStr);
  if (isNaN(channelId)) {
    return NextResponse.json({ error: 'Invalid channel id' }, { status: 400 });
  }
  try {
    const { content } = await request.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    // Determine stub user based on cookie (stub session)
    const cookieUser = request.cookies.get('user')?.value;
    let stubEmail: string;
    let stubName: string;
    if (cookieUser === 'bob') {
      stubEmail = 'bob@example.com';
      stubName = 'Bob';
    } else {
      stubEmail = 'alice@example.com';
      stubName = 'Alice';
    }
    // Ensure a stub user exists
    const stubUser = await prisma.user.upsert({
      where: { email: stubEmail },
      update: {},
      create: { name: stubName, email: stubEmail, password: 'password' },
    });
    const userId = stubUser.id;
    // @ts-ignore: Message model may not be generated yet
    const message = await prisma.message.create({
      data: { content, channelId, userId },
      include: { user: { select: { id: true, name: true } } },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}