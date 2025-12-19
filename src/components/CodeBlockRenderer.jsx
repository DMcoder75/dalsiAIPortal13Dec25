/**
 * CodeBlockRenderer Component
 * Renders code blocks with syntax highlighting and copy button
 */

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export const CodeBlockRenderer = ({ language = 'text', code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting for common languages
  const highlightCode = (code, lang) => {
    // For now, return as-is. Can be enhanced with Prism or Highlight.js
    return code
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden bg-slate-950 border border-purple-500/20">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-b border-purple-500/20">
        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
          {language || 'Code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto">
        <code
          className="text-sm font-mono text-gray-100 leading-relaxed"
          style={{
            fontFamily: 'Fira Code, Courier New, monospace',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        >
          {highlightCode(code, language)}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlockRenderer
