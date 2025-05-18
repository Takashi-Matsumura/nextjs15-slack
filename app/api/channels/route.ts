/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const existing = await prisma.channel.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: 'Channel already exists' }, { status: 409 });
    }
    const channel = await prisma.channel.create({ data: { name } });
    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}