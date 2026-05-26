type JsonLdSchema = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ schema }: { schema: JsonLdSchema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
