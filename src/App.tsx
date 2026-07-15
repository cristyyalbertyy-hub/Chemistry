import { useEffect, useMemo, useRef, useState } from 'react';
import { ContentArea } from './components/ContentArea/ContentArea';
import { LockedChapterPanel } from './components/LockedChapterPanel';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useAuth } from './context/AuthContext';
import { resolveAppTitle, resolveOverviewImage, resolveOverviewLead } from './lib/packageAccess';
import {
  CHAPTER_COLORS,
  CHAPTER_IDS,
  countChapterTopics,
  courseMenu,
  findLeafContext,
} from './data/courseData';
import type { LeafNode } from './types';

function collapsedChapters(): Record<string, boolean> {
  const init: Record<string, boolean> = {};
  for (const chapter of courseMenu) {
    if (chapter.type === 'branch') init[chapter.label] = false;
  }
  return init;
}

export default function App() {
  const { hasChapterAccess, hasFullAccess, ownedPackageIds, launchPackageId, userEmail, logout } = useAuth();
  const [selectedLeaf, setSelectedLeaf] = useState<LeafNode | null>(null);
  const [atHome, setAtHome] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const [openChapters, setOpenChapters] = useState(collapsedChapters);
  const [lockedChapterId, setLockedChapterId] = useState<string | null>(null);
  const [lockedChapterTitle, setLockedChapterTitle] = useState('');
  const mainRef = useRef<HTMLElement>(null);

  const leafContext = useMemo(
    () => (selectedLeaf ? findLeafContext(selectedLeaf.code) : null),
    [selectedLeaf],
  );

  const activeChapterId = useMemo(() => {
    if (leafContext) return leafContext.chapterId;
    const openChapter = courseMenu.find(
      (chapter) => chapter.type === 'branch' && openChapters[chapter.label],
    );
    if (openChapter?.type === 'branch') {
      return CHAPTER_IDS[openChapter.label] ?? null;
    }
    return null;
  }, [leafContext, openChapters]);

  const mobileLessonContext = useMemo(() => {
    if (!leafContext || !selectedLeaf) return null;
    return {
      chapter: leafContext.chapter,
      subchapter: selectedLeaf.label,
      color: leafContext.color,
    };
  }, [leafContext, selectedLeaf]);

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null;
  const shellMode = mobileMenuOpen ? 'is-mobile-menu' : 'is-mobile-content';
  const appTitle = useMemo(
    () => resolveAppTitle(ownedPackageIds, launchPackageId),
    [ownedPackageIds, launchPackageId],
  );
  const overviewLead = useMemo(
    () => resolveOverviewLead(ownedPackageIds, launchPackageId),
    [ownedPackageIds, launchPackageId],
  );
  const overviewImage = useMemo(
    () => resolveOverviewImage(ownedPackageIds, launchPackageId),
    [ownedPackageIds, launchPackageId],
  );
  const visibleChapters = useMemo(
    () => courseMenu.filter((chapter) => {
      if (chapter.type !== 'branch') return false;
      const chapterId = CHAPTER_IDS[chapter.label];
      return chapterId ? hasChapterAccess(chapterId) : true;
    }),
    [hasChapterAccess],
  );

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">{overviewLead}</p>
        <ul className="overview-systems" aria-label="Course chapters">
          {visibleChapters.map((chapter) => {
            if (chapter.type !== 'branch') return null;
            const topicCount = countChapterTopics(chapter);
            return (
              <li
                key={chapter.label}
                className="overview-systems__item"
                style={{ borderLeftColor: CHAPTER_COLORS[chapter.label] }}
              >
                <strong>{chapter.label}</strong>
                <span>
                  {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt={`${appTitle} — course overview`}
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
    </div>
  );

  const toggleChapter = (label: string) => {
    const chapterId = CHAPTER_IDS[label];
    if (chapterId && !hasChapterAccess(chapterId)) {
      setLockedChapterId(chapterId);
      setLockedChapterTitle(label);
      setAtHome(false);
      setSelectedLeaf(null);
      setMobileMenuOpen(false);
      return;
    }
    setLockedChapterId(null);
    setOpenChapters((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const selectLeaf = (leaf: LeafNode) => {
    const context = findLeafContext(leaf.code);
    if (context && !hasChapterAccess(context.chapterId)) {
      setLockedChapterId(context.chapterId);
      setLockedChapterTitle(context.chapter);
      setAtHome(false);
      setSelectedLeaf(null);
      setMobileMenuOpen(false);
      return;
    }

    setLockedChapterId(null);
    setAtHome(false);
    setSelectedLeaf(leaf);
    setMobileMenuOpen(false);

    if (context) {
      const next = collapsedChapters();
      next[context.chapter] = true;
      setOpenChapters(next);
    }
  };

  const lessonScrollKey = selectedLeaf?.code ?? null;

  useEffect(() => {
    if (!lessonScrollKey) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lessonScrollKey]);

  const goToEntry = () => {
    setAtHome(true);
    setSelectedLeaf(null);
    setLockedChapterId(null);
    setMobileMenuOpen(false);
    setOpenChapters(collapsedChapters());
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? ' app-header--compact-mobile' : ''}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img
              src={overviewImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{appTitle}</h1>
        {userEmail ? (
          <div className="app-header__actions">
            <div className="auth-account">
              <span className="auth-account__email" title={userEmail}>
                {userEmail}
              </span>
              <button type="button" className="btn-ghost" onClick={() => void logout()}>
                Sair
              </button>
            </div>
          </div>
        ) : null}
      </header>

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={openMobileMenu}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <Sidebar
            selectedCode={selectedLeaf?.code ?? null}
            openChapters={openChapters}
            hasChapterAccess={hasChapterAccess}
            onToggleChapter={toggleChapter}
            onSelectLeaf={selectLeaf}
            hideLockedChapters={!hasFullAccess}
            onLockedChapter={(chapterId, chapterTitle) => {
              setLockedChapterId(chapterId);
              setLockedChapterTitle(chapterTitle);
              setAtHome(false);
              setSelectedLeaf(null);
              setMobileMenuOpen(false);
            }}
          />
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? ' main--overview' : ''}`}
          data-system-tint={activeChapterId ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : lockedChapterId ? (
            <LockedChapterPanel
              chapterId={lockedChapterId}
              chapterTitle={lockedChapterTitle || lockedChapterId}
            />
          ) : selectedLeaf && leafContext ? (
            <ContentArea
              key={selectedLeaf.code}
              selectedLeaf={selectedLeaf}
              eyebrow={
                leafContext.subchapter === selectedLeaf.label
                  ? leafContext.chapter
                  : `${leafContext.chapter} › ${leafContext.subchapter}`
              }
            />
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                <p>Choose a coloured chapter in the menu on the left, then select a topic.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
