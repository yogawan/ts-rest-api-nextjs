import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret'

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (err) {
    throw new Error('Token tidak valid')
  }
}
