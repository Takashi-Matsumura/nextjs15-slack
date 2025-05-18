/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Delete a channel by id
export async function DELETE(
  request: NextRequest,
  context: { params: any }
) {
  const { id } = context.params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid channel id' }, { status: 400 });
  }
  try {
    await prisma.channel.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 });
  }
}