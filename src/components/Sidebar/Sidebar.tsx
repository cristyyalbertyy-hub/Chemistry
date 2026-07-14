import {
  CHAPTER_COLORS,
  CHAPTER_IDS,
  courseMenu,
} from '../../data/courseData';
import type { LeafNode } from '../../types';
import { AccordionItem } from './AccordionItem';

interface SidebarProps {
  selectedCode: string | null;
  openChapters: Record<string, boolean>;
  hasChapterAccess?: (chapterId: string) => boolean;
  onToggleChapter: (label: string) => void;
  onSelectLeaf: (leaf: LeafNode) => void;
  onLockedChapter?: (chapterId: string, chapterTitle: string) => void;
  hideLockedChapters?: boolean;
}

export function Sidebar({
  selectedCode,
  openChapters,
  hasChapterAccess,
  onToggleChapter,
  onSelectLeaf,
  onLockedChapter,
  hideLockedChapters = false,
}: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Course chapters">
      {courseMenu.map((chapter) => {
        if (chapter.type !== 'branch') return null;
        const chapterId = CHAPTER_IDS[chapter.label];
        const locked = chapterId && hasChapterAccess ? !hasChapterAccess(chapterId) : false;
        if (hideLockedChapters && locked) return null;
        return (
          <AccordionItem
            key={chapter.label}
            node={chapter}
            depth={0}
            selectedCode={selectedCode}
            onSelectLeaf={onSelectLeaf}
            chapterColor={CHAPTER_COLORS[chapter.label]}
            chapterId={chapterId}
            chapterTitle={chapter.label}
            locked={locked}
            open={openChapters[chapter.label] ?? false}
            onToggle={() => onToggleChapter(chapter.label)}
            onLockedChapter={
              chapterId
                ? () => onLockedChapter?.(chapterId, chapter.label)
                : undefined
            }
          />
        );
      })}
    </nav>
  );
}
