import { useState, lazy, Suspense } from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';

import NavBar from './components/NavBar.tsx';
import StatusIndicator from './components/StatusIndicator.tsx';
import AddModal from './components/spending/SpendingAddModal.tsx';

const Analytics = lazy(() => import('./pages/Analytics.tsx'));
const Profile = lazy(() => import('./pages/Profile.tsx'));
const Home = lazy(() => import('./pages/Home.tsx'));
const Alice = lazy(() => import('./pages/Alice.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

export default function App() {
  const [authedUser, setAuthedUser] = useState<string | null>(
    () => localStorage.getItem('accessToken') || null
  );

  const [addModalVisible, setAddModalVisible] = useState(false);
  const toggleAddModal = () => setAddModalVisible((prev) => !prev);
  const closeModal = () => setAddModalVisible(false);

  return (
    <div className="w-full minh-h-[100dvh] md:h-screen md:w-screen">
      <StatusIndicator />

      <Routes>
        <Route
          path="/login"
          element={
            !authedUser ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen w-full bg-bg-main">
                    Loading...
                  </div>
                }
              >
                <Login setAuthedUser={setAuthedUser} />
              </Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !authedUser ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen w-full bg-bg-main">
                    Loading...
                  </div>
                }
              >
                <Register />
              </Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          element={
            authedUser ? (
              <div className="flex md:h-full md:w-full md:p-5">
                <div className="flex h-full w-full flex-col md:flex-row gap-5 rounded-2xl bg-gray-400/30 dark:bg-zinc-800/65 md:p-5">
                  <AddModal isVisible={addModalVisible} closeModal={closeModal} />
                  <NavBar toggleAddModal={toggleAddModal} />
                  <main className="flex-1 md:overflow-auto bg-bg-main md:rounded-xl md:relative pb-10 md:pb-1 lg:pb-0 inset-0 ">
                    <div className="lg:p-0 pb-15 md:pb-0 lg:absolute lg:inset-0 ">
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center h-screen w-full bg-bg-main">
                            Loading...
                          </div>
                        }
                      >
                        <Outlet />
                      </Suspense>
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

        <Route
          path="*"
          element={
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen w-full bg-bg-main">
                  Loading...
                </div>
              }
            >
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
