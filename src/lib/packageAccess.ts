/** Mirrors Site Medical packages/catalog.json → packageAccess.chemistry-introductory-biochemistry */
export const PARENT_APP_ID = 'chemistry-introductory-biochemistry' as const

export const CHAPTERS_BY_PACKAGE_ID: Record<string, readonly string[]> = {
  chemistry: ['gc', 'oc'],
  'introductory-biochemistry': ['ib'],
  'chemistry-introductory-biochemistry': ['gc', 'oc', 'ib'],
}

export const RELEVANT_PACKAGE_IDS = Object.keys(CHAPTERS_BY_PACKAGE_ID)

export const ALL_CHAPTER_PREFIXES = ['gc', 'oc', 'ib'] as const

export const PACKAGE_LABELS: Record<string, string> = {
  chemistry: 'Chemistry',
  'introductory-biochemistry': 'Introductory Biochemistry',
  'chemistry-introductory-biochemistry': 'Chemistry and Biochemistry (complete)',
}

export function allowedPrefixesFromPackageIds(packageIds: Iterable<string>): Set<string> {
  const out = new Set<string>()
  for (const id of packageIds) {
    for (const prefix of CHAPTERS_BY_PACKAGE_ID[id] ?? []) {
      out.add(prefix)
    }
  }
  return out
}

export function packagesUnlockingChapter(prefix: string): string[] {
  return Object.entries(CHAPTERS_BY_PACKAGE_ID)
    .filter(([, prefixes]) => prefixes.includes(prefix) && prefixes.length < ALL_CHAPTER_PREFIXES.length)
    .map(([id]) => id)
}
