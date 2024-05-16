// module
import { Routes, Route } from 'react-router-dom';

// component
import NavBar from './components/NavBar/NavBar';
import MainPage from './pages/MainPage/MainPage';

// page
import MainContainer from './pages/MainContainer/MainContainer';
import AddDwelling from './pages/AddDwelling/AddDwelling';
import ViewDwelling from './pages/ViewDwelling/ViewDwelling';

export default function App() {
  return (
    <MainContainer>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dwelling/add" element={<AddDwelling />} />
        <Route path="/dwelling/:dwellingId" element={<ViewDwelling />} />
      </Routes>
    </MainContainer>
  )
}