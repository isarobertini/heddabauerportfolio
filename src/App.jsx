import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ArtPage } from "./pages/ArtPage";
import { ArtworkPage } from "./pages/ArtWorkPage";
import { Page } from "./pages/Page";
import { Navigation } from "./pages/Navigation";
import { Footer } from "./pages/Footer";

function App() {
  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Routes>
          <Route path="/" element={<ArtPage />} />
          <Route path="/artwork/:slug" element={<ArtworkPage />} />
          <Route path="/:slug" element={<Page />} /> {/* Generic page route */}
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;