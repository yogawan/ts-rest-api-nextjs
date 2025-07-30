import { NextResponse } from 'next/server';
import { PostModel } from '@/models/post.model';
import connectMongoDB from '@/lib/mongodb';
import { verifyToken } from '@/middlewares/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();
    const post = await PostModel.findById(params.id).populate('author', 'name email');
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const post = await PostModel.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      params.id,
      { title, content },
      { new: true }
    ).populate('author', 'name email');

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { userId } = verifyToken(token);

    const post = await PostModel.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await PostModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
