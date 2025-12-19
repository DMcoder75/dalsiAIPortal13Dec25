/**
 * TableRenderer Component
 * Renders Markdown tables with professional styling
 */

import React from 'react'

export const TableRenderer = ({ headers, rows }) => {
  if (!headers || !rows || rows.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-b-2 border-purple-500/40">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-purple-500/20 last:border-r-0"
                style={{
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-purple-500/20 transition-colors hover:bg-purple-900/10 ${
                rowIdx % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-800/10'
              }`}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-sm text-white border-r border-purple-500/20 last:border-r-0"
                  style={{
                    textAlign: 'left',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    hyphens: 'none',
                    overflowWrap: 'break-word'
                  }}
                >
                  {/* Handle bold formatting in cells */}
                  {renderCellContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Render cell content with bold formatting support
 */
function renderCellContent(content) {
  if (!content) return null

  const parts = content.split(/(\*\*.*?\*\*)/g)

  return parts.map((part, idx) => {
    if (!part) return null

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    } else {
      return <span key={idx}>{part}</span>
    }
  })
}

export default TableRenderer
