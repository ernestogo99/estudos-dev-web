import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Todos } from "./components/todo";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Todos />
      </QueryClientProvider>
    </>
  );
}

export default App;
