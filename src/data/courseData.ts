import type { MenuNode } from '../types';

export const COURSE_TITLE =
  'INFOGRAPHIC CHEMISTRY AND INTRODUCTORY BIOCHEMISTRY';

export const DEFAULT_INFOGRAPHIC = '/I_C_I_B.png';

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
