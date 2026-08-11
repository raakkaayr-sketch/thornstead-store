export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
}

export function LegalContent({
  sections,
  updated,
}: {
  sections: LegalSection[];
  updated: string;
}) {
  return (
    <div className="container-page px-6 py-12">
      <div className="prose-legal max-w-3xl">
        <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
