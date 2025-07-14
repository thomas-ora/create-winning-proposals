import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, DollarSign, FileText, Eye, ArrowRight } from "lucide-react";
import { proposalTemplates, getAllCategories } from '@/data/proposalTemplates';
import { formatCurrency } from '@/utils/formatters';
import AppLayout from '@/components/layout/AppLayout';

const Templates = () => {
  const categories = getAllCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <Button asChild>
              <Link to="/proposals/create">
                Create Custom Proposal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4">Proposal Templates</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our professionally crafted templates to create compelling proposals quickly. 
              Each template includes industry-specific content and proven structures.
            </p>
          </motion.div>

          {/* Categories */}
          {categories.map((category) => {
            const categoryTemplates = proposalTemplates.filter(t => t.category === category);
            
            return (
              <motion.div 
                key={category}
                className="mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-bold mb-6"
                  variants={itemVariants}
                >
                  {category}
                </motion.h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTemplates.map((template) => (
                    <motion.div key={template.id} variants={itemVariants}>
                      <Card className="p-6 h-full flex flex-col bg-card/50 backdrop-blur shadow-card hover:shadow-elegant transition-all duration-200 group">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{template.icon}</div>
                            <div>
                              <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                                {template.name}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 flex-grow">
                          {template.description}
                        </p>

                        {/* Metrics */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Value Range</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrency(template.estimatedValue.min)} - {formatCurrency(template.estimatedValue.max)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Duration</span>
                            </div>
                            <span className="font-medium">{template.duration}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Sections</span>
                            </div>
                            <span className="font-medium">{template.sections.length} sections</span>
                          </div>
                        </div>

                        {/* Section Preview */}
                        <div className="mb-6">
                          <p className="text-sm font-medium mb-3">Includes:</p>
                          <div className="space-y-2">
                            {template.sections.slice(0, 4).map((section) => (
                              <div key={section.id} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span className="text-sm text-muted-foreground">{section.title}</span>
                              </div>
                            ))}
                            {template.sections.length > 4 && (
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                                <span className="text-sm text-muted-foreground">
                                  +{template.sections.length - 4} more sections
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3 mt-auto">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/proposals/create?template=${template.id}`}>
                              Use Template
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Custom Template CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our templates cover most common scenarios, but if you need something specific, 
                you can always start with a blank proposal and build it from scratch.
              </p>
              <Button asChild size="lg">
                <Link to="/proposals/create?template=custom">
                  Create Custom Proposal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default Templates;