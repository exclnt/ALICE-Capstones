import NavBar from './components/NavBar.tsx';
import { Route, Routes } from 'react-router-dom';

import Analytics from './pages/Analytics.tsx';
import Profile from './pages/Profile.tsx';
import Home from './pages/Home.tsx';
import Alice from './pages/Alice.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Loading from './components/Loading.tsx';
import React from 'react';
import { LoadingProvider } from './context/LoadingProvider.tsx';
import { useLoading } from './context/LoadingContext.tsx';

export default function App() {
  const { loading } = useLoading();
  return (
    <>
      {/* {loading ? <Loading /> : ''}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes> */}

      <div className="flex md:flex-row h-screen md:h-[calc(100vh-40px)] w-screen md:w-[calc(100vw-40px)] md:rounded-2xl md:bg-[rgba(144,144,144,0.3)] dark:md:bg-[rgba(50,49,49,0.65)] md:gap-5 md:p-5 md:ml-5 md:mt-5">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analitik" element={<Analytics />} />
          <Route path="/alice" element={<Alice />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}
