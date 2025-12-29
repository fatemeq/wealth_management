// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Avatar, List, Typography } from "antd";
// import {
//   WalletOutlined,
//   RiseOutlined,
//   PieChartOutlined,
//   ArrowRightOutlined,
//   FallOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// import { formatMoney } from "./utils/format";
// import { useUnits } from "./hooks/useUnits";
// import { useExchangeRates } from "./hooks/useExchangeRates";

// const { Text } = Typography;

// const cardStyle = {
//   borderRadius: 16,
//   boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
// } as React.CSSProperties;

// // Portfolio Row (unchanged)
// const PortfolioRow: React.FC<{
//   name: string;
//   color: string;
//   originalLabel: string;
//   baseLabel: string;
//   percent: number;
// }> = ({ name, color, originalLabel, baseLabel, percent }) => {
//   const safePercent = Math.max(0, Math.min(100, percent));

//   return (
//     <div style={{ marginBottom: 18 }}>
//       <Row justify="space-between" align="middle">
//         <Row align="middle">
//           <span
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: "50%",
//               background: color,
//               display: "inline-block",
//               marginRight: 8,
//             }}
//           />
//           <Text strong style={{ fontSize: 14 }}>
//             {name}
//           </Text>
//         </Row>
//         <Text strong style={{ fontSize: 14 }}>
//           {safePercent.toFixed(1)}%
//         </Text>
//       </Row>

//       <div
//         style={{
//           marginTop: 6,
//           width: "100%",
//           height: 8,
//           borderRadius: 999,
//           background: "rgba(0,0,0,0.06)",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             width: `${safePercent}%`,
//             height: "100%",
//             borderRadius: 999,
//             background: color,
//           }}
//         />
//       </div>

//       <Row justify="space-between" style={{ marginTop: 6 }}>
//         <Text type="secondary" style={{ fontSize: 12 }}>
//           {originalLabel}
//         </Text>
//         <Text type="secondary" style={{ fontSize: 12 }}>
//           {baseLabel}
//         </Text>
//       </Row>
//     </div>
//   );
// };

// const Dashboard: React.FC = () => {
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   const { units } = useUnits();
//   const { convert } = useExchangeRates();

//   const [baseUnit, setBaseUnit] = useState<string>("USD");
//   const [baseSymbol, setBaseSymbol] = useState<string>("$");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const stored: Account[] = JSON.parse(
//       localStorage.getItem("accounts") || "[]"
//     );
//     setAccounts(stored);

//     const allTx: Transaction[] = stored.flatMap((acc) =>
//       (acc.transactions || []).map((t) => ({
//         ...t,
//         accountName: acc.name,
//         accountCurrency: acc.currency,
//         color: acc.color,
//       }))
//     );

//     allTx.sort(
//       (a, b) =>
//         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     );

//     setTransactions(allTx);

//     const savedBase = localStorage.getItem("baseUnit") || "USD";
//     setBaseUnit(savedBase);
//   }, []);

//   useEffect(() => {
//     const u = units.find((u) => u.code === baseUnit);
//     setBaseSymbol(u?.symbol || "$");
//   }, [baseUnit, units]);

//   // TOTAL WEALTH
//   const totalWealthBase = accounts.reduce((sum, acc) => {
//     const valueInBase = convert(acc.balance, acc.currency, baseUnit);
//     return sum + valueInBase;
//   }, 0);

//   // TOTAL P/L (unchanged)
//   const totalPL = accounts.reduce((sum, acc) => {
//     const accPL = (acc.transactions || []).reduce((pl, t) => {
//       if (t.trackPrice && t.purchaseUnit === acc.currency) {
//         return pl + (t.amount - (t.purchasePrice ?? 0));
//       }
//       return pl;
//     }, 0);

//     const plBase = convert(accPL, acc.currency, baseUnit);
//     return sum + plBase;
//   }, 0);

//   // Convert all account balances to base
//   const baseValues = accounts.map((acc) =>
//     convert(acc.balance, acc.currency, baseUnit)
//   );

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 5px" }}>
      
//       {/* Total Wealth + PL (unchanged) */}
//       <Row gutter={[16, 16]}>
//         <Col span={18}>
//           <Card style={cardStyle}>
//             <Row justify="space-between" align="middle">
//               <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
//                 Total Wealth
//               </p>
//               <Avatar size={36} style={{ backgroundColor: "#8b79f7" }}>
//                 <WalletOutlined style={{ color: "#fff", fontSize: 18 }} />
//               </Avatar>
//             </Row>

//             <p style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>
//               {baseSymbol}
//               {formatMoney(totalWealthBase)}
//             </p>

//             <p style={{ margin: 0, opacity: 0.6 }}>
//               {baseUnit} • {accounts.length} accounts
//             </p>
//           </Card>
//         </Col>

//         <Col span={6}>
//           <Card style={cardStyle}>
//             <Row justify="space-between" align="middle">
//               <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
//                 Total P/L
//               </p>
//               <Avatar size={36} style={{ backgroundColor: "#8b79f7" }}>
//                 <RiseOutlined style={{ color: "#fff", fontSize: 18 }} />
//               </Avatar>
//             </Row>

//             <p
//               style={{
//                 margin: 0,
//                 fontSize: 28,
//                 fontWeight: 600,
//                 color: totalPL >= 0 ? "green" : "red",
//               }}
//             >
//               {totalPL >= 0 ? "+" : "-"}
//               {baseSymbol}
//               {formatMoney(Math.abs(totalPL))}
//             </p>

//             <p style={{ margin: 0, opacity: 0.6 }}>
//               {totalWealthBase === 0
//                 ? "0%"
//                 : ((totalPL / totalWealthBase) * 100).toFixed(2) + "% return"}
//             </p>
//           </Card>
//         </Col>
//       </Row>

//       {/* Accounts + Distribution */}
//       <Row gutter={[16, 16]}>
//         {/* ACCOUNTS (unchanged) */}
//         <Col span={12}>
//           <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
//             <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Accounts</p>
//             <p style={{ margin: 0, opacity: 0.7 }}>{accounts.length} total</p>
//           </Row>

//           {accounts.map((acc) => {
//             const baseValue = convert(acc.balance, acc.currency, baseUnit);

//             return (
//               <Card
//                 key={acc.id}
//                 style={{
//                   ...cardStyle,
//                   marginBottom: 8,
//                   padding: "8px 12px",
//                   background: "rgb(255, 255, 255)",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate(`/accounts/${acc.id}`)}
//               >
//                 <Row justify="space-between" align="middle">
//                   <Row align="middle" style={{ gap: 12 }}>
//                     <Avatar
//                       size={36}
//                       style={{
//                         background: acc.color + "33",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {acc.icon}
//                     </Avatar>
//                     <div style={{ display: "flex", flexDirection: "column" }}>
//                       <Text strong style={{ fontSize: 14 }}>
//                         {acc.name}
//                       </Text>
//                       <Text type="secondary" style={{ fontSize: 12 }}>
//                         {acc.currency} {formatMoney(acc.balance)}
//                       </Text>
//                     </div>
//                   </Row>

//                   <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//                     <Text strong style={{ fontSize: 14 }}>
//                       {baseSymbol}
//                       {formatMoney(baseValue)}
//                     </Text>
//                     <ArrowRightOutlined
//                       style={{
//                         fontSize: 14,
//                         opacity: 0.6,
//                         marginTop: 2,
//                         transform: "rotate(-45deg)",
//                       }}
//                     />
//                   </div>
//                 </Row>
//               </Card>
//             );
//           })}
//         </Col>

//         {/* DISTRIBUTION (UPDATED!) */}
//         <Col span={12}>
//           <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
//             <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Distribution</p>
//             <PieChartOutlined />
//           </Row>

//           <Card style={{ ...cardStyle, padding: 12 }}>
//             {accounts.length === 0 ? (
//               <div style={{ textAlign: "center", padding: 32 }}>
//                 <PieChartOutlined style={{ fontSize: 40, color: "#f39c12" }} />
//                 <p style={{ marginTop: 12, fontSize: 16, fontWeight: 500 }}>
//                   No data yet
//                 </p>
//               </div>
//             ) : (
//               <div style={{ width: "100%" }}>
//                 {accounts.map((acc, index) => {
//                   const baseValue = baseValues[index];

//                   // NEW: TRUE wealth distribution (0–100%)
//                   const percent =
//                     totalWealthBase === 0
//                       ? 0
//                       : (baseValue / totalWealthBase) * 100;

//                   const originalLabel = `${acc.currency} ${formatMoney(acc.balance)}`;
//                   const baseLabel = `${baseSymbol}${formatMoney(baseValue)}`;

//                   return (
//                     <PortfolioRow
//                       key={acc.id}
//                       name={acc.name}
//                       color={acc.color}
//                       originalLabel={originalLabel}
//                       baseLabel={baseLabel}
//                       percent={percent}
//                     />
//                   );
//                 })}
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* Recent Activity (unchanged) */}
//       <Row>
//         <Col span={24}>
//           <p style={{ marginBottom: 8, marginTop: 4, fontSize: 14, fontWeight: 600 }}>
//             Recent Activity
//           </p>

//           <Card style={{ ...cardStyle, padding: 12 }}>
//             {transactions.length === 0 ? (
//               <div style={{ textAlign: "center", marginTop: 32 }}>
//                 <RiseOutlined style={{ fontSize: 48, color: "#27ae60" }} />
//                 <p style={{ marginTop: 16, fontSize: 16, fontWeight: 500 }}>
//                   No transactions
//                 </p>
//               </div>
//             ) : (
//               <div style={{ maxHeight: 500, overflowY: "auto" }}>
//                 <List
//                   dataSource={transactions}
//                   renderItem={(tx) => {
//                     const signedNative =
//                       tx.type === "deposit" ? tx.amount : -tx.amount;
//                     const baseValue = convert(
//                       Math.abs(signedNative),
//                       tx.accountCurrency,
//                       baseUnit
//                     );

//                     const sign = signedNative >= 0 ? "+" : "-";
//                     const color = signedNative >= 0 ? "green" : "red";

//                     const iconNode =
//                       tx.type === "deposit" ? (
//                         <RiseOutlined style={{ color: "green", fontSize: 18 }} />
//                       ) : (
//                         <FallOutlined style={{ color: "red", fontSize: 18 }} />
//                       );

//                     return (
//                       <List.Item>
//                         <Row align="middle" style={{ width: "100%" }}>
//                           <Avatar
//                             style={{ background: tx.color + "15", marginRight: 10 }}
//                             icon={iconNode}
//                           />
//                           <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//                             <Text strong style={{ fontSize: 13 }}>
//                               {tx.description || tx.type}
//                             </Text>
//                             <Text type="secondary" style={{ fontSize: 12 }}>
//                               {tx.accountCurrency} {formatMoney(Math.abs(tx.amount))}
//                             </Text>
//                             <Text type="secondary" style={{ fontSize: 11 }}>
//                               {tx.timestamp}
//                             </Text>
//                           </div>
//                           <Text strong style={{ color, fontSize: 13 }}>
//                             {sign}
//                             {baseSymbol}
//                             {formatMoney(baseValue)}
//                           </Text>
//                         </Row>
//                       </List.Item>
//                     );
//                   }}
//                 />
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;
