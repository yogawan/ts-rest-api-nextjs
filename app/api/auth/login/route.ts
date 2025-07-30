import { NextResponse } from 'next/server';
import { UserModel } from '@/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectMongoDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret'

export async function POST(req: Request) {
  await connectMongoDB()
  const { email, password } = await req.json()

  const user = await UserModel.findOne({ email })
  if (!user) return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 404 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return NextResponse.json({ error: 'Password salah' }, { status: 401 })

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

  return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}
