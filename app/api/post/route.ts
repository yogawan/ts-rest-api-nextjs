import { NextResponse } from 'next/server';
import { PostModel } from '@/models/post.model';
import connectMongoDB from '@/lib/mongodb';
import { verifyToken } from '@/middlewares/auth';

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { userId } = verifyToken(token);
    
    const posts = await PostModel.find().populate('author', 'name email').lean();
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/post error:', error);
    
    try {
      const posts = await PostModel.find().lean();
      return NextResponse.json(posts, { status: 200 });
    } catch (fallbackError: any) {
      console.error('Fallback GET /api/post error:', fallbackError);
      return NextResponse.json({ 
        error: 'Failed to fetch posts', 
        details: fallbackError.message 
      }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { userId } = verifyToken(token);
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const post = await PostModel.create({
      title,
      content,
      author: userId,
    });

    const populatedPost = await PostModel.findById(post._id).populate('author', 'name email');
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}