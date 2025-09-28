import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProposalView from "./pages/ProposalView";
import AcceptProposal from "./pages/AcceptProposal";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProposalList from "./pages/ProposalList";
import ProposalAnalytics from "./pages/ProposalAnalytics";
import GeneralAnalytics from "./pages/GeneralAnalytics";
import CompareProposals from "./pages/CompareProposals";
import CreateProposal from "./pages/CreateProposal";
import Templates from "./pages/Templates";
import APIKeys from "./pages/APIKeys";
import APIDocumentation from "./pages/APIDocumentation";
import TestAPI from "./pages/TestAPI";
import SystemSetup from "./pages/SystemSetup";
import SystemHealth from "./pages/SystemHealth";
import AdminDashboard from "./pages/AdminDashboard";
import DebugProposals from "./pages/DebugProposals";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/layout/AuthGuard";
import { useAdminShortcut } from "./hooks/useAdminShortcut";

const queryClient = new QueryClient();

const AppContent = () => {
  useAdminShortcut();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/api-docs" element={<APIDocumentation />} />
      <Route path="/settings/api-keys" element={<APIKeys />} />
      
      {/* Public proposal viewing */}
      <Route path="/proposal/:proposalId" element={<ProposalView />} />
      <Route path="/p/:proposalId" element={<ProposalView />} />
      <Route path="/p/:proposalId/accept" element={<AcceptProposal />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* Protected Routes - require authentication */}
      <Route path="/proposals" element={<AuthGuard><ProposalList /></AuthGuard>} />
      <Route path="/proposals/analytics" element={<AuthGuard><GeneralAnalytics /></AuthGuard>} />
      <Route path="/proposals/create" element={<AuthGuard><CreateProposal /></AuthGuard>} />
      <Route path="/proposals/compare" element={<AuthGuard><CompareProposals /></AuthGuard>} />
      <Route path="/proposals/:id/analytics" element={<AuthGuard><ProposalAnalytics /></AuthGuard>} />
      <Route path="/templates" element={<AuthGuard><Templates /></AuthGuard>} />
      
      {/* Admin/Debug Routes */}
      <Route path="/test-api" element={<TestAPI />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/setup" element={<SystemSetup />} />
      <Route path="/health" element={<SystemHealth />} />
      <Route path="/debug/proposals" element={<DebugProposals />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
