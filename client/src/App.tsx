import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

function App() {
  const { authUser, isCheckingAuth } = useAuth();
  if (isCheckingAuth) return <h1>Loading...</h1>;
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain ">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
