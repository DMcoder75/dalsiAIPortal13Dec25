/**
 * FormattedResponseContentLight
 * Light theme version for modals - renders AI responses with comprehensive Markdown formatting
 * Uses foreground colors for light backgrounds
 */

import React from 'react'
import { smartFormatText } from '../lib/smartFormatter'
import { parseInlineMarkdown, renderInlineMarkdownLight } from '../lib/inlineFormatter'
import TableRenderer from './TableRenderer'
import CodeBlockRenderer from './CodeBlockRenderer'
import BlockquoteRenderer from './BlockquoteRenderer'
import UnorderedListRenderer from './UnorderedListRenderer'

/**
 * Render formatted text with inline Markdown support (light theme)
 */
const renderFormattedTextLight = (paragraph) => {
  if (!paragraph) return null

  const parts = parseInlineMarkdown(paragraph)
  return renderInlineMarkdownLight(parts)
}

/**
 * Parse response text and render as formatted React components (light theme)
 */
export const FormattedResponseContentLight = ({ text }) => {
  if (!text || typeof text !== 'string') return <p className="text-sm text-foreground">{text}</p>

  // Apply smart formatting
  const formattedItems = smartFormatText(text)

  return (
    <div className="space-y-4 text-foreground">
      {/* Response Content */}
      {formattedItems.map((item, idx) => {
        // Handle tables
        if (item.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    {item.headers.map((header, hIdx) => (
                      <th key={hIdx} className="border border-border px-3 py-2 text-left text-sm font-semibold text-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-border px-3 py-2 text-sm text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        // Handle code blocks
        if (item.type === 'code_block') {
          return (
            <div key={idx} className="bg-muted border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/80 px-4 py-2 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground">
                  {item.language || 'code'}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                  {item.code}
                </code>
              </pre>
            </div>
          )
        }

        // Handle blockquotes
        if (item.type === 'blockquote') {
          return (
            <div key={idx} className="border-l-4 border-primary/50 bg-primary/5 px-4 py-3 rounded">
              <p className="text-sm text-foreground italic">
                {renderFormattedTextLight(item.content)}
              </p>
            </div>
          )
        }

        // Handle unordered lists
        if (item.type === 'unordered_list') {
          return (
            <ul key={idx} className="space-y-2 ml-6 text-foreground">
              {item.items.map((listItem, listIdx) => (
                <li key={listIdx} className="text-sm leading-relaxed flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{renderFormattedTextLight(listItem)}</span>
                </li>
              ))}
            </ul>
          )
        }

        // Handle Markdown headings
        if (item.type === 'heading') {
          const headingClasses = {
            1: 'text-2xl',
            2: 'text-xl',
            3: 'text-lg',
            4: 'text-base',
            5: 'text-sm',
            6: 'text-xs'
          }

          return (
            <div key={idx} className={`${headingClasses[item.level] || 'text-lg'} font-semibold text-foreground mt-4 mb-2 border-b border-border pb-2`}>
              {renderFormattedTextLight(item.content)}
            </div>
          )
        }

        // Handle standalone headers
        if (item.type === 'header') {
          return (
            <h2 key={idx} className="text-lg font-semibold text-foreground mt-4 mb-2 border-b border-border pb-2">
              {renderFormattedTextLight(item.content)}
            </h2>
          )
        }

        // Handle numbered lists
        if (item.type === 'list') {
          return (
            <ol key={idx} className="space-y-2 ml-6 text-foreground">
              {item.items.map((listItem, listIdx) => (
                <li key={listIdx} className="text-sm leading-relaxed flex gap-3">
                  <span className="font-semibold text-primary flex-shrink-0">{listItem.number}.</span>
                  <span>{renderFormattedTextLight(listItem.content)}</span>
                </li>
              ))}
            </ol>
          )
        }

        // Handle regular paragraphs
        if (item.type === 'paragraph') {
          return (
            <p
              key={idx}
              className="text-sm text-foreground leading-relaxed"
            >
              {renderFormattedTextLight(item.content)}
            </p>
          )
        }

        return null
      })}
    </div>
  )
}

export default FormattedResponseContentLight
