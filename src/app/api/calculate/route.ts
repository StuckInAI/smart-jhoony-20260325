import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppDataSource } from '@/data-source'
import { CalculationHistory } from '@/entities/History'
import { evaluateExpression } from '@/lib/calculator'
import { nanoid } from 'nanoid'

const calculationSchema = z.object({
  expression: z.string().min(1).max(200),
  sessionId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = calculationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { expression, sessionId } = validation.data
    const result = evaluateExpression(expression)
    
    if (result === null || isNaN(result) || !isFinite(result)) {
      return NextResponse.json(
        { error: 'Invalid calculation result' },
        { status: 400 }
      )
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    const historyRepo = AppDataSource.getRepository(CalculationHistory)
    const historyEntry = new CalculationHistory()
    historyEntry.id = nanoid()
    historyEntry.expression = expression
    historyEntry.result = result
    historyEntry.sessionId = sessionId || nanoid()
    await historyRepo.save(historyEntry)

    return NextResponse.json({
      expression,
      result,
      timestamp: historyEntry.timestamp,
    })
  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
