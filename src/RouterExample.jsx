import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/secondPage" element={<SecondPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function HomePage() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Link  to="/secondPage">secondPage</Link>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
function SecondPage() {
  return (
    <div className="App">
        <Link  to="/">homePage</Link>
      <h1>Hello secondPage</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}   
