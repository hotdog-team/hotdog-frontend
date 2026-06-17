const POPULAR_RANKS_KEY = 'd-to-popular-search-ranks'

function normalizeKeyword(item) {
  if (typeof item === 'string') return item
  return item?.keyword ?? ''
}

export function getPopularRankChanges(keywords = []) {
  const normalized = keywords.map(normalizeKeyword).filter(Boolean)

  let previous = []
  try {
    const stored = window.localStorage.getItem(POPULAR_RANKS_KEY)
    previous = stored ? JSON.parse(stored) : []
    if (!Array.isArray(previous)) previous = []
  } catch {
    previous = []
  }

  const previousIndexMap = new Map(previous.map((keyword, index) => [keyword, index]))

  const changes = normalized.map((keyword, index) => {
    const previousIndex = previousIndexMap.get(keyword)
    if (previousIndex === undefined) return 'new'
    if (previousIndex > index) return 'up'
    if (previousIndex < index) return 'down'
    return 'same'
  })

  try {
    window.localStorage.setItem(POPULAR_RANKS_KEY, JSON.stringify(normalized))
  } catch {
    // ignore
  }

  return changes
}

export function formatPopularSearchTimestamp(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}.${day} ${hours}:${minutes} 기준`
}
