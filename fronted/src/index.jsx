import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import SinglePage from './pages/SinglePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<ResultsPage />} />
        <Route path="single/:id" element={<SinglePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
