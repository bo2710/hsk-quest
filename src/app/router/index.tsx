import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomeScreen } from '../../features/home';
import { PracticeHubScreen } from '../../features/practice-hub';
import { ProfileScreen } from '../../features/profile';
import { OnboardingScreen } from '../../features/onboarding';
import { ExercisePlayerScreen } from '../../features/exercise-player';

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <OnboardingScreen />
  },
  {
    path: '/',
    element: <MainLayout />, // Dùng cái Layout xịn ở trên
    children: [
      {
        index: true, // Trang chủ là HomeScreen (chứa Path)
        element: <HomeScreen />
      },
      {
        path: 'practice',
        element: <PracticeHubScreen />
      },
      {
        path: 'profile',
        element: <ProfileScreen />
      }
    ]
  },
  {
    path: '/session/:lessonId',
    element: <ExercisePlayerScreen />
  }
]);