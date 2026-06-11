import { useState } from 'react';
import type { LeafNode, MenuNode } from '../../types';

interface AccordionItemProps {
  node: MenuNode;
  depth: number;
  selectedCode: string | null;
  onSelectLeaf: (leaf: LeafNode) => void;
  defaultOpen?: boolean;
}

export function AccordionItem({
  node,
  depth,
  selectedCode,
  onSelectLeaf,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (node.type === 'leaf') {
    const isSelected = selectedCode === node.code;
    return (
      <button
        type="button"
        className={`accordion-leaf depth-${depth}${isSelected ? ' selected' : ''}`}
        onClick={() => onSelectLeaf(node)}
      >
        <span className="leaf-dot" />
        {node.label}
      </button>
    );
  }

  return (
    <div className={`accordion-branch depth-${depth}`}>
      <button
        type="button"
        className={`accordion-trigger depth-${depth}${open ? ' open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="chevron" aria-hidden="true">
          ›
        </span>
        {node.label}
      </button>
      {open && (
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
      )}
    </div>
  );
}
