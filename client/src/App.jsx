import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import EstatusSistema from "./components/00_EstatusSistema";
import EstatusMensual from "./components/01_EstatusMensual";
import AnalisisOperacion from "./components/02_AnalisisOperacion";
import EstatusOperacion from "./components/03_EstatusOperacion";
import Mantenimiento from "./components/04_Mantenimiento";
import Alertas from "./components/05_Alertas";
import LoginView from "./components/Login";
import { useEffect, useState } from "react";
import { getHostPath, setHost, setHostNode } from "./utils/host";
import Settings from "./components/Settings";

function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const base = "http://" + window.location.hostname;
    setHost(base, 1880);
    // setHostNode(base, 8081);
    console.log(getHostPath(""));
    setLoaded(true);
  }, []);

  return loaded ? (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EstatusSistema />} />
          <Route path="mensual" element={<EstatusMensual />} />
          <Route path="analysis" element={<AnalisisOperacion />} />
          <Route path="operation" element={<EstatusOperacion />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="maintenance" element={<Mantenimiento />} />
          <Route path="alerts" element={<Alertas />} /> */}
        </Route>

        <Route path="login" element={<LoginView />} />
      </Routes>
    </Router>
  ) : (
    <p>Cargando...</p>
  );
}

export default App;
