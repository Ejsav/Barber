import { jsonLdScript } from '@/lib/jsonld';

/** Renders a structured-data block. Server component — no client JS. */
export function JsonLd({ data, id }: { data: object; id: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}
