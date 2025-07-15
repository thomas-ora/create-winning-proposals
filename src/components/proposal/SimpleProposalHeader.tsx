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
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-alter-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900">ORA Systems</span>
          </div>
        )}
      </div>

      {/* Client Name */}
      {clientName && (
        <div className="text-gray-600 font-medium">
          Proposal for {clientName}
        </div>
      )}
    </header>
  );
};