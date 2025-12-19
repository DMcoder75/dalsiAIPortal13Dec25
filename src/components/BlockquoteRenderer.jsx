/**
 * BlockquoteRenderer Component
 * Renders blockquotes with professional styling
 */

import React from 'react'
import { Quote } from 'lucide-react'

export const BlockquoteRenderer = ({ content }) => {
  if (!content) return null

  return (
    <div className="my-6 pl-4 border-l-4 border-purple-500/60 bg-purple-900/10 rounded-r-lg py-4 pr-4">
      <div className="flex items-start gap-3">
        <Quote className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
        <p
          className="text-sm text-gray-100 italic leading-relaxed"
          style={{
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.8'
          }}
        >
          {content}
        </p>
      </div>
    </div>
  )
}

export default BlockquoteRenderer
