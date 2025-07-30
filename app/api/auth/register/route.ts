import { NextResponse } from 'next/server';
import { UserModel } from '@/models/user.model';
import bcrypt from 'bcrypt';
import connectMongoDB from '@/lib/mongodb';

export async function POST(req: Request) {
  await connectMongoDB()
  const { name, email, password } = await req.json()

  const existing = await UserModel.findOne({ email })
  if (existing) return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await UserModel.create({ name, email, password: hashed })

  return NextResponse.json({ user: { id: user._id, name, email } }, { status: 201 })
}
