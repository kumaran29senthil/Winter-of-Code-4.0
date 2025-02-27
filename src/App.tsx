import Layout from "./components/layout";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import WeatherDashboard from "./pages/weather-dashboard";
import CityPage from "./pages/city-page";
import Header from "./components/header";
import {QueryClientProvider,QueryClient} from "@tanstack/react-query" ;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
    staleTime:5*60*1000,
    gcTime:10*60*1000,
    retry:false,
    refetchOnWindowFocus:false,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Header />
        <Layout>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/city/:cityName" element={<CityPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
    </QueryClientProvider>

  );
}

export default App;
