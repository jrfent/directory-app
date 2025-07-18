import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const logo = formData.get('logo') as File | null

    if (!logo) {
      return NextResponse.json({ error: 'No logo provided' }, { status: 400 })
    }

    const bytes = await logo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = `logo-${Date.now()}.${logo.name.split('.').pop()}`
    const filepath = join(process.cwd(), 'public/uploads', filename)
    
    await writeFile(filepath, buffer)
    const logoUrl = `/uploads/${filename}`

    return NextResponse.json({ logoUrl })
  } catch (error) {
    console.error('Error uploading logo:', error)
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
  }
}