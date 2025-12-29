import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, List, Typography } from "antd";
import {
  WalletOutlined,
  RiseOutlined,
  PieChartOutlined,
  ArrowRightOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { formatMoney } from "./utils/format";
import { useUnits } from "./hooks/useUnits";
import { useExchangeRates } from "./hooks/useExchangeRates";

const { Text } = Typography;

const cardStyle = {
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
} as React.CSSProperties;

type TransactionType = "deposit" | "withdrawal";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  description?: string;
  trackPrice?: boolean;
  purchasePrice?: number;
  purchaseUnit?: string;
  accountName?: string;
  accountCurrency?: string;
  color?: string;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  color: string;
  icon?: React.ReactNode;
  transactions?: Transaction[];
}

const PortfolioRow: React.FC<{
  name: string;
  color: string;
  originalLabel: string;
  baseLabel: string;
  percent: number;
}> = ({ name, color, originalLabel, baseLabel, percent }) => {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <div style={{ marginBottom: 18 }}>
      <Row justify="space-between" align="middle">
        <Row align="middle">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
              marginRight: 8,
            }}
          />
          <Text strong style={{ fontSize: 14 }}>
            {name}
          </Text>
        </Row>
        <Text strong style={{ fontSize: 14 }}>
          {safePercent.toFixed(1)}%
        </Text>
      </Row>

      <div
        style={{
          marginTop: 6,
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: "rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safePercent}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>

      <Row justify="space-between" style={{ marginTop: 6 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {originalLabel}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {baseLabel}
        </Text>
      </Row>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { units } = useUnits();
  const { convert } = useExchangeRates();

  const [baseUnit, setBaseUnit] = useState<string>("USD");
  const [baseSymbol, setBaseSymbol] = useState<string>("$");

  const navigate = useNavigate();

  useEffect(() => {
    const stored: Account[] = JSON.parse(
      localStorage.getItem("accounts") || "[]"
    );
    setAccounts(stored);

    const allTx: Transaction[] = stored.flatMap((acc) =>
      (acc.transactions || []).map((t) => ({
        ...t,
        accountName: acc.name,
        accountCurrency: acc.currency,
        color: acc.color,
      }))
    );

    allTx.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setTransactions(allTx);

    const savedBase = localStorage.getItem("baseUnit") || "USD";
    setBaseUnit(savedBase);
  }, []);

  useEffect(() => {
    const u = units.find((u) => u.code === baseUnit);
    setBaseSymbol(u?.symbol || "$");
  }, [baseUnit, units]);

  const totalWealthBase = accounts.reduce((sum, acc) => {
    const valueInBase = convert(acc.balance, acc.currency, baseUnit);
    return sum + valueInBase;
  }, 0);

  const totalPL = accounts.reduce((sum, acc) => {
    const accPL = (acc.transactions || []).reduce((pl, t) => {
      if (t.trackPrice && t.purchaseUnit === acc.currency) {
        return pl + (t.amount - (t.purchasePrice ?? 0));
      }
      return pl;
    }, 0);

    const plBase = convert(accPL, acc.currency, baseUnit);
    return sum + plBase;
  }, 0);

  const baseValues = accounts.map((acc) =>
    convert(acc.balance, acc.currency, baseUnit)
  );

  const totalDepositsBase = accounts.reduce((total, acc) => {
    const deposits = (acc.transactions || [])
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const depositsBase = convert(deposits, acc.currency, baseUnit);
    return total + depositsBase;
  }, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        margin: "0 auto",
        padding: "0 8px",
        maxWidth: 1200,
      }}
    >
      {/* Total Wealth + PL */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16} lg={18}>
          <Card style={cardStyle}>
            <Row justify="space-between" align="middle">
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                Total Wealth
              </p>
              <Avatar size={36} style={{ backgroundColor: "#8b79f7" }}>
                <WalletOutlined style={{ color: "#fff", fontSize: 18 }} />
              </Avatar>
            </Row>

            <p style={{ margin: 0, fontSize: 26, fontWeight: 600 }}>
              {baseSymbol}
              {formatMoney(totalWealthBase)}
            </p>

            <p style={{ margin: 0, opacity: 0.6 }}>
              {baseUnit} • {accounts.length} accounts
            </p>
          </Card>
        </Col>

        <Col xs={24} md={8} lg={6}>
          <Card style={cardStyle}>
            <Row justify="space-between" align="middle">
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                Total P/L
              </p>
              <Avatar size={36} style={{ backgroundColor: "#8b79f7" }}>
                <RiseOutlined style={{ color: "#fff", fontSize: 18 }} />
              </Avatar>
            </Row>

            <p
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 600,
                color: totalPL >= 0 ? "green" : "red",
              }}
            >
              {totalPL >= 0 ? "+" : "-"}
              {baseSymbol}
              {formatMoney(Math.abs(totalPL))}
            </p>

            <p style={{ margin: 0, opacity: 0.6 }}>
              {totalWealthBase === 0
                ? "0%"
                : ((totalPL / totalWealthBase) * 100).toFixed(2) + "% return"}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Accounts + Distribution */}
      <Row gutter={[16, 16]}>
        {/* ACCOUNTS */}
        <Col xs={24} md={12}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 8 }}
          >
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Accounts
            </p>
            <p style={{ margin: 0, opacity: 0.7 }}>
              {accounts.length} total
            </p>
          </Row>

          {accounts.length === 0 ? (
            <Card
              style={{
                ...cardStyle,
                padding: 0,
                background: "rgb(255, 255, 255)",
                border: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 24,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <WalletOutlined style={{ fontSize: 38, color: "#8b79f7" }} />
                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 4,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  No accounts yet
                </p>
                <p style={{ opacity: 0.8, fontSize: 13 }}>
                  Create one to get started
                </p>
              </div>
            </Card>
          ) : (
            accounts.map((acc, index) => {
              const baseValue = baseValues[index];

              return (
                <Card
                  key={acc.id}
                  style={{
                    ...cardStyle,
                    marginBottom: 8,
                    padding: "8px 12px",
                    background: "rgb(255, 255, 255)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/accounts/${acc.id}`)}
                >
                  <Row justify="space-between" align="middle" wrap>
                    <Row align="middle" style={{ gap: 12 }}>
                      <Avatar
                        size={34}
                        style={{
                          background: acc.color + "33",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}
                      >
                        {acc.icon}
                      </Avatar>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text strong style={{ fontSize: 14 }}>
                          {acc.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {acc.currency} {formatMoney(acc.balance)}
                        </Text>
                      </div>
                    </Row>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        marginTop: 4,
                      }}
                    >
                      <Text strong style={{ fontSize: 14 }}>
                        {baseSymbol}
                        {formatMoney(baseValue)}
                      </Text>
                      <ArrowRightOutlined
                        style={{
                          fontSize: 14,
                          opacity: 0.6,
                          marginTop: 2,
                          transform: "rotate(-45deg)",
                        }}
                      />
                    </div>
                  </Row>
                </Card>
              );
            })
          )}
        </Col>

        {/* DISTRIBUTION (deposit-only) */}
        <Col xs={24} md={12}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 8 }}
          >
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Distribution
            </p>
            <PieChartOutlined />
          </Row>

          <Card
            style={{
              ...cardStyle,
              padding: 0,
              background: "rgb(255, 255, 255)",
              border: "none",
            }}
          >
            {accounts.length === 0 || totalDepositsBase === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 24,
                  textAlign: "center",
                  minHeight: 160,
                }}
              >
                <PieChartOutlined
                  style={{ fontSize: 38, color: "#f39c12" }}
                />
                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 4,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  No data yet
                </p>
                <p style={{ opacity: 0.8, fontSize: 13 }}>
                  Add funds to see distribution
                </p>
              </div>
            ) : (
              <div style={{ width: "100%", padding: 12 }}>
                {accounts.map((acc) => {
                  const depositAmount = (acc.transactions || [])
                    .filter((t) => t.type === "deposit")
                    .reduce((sum, t) => sum + t.amount, 0);

                  if (depositAmount === 0) return null;

                  const baseDeposit = convert(
                    depositAmount,
                    acc.currency,
                    baseUnit
                  );

                  const percent =
                    totalDepositsBase === 0
                      ? 0
                      : (baseDeposit / totalDepositsBase) * 100;

                  const originalLabel = `${acc.currency} ${formatMoney(
                    depositAmount
                  )}`;
                  const baseLabel = `${baseSymbol}${formatMoney(
                    baseDeposit
                  )}`;

                  return (
                    <PortfolioRow
                      key={acc.id}
                      name={acc.name}
                      color={acc.color}
                      originalLabel={originalLabel}
                      baseLabel={baseLabel}
                      percent={percent}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col xs={24}>
          <p
            style={{
              marginBottom: 8,
              marginTop: 4,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Recent Activity
          </p>

          <Card style={{ ...cardStyle, padding: 12 }}>
            {transactions.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <RiseOutlined
                  style={{ fontSize: 44, color: "#27ae60" }}
                />
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  No transactions yet
                </p>
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                <List
                  dataSource={transactions}
                  renderItem={(tx) => {
                    const signedNative =
                      tx.type === "deposit" ? tx.amount : -tx.amount;
                    const baseValue = convert(
                      Math.abs(signedNative),
                      tx.accountCurrency || baseUnit,
                      baseUnit
                    );

                    const sign = signedNative >= 0 ? "+" : "-";
                    const color = signedNative >= 0 ? "green" : "red";

                    const iconNode =
                      tx.type === "deposit" ? (
                        <RiseOutlined
                          style={{ color: "green", fontSize: 18 }}
                        />
                      ) : (
                        <FallOutlined
                          style={{ color: "red", fontSize: 18 }}
                        />
                      );

                    return (
                      <List.Item>
                        <Row align="middle" style={{ width: "100%" }}>
                          <Avatar
                            style={{
                              background: (tx.color || "#000") + "15",
                              marginRight: 10,
                            }}
                            icon={iconNode}
                          />
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Text strong style={{ fontSize: 13 }}>
                              {tx.description || tx.type}
                            </Text>
                            <Text
                              type="secondary"
                              style={{ fontSize: 12 }}
                            >
                              {tx.accountCurrency}{" "}
                              {formatMoney(Math.abs(tx.amount))}
                            </Text>
                            <Text
                              type="secondary"
                              style={{ fontSize: 11 }}
                            >
                              {tx.timestamp}
                            </Text>
                          </div>
                          <Text
                            strong
                            style={{ color, fontSize: 13 }}
                          >
                            {sign}
                            {baseSymbol}
                            {formatMoney(baseValue)}
                          </Text>
                        </Row>
                      </List.Item>
                    );
                  }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
