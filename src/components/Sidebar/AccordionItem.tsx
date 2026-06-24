import { useState } from 'react';
import type { LeafNode, MenuNode } from '../../types';

interface AccordionItemProps {
  node: MenuNode;
  depth: number;
  selectedCode: string | null;
  onSelectLeaf: (leaf: LeafNode) => void;
  chapterColor?: string;
  chapterId?: string;
  open?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({
  node,
  depth,
  selectedCode,
  onSelectLeaf,
  chapterColor,
  chapterId,
  open: controlledOpen,
  onToggle,
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = depth === 0 && onToggle !== undefined;
  const open = isControlled ? (controlledOpen ?? false) : internalOpen;

  if (node.type === 'leaf') {
    const isSelected = selectedCode === node.code;
    return (
      <button
        type="button"
        className={`accordion-leaf depth-${depth}${isSelected ? ' selected' : ''}`}
        onClick={() => onSelectLeaf(node)}
      >
        <span className="accordion-leaf-title">{node.label}</span>
        <span className="accordion-leaf-arrow" aria-hidden>
          ›
        </span>
      </button>
    );
  }

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
      return;
    }
    setInternalOpen((prev) => !prev);
  };

  if (depth === 0 && chapterColor && chapterId) {
    return (
      <div
        className={`accordion accordion--chapter${open ? ' is-open' : ''}`}
        data-chapter={chapterId}
      >
        <button
          type="button"
          className="accordion-trigger accordion-trigger--chapter"
          style={{ backgroundColor: chapterColor }}
          aria-expanded={open}
          onClick={handleToggle}
        >
          <span className="chevron" aria-hidden>
            {open ? '▼' : '▶'}
          </span>
          <span className="chapter-name">{node.label}</span>
        </button>
        {open ? (
          <div className="section-tree" style={{ borderTopColor: chapterColor }}>
            {node.children.map((child) => (
              <AccordionItem
                key={child.type === 'leaf' ? child.code : child.label}
                node={child}
                depth={depth + 1}
                selectedCode={selectedCode}
                onSelectLeaf={onSelectLeaf}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`accordion-branch depth-${depth}`}>
      <button
        type="button"
        className={`section-trigger${open ? ' open' : ''}`}
        aria-expanded={open}
        onClick={handleToggle}
      >
        <span className="chevron chevron--sm" aria-hidden>
          {open ? '▼' : '▶'}
        </span>
        {node.label}
      </button>
      {open ? (
        <div className="accordion-children">
          {node.children.map((child) => (
            <AccordionItem
              key={child.type === 'leaf' ? child.code : child.label}
              node={child}
              depth={depth + 1}
              selectedCode={selectedCode}
              onSelectLeaf={onSelectLeaf}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
