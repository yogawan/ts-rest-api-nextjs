import { NextResponse } from 'next/server';
import { PostModel } from '@/models/post.model';
import connectMongoDB from '@/lib/mongodb';

export async function GET() {
  await connectMongoDB()
  const posts = await PostModel.find().populate('author', 'name email')
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  await connectMongoDB()
  const { title, content, userId } = await req.json()

  const newPost = await PostModel.create({
    title,
    content,
    author: userId
  })

  return NextResponse.json(newPost, { status: 201 })
}