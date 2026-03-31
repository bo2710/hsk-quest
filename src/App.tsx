import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Onboarding from './features/onboarding/Onboarding';
import Dashboard from './features/dashboard/Dashboard';
import ExerciseSession from './features/learning/ExerciseSession';
import Clinic from './features/clinic/Clinic';
import Profile from './features/profile/Profile'; // <-- Đã import Profile thật
import { Home as HomeIcon, BookOpen, Swords, Stethoscope, User } from 'lucide-react';
import Learn from './features/learn/Learn';
import Battle from './features/battle/Battle';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navItems = [
    { path: '/home', icon: <HomeIcon size={22} />, label: 'Home' },
    { path: '/learn', icon: <BookOpen size={22} />, label: 'Learn' },
    { path: '/battle', icon: <Swords size={22} />, label: 'Battle' },
    { path: '/clinic', icon: <Stethoscope size={22} />, label: 'Clinic' },
    { path: '/profile', icon: <User size={22} />, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl dark:bg-gray-900 relative border-x border-gray-100 dark:border-gray-800">
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 flex justify-around p-2 pb-safe z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center p-2 transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
              {item.icon}
              <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  const { hasProfile, checkProfile } = useAppStore();
  
  useEffect(() => { checkProfile(); }, [checkProfile]);
  
  if (hasProfile === null) return <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900"><div className="animate-pulse text-blue-600 font-black text-2xl italic tracking-tighter uppercase">HSK QUEST</div></div>;

  return (
    <BrowserRouter>
      <Routes>
        {!hasProfile ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/session" element={<ExerciseSession />} />
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/home" element={<Dashboard />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/battle" element={<Battle />} />
                  <Route path="/clinic" element={<Clinic />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </MainLayout>
            } />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}