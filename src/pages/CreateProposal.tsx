import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { ClientInfoStep, ProposalDetailsStep, SectionsStep } from "@/components/proposal/ProposalForm";
import { getTemplateById } from "@/data/proposalTemplates";
import { toast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { proposalService } from "@/services/proposalService";

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
    type: 'text' | 'list' | 'pricing' | 'roi_calculator';
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
  
  // Check for template parameter in URL
  const searchParams = new URLSearchParams(window.location.search);
  const templateParam = searchParams.get('template');

  const form = useForm<ProposalFormData>({
    defaultValues: {
      client: {
        name: '',
        email: '',
        company: '',
        phone: ''
      },
      title: '',
      template: templateParam || 'custom',
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

  // Apply template on mount if template parameter exists
  useEffect(() => {
    if (templateParam && templateParam !== 'custom') {
      handleTemplateSelect(templateParam);
    }
  }, [templateParam]);

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

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'custom') {
      // Clear sections for custom proposal
      form.setValue('sections', []);
      return;
    }

    const template = getTemplateById(templateId);
    if (template) {
      // Pre-populate form with template data
      form.setValue('financial.currency', template.financial.currency);
      form.setValue('financial.paymentTerms', template.financial.paymentTerms);
      
      // Set estimated amount to middle of range
      const avgAmount = Math.round((template.estimatedValue.min + template.estimatedValue.max) / 2);
      form.setValue('financial.amount', avgAmount);
      
      // Set estimated duration
      form.setValue('timeline.estimatedDuration', template.duration);
      
      // Pre-populate sections from template
      form.setValue('sections', template.sections);
      
      toast({
        title: "Template Applied",
        description: `${template.name} template has been applied to your proposal.`,
      });
    }
  };

  const validateFormData = (data: ProposalFormData): string[] => {
    const errors: string[] = [];
    
    // Validate client data
    if (!data.client?.name?.trim()) errors.push("Client name is required");
    if (!data.client?.email?.trim()) errors.push("Client email is required");
    if (!data.client?.company?.trim()) errors.push("Client company is required");
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.client?.email && !emailRegex.test(data.client.email)) {
      errors.push("Client email format is invalid");
    }
    
    // Validate proposal data
    if (!data.title?.trim()) errors.push("Proposal title is required");
    if (!data.financial?.amount || data.financial.amount <= 0) {
      errors.push("Financial amount must be greater than 0");
    }
    if (!data.financial?.currency?.trim()) errors.push("Currency is required");
    
    // Validate sections (at least one is recommended)
    if (!data.sections || data.sections.length === 0) {
      console.warn("No sections added to proposal - this is allowed but not recommended");
    }
    
    return errors;
  };

  const onSubmit = async (data: ProposalFormData) => {
    console.log("=== START CREATE PROPOSAL SUBMISSION ===");
    console.log("Current step:", currentStep);
    console.log("Complete form data:", JSON.stringify(data, null, 2));
    
    try {
      // Validate form data before submission
      console.log("Validating form data...");
      const validationErrors = validateFormData(data);
      
      if (validationErrors.length > 0) {
        console.error("Form validation failed:", validationErrors);
        toast({
          title: "Validation Error",
          description: validationErrors.join(". "),
          variant: "destructive"
        });
        return;
      }
      
      console.log("Form validation passed");
      
      // Check if all required fields are present
      console.log("Checking required fields...");
      const requiredChecks = {
        clientName: !!data.client?.name?.trim(),
        clientEmail: !!data.client?.email?.trim(),
        clientCompany: !!data.client?.company?.trim(),
        proposalTitle: !!data.title?.trim(),
        financialAmount: data.financial?.amount > 0,
        financialCurrency: !!data.financial?.currency?.trim()
      };
      
      console.log("Required fields check:", requiredChecks);
      
      const missingFields = Object.entries(requiredChecks)
        .filter(([_, isPresent]) => !isPresent)
        .map(([field, _]) => field);
      
      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive"
        });
        return;
      }
      
      // Create the proposal request object
      console.log("Creating proposal request object...");
      const proposalRequest = {
        client: {
          first_name: data.client.name.split(' ')[0] || data.client.name,
          last_name: data.client.name.split(' ').slice(1).join(' ') || '',
          email: data.client.email,
          company_name: data.client.company,
          phone: data.client.phone || undefined,
        },
        psychology_profile: {
          risk_tolerance: "moderate",
          decision_making_style: "analytical",
          communication_preference: "detailed"
        },
        proposal: {
          title: data.title,
          executive_summary: "This proposal outlines a comprehensive solution tailored to your business needs.",
          sections: data.sections.map(section => ({
            type: section.type,
            title: section.title,
            content: section.content
          })),
          financial_amount: Number(data.financial.amount),
          financial_currency: data.financial.currency,
          payment_terms: data.financial.paymentTerms || "Net 30",
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          prepared_by: "ORA Systems Team",
          password_protected: false,
          brand_color: "#7B7FEB"
        }
      };
      
      console.log("Proposal request object:", JSON.stringify(proposalRequest, null, 2));
      
      // Validate the proposal request object
      if (!proposalRequest.client.first_name) {
        throw new Error("Client first name is missing after processing");
      }
      if (!proposalRequest.client.email) {
        throw new Error("Client email is missing after processing");
      }
      if (!proposalRequest.proposal.title) {
        throw new Error("Proposal title is missing after processing");
      }
      if (isNaN(proposalRequest.proposal.financial_amount)) {
        throw new Error("Financial amount is not a valid number");
      }
      
      console.log("Making API call to create proposal...");
      
      // Use a demo API key for now - in production this would come from user settings
      const demoApiKey = "demo-api-key-12345";
      console.log("Using API key:", demoApiKey);
      
      const response = await proposalService.createProposal(proposalRequest, demoApiKey);
      console.log("API response:", response);
      
      if (!response || !response.proposal_id) {
        throw new Error("Invalid response from proposal service - missing proposal ID");
      }
      
      console.log("Proposal created successfully with ID:", response.proposal_id);
      
      toast({
        title: "Proposal Created Successfully!",
        description: `Your proposal "${data.title}" has been created.`,
      });
      
      // Navigate to the newly created proposal
      console.log("Navigating to proposal:", `/p/${response.proposal_id}`);
      navigate(`/p/${response.proposal_id}`);
      
    } catch (error: any) {
      console.error("=== ERROR CREATING PROPOSAL ===");
      console.error("Error details:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      
      // Try to extract more meaningful error information
      let errorMessage = "Failed to create proposal. Please try again.";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.statusText) {
        errorMessage = `API Error: ${error.response.statusText}`;
      }
      
      console.error("Final error message to display:", errorMessage);
      
      toast({
        title: "Error Creating Proposal",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      console.log("=== END CREATE PROPOSAL SUBMISSION ===");
    }
  };

  const renderCurrentStep = () => {
    console.log("Rendering step:", currentStep);
    console.log("Form values for current step:", form.getValues());
    
    try {
      switch (currentStep) {
        case 1:
          console.log("Rendering ClientInfoStep");
          return <ClientInfoStep form={form} />;
        case 2:
          console.log("Rendering ProposalDetailsStep");
          return <ProposalDetailsStep form={form} onTemplateSelect={handleTemplateSelect} />;
        case 3:
          console.log("Rendering SectionsStep");
          return <SectionsStep form={form} />;
        default:
          console.warn("Unknown step:", currentStep);
          return null;
      }
    } catch (error) {
      console.error("Error rendering current step:", error);
      return (
        <div className="p-4 text-center">
          <p className="text-destructive">Error rendering form step. Please refresh and try again.</p>
          <p className="text-sm text-muted-foreground mt-2">Step: {currentStep}</p>
        </div>
      );
    }
  };

  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default CreateProposal;