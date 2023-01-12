import { DEFAULT_RENDERERS } from 'myst-to-react';
import { MystDemoRenderer } from 'myst-demo';
import { MermaidNodeRenderer } from '@myst-theme/diagrams';
import OUTPUT_RENDERERS from '@myst-theme/jupyter';

export const renderers = {
  ...DEFAULT_RENDERERS,
  myst: MystDemoRenderer,
  mermaid: MermaidNodeRenderer,
  ...OUTPUT_RENDERERS,
};
