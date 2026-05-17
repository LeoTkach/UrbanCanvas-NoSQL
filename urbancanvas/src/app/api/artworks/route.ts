import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('urbancanvas');
    const artworks = await db.collection('artworks').aggregate([
      {
        $lookup: {
          from: 'artists',
          localField: 'artistId',
          foreignField: '_id',
          as: 'artist',
        },
      },
      {
        $addFields: {
          artist: { $arrayElemAt: ['$artist', 0] },
        },
      },
    ]).toArray();
    return NextResponse.json(artworks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('urbancanvas');

    const newArtwork = {
      title: data.title,
      style: data.style,
      description: data.description || '',
      story: data.story || '',
      location: {
        type: 'Point',
        coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
      },
      year: new Date().getFullYear(),
      status: 'Active',
      tags: [],
      commentsCount: 0,
      artistId: null,
    };

    const result = await db.collection('artworks').insertOne(newArtwork);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}
