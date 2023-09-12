import { Routes, Route } from "react-router-dom";
import { atom } from "recoil";
import HomePage from "./pages/HomePage";
import Scheduler from "./pages/Scheduler";
import NavBar from "./components/NavBar";
import MobileWarningScreen from "./components/MobileWarningScreen";

// Creating atom state for onboarding status 
atom({
  key: "onboardingComplete",
  default: localStorage.getItem("onboarding-status") === "complete",
  effects: [
    ({ onSet }) => {
      onSet((isOnboardingComplete) => {
        if (isOnboardingComplete === true) {
          localStorage.setItem("onboarding-status", "complete");
        } else {
          localStorage.removeItem("onboarding-status");
        }
      });
    }
  ]
});

function App() {
  return (
    <>
      <MobileWarningScreen />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scheduler" element={<Scheduler />} />
      </Routes>
    </>
  );
}

export default App;
