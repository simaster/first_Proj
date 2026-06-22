import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock user storage (replace with database in production)
const users: any[] = []

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, role } = req.body

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role: role || 'USER',
    }
    users.push(user)

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    )
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    )
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    )

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req: Request, res: Response) {
  res.json({ message: 'Logged out successfully' })
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh-secret'
    ) as { id: string }

    const user = users.find((u) => u.id === decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    )

    res.json({ accessToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}
