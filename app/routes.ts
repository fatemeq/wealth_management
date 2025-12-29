import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./components/containers/layout/index.tsx", [ // DashboardLayout
    index("./routes/dashboard.tsx"),
    route("accounts", "./routes/accounts.tsx"),
    route("settings", "./routes/settings.tsx"),
    route("units", "./routes/units.tsx"),
    route("accounts/:id", "./routes/account-details.tsx")
  ]),
] satisfies RouteConfig;
