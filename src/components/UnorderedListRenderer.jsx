/**
 * UnorderedListRenderer Component
 * Renders unordered lists with nesting support
 */

import React from 'react'

export const UnorderedListRenderer = ({ items }) => {
  if (!items || items.length === 0) return null

  const renderFormattedText = (text) => {
    if (!text) return null

    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\)|`.*?`)/g)

    return parts.map((part, idx) => {
      if (!part) return null

      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Italic
      else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <em key={idx} className="italic text-gray-200">
            {part.slice(1, -1)}
          </em>
        )
      }
      // Link
      else if (part.startsWith('[') && part.includes('](')) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              {linkMatch[1]}
            </a>
          )
        }
        return <span key={idx}>{part}</span>
      }
      // Inline code
      else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="bg-slate-900 px-2 py-1 rounded text-gray-200 font-mono text-xs"
          >
            {part.slice(1, -1)}
          </code>
        )
      }

      return <span key={idx}>{part}</span>
    })
  }

  const renderListItems = (items, level = 0) => {
    const currentLevelItems = items.filter(item => item.level === level)
    
    if (currentLevelItems.length === 0) return null

    return (
      <ul className={`space-y-2 ${level > 0 ? 'ml-6 mt-2' : ''}`}>
        {currentLevelItems.map((item, idx) => (
          <li key={idx} className="text-sm text-white leading-relaxed">
            <span className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span className="flex-1">{renderFormattedText(item.content)}</span>
            </span>
            {items.some(i => i.level === level + 1) && renderListItems(items, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="my-6">
      {renderListItems(items)}
    </div>
  )
}

export default UnorderedListRenderer
