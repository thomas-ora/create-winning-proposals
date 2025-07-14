import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { ClientInfoStep, ProposalDetailsStep, SectionsStep } from "@/components/proposal/ProposalForm";
import { toast } from "@/hooks/use-toast";

interface ProposalFormData {
  client: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };
  title: string;
  template: string;
  financial: {
    amount: number;
    currency: string;
    paymentTerms: string;
  };
  timeline: {
    estimatedDuration?: string;
  };
  sections: Array<{
    id: string;
    type: 'text' | 'list' | 'pricing';
    title: string;
    content: any;
    order: number;
  }>;
}

const STEPS = [
  { id: 1, name: 'Client Info', description: 'Basic client information' },
  { id: 2, name: 'Details', description: 'Proposal configuration' },
  { id: 3, name: 'Sections', description: 'Content sections' }
];

const CreateProposal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProposalFormData>({
    defaultValues: {
      client: {
        name: '',
        email: '',
        company: '',
        phone: ''
      },
      title: '',
      template: 'custom',
      financial: {
        amount: 0,
        currency: 'USD',
        paymentTerms: ''
      },
      timeline: {
        estimatedDuration: ''
      },
      sections: []
    }
  });

  const { handleSubmit, trigger, watch } = form;

  const progress = (currentStep / STEPS.length) * 100;

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await trigger(['client.name', 'client.email', 'client.company']);
      case 2:
        return await trigger(['title', 'financial.amount']);
      case 3:
        return true; // Sections are optional
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = async () => {
    const formData = form.getValues();
    setIsDraft(true);
    
    // Simulate saving draft
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Draft Saved",
      description: "Your proposal has been saved as a draft.",
    });
    
    setIsDraft(false);
  };

  const onSubmit = async (data: ProposalFormData) => {
    try {
      // Simulate proposal creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock proposal ID
      const proposalId = `proposal-${Date.now()}`;
      
      toast({
        title: "Proposal Created Successfully!",
        description: `Your proposal "${data.title}" has been created.`,
      });
      
      // Navigate to the new proposal
      navigate(`/proposal/${proposalId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ClientInfoStep form={form} />;
      case 2:
        return <ProposalDetailsStep form={form} />;
      case 3:
        return <SectionsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/proposals')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isDraft}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isDraft ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </div>

          {/* Progress Header */}
          <Card className="p-6 mb-8 bg-card/50 backdrop-blur shadow-card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create New Proposal</h1>
                <p className="text-muted-foreground">
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="flex justify-between">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex-1 text-center ${
                      step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm font-medium">{step.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-8 bg-card/50 backdrop-blur shadow-card">
              {renderCurrentStep()}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center"
                  >
                    Create Proposal
                    <FileText className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;