import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import Receipts from "./pages/Receipts";
import Deliveries from "./pages/Deliveries";
import Transfers from "./pages/Transfers";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-card flex items-center px-4 sticky top-0 z-10">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Products />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouses"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Warehouses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/receipts"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Receipts />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/deliveries"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Deliveries />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Transfers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <History />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
