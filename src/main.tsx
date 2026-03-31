import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router'; // Dòng này hết gạch đỏ vì ở dưới đã xài
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Truyền cái router nãy import vào đây */}
    <RouterProvider router={router} />
  </React.StrictMode>,
);