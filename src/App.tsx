import DashboardLayout from "./components/layout/DashboardLayout.tsx";
import MapView from "./alternative/map/MapView.tsx";

function App() {
  return (
    <DashboardLayout>
      <MapView />
    </DashboardLayout>
  );
}

export default App;