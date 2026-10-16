GRANT SELECT, INSERT, DELETE ON public.cbse_pyqs TO authenticated;
GRANT ALL ON public.cbse_pyqs TO service_role;
CREATE POLICY "Admins insert papers" ON public.cbse_pyqs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete papers" ON public.cbse_pyqs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));