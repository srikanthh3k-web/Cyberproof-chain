import { useState } from 'react';
import { SectionHeader, Card, Button } from '../App';

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);

  const generate = async () => {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId: 'INV-1001', investigationSummary: 'Credential stuffing campaign against privileged user accounts.', investigator: 'Marcus Chen' }),
    });
    const data = await response.json();
    setReport(data);
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${report.caseId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!report) return;
    const content = `Case ID: ${report.caseId}\nInvestigator: ${report.investigatorDetails}\nSummary: ${report.investigationSummary}\nIntegrity: ${report.integrityStatus}\nBlockchain: ${report.blockchainVerification}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<pre>${content}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <SectionHeader title="Forensic Report Generator" subtitle="Generate professional investigation documentation and preview the report" action={<Button onClick={generate}>Generate Forensic Report</Button>} />
      {report ? (
        <Card style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Case ID {report.caseId}</h3>
          <p><strong>Investigation Summary:</strong> {report.investigationSummary}</p>
          <p><strong>Investigator:</strong> {report.investigatorDetails}</p>
          <p><strong>Integrity Status:</strong> {report.integrityStatus}</p>
          <p><strong>Blockchain Verification:</strong> {report.blockchainVerification}</p>
          <p><strong>AI Findings:</strong> {report.aiFindings.summary}</p>
          <p><strong>Timeline:</strong> {report.timeline.length} chain-of-custody events</p>
          <div className="pill-row">
            <span className="pill">Preview Ready</span>
            <button className="btn btn-secondary" onClick={downloadReport}>Download JSON</button>
            <button className="btn btn-secondary" onClick={printReport}>Print</button>
            <button className="btn btn-ghost" onClick={() => setReport(null)}>Delete</button>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 18 }}><p className="muted">No report generated yet.</p></Card>
      )}
    </>
  );
}
