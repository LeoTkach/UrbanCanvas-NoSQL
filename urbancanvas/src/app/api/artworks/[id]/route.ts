import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('urbancanvas');

    const updateDoc = {
      $set: {
        title: data.title,
        style: data.style,
        description: data.description,
        story: data.story,
        location: {
          type: 'Point',
          coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
        }
      }
    };

    const result = await db.collection('artworks').updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('urbancanvas');

    const result = await db.collection('artworks').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}
