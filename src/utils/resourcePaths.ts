import type { ResourceType } from '../types';

export function getMediaPath(
  code: string,
  resource: ResourceType,
  infographicVariant: 'I' | 'II' = 'I'
): string {
  switch (resource) {
    case 'video':
      return `/${code}_V.mp4`;
    case 'podcast':
      return `/${code}_P.m4a`;
    case 'infographic':
      return `/${code}_${infographicVariant}.png`;
    case 'questionnaire':
      return `/${code}_Q.csv`;
  }
}
