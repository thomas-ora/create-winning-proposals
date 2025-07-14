import { Card } from "@/components/ui/card";
import { ProposalSection as ProposalSectionType, PricingTable } from "@/data/types";

interface ProposalSectionProps {
  section: ProposalSectionType;
}

export const ProposalSection = ({ section }: ProposalSectionProps) => {
  return (
    <Card className="p-8 bg-card/50 backdrop-blur shadow-card">
      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
      <div className="prose prose-gray max-w-none">
        {section.type === 'text' && typeof section.content === 'string' && (
          section.content.split('\n').map((paragraph, i) => (
            <p key={i} className="text-foreground leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))
        )}
        {section.type === 'list' && Array.isArray(section.content) && (
          <ul className="space-y-2">
            {section.content.map((item, i) => (
              <li key={i} className="text-foreground leading-relaxed flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        )}
        {section.type === 'pricing' && typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {(section.content as PricingTable).headers.map((header, i) => (
                    <th key={i} className="text-left py-3 px-4 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(section.content as PricingTable).rows.map((row, i) => (
                  <tr key={i} className="border-b border-muted">
                    {(section.content as PricingTable).headers.map((header, j) => (
                      <td key={j} className="py-3 px-4">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
                {(section.content as PricingTable).total && (
                  <tr className="border-t-2 border-primary font-semibold">
                    <td className="py-3 px-4" colSpan={(section.content as PricingTable).headers.length - 1}>
                      Total Investment
                    </td>
                    <td className="py-3 px-4">
                      ${(section.content as PricingTable).total!.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};