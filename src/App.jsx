// module
import { Routes, Route } from 'react-router-dom';

// component
import NavBar from './components/NavBar/NavBar';
import MainPage from './pages/MainPage/MainPage';

// page
import MainContainer from './pages/MainContainer/MainContainer';
import AddDwelling from './pages/AddDwelling/AddDwelling';

export default function App() {
  return (
    <MainContainer>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/add" element={<AddDwelling />} />
      </Routes>
    </MainContainer>
  )
}