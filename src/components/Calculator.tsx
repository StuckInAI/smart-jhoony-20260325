'use client'

import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import clsx from 'clsx'

type Operation = '+' | '-' | '*' | '/' | '^' | 'sqrt' | 'log'

interface CalculatorProps {
  onCalculate: () => void
}

export default function Calculator({ onCalculate }: CalculatorProps) {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [sessionId] = useState(() => nanoid())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    setError(null)
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperation = (op: Operation) => {
    setError(null)
    if (display === 'Error') {
      setDisplay('0')
    }
    
    if (op === 'sqrt') {
      setDisplay(`sqrt(${display})`)
    } else if (op === 'log') {
      setDisplay(`log(${display})`)
    } else {
      setDisplay(display + op)
    }
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setError(null)
  }

  const handleMemoryStore = () => {
    const value = parseFloat(display)
    if (!isNaN(value)) {
      setMemory(value)
    }
  }

  const handleMemoryRecall = () => {
    setDisplay(memory.toString())
  }

  const handleMemoryClear = () => {
    setMemory(0)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handleCalculate = useCallback(async () => {
    if (!display || display === 'Error') return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          expression: display,
          sessionId 
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Calculation failed')
      }

      setDisplay(data.result.toString())
      onCalculate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setDisplay('Error')
    } finally {
      setIsLoading(false)
    }
  }, [display, sessionId, onCalculate])

  const buttonClass = (isSpecial = false) => 
    clsx(
      'h-14 md:h-16 rounded-lg font-medium transition-colors flex items-center justify-center',
      isSpecial 
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300'
    )

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1">Memory: {memory}</div>
        <div className="text-2xl md:text-3xl font-mono bg-gray-100 p-4 rounded-lg text-right min-h-[4rem] flex items-center justify-end">
          {display}
        </div>
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Memory buttons */}
        <button onClick={handleMemoryStore} className={buttonClass(true)}>M+</button>
        <button onClick={handleMemoryRecall} className={buttonClass(true)}>MR</button>
        <button onClick={handleMemoryClear} className={buttonClass(true)}>MC</button>
        <button onClick={handleBackspace} className={buttonClass(true)}>⌫</button>

        {/* Scientific functions */}
        <button onClick={() => handleOperation('sqrt')} className={buttonClass()}>√</button>
        <button onClick={() => handleOperation('^')} className={buttonClass()}>x^y</button>
        <button onClick={() => handleOperation('log')} className={buttonClass()}>log</button>
        <button onClick={handleClear} className="bg-red-100 hover:bg-red-200 text-red-700 h-14 md:h-16 rounded-lg font-medium">C</button>

        {/* Numbers and operations */}
        <button onClick={() => handleNumber('7')} className={buttonClass()}>7</button>
        <button onClick={() => handleNumber('8')} className={buttonClass()}>8</button>
        <button onClick={() => handleNumber('9')} className={buttonClass()}>9</button>
        <button onClick={() => handleOperation('/')} className={buttonClass(true)}>÷</button>

        <button onClick={() => handleNumber('4')} className={buttonClass()}>4</button>
        <button onClick={() => handleNumber('5')} className={buttonClass()}>5</button>
        <button onClick={() => handleNumber('6')} className={buttonClass()}>6</button>
        <button onClick={() => handleOperation('*')} className={buttonClass(true)}>×</button>

        <button onClick={() => handleNumber('1')} className={buttonClass()}>1</button>
        <button onClick={() => handleNumber('2')} className={buttonClass()}>2</button>
        <button onClick={() => handleNumber('3')} className={buttonClass()}>3</button>
        <button onClick={() => handleOperation('-')} className={buttonClass(true)}>-</button>

        <button onClick={() => handleNumber('0')} className={buttonClass()}>0</button>
        <button onClick={handleDecimal} className={buttonClass()}>.</button>
        <button 
          onClick={handleCalculate} 
          disabled={isLoading}
          className={clsx(
            'col-span-2',
            isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700',
            'text-white h-14 md:h-16 rounded-lg font-medium transition-colors'
          )}
        >
          {isLoading ? 'Calculating...' : '='}
        </button>
        <button onClick={() => handleOperation('+')} className={buttonClass(true)}>+</button>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Session: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId.slice(0, 8)}</code></p>
      </div>
    </div>
  )
}
