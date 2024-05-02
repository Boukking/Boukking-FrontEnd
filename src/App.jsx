// modules
import { useState } from 'react'

// components
import MainContainer from './pages/MainContainer/MainContainer';
import MainPage from './pages/MainPage/MainPage';

export default function App() {
  const [logged, isLogged] = useState(null);

  return (
    <MainContainer>
      <MainPage />
    </MainContainer>
  )
}