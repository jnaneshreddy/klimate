import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'
import  Layout  from './components/layout'
import { ThemeProvider } from './context/theme-provider'
import WetherDashboard from './pages/wether-dashboard'
import { CityPage } from './pages/city-page'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'
import { LanguageProvider } from "./context/language-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});


function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <ThemeProvider defaultTheme='dark'>
    <LanguageProvider>
    <Layout> 
      <Routes>
        <Route path='/' element={<WetherDashboard />} /> 
        <Route path='/city/:cityName' element={<CityPage/>} />
      </Routes>
    </Layout>
    </LanguageProvider>
    </ThemeProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default App
