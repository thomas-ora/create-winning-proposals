import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, DollarSign, FileText } from "lucide-react";
import { ProposalTemplate } from '@/data/proposalTemplates';
import { formatCurrency } from '@/utils/formatters';

interface TemplateSelectorProps {
  templates: ProposalTemplate[];
  selectedTemplate?: string;
  onSelectTemplate: (templateId: string) => void;
  className?: string;
}

export const TemplateSelector = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate,
  className = ""
}: TemplateSelectorProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
        <p className="text-muted-foreground">
          Select a pre-built template to get started quickly, or choose "Custom" to start from scratch.
        </p>
      </div>

      <motion.div 
        className="grid md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {templates.map((template) => (
          <motion.div key={template.id} variants={cardVariants}>
            <Card 
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                selectedTemplate === template.id 
                  ? 'border-primary shadow-lg bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{template.icon}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{template.name}</h4>
                    <Badge variant="secondary" className="mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatCurrency(template.estimatedValue.min)} - {formatCurrency(template.estimatedValue.max)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{template.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {template.sections.length} sections
                  </span>
                </div>
                <Button 
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Select'}
                </Button>
              </div>

              {/* Section Preview */}
              <div className="mt-4 pt-4 border-t border-muted">
                <p className="text-xs text-muted-foreground mb-2">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 3).map((section) => (
                    <Badge key={section.id} variant="outline" className="text-xs">
                      {section.title}
                    </Badge>
                  ))}
                  {template.sections.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.sections.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Custom Template Option */}
        <motion.div variants={cardVariants}>
          <Card 
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              selectedTemplate === 'custom' 
                ? 'border-primary shadow-lg bg-primary/5' 
                : 'border-muted hover:border-primary/50'
            }`}
            onClick={() => onSelectTemplate('custom')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="font-semibold text-lg">Custom Proposal</h4>
                  <Badge variant="secondary" className="mt-1">
                    Custom
                  </Badge>
                </div>
              </div>
              {selectedTemplate === 'custom' && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-4">
              Start with a blank proposal and add your own sections and content.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fully customizable</span>
              </div>
              <Button 
                variant={selectedTemplate === 'custom' ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate('custom');
                }}
              >
                {selectedTemplate === 'custom' ? 'Selected' : 'Select'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};