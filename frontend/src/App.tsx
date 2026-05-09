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
      <div className="h-screen w-screen p-5 overflow-hidden">
        <div className="flex h-full w-full flex-col md:flex-row gap-5 rounded-2xl bg-gray-400/30 dark:bg-zinc-800/65 md:p-5 overflow-hidden">
          <NavBar />
          <main className="flex-1 overflow-y-auto bg-bg-main md:rounded-xl md:p-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analitik" element={<Analytics />} />
              <Route path="/alice" element={<Alice />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
