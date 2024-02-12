import "./App.css";
import { ThemeProvider } from "./context/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanBoard from "./pages/Kanbanboard";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <KanbanBoard />
        <Toaster position="top-right" closeButton richColors />
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
