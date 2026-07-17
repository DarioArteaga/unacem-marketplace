import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "@/components/MermaidDiagram";

type CodeProps = {
  className?: string;
  children?: ReactNode;
};

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function Pre({ children }: { children?: ReactNode }): ReactElement {
  const child = Children.toArray(children)[0];

  if (isValidElement<CodeProps>(child)) {
    const className = child.props.className ?? "";
    if (className.includes("language-mermaid")) {
      return <MermaidDiagram chart={extractText(child.props.children)} />;
    }
  }

  return (
    <pre className="overflow-x-auto rounded-xl bg-ink px-4 py-3 text-sm text-white">
      {children}
    </pre>
  );
}

const components: MDXComponents = {
  pre: Pre,
  h2: (props) => (
    <h2
      className="mt-10 mb-3 font-serif text-2xl font-semibold text-brand first:mt-0"
      {...props}
    />
  ),
  p: (props) => <p className="mb-4 leading-relaxed text-ink" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-5 text-ink" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-5 text-ink" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => (
    <a className="font-medium text-brand underline-offset-2 hover:underline" {...props} />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-ink-muted/15 bg-surface">
      <table className="w-full min-w-[280px] border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-surface-muted" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr className="border-t border-ink-muted/10" {...props} />,
  th: (props) => (
    <th className="px-4 py-3 font-semibold text-brand" {...props} />
  ),
  td: (props) => <td className="px-4 py-3 align-top text-ink" {...props} />,
  code: (props) => {
    const className = props.className ?? "";
    if (className.includes("language-mermaid")) {
      return <code {...props} />;
    }
    return (
      <code
        className="rounded bg-surface-muted px-1.5 py-0.5 text-[0.9em] text-brand"
        {...props}
      />
    );
  },
};

type MdxContentProps = {
  source: string;
};

export async function MdxContent({ source }: MdxContentProps): Promise<ReactElement> {
  return (
    <div className="caso-prose max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
