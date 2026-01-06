import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Typography,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { useUnits } from "./hooks/useUnits";
import { useExchangeRates } from "./hooks/useExchangeRates";
import { formatMoney } from "./utils/format";

const { Option } = Select;
const { Title, Text } = Typography;

interface Account {
  id: number;
  name: string;
  currency: string;
  balance: number;
  icon: string;
  color: string;
}

interface NewAccount {
  name: string;
  currency: string;
  icon: string;
  color: string;
}

const ICONS = ["💰", "🏦", "💳", "💎", "🌕", "📈", "💵", "🏛", "⚡️", "🎯"];
const COLORS = [
  "#ff4d4f",
  "#fa8c16",
  "#fadb14",
  "#a0d911",
  "#13c2c2",
  "#1890ff",
  "#2f54eb",
  "#722ed1",
  "#eb2f96",
  "#595959",
];

const Accounts: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { units } = useUnits();
  const { convert } = useExchangeRates();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [newAccount, setNewAccount] = useState<NewAccount>({
    name: "",
    currency: "",
    icon: "",
    color: "",
  });

  const [baseUnit, setBaseUnit] = useState("USD");
  const [baseSymbol, setBaseSymbol] = useState("$");

  useEffect(() => {
    const saved = localStorage.getItem("accounts");
    if (saved) setAccounts(JSON.parse(saved as string));

    const savedBase = localStorage.getItem("baseUnit") || "USD";
    setBaseUnit(savedBase);

    setIsLoaded(true);

    if (units.length > 0) {
      setNewAccount((prev) => ({
        ...prev,
        currency: prev.currency || units[0].code,
      }));
    }
  }, [units]);

  useEffect(() => {
    const u = units.find((u) => u.code === baseUnit);
    setBaseSymbol(u?.symbol || "$");
  }, [baseUnit, units]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }, [accounts, isLoaded]);

  const handleSaveAccount = () => {
    const { name, currency, icon, color } = newAccount;

    if (!name || !currency || !icon || !color) {
      Modal.warning({
        title: t('common.allFieldsRequired', { defaultValue: 'All fields required' }),
        content: t('common.fillAllFields', { defaultValue: 'Please fill all fields' }),
      });
      return;
    }

    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id ? { ...acc, ...newAccount } : acc
        )
      );
    } else {
      setAccounts((prev) => [
        ...prev,
        {
          id: Date.now(),
          balance: 0,
          ...newAccount,
        },
      ]);
    }

    setIsAdding(false);
    setEditingAccount(null);

    setNewAccount({
      name: "",
      currency: units[0]?.code || "",
      icon: "",
      color: "",
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('accounts.delete'),
      okText: t('common.yesDelete'),
      okType: "danger",
      cancelText: t('common.cancel'),
      onOk: () => {
        setAccounts((prev) => prev.filter((acc) => acc.id !== id));
      },
    });
  };

  const getSymbol = (code: string) => {
    const unit = units.find((u) => u.code === code);
    return unit?.symbol || "";
  };

  return (
    <div style={{ paddingInline: 5 }}>
      {/* ✅ RTL-Aware Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 16,
        }}
      >
        <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: 48,
            }}
          >
            <Title
              level={2}
              style={{
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {t('accounts.title')}
            </Title>
            <Text
              type="secondary"
              style={{
                margin: 0,
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              {t('accounts.subtitle')}
            </Text>
          </div>
        </Col>

        <Col style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{ borderRadius: 10 }}
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingAccount(null);
              setIsAdding(true);
              setNewAccount({
                name: "",
                currency: units[0]?.code || "",
                icon: "",
                color: "",
              });
            }}
          >
            {t('accounts.add')}
          </Button>
        </Col>
      </Row>

      {isAdding && (
        <Card
          style={{
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Title level={4} style={{ marginTop: 0 }}>
            {editingAccount ? t('accounts.edit') : `${t('common.add')} ${t('accounts.title')}`}
          </Title>

          <Text strong>{t('accounts.accountName', { defaultValue: 'Account Name' })}</Text>
          <Input
            placeholder={t('accounts.accountNamePlaceholder', { defaultValue: 'Savings, Investment, Crypto Wallet' })}
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount((s) => ({ ...s, name: e.target.value }))
            }
            style={{ marginBottom: 16, marginTop: 4 }}
          />

          <Text strong>{t('accounts.currency', { defaultValue: 'Currency' })}</Text>
          <Select
            value={newAccount.currency}
            onChange={(currency) =>
              setNewAccount((s) => ({ ...s, currency }))
            }
            style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
          >
            {units.map((u) => (
              <Option key={u.code} value={u.code}>
                {u.symbol} {u.code}
              </Option>
            ))}
          </Select>

          <Text strong>{t('common.icon', { defaultValue: 'Icon' })}</Text>
          <Row
            gutter={[12, 12]}
            style={{
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {ICONS.map((emoji) => {
              const selected = newAccount.icon === emoji;
              return (
                <Col
                  xs={6}
                  sm={4}
                  md={3}
                  key={emoji}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div
                    onClick={() => setNewAccount((s) => ({ ...s, icon: emoji }))}
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 14,
                      border: selected ? "2px solid #1677ff" : "1px solid #ddd",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: 28,
                      background: "#fff",
                      boxShadow: selected
                        ? "0 2px 8px rgba(22, 119, 255, 0.3)"
                        : "0 1px 4px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {emoji}
                  </div>
                </Col>
              );
            })}
          </Row>

          <Text strong>{t('common.color', { defaultValue: 'Color' })}</Text>
          <Row
            gutter={[8, 12]}
            style={{
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            {COLORS.map((color) => {
              const selected = newAccount.color === color;
              return (
                <Col xs={6} sm={4} md={3} xl={2} key={color}>
                  <div
                    onClick={() => setNewAccount((s) => ({ ...s, color }))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: color,
                      cursor: "pointer",
                      border: selected ? "3px solid black" : "2px solid white",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  />
                </Col>
              );
            })}
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Button type="primary" block onClick={handleSaveAccount}>
                {editingAccount ? t('common.save') : t('common.add')}
              </Button>
            </Col>

            <Col span={12}>
              <Button
                block
                onClick={() => {
                  setIsAdding(false);
                  setEditingAccount(null);
                  setNewAccount({
                    name: "",
                    currency: units[0]?.code || "",
                    icon: "",
                    color: "",
                  });
                }}
              >
                {t('common.cancel')}
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {accounts.map((acc) => {
          const baseValue = convert(acc.balance, acc.currency, baseUnit);

          return (
            <Col xs={24} md={12} key={acc.id}>
              <Card
                style={{
                  borderRadius: 16,
                  padding: 16,
                  height: "100%",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  borderInlineStart: `8px solid ${acc.color}`, // ✅ RTL-aware border
                  position: "relative",
                }}
              >
                {/* ✅ RTL-Aware Card Header */}
                <Row justify="space-between" align="top">
                  <Col>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: acc.color + "20",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 22,
                      }}
                    >
                      {acc.icon}
                    </div>
                  </Col>

                  {/* ✅ RTL: Edit/Delete buttons flip correctly */}
                  <Col style={{ display: "flex", gap: 8 }}>
                    <EditOutlined
                      style={{
                        color: "#fa8c16",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                      onClick={() => {
                        setEditingAccount(acc);
                        setIsAdding(true);
                        setNewAccount({
                          name: acc.name,
                          currency: acc.currency,
                          icon: acc.icon,
                          color: acc.color,
                        });
                      }}
                      title={t('common.edit')}
                    />

                    <DeleteOutlined
                      style={{ color: "#ff4d4f", cursor: "pointer", fontSize: 18 }}
                      onClick={() => handleDelete(acc.id)}
                      title={t('common.delete')}
                    />
                  </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                  <Title level={4} style={{ marginBottom: 0, fontSize: 18 }}>
                    {acc.name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {acc.currency}
                  </Text>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(0,0,0,0.1)",
                    marginBlock: 16, // ✅ RTL-aware margin
                  }}
                />

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('accounts.balance')}
                </Text>

                <div style={{ fontSize: 20, fontWeight: 600 }}>
                  {getSymbol(acc.currency)}
                  {formatMoney(acc.balance)}
                </div>

                <Text type="secondary" style={{ fontSize: 11 }}>
                  ≈ {baseSymbol}
                  {formatMoney(baseValue)} {baseUnit}
                </Text>

                {/* ✅ RTL: Arrow stays bottom-right */}
                <ArrowRightOutlined
                  onClick={() => navigate(`/accounts/${acc.id}`)}
                  style={{
                    position: "absolute",
                    insetInlineEnd: 24,  // ✅ RTL-aware positioning
                    bottom: 20,
                    fontSize: 18,
                    color: "#999",
                    cursor: "pointer",
                    transform: "rotate(-45deg)",
                  }}
                  title={t('common.viewDetails', { defaultValue: 'View details' })}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {!isAdding && accounts.length === 0 && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 60, opacity: 0.5 }}>💼</div>
          <Title level={4}>{t('dashboard.noAccounts')}</Title>
          <Text type="secondary">{t('accounts.add')}</Text>
        </Card>
      )}
    </div>
  );
};

export default Accounts;
