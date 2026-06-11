import { useState } from 'react';
import { COURSE_TITLE } from './data/courseData';
import { ContentArea } from './components/ContentArea/ContentArea';
import { Sidebar } from './components/Sidebar/Sidebar';
import type { LeafNode } from './types';

export default function App() {
  const [selectedLeaf, setSelectedLeaf] = useState<LeafNode | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>{COURSE_TITLE}</h1>
      </header>
      <div className="app-body">
        <Sidebar
          selectedCode={selectedLeaf?.code ?? null}
          onSelectLeaf={setSelectedLeaf}
          onHome={() => setSelectedLeaf(null)}
        />
        <main className="main-content">
          <ContentArea key={selectedLeaf?.code ?? 'home'} selectedLeaf={selectedLeaf} />
        </main>
      </div>
    </div>
  );
}
