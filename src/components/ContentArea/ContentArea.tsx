import { useState, useEffect } from 'react';
import { DEFAULT_INFOGRAPHIC } from '../../data/courseData';
import type { LeafNode, ResourceType } from '../../types';
import { getMediaPath } from '../../utils/resourcePaths';
import { Questionnaire } from '../Questionnaire/Questionnaire';

interface ContentAreaProps {
  selectedLeaf: LeafNode | null;
}

const RESOURCE_TABS: { id: ResourceType; label: string; icon: string }[] = [
  { id: 'video', label: 'Video', icon: '▶' },
  { id: 'podcast', label: 'Podcast', icon: '♫' },
  { id: 'infographic', label: 'Infographic', icon: '◫' },
  { id: 'questionnaire', label: 'Questionnaire', icon: '?' },
];

function MediaFallback({ path, type }: { path: string; type: string }) {
  return (
    <div className="content-error">
      <p>{type} not available yet.</p>
      <p className="content-error-file">Expected file: {path}</p>
    </div>
  );
}

export function ContentArea({ selectedLeaf }: ContentAreaProps) {
  const [resource, setResource] = useState<ResourceType>('video');
  const [infographicVariant, setInfographicVariant] = useState<'I' | 'II'>('I');
  const [mediaError, setMediaError] = useState(false);

  const [homeImageError, setHomeImageError] = useState(false);

  useEffect(() => {
    setHomeImageError(false);
  }, [selectedLeaf]);

  if (!selectedLeaf) {
    return (
      <div className="content-home">
        {!homeImageError ? (
          <img
            src={DEFAULT_INFOGRAPHIC}
            alt="Course overview infographic"
            className="home-infographic"
            onError={() => setHomeImageError(true)}
          />
        ) : (
          <div className="content-error">
            <p>Course overview infographic</p>
            <p className="content-error-file">Expected file: {DEFAULT_INFOGRAPHIC}</p>
          </div>
        )}
      </div>
    );
  }

  const handleResourceChange = (r: ResourceType) => {
    setResource(r);
    setMediaError(false);
    if (r === 'infographic') setInfographicVariant('I');
  };

  const mediaPath = getMediaPath(selectedLeaf.code, resource, infographicVariant);

  return (
    <div className="content-topic">
      <header className="content-header">
        <h2>{selectedLeaf.label}</h2>
        <span className="content-code">{selectedLeaf.code}</span>
      </header>

      <div className="resource-tabs" role="tablist">
        {RESOURCE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={resource === tab.id}
            className={`resource-tab${resource === tab.id ? ' active' : ''}`}
            onClick={() => handleResourceChange(tab.id)}
          >
            <span className="tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {resource === 'infographic' && (
        <div className="infographic-toggle">
          <button
            type="button"
            className={`toggle-btn${infographicVariant === 'I' ? ' active' : ''}`}
            onClick={() => {
              setInfographicVariant('I');
              setMediaError(false);
            }}
          >
            Infographic I
          </button>
          <button
            type="button"
            className={`toggle-btn${infographicVariant === 'II' ? ' active' : ''}`}
            onClick={() => {
              setInfographicVariant('II');
              setMediaError(false);
            }}
          >
            Infographic II
          </button>
        </div>
      )}

      <div className="content-viewer">
        {resource === 'video' && (
          mediaError ? (
            <MediaFallback path={mediaPath} type="Video" />
          ) : (
            <video
              key={mediaPath}
              className="media-player"
              controls
              src={mediaPath}
              onError={() => setMediaError(true)}
            >
              Your browser does not support video playback.
            </video>
          )
        )}

        {resource === 'podcast' && (
          mediaError ? (
            <MediaFallback path={mediaPath} type="Podcast" />
          ) : (
            <div className="audio-wrapper">
              <div className="audio-visual" aria-hidden="true">
                <span>♫</span>
              </div>
              <audio
                key={mediaPath}
                className="media-player audio"
                controls
                src={mediaPath}
                onError={() => setMediaError(true)}
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          )
        )}

        {resource === 'infographic' && (
          mediaError ? (
            <MediaFallback path={mediaPath} type="Infographic" />
          ) : (
            <img
              key={mediaPath}
              src={mediaPath}
              alt={`${selectedLeaf.label} — Infographic ${infographicVariant}`}
              className="infographic-image"
              onError={() => setMediaError(true)}
            />
          )
        )}

        {resource === 'questionnaire' && (
          <Questionnaire src={mediaPath} title={selectedLeaf.label} />
        )}
      </div>
    </div>
  );
}
