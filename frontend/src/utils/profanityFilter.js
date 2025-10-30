import filter from 'leo-profanity'

try {
  filter.loadDictionary('ru')
  filter.loadDictionary('en')
  console.log('Russian dictionary loaded for profanity filter.')
}
catch (e) {
  console.warn('Could not load Russian dictionary for profanity filter:', e)
}

export const cleanText = (text) => {
  if (!text) return text
  return filter.clean(text)
}

export const hasProfanity = (text) => {
  if (!text) return false
  const cleaned = filter.clean(text)
  return cleaned !== text
}
