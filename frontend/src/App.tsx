import { useState } from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';

import NavBar from './components/NavBar.tsx';
import Analytics from './pages/Analytics.tsx';
import Profile from './pages/Profile.tsx';
import Home from './pages/Home.tsx';
import Alice from './pages/Alice.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import NotFound from './pages/NotFound.tsx';
import StatusIndicator from './components/StatusIndicator.tsx';
import AddModal from './components/spending/SpendingAddModal.tsx';

export default function App() {
  const [authedUser, setAuthedUser] = useState<string | null>(
    () => localStorage.getItem('accessToken') || null
  );

  const [addModalVisible, setAddModalVisible] = useState(false);
  const toggleAddModal = () => setAddModalVisible((prev) => !prev);
  const closeModal = () => setAddModalVisible(false);

  return (
    <div className="w-screen h-screen">
      <StatusIndicator />

      <Routes>
        <Route
          path="/login"
          element={
            !authedUser ? <Login setAuthedUser={setAuthedUser} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/register"
          element={!authedUser ? <Register /> : <Navigate to="/" replace />}
        />

        <Route
          element={
            authedUser ? (
              <div className="flex md:h-full md:w-full md:p-5">
                <div className="flex h-full w-full flex-col md:flex-row gap-5 rounded-2xl bg-gray-400/30 dark:bg-zinc-800/65 md:p-5">
                  <AddModal isVisible={addModalVisible} closeModal={closeModal} />
                  <NavBar toggleAddModal={toggleAddModal} />
                  <main className="flex-1 md:overflow-auto bg-bg-main md:rounded-xl md:relative pb-10 md:pb-1 lg:pb-0">
                    <div className="lg:p-0 pb-15 md:pb-0 lg:absolute lg:inset-0 ">
                      <Outlet />
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/analitik" element={<Analytics />} />
          <Route path="/alice" element={<Alice />} />
          <Route path="/profile" element={<Profile setAuthedUser={setAuthedUser} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
