// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "~/components/containers/layout/index";
import Dashboard from "~/routes/dashboard";
import Accounts from "~/routes/accounts";
import AccountDetails from "~/routes/account-details";
import Settings from "~/routes/settings";
import Units from "~/routes/units";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/:id" element={<AccountDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="units" element={<Units />} />
      </Route>
    </Routes>
  );
}
