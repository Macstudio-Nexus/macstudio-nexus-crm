import { Files } from "lucide-react";
import { WebProjectDocs } from "@/types";

export default function ProjectDocumentsViewer({
  questionnaire,
  quote,
  contract,
  invoice,
}: WebProjectDocs) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 bg-component-bg rounded-xl border border-border h-fit max-w-fit 2xl:min-w-sm p-4">
      <div className="flex items-center justify-left gap-3 w-full">
        <Files className="size-12 text-neon-green bg-neon-green-trans rounded-xl p-2" />
        <h1 className="text-2xl">Documents</h1>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-3">
        {questionnaire ? (
          <a className="project-page-button" href={questionnaire}>View Questionnaire</a>
        ) : (
          <span className="project-page-button">Upload Questionnaire</span>
        )}
        {quote ? (
          <a className="proejct-page-button" href={quote}>View Quote</a>
        ) : (
          <button className="project-page-button">Create Quote</button>
        )}
        {contract ? (
          <a className="proejct-page-button" href={contract}>View contract</a>
        ) : (
          <button className="project-page-button">Create Contract</button>
        )}
        {invoice ? (
          <a className="proejct-page-button" href={invoice}>View Invoice</a>
        ) : (
          <button className="project-page-button">Create Invoice</button>
        )}
      </div>
    </div>
  );
}
