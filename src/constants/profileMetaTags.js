//연령대
export const AGE_OPTIONS = ['20대', '30대', '40대', '50대', '60대 이상']

//직종
export const JOB_OPTIONS = ['사무', '영업', '현장', '의료', '교육', '기타']

//기타 메타태그(카테고리/목적/기획의도)
export const META_TAGS = {
  CATEGORIES: [
    { id: 1, name: '건강' },
    { id: 2, name: '교육' },
    { id: 3, name: '여행' },
    { id: 4, name: '선물' },
    { id: 5, name: '가전' },
  ],
  PURPOSES: [
    { id: 6, name: '나를 위한 구매' },
    { id: 7, name: '선물용' },
    { id: 8, name: '가족/아이' },
    { id: 9, name: '업무/직장' },
    { id: 10, name: '취미/여가' },
  ],
  MERCHANDISING: [
    { id: 11, name: '가성비' },
    { id: 12, name: '고품질' },
    { id: 13, name: '실용적' },
    { id: 14, name: '트렌디' },
    { id: 15, name: '친환경' },
  ],
}

//목적 RADIO OPTIONS
export const PURPOSE_RADIO_OPTIONS = [
  ...META_TAGS.PURPOSES.map((tag) => ({ value: tag.id, label: tag.name })),
  { value: -1, label: '모르겠어요' },
]

const CATEGORY_ID_SET = new Set(META_TAGS.CATEGORIES.map((tag) => tag.id))
const PURPOSE_ID_SET = new Set(META_TAGS.PURPOSES.map((tag) => tag.id))
const MERCHANDISING_ID_SET = new Set(META_TAGS.MERCHANDISING.map((tag) => tag.id))

export function splitProfileTagIds(profileTagIds = []) {
  const purposeId = profileTagIds.find((id) => PURPOSE_ID_SET.has(id)) ?? null

  return {
    categoryIds: profileTagIds.filter((id) => CATEGORY_ID_SET.has(id)),
    purposeId,
    merchandisingIds: profileTagIds.filter((id) => MERCHANDISING_ID_SET.has(id)),
  }
}

export function buildProfileTagIds(categoryIds, purposeId, merchandisingIds) {
  return [
    ...categoryIds,
    ...(purposeId != null ? [purposeId] : []),
    ...merchandisingIds,
  ]
}
