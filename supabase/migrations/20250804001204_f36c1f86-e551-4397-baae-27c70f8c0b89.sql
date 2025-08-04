-- Add DELETE policy for proposals table to allow users to delete their own proposals
CREATE POLICY "Users can delete their own proposals" 
ON public.proposals 
FOR DELETE 
USING ((user_id = auth.uid()) OR (auth.role() = 'service_role'::text));