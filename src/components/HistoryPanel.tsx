'use client'

import { CalculationHistory } from '@/entities/History'

type HistoryPanelProps = {
  history: CalculationHistory[]
  isLoading: boolean
  onDelete: (id?: string) => void
  onRefresh: () => void
}

export default function HistoryPanel({ history, isLoading, onDelete, onRefresh }: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Calculation History</h2>
        <div className="flex gap-2">
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
          >
            Refresh
          </button>
          <button 
            onClick={() => onDelete()}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px] pr-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No calculations yet</div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-lg">{item.expression}</div>
                    <div className="text-green-600 font-bold mt-1">= {item.result}</div>
                    <div className="text-gray-500 text-sm mt-2">
                      {formatTime(item.timestamp)} • 
                      <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        {item.sessionId?.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Total calculations: {history.length}</p>
        <p className="mt-1">History is automatically saved to the database.</p>
      </div>
    </div>
  )
}
