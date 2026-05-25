import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { InitiativeDetail } from './pages/InitiativeDetail';
import { Testing } from './pages/Testing';
import { Topology } from './pages/Topology';
import { Runtime } from './pages/Runtime';
import { Gates } from './pages/Gates';
import { Impact } from './pages/Impact';
import { Registry } from './pages/Registry';
import { Value } from './pages/Value';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="initiative/:id" element={<InitiativeDetail />} />
          <Route path="testing" element={<Testing />} />
          <Route path="topology" element={<Topology />} />
          <Route path="runtime" element={<Runtime />} />
          <Route path="gates" element={<Gates />} />
          <Route path="impact" element={<Impact />} />
          <Route path="registry" element={<Registry />} />
          <Route path="value" element={<Value />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
