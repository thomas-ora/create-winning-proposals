import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProposalView from "./pages/ProposalView";
import ProposalList from "./pages/ProposalList";
import ProposalAnalytics from "./pages/ProposalAnalytics";
import CompareProposals from "./pages/CompareProposals";
import CreateProposal from "./pages/CreateProposal";
import Templates from "./pages/Templates";
import APIKeys from "./pages/APIKeys";
import APIDocumentation from "./pages/APIDocumentation";
import TestAPI from "./pages/TestAPI";
import SystemSetup from "./pages/SystemSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/proposals" element={<ProposalList />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/proposals/compare" element={<CompareProposals />} />
          <Route path="/proposals/:id/analytics" element={<ProposalAnalytics />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings/api-keys" element={<APIKeys />} />
          <Route path="/setup" element={<SystemSetup />} />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="/proposal/:proposalId" element={<ProposalView />} />
          <Route path="/p/:proposalId" element={<ProposalView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
