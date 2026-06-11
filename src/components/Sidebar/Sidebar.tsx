import { courseMenu } from '../../data/courseData';
import type { LeafNode } from '../../types';
import { AccordionItem } from './AccordionItem';

interface SidebarProps {
  selectedCode: string | null;
  onSelectLeaf: (leaf: LeafNode) => void;
  onHome: () => void;
}

export function Sidebar({ selectedCode, onSelectLeaf, onHome }: SidebarProps) {
  const isHome = selectedCode === null;

  return (
    <aside className="sidebar">
      <button
        type="button"
        className={`sidebar-home${isHome ? ' active' : ''}`}
        onClick={onHome}
      >
        <span className="home-icon" aria-hidden="true">
          ⌂
        </span>
        Course Overview
      </button>
      <nav className="sidebar-nav" aria-label="Course chapters">
        {courseMenu.map((chapter, index) => (
          <AccordionItem
            key={chapter.label}
            node={chapter}
            depth={0}
            selectedCode={selectedCode}
            onSelectLeaf={onSelectLeaf}
            defaultOpen={index === 0}
          />
        ))}
      </nav>
    </aside>
  );
}
