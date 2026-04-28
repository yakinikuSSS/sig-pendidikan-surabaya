import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import MapView from "./components/map/MapView.tsx";
import { EducationDiagram } from './components/diagram/EducationDiagram';

function App() {
  return (
    <DashboardLayout>
      <MapView />
      <EducationDiagram />
    </DashboardLayout>
  );
}

export default App;