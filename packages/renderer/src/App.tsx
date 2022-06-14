import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import Home from "/@/components/Home";
import AppNavigation from "/@/components/AppNavigation";
// Lazy load component
const About = React.lazy(() => import("/@/components/About"));

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <AppNavigation>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empty" element={() => <></>} />
            <Route
              path="/about"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <About />
                </Suspense>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppNavigation>
      </BrowserRouter>
    </>
  );
};

export default App;
