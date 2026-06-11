export type ResourceType = 'video' | 'podcast' | 'infographic' | 'questionnaire';

export interface LeafNode {
  type: 'leaf';
  label: string;
  /** File prefix: penultimateBranch_lastBranch, e.g. AS_API */
  code: string;
}

export interface BranchNode {
  type: 'branch';
  label: string;
  children: MenuNode[];
}

export type MenuNode = BranchNode | LeafNode;

export interface SelectedContent {
  leaf: LeafNode;
  resource: ResourceType;
  infographicVariant?: 'I' | 'II';
}
