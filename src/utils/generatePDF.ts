import { pdf } from '@react-pdf/renderer';
import { ProposalPDF } from '@/components/proposal/ProposalPDF';
import { ProposalData } from '@/data/types';
import { trackProposalEvent } from './analytics';

interface GeneratePDFOptions {
  proposal: ProposalData;
  filename?: string;
}

export const generatePDF = async ({ 
  proposal, 
  filename = `${proposal.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf` 
}: GeneratePDFOptions): Promise<Blob> => {
  try {
    // Create PDF document
    const doc = ProposalPDF({ proposal });
    
    // Generate PDF blob
    const blob = await pdf(doc).toBlob();
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPDF = async ({ 
  proposal, 
  filename = `${proposal.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proposal.pdf` 
}: GeneratePDFOptions): Promise<void> => {
  try {
    // Generate PDF blob
    const blob = await generatePDF({ proposal, filename });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};

export const trackPDFDownload = async (proposalId: string) => {
  try {
    await trackProposalEvent(proposalId, 'pdf_download', {
      downloadTime: new Date().toISOString(),
      fileType: 'pdf'
    });
  } catch (error) {
    console.error('Error tracking PDF download:', error);
    // Don't throw error for tracking failures
  }
};