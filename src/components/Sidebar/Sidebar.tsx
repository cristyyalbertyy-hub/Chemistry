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
  onToggleChapter: (label: string) => void;
  onSelectLeaf: (leaf: LeafNode) => void;
}

export function Sidebar({
  selectedCode,
  openChapters,
  onToggleChapter,
  onSelectLeaf,
}: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Course chapters">
      {courseMenu.map((chapter) => {
        if (chapter.type !== 'branch') return null;

        return (
          <AccordionItem
            key={chapter.label}
            node={chapter}
            depth={0}
            selectedCode={selectedCode}
            onSelectLeaf={onSelectLeaf}
            chapterColor={CHAPTER_COLORS[chapter.label]}
            chapterId={CHAPTER_IDS[chapter.label]}
            open={openChapters[chapter.label] ?? false}
            onToggle={() => onToggleChapter(chapter.label)}
          />
        );
      })}
    </nav>
  );
}
