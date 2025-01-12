import type { NodeRenderer } from '@myst-theme/providers';
import { useEffect, useState } from 'react';

async function parse(id: string, text: string): Promise<string> {
  const { default: mermaid } = await import('mermaid');
  return await new Promise<string>((resolve) => {
    mermaid.render(id, text, (code) => {
      resolve(code);
    });
  });
}

export function MermaidRenderer({ id, value }: { value: string; id: string }) {
  const [graph, setGraph] = useState<string>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    parse(id, value)
      .then((svg) => {
        setGraph(svg);
        setError(undefined);
      })
      .catch((err) => {
        setGraph(undefined);
        setError(err as Error);
      });
  }, []);
  return (
    <figure className="">
      {graph && <div dangerouslySetInnerHTML={{ __html: graph }}></div>}
      {error && (
        <pre>
          Error parsing mermaid graph.
          {'\n\n'}
          {value}
        </pre>
      )}
    </figure>
  );
}

export const MermaidNodeRenderer: NodeRenderer = ({ node }) => {
  return <MermaidRenderer id={node.key} value={node.value} />;
};
