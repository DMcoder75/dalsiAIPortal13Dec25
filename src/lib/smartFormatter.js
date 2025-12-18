/**
 * Smart Text Formatter
 * Intelligently structures AI responses with headers, sections, and proper organization
 */

const BOLD_KEYWORDS = [
  'WordPress', 'WooCommerce', 'portfolio website', 'personal portfolio',
  'ecommerce', 'e-commerce', 'website', 'web', 'mobile app',
  'theme', 'plugin', 'design', 'layout', 'strategy',
  'content', 'page', 'post', 'product', 'marketing',
  'integration', 'platform', 'system', 'campaign',
  'SEO', 'responsive', 'mobile', 'social media',
  'user experience', 'UX', 'UI', 'target audience',
  'key features', 'key milestone', 'key event',
  'success', 'challenge', 'important', 'significant',
  'crucial', 'essential', 'fundamental', 'critical',
  'step', 'phase', 'stage', 'milestone', 'timeline',
  'goal', 'objective', 'target', 'leadership', 'partnership'
]

function applyBoldFormatting(text) {
  let formatted = text
  BOLD_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    formatted = formatted.replace(regex, `**${keyword}**`)
  })
  return formatted
}

function splitIntoSentences(text) {
  return text.match(/[^.!?]+[.!?]+/g) || [text]
}

function groupIntoParagraphs(sentences) {
  const paragraphs = []
  let currentParagraph = []
  
  sentences.forEach((sentence, idx) => {
    currentParagraph.push(sentence.trim())
    
    if (currentParagraph.length >= 3 || 
        (sentence.match(/[.!?]\s*$/) && 
        (idx === sentences.length - 1 || Math.random() > 0.7))) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '))
        currentParagraph = []
      }
    }
  })
  
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '))
  }
  
  return paragraphs.filter(p => p.trim().length > 0)
}

function identifySections(text) {
  const sections = []
  
  const sectionPatterns = [
    { pattern: /introduction|overview|background/i, title: 'Introduction' },
    { pattern: /strategy|approach|method/i, title: 'Strategy & Approach' },
    { pattern: /benefit|advantage|feature|key point/i, title: 'Key Benefits & Features' },
    { pattern: /challenge|obstacle|issue|problem/i, title: 'Challenges & Solutions' },
    { pattern: /timeline|schedule|deadline/i, title: 'Timeline & Milestones' },
    { pattern: /target|audience|market|customer/i, title: 'Target Audience' },
    { pattern: /channel|platform|media|social/i, title: 'Channels & Platforms' },
    { pattern: /content|creative|execution|message/i, title: 'Content & Creative Strategy' },
    { pattern: /budget|cost|investment|resource/i, title: 'Budget & Resources' },
    { pattern: /metric|measure|success|kpi/i, title: 'Success Metrics' },
    { pattern: /conclusion|summary|next step|recommendation/i, title: 'Conclusion & Next Steps' }
  ]
  
  sectionPatterns.forEach(({ pattern, title }) => {
    if (pattern.test(text)) {
      sections.push(title)
    }
  })
  
  return sections
}

/**
 * Format text with proper structure - returns array of structured items
 * Each item has type: 'paragraph' or 'section' with header and content
 */
export function smartFormatText(text) {
  if (!text || text.length === 0) return []
  
  const sentences = splitIntoSentences(text)
  const paragraphs = groupIntoParagraphs(sentences)
  const sections = identifySections(text)
  
  const result = []
  
  // Add introduction paragraph
  if (paragraphs.length > 0) {
    result.push({
      type: 'paragraph',
      content: applyBoldFormatting(paragraphs[0])
    })
  }
  
  // Distribute remaining paragraphs across sections
  const remainingParagraphs = paragraphs.slice(1)
  const paragraphsPerSection = Math.ceil(remainingParagraphs.length / Math.max(sections.length, 1))
  
  sections.forEach((section, idx) => {
    // Create section with header and content
    const startIdx = idx * paragraphsPerSection
    const endIdx = Math.min(startIdx + paragraphsPerSection, remainingParagraphs.length)
    
    const sectionContent = []
    for (let i = startIdx; i < endIdx; i++) {
      if (remainingParagraphs[i]) {
        sectionContent.push(applyBoldFormatting(remainingParagraphs[i]))
      }
    }
    
    if (sectionContent.length > 0) {
      result.push({
        type: 'section',
        header: section,
        content: sectionContent
      })
    }
  })
  
  // Add any remaining paragraphs
  const lastSectionEnd = sections.length * paragraphsPerSection
  if (lastSectionEnd < remainingParagraphs.length) {
    for (let i = lastSectionEnd; i < remainingParagraphs.length; i++) {
      result.push({
        type: 'paragraph',
        content: applyBoldFormatting(remainingParagraphs[i])
      })
    }
  }
  
  return result.filter(item => item && item.content && item.content.length > 0)
}

export function parseFormattedText(text) {
  if (!text) return null
  
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return {
        type: 'bold',
        content: part.slice(2, -2),
        key: idx
      }
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return {
        type: 'italic',
        content: part.slice(1, -1),
        key: idx
      }
    } else {
      return {
        type: 'text',
        content: part,
        key: idx
      }
    }
  })
}

export default {
  smartFormatText,
  parseFormattedText
}
