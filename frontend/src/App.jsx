import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";

const Projects = lazy(() => import("./components/Projects"));
const Contact = lazy(() => import("./components/Contact"));
const Login = lazy(() => import("./components/Login"));

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "app-shell dark-mode" : "app-shell light-mode"}>
      <div className="bg-glow" aria-hidden="true" />
      <NavBar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />
      <main className="page-wrap">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
