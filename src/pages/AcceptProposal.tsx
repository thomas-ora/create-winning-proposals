import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProposal } from '@/hooks/useProposal';
import { useProposalTracking } from '@/hooks/useProposalTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileSignature, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AcceptProposal = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const { proposal, loading } = useProposal(proposalId);
  const { trackInteraction } = useProposalTracking(proposalId || '');
  
  const [step, setStep] = useState<'review' | 'sign' | 'payment'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proposal Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setSignatureData(dataURL);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  const handleCreateAgreement = async () => {
    setIsProcessing(true);
    
    try {
      trackInteraction('agreement_review_completed', { step: 'review' });
      setStep('sign');
    } catch (error) {
      toast.error('Error proceeding to signature step');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!signatureData || !signerName || !signerEmail) {
      toast.error('Please complete your signature and contact information');
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-sales-agreement', {
        body: {
          proposal_id: proposalId,
          signer_name: signerName,
          signer_email: signerEmail,
          signature_data: signatureData
        }
      });

      if (error) throw error;

      trackInteraction('agreement_signed', { agreement_id: data.agreement_id });
      setStep('payment');
    } catch (error) {
      toast.error('Error processing signature');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-agreement-payment', {
        body: {
          proposal_id: proposalId,
          amount: proposal.financial?.amount || 499900 // Default to $4,999 if no amount specified
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      trackInteraction('payment_initiated', { session_id: data.session_id });
      
      toast.success('Payment page opened. Please complete your payment in the new tab.');
    } catch (error) {
      toast.error('Error creating payment session');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-primary' : step === 'sign' || step === 'payment' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-primary text-white' : step === 'sign' || step === 'payment' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
                1
              </div>
              <span>Review Agreement</span>
            </div>
            
            <div className={`w-16 h-0.5 ${step === 'sign' || step === 'payment' ? 'bg-green-600' : 'bg-muted'}`} />
            
            <div className={`flex items-center space-x-2 ${step === 'sign' ? 'text-primary' : step === 'payment' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'sign' ? 'bg-primary text-white' : step === 'payment' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
                <FileSignature className="w-4 h-4" />
              </div>
              <span>Sign Agreement</span>
            </div>
            
            <div className={`w-16 h-0.5 ${step === 'payment' ? 'bg-green-600' : 'bg-muted'}`} />
            
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-muted'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {step === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sales Agreement Review</CardTitle>
              <p className="text-muted-foreground">Please review the terms below before proceeding</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Client Information</h3>
                  <p className="text-sm text-muted-foreground">Name: {proposal.client?.name}</p>
                  <p className="text-sm text-muted-foreground">Email: {proposal.client?.email}</p>
                  {proposal.client?.company && (
                    <p className="text-sm text-muted-foreground">Company: {proposal.client.company}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Project Details</h3>
                  <p className="text-sm text-muted-foreground">Service: {proposal.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Value: ${((proposal.financial?.amount || 0) / 100).toLocaleString()}
                  </p>
                  {proposal.timeline?.expiresAt && (
                    <p className="text-sm text-muted-foreground">
                      Valid Until: {proposal.timeline.expiresAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Executive Summary</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    {(() => {
                      const textSection = proposal.sections?.find(s => s.type === 'text');
                      return typeof textSection?.content === 'string' 
                        ? textSection.content 
                        : 'Executive summary will be displayed here.';
                    })()}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Terms & Conditions</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Payment terms: Setup fee due upon agreement signing</p>
                  <p>• Project timeline will be confirmed after payment processing</p>
                  <p>• All work performed according to industry standard practices</p>
                  <p>• Client satisfaction guaranteed with revision process</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/p/${proposalId}`)}>
                  Back to Proposal
                </Button>
                <Button onClick={handleCreateAgreement} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed to Signature
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'sign' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Electronic Signature</CardTitle>
              <p className="text-muted-foreground">Please provide your signature and contact information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signerName">Full Name *</Label>
                  <Input
                    id="signerName"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="signerEmail">Email Address *</Label>
                  <Input
                    id="signerEmail"
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label>Digital Signature *</Label>
                <div className="border rounded-lg p-4 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="border border-dashed border-gray-300 w-full h-48 cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">Sign above with your mouse or touch screen</p>
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  By signing above, I acknowledge that I have read and agree to the terms and conditions 
                  outlined in this agreement. This electronic signature has the same legal validity as a 
                  handwritten signature.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('review')}>
                  Back to Review
                </Button>
                <Button onClick={handleSignAgreement} disabled={isProcessing || !signatureData || !signerName || !signerEmail}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Setup Fee Payment</CardTitle>
              <p className="text-muted-foreground">Complete your payment to begin the project</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Setup Fee</span>
                  <span className="text-2xl font-bold">
                    ${((proposal.financial?.amount || 499900) / 100).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This covers initial project setup and first milestone. Remaining payments will be 
                  processed according to the agreed schedule.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Secure payment processing via Stripe</li>
                  <li>• Automatic project onboarding initiation</li>
                  <li>• Team notification and project setup</li>
                  <li>• You'll receive a confirmation email with next steps</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('sign')}>
                  Back to Signature
                </Button>
                <Button onClick={handlePayment} disabled={isProcessing} size="lg">
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AcceptProposal;