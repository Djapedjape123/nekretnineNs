import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import SinglePage from './pages/SinglePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Početna stranica */}
      <Route path="/" element={<HomePage />} />

      {/* Rezultati pretrage */}
      <Route path="/results" element={<ResultsPage />} />

      {/* Single oglasi */}
      <Route path="/single/:id" element={<SinglePage />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-yellow-400 text-2xl">
            404 Not Found
          </div>
        }
      />
    </Routes>
  );
}

