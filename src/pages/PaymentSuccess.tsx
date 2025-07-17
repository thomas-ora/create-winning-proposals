import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const sessionId = searchParams.get('session_id');
  const proposalId = searchParams.get('proposal_id');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!sessionId) {
        setError('Missing payment session information');
        setIsProcessing(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('process-payment-success', {
          body: {
            session_id: sessionId,
            proposal_id: proposalId
          }
        });

        if (error) throw error;

        setPaymentData(data);
        toast.success('Payment completed successfully! Onboarding has been initiated.');
      } catch (error) {
        console.error('Error processing payment:', error);
        setError(error instanceof Error ? error.message : 'Failed to process payment');
        toast.error('Error processing payment completion');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [sessionId, proposalId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-xl font-semibold">Processing Your Payment</h2>
              <p className="text-muted-foreground text-center">
                Please wait while we confirm your payment and initiate the onboarding process...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Processing Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">{error}</p>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
              {proposalId && (
                <Button onClick={() => navigate(`/p/${proposalId}`)}>
                  Back to Proposal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <p className="text-muted-foreground">
              Your payment has been processed and your project onboarding has begun.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {paymentData && (
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <h3 className="font-semibold">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Client:</span>
                    <p className="font-medium">{paymentData.client_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">${(paymentData.amount / 100).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Project:</span>
                    <p className="font-medium">Setup fee for onboarding process</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Automatic Onboarding Initiated</p>
                    <p className="text-sm text-muted-foreground">
                      Our team has been notified and the project setup process has begun.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Welcome Email Sent</p>
                    <p className="text-sm text-muted-foreground">
                      Check your inbox for detailed next steps and project timeline.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Project Kickoff Scheduled</p>
                    <p className="text-sm text-muted-foreground">
                      We'll reach out within 24 hours to schedule your project kickoff call.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Save this confirmation page. You'll receive a detailed 
                receipt via email, but this serves as immediate confirmation of your successful payment.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <Button onClick={() => navigate('/')} size="lg" className="w-full">
                Return to Homepage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {proposalId && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/p/${proposalId}`)}
                  className="w-full"
                >
                  View Original Proposal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;