import type { MenuNode } from '../types';

export const COURSE_TITLE =
  'CHEMISTRY AND INTRODUCTORY BIOCHEMISTRY';

export const DEFAULT_INFOGRAPHIC = '/I_C_I_B.png';

export const CHAPTER_COLORS: Record<string, string> = {
  'General Chemistry': '#14213d',
  'Organic Chemistry': '#2d4636',
  'Introductory Biochemistry': '#d36b31',
};

export const CHAPTER_IDS: Record<string, string> = {
  'General Chemistry': 'gc',
  'Organic Chemistry': 'oc',
  'Introductory Biochemistry': 'ib',
};

export interface LeafContext {
  chapter: string;
  subchapter: string;
  chapterId: string;
  color: string;
}

function walkBranch(
  node: MenuNode,
  chapterLabel: string,
  chapterId: string,
  color: string,
  parentLabel: string | null,
  code: string,
): LeafContext | null {
  if (node.type === 'leaf') {
    if (node.code !== code) return null;
    return {
      chapter: chapterLabel,
      subchapter: parentLabel ?? node.label,
      chapterId,
      color,
    };
  }

  for (const child of node.children) {
    const found = walkBranch(child, chapterLabel, chapterId, color, node.label, code);
    if (found) return found;
  }

  return null;
}

export function findLeafContext(code: string): LeafContext | null {
  for (const chapter of courseMenu) {
    if (chapter.type !== 'branch') continue;

    const chapterId = CHAPTER_IDS[chapter.label] ?? 'gc';
    const color = CHAPTER_COLORS[chapter.label] ?? '#14213d';

    for (const child of chapter.children) {
      const found = walkBranch(child, chapter.label, chapterId, color, null, code);
      if (found) return found;
    }
  }

  return null;
}

export function countChapterTopics(chapter: MenuNode): number {
  if (chapter.type === 'leaf') return 1;

  let count = 0;
  for (const child of chapter.children) {
    count += countChapterTopics(child);
  }
  return count;
}

export const courseMenu: MenuNode[] = [
  {
    type: 'branch',
    label: 'General Chemistry',
    children: [
      {
        type: 'branch',
        label: 'Atomic Structure',
        children: [
          { type: 'leaf', label: 'Atomic particles and isotopes', code: 'AS_API' },
          { type: 'leaf', label: 'Quantum mechanical model', code: 'AS_QMM' },
          { type: 'leaf', label: 'Quantum numbers and orbitals', code: 'AS_QNO' },
          { type: 'leaf', label: 'Chemical bonds', code: 'AS_CB' },
        ],
      },
      {
        type: 'branch',
        label: 'Matter and Thermodynamics',
        children: [
          { type: 'leaf', label: 'Gases and their properties', code: 'MT_GIGL' },
          { type: 'leaf', label: 'Liquid-vapor pressure', code: 'MT_LVP' },
          { type: 'leaf', label: 'Solids classification', code: 'MT_SC' },
          { type: 'leaf', label: 'Entropy, Energy and Free energy', code: 'MT_EEFE' },
        ],
      },
      {
        type: 'branch',
        label: 'Solutions and Equilibrium',
        children: [
          { type: 'leaf', label: 'Concentration and Dilution', code: 'SE_CD' },
          { type: 'leaf', label: 'Kinetics and Energy Laws', code: 'SE_KEL' },
          { type: 'leaf', label: 'Equilibrium constants', code: 'SE_EC' },
          { type: 'leaf', label: "Le Chatelier's Principle", code: 'SE_LCF' },
        ],
      },
      {
        type: 'branch',
        label: 'Electrolytes and Kinetics',
        children: [
          { type: 'leaf', label: 'Acid-base theories', code: 'EK_ABT' },
          { type: 'leaf', label: 'pH and Buffers', code: 'EK_PB' },
          { type: 'leaf', label: 'Colligative properties', code: 'EK_CP' },
          { type: 'leaf', label: 'Activation energy', code: 'EK_AE' },
          { type: 'leaf', label: 'Redox reactions', code: 'EK_RR' },
        ],
      },
    ],
  },
  {
    type: 'branch',
    label: 'Organic Chemistry',
    children: [
      {
        type: 'branch',
        label: 'Hydrocarbons',
        children: [
          { type: 'leaf', label: 'Carbon hybridization', code: 'H_CH' },
          { type: 'leaf', label: 'Alkanes and Cycloalkanes', code: 'H_AC' },
          { type: 'leaf', label: 'Alkenes and Alkynes', code: 'H_AA' },
          { type: 'leaf', label: 'Aromatic compounds and Benzene', code: 'H_ACB' },
        ],
      },
      {
        type: 'branch',
        label: 'Functional Groups',
        children: [
          { type: 'leaf', label: 'Alcohols, Phenols and Ethers', code: 'FG_APT' },
          { type: 'leaf', label: 'Aldehydes and Ketones', code: 'FG_AK' },
          { type: 'leaf', label: 'Carboxylic acids and Esters', code: 'FG_CAE' },
          { type: 'leaf', label: 'Amines and Amides', code: 'FG_AA' },
        ],
      },
      {
        type: 'leaf',
        label: 'Stereochemistry and Chirality',
        code: 'OC_SC',
      },
    ],
  },
  {
    type: 'branch',
    label: 'Introductory Biochemistry',
    children: [
      { type: 'leaf', label: 'Carbohydrates and Monosaccharides', code: 'IB_CM' },
      { type: 'leaf', label: 'Amino acids and Proteins', code: 'IB_AP' },
      { type: 'leaf', label: 'Lipids and Biomembranes', code: 'IB_LSP' },
      { type: 'leaf', label: 'Nitrogen Bases and Nucleotides', code: 'IB_NBN' },
    ],
  },
];
