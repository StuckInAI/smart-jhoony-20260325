import { NextRequest, NextResponse } from 'next/server'
import { AppDataSource } from '@/data-source'
import { CalculationHistory } from '@/entities/History'

export async function GET(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const sessionId = searchParams.get('sessionId')

    const historyRepo = AppDataSource.getRepository(CalculationHistory)
    let query = historyRepo.createQueryBuilder('history')
      .orderBy('history.timestamp', 'DESC')
      .limit(limit)

    if (sessionId) {
      query = query.where('history.sessionId = :sessionId', { sessionId })
    }

    const history = await query.getMany()
    return NextResponse.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const sessionId = searchParams.get('sessionId')

    const historyRepo = AppDataSource.getRepository(CalculationHistory)
    
    if (id) {
      await historyRepo.delete({ id })
    } else if (sessionId) {
      await historyRepo.delete({ sessionId })
    } else {
      await historyRepo.clear()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
