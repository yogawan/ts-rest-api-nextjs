import { NextResponse } from 'next/server';
import { PostModel } from '@/models/post.model';
import connectMongoDB from '@/lib/mongodb';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectMongoDB()
  const post = await PostModel.findById(params.id).populate('author', 'name email')
  if (!post) return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB()
  const { title, content } = await req.json()

  const updated = await PostModel.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  )

  if (!updated) return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectMongoDB()
  const deleted = await PostModel.findByIdAndDelete(params.id)
  if (!deleted) return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 })

  return NextResponse.json({ message: 'Post berhasil dihapus' })
}