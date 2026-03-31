// đường dẫn: src/app/router/index.tsx

import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Layout chính có Bottom Navigation (Đang xây)</div>,
    children: [
      {
        index: true,
        element: <div>Màn hình Cây Lộ Trình (Path)</div>, 
      },
      {
        path: 'practice',
        element: <div>Màn hình Practice Hub</div>,
      },
      {
        path: 'profile',
        element: <div>Màn hình Hồ sơ</div>,
      }
    ]
  },
  {
    path: '/lesson/:sessionId',
    element: <div>Màn hình Session Player (Full màn hình)</div>,
  },
  {
    path: '/login',
    element: <div>Màn hình Chọn Profile / Login</div>,
  }
]);