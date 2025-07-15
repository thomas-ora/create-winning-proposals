import React from 'react';
import { FileText } from 'lucide-react';

interface SimpleProposalHeaderProps {
  clientName?: string;
  logoUrl?: string;
}

export const SimpleProposalHeader: React.FC<SimpleProposalHeaderProps> = ({ 
  clientName,
  logoUrl 
}) => {
  return (
    <header className="h-16 bg-white px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Logo" 
            style={{ height: '32px', maxHeight: '32px' }}
            className="w-auto"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <div style={{ width: '24px', height: '24px' }} className="bg-alter-primary rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-500">ORA Systems</span>
          </div>
        )}
      </div>

      {/* Client Name */}
      {clientName && (
        <div className="text-xs text-gray-400">
          Proposal for {clientName}
        </div>
      )}
    </header>
  );
};