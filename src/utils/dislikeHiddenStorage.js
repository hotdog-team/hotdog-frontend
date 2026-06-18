// 재사용성이 높아져 분리 처리
export const HIDDEN_STORAGE_KEY = 'dislike:hidden'

function migrateFromSessionStorage() {
  try {
    const sessionRaw = sessionStorage.getItem(HIDDEN_STORAGE_KEY)
    if (!sessionRaw) return

    if (!localStorage.getItem(HIDDEN_STORAGE_KEY)) {
      localStorage.setItem(HIDDEN_STORAGE_KEY, sessionRaw)
    }

    sessionStorage.removeItem(HIDDEN_STORAGE_KEY)
  } catch {
    // 무시 처리한다
  }
}

export function getHiddenIds() {
  migrateFromSessionStorage()

  try {
    const raw = localStorage.getItem(HIDDEN_STORAGE_KEY)
    return new Set(Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

export function addHiddenId(id) {
  const next = getHiddenIds()
  next.add(Number(id))
  localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify([...next]))
}

export function removeHiddenId(id) {
  const next = getHiddenIds()
  next.delete(Number(id))
  localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify([...next]))
}

export function removeHiddenIds(ids) {
  if (!ids?.length) return

  const next = getHiddenIds()
  ids.forEach((id) => next.delete(Number(id)))
  localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify([...next]))
}
