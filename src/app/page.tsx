'use client'

import { useState, useEffect } from 'react'
import Calculator from '@/components/Calculator'
import HistoryPanel from '@/components/HistoryPanel'
import { CalculationHistory } from '@/entities/History'

export default function Home() {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteHistory = async (id?: string) => {
    try {
      const url = id ? `/api/history?id=${id}` : '/api/history'
      const response = await fetch(url, { method: 'DELETE' })
      if (response.ok) {
        await fetchHistory()
      }
    } catch (error) {
      console.error('Failed to delete history:', error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Calculator onCalculate={fetchHistory} />
      </div>
      <div>
        <HistoryPanel 
          history={history} 
          isLoading={isLoading} 
          onDelete={deleteHistory} 
          onRefresh={fetchHistory} 
        />
      </div>
    </div>
  )
}
