import { Navigate, Route, Routes } from "react-router-dom";
import {
  FinalDashboard,
  FinalLayout,
  FinalOmbudsman,
  FinalPriority,
  FinalTracking,
} from "./FinalExperience";
import LowFidelityExperience from "./LowFidelityExperience";

export default function App() {
  return (
    <Routes>
      <Route path="/baixa-fidelidade/*" element={<LowFidelityExperience />} />
      <Route element={<FinalLayout />}>
        <Route path="/" element={<FinalDashboard />} />
        <Route path="/prioridade/:componentId" element={<FinalPriority />} />
        <Route path="/acompanhamento" element={<FinalTracking />} />
        <Route path="/ouvidoria" element={<FinalOmbudsman />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
