import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface ClientInfoProps {
  form: UseFormReturn<any>;
}

export const ClientInfoStep = ({ form }: ClientInfoProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Client Information</h3>
        <p className="text-muted-foreground">Enter details about your client and project.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              {...register("client.name", { required: "Client name is required" })}
              placeholder="John Smith"
            />
            {errors.client && 'name' in errors.client && (
              <p className="text-sm text-destructive mt-1">Client name is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="clientEmail">Email Address *</Label>
            <Input
              id="clientEmail"
              type="email"
              {...register("client.email", { 
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address"
                }
              })}
              placeholder="john@company.com"
            />
            {errors.client && 'email' in errors.client && (
              <p className="text-sm text-destructive mt-1">Please enter a valid email address</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="clientCompany">Company Name *</Label>
            <Input
              id="clientCompany"
              {...register("client.company", { required: "Company name is required" })}
              placeholder="Acme Corporation"
            />
            {errors.client && 'company' in errors.client && (
              <p className="text-sm text-destructive mt-1">Company name is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="clientPhone">Phone Number</Label>
            <Input
              id="clientPhone"
              {...register("client.phone")}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProposalDetailsProps {
  form: UseFormReturn<any>;
}

export const ProposalDetailsStep = ({ form }: ProposalDetailsProps) => {
  const { register, formState: { errors }, setValue, watch } = form;
  const template = watch("template");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Proposal Details</h3>
        <p className="text-muted-foreground">Configure the basic details of your proposal.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Proposal Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Proposal title is required" })}
            placeholder="Website Development Proposal"
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">Proposal title is required</p>
          )}
        </div>

        <div>
          <Label htmlFor="template">Template</Label>
          <Select onValueChange={(value) => setValue("template", value)} value={template}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent className="bg-background border">
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="marketing">Marketing Services</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="design">Design Services</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amount">Project Amount *</Label>
            <Input
              id="amount"
              type="number"
              {...register("financial.amount", { 
                required: "Project amount is required",
                min: { value: 1, message: "Amount must be greater than 0" }
              })}
              placeholder="25000"
            />
            {errors.financial && 'amount' in errors.financial && (
              <p className="text-sm text-destructive mt-1">Project amount is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select onValueChange={(value) => setValue("financial.currency", value)} defaultValue="USD">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Estimated Duration</Label>
          <Input
            id="duration"
            {...register("timeline.estimatedDuration")}
            placeholder="8 weeks"
          />
        </div>

        <div>
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Textarea
            id="paymentTerms"
            {...register("financial.paymentTerms")}
            placeholder="50% upfront, 50% upon completion"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

interface Section {
  id: string;
  type: 'text' | 'list' | 'pricing' | 'roi_calculator';
  title: string;
  content: any;
  order: number;
}

interface SectionsStepProps {
  form: UseFormReturn<any>;
}

export const SectionsStep = ({ form }: SectionsStepProps) => {
  const { setValue, watch } = form;
  const sections = watch("sections") || [];

  const addSection = (type: 'text' | 'list' | 'pricing' | 'roi_calculator') => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      title: "",
      content: type === 'list' ? [] : type === 'pricing' ? { headers: [], rows: [], total: 0 } : type === 'roi_calculator' ? { title: '', description: '' } : "",
      order: sections.length
    };
    setValue("sections", [...sections, newSection]);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_: any, i: number) => i !== index);
    setValue("sections", updatedSections);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...sections];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedSections[index][parent][child] = value;
    } else {
      updatedSections[index][field] = value;
    }
    setValue("sections", updatedSections);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Proposal Sections</h3>
        <p className="text-muted-foreground">Add content sections to your proposal.</p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => addSection('text')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Text Section
        </Button>
        <Button type="button" variant="outline" onClick={() => addSection('list')}>
          <Plus className="w-4 h-4 mr-2" />
          Add List Section
        </Button>
        <Button type="button" variant="outline" onClick={() => addSection('roi_calculator')}>
          <Plus className="w-4 h-4 mr-2" />
          Add ROI Calculator
        </Button>
        <Button type="button" variant="outline" onClick={() => addSection('pricing')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Table
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section: Section, index: number) => (
          <Card key={section.id} className="p-6 bg-card/50 backdrop-blur shadow-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="secondary" className="capitalize">
                    {section.type}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor={`section-title-${index}`}>Section Title</Label>
                <Input
                  id={`section-title-${index}`}
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  placeholder="Enter section title"
                />
              </div>

              {section.type === 'text' && (
                <div>
                  <Label htmlFor={`section-content-${index}`}>Content</Label>
                  <Textarea
                    id={`section-content-${index}`}
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    placeholder="Enter section content..."
                    rows={4}
                  />
                </div>
              )}

              {section.type === 'list' && (
                <div>
                  <Label>List Items</Label>
                  <div className="space-y-2">
                    {section.content.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newContent = [...section.content];
                            newContent[itemIndex] = e.target.value;
                            updateSection(index, 'content', newContent);
                          }}
                          placeholder="List item"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newContent = section.content.filter((_: any, i: number) => i !== itemIndex);
                            updateSection(index, 'content', newContent);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSection(index, 'content', [...section.content, ''])}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              )}

              {section.type === 'roi_calculator' && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    ROI Calculator will be automatically configured based on your proposal details.
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted">
                    <div className="text-center text-muted-foreground">
                      Interactive ROI Calculator Preview
                    </div>
                  </div>
                </div>
              )}

              {section.type === 'pricing' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pricing table functionality will be enhanced in future updates.
                  </p>
                  <Textarea
                    value={JSON.stringify(section.content, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateSection(index, 'content', parsed);
                      } catch (error) {
                        // Handle JSON parse error silently
                      }
                    }}
                    rows={6}
                    placeholder="Pricing table JSON"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}

        {sections.length === 0 && (
          <Card className="p-12 text-center bg-card/50 backdrop-blur shadow-card">
            <p className="text-muted-foreground">
              No sections added yet. Click the buttons above to add content sections.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};