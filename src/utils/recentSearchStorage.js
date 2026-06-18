export const MAX_RECENT_SEARCHES = 10

export function getRecentSearchesKey(userId) {
  return `d-to-recent-searches-${userId || 'guest'}`
}

function normalizeStoredEntry(entry) {
  if (typeof entry === 'string') {
    const keyword = entry.trim()
    return keyword ? { keyword, searchedAt: null } : null
  }

  if (entry?.keyword) {
    const keyword = String(entry.keyword).trim()
    return keyword ? { keyword, searchedAt: entry.searchedAt ?? null } : null
  }

  return null
}

export function formatRecentSearchDate(searchedAt) {
  if (!searchedAt) return ''

  const date = new Date(searchedAt)
  if (Number.isNaN(date.getTime())) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}.`
}

export function readRecentSearches(userId) {
  try {
    const storedSearches = window.localStorage.getItem(getRecentSearchesKey(userId))
    const parsedSearches = JSON.parse(storedSearches)
    if (!Array.isArray(parsedSearches)) return []

    return parsedSearches.map(normalizeStoredEntry).filter(Boolean)
  } catch {
    return []
  }
}

export function writeRecentSearches(userId, searches) {
  try {
    window.localStorage.setItem(getRecentSearchesKey(userId), JSON.stringify(searches))
    window.dispatchEvent(new Event('recent-searches-updated'))
  } catch {
    // ignore quota errors
  }
}

export function addRecentSearch(userId, keyword, current = readRecentSearches(userId)) {
  const trimmed = keyword.trim()
  if (!trimmed) return current

  const nextSearches = [
    { keyword: trimmed, searchedAt: new Date().toISOString() },
    ...current.filter((search) => search.keyword !== trimmed),
  ].slice(0, MAX_RECENT_SEARCHES)

  writeRecentSearches(userId, nextSearches)
  return nextSearches
}

export function removeRecentSearch(userId, keywordToRemove, current = readRecentSearches(userId)) {
  const nextSearches = current.filter((search) => search.keyword !== keywordToRemove)
  writeRecentSearches(userId, nextSearches)
  return nextSearches
}

export function clearRecentSearches(userId) {
  writeRecentSearches(userId, [])
  return []
}
