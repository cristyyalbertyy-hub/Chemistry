import { useState } from 'react';
import type { LeafNode, ResourceType } from '../../types';
import { getMediaPath } from '../../utils/resourcePaths';
import { Questionnaire } from '../Questionnaire/Questionnaire';

interface ContentAreaProps {
  selectedLeaf: LeafNode;
  eyebrow: string;
}

const RESOURCE_TABS: { id: ResourceType; label: string }[] = [
  { id: 'video', label: 'Video' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'questionnaire', label: 'Questions' },
];

function MediaFallback({ path, type }: { path: string; type: string }) {
  return (
    <div className="missing-box">
      <p>{type} not available yet.</p>
      <p className="small muted">Expected file: {path}</p>
    </div>
  );
}

export function ContentArea({ selectedLeaf, eyebrow }: ContentAreaProps) {
  const [resource, setResource] = useState<ResourceType>('video');
  const [infographicVariant, setInfographicVariant] = useState<'I' | 'II'>('I');
  const [mediaError, setMediaError] = useState(false);

  const handleResourceChange = (r: ResourceType) => {
    setResource(r);
    setMediaError(false);
    if (r === 'infographic') setInfographicVariant('I');
  };

  const mediaPath = getMediaPath(selectedLeaf.code, resource, infographicVariant);

  return (
    <div className="lesson-view">
      <header className="subchapter-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{selectedLeaf.label}</h2>
      </header>

      <div className="media-tabs" role="tablist" aria-label="Lesson media">
        {RESOURCE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={resource === tab.id}
            className={`media-tab${resource === tab.id ? ' active' : ''}`}
            onClick={() => handleResourceChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {resource === 'infographic' ? (
        <div className="media-tabs infographic-variant-tabs" role="tablist" aria-label="Infographic variant">
          <button
            type="button"
            className={`media-tab${infographicVariant === 'I' ? ' active' : ''}`}
            onClick={() => {
              setInfographicVariant('I');
              setMediaError(false);
            }}
          >
            Infographic I
          </button>
          <button
            type="button"
            className={`media-tab${infographicVariant === 'II' ? ' active' : ''}`}
            onClick={() => {
              setInfographicVariant('II');
              setMediaError(false);
            }}
          >
            Infographic II
          </button>
        </div>
      ) : null}

      <div className="media-stage" role="tabpanel">
        {resource === 'video' &&
          (mediaError ? (
            <MediaFallback path={mediaPath} type="Video" />
          ) : (
            <video
              key={mediaPath}
              className="video"
              controls
              preload="metadata"
              src={mediaPath}
              onError={() => setMediaError(true)}
            >
              Your browser does not support video playback.
            </video>
          ))}

        {resource === 'podcast' &&
          (mediaError ? (
            <MediaFallback path={mediaPath} type="Podcast" />
          ) : (
            <audio
              key={mediaPath}
              className="audio"
              controls
              preload="metadata"
              src={mediaPath}
              onError={() => setMediaError(true)}
            >
              Your browser does not support audio playback.
            </audio>
          ))}

        {resource === 'infographic' &&
          (mediaError ? (
            <MediaFallback path={mediaPath} type="Infographic" />
          ) : (
            <img
              key={mediaPath}
              src={mediaPath}
              alt={`${selectedLeaf.label} — Infographic ${infographicVariant}`}
              className="infographic"
              onError={() => setMediaError(true)}
            />
          ))}

        {resource === 'questionnaire' ? (
          <div className="media-panel media-panel--questions">
            <Questionnaire src={mediaPath} urlKey={mediaPath} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
