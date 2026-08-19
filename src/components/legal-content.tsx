export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
  /**
   * Hervorgehobener Block, etwa für das Muster-Widerrufsformular, das nach
   * Anlage 2 zu Art. 246a EGBGB im Wortlaut wiedergegeben werden soll.
   */
  boxed?: string[];
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
        <p className="text-sm text-muted-foreground">
          Zuletzt aktualisiert: {updated}
        </p>
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
            {section.boxed && (
              <div className="not-prose my-6 rounded-2xl border border-border bg-muted/40 px-5 py-4">
                {section.boxed.map((line) => (
                  <p
                    key={line}
                    className="mb-2 text-sm leading-relaxed text-foreground last:mb-0"
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
