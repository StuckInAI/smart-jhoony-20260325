/**
 * Safe evaluation of mathematical expressions
 * Supports: +, -, *, /, ^, sqrt(), log()
 */
export function evaluateExpression(expression: string): number | null {
  try {
    // Sanitize input
    const sanitized = expression
      .replace(/[^-+*/.\^0-9sqrtlog()\s]/g, '') // Remove dangerous characters
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/log/g, 'Math.log10')
      .replace(/\^/g, '**')

    // Validate expression has valid characters
    if (!/^[0-9+\-*/.\s()**Math.sqrtMath.log10]+$/.test(sanitized)) {
      return null
    }

    // Use Function constructor in a safe way (no access to global scope)
    const result = Function(`'use strict'; return (${sanitized})`)()
    
    // Validate result is a number
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return null
    }

    // Round to avoid floating point precision issues
    return Math.round(result * 1e12) / 1e12
  } catch (error) {
    console.error('Expression evaluation error:', error)
    return null
  }
}
