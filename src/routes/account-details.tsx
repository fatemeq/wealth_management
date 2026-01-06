import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Modal,
  Input,
  Select,
  Checkbox,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

import { formatMoney, formatInputNumber } from "./utils/format";
import { useUnits } from "./hooks/useUnits";
import { useExchangeRates } from "./hooks/useExchangeRates";

const { Title, Text } = Typography;
const { Option } = Select;

type Transaction = {
  id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  description?: string;
  timestamp: string;
  trackPrice?: boolean;
  purchasePrice?: number;
  purchaseUnit?: string;
  icon?: string;
};

type Account = {
  id: number;
  name: string;
  currency: string;
  balance: number;
  icon: string;
  color: string;
  transactions?: Transaction[];
};

const ICONS = ["💼", "💰", "🏦", "💳", "🎯", "⚡️", "📈", "💵"];
const COLORS = ["#8b79f7", "#4caf50", "#ff9800", "#03a9f4", "#e91e63", "#9c27b0"];
const LOCAL_KEY = "accounts";

const AccountDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { units } = useUnits();
  const { convert } = useExchangeRates();

  const [account, setAccount] = useState<Account | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trackPrice, setTrackPrice] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    currency: "",
    icon: "",
    color: "",
  });

  const [form, setForm] = useState({
    type: "deposit" as const,
    amount: "",
    description: "",
    purchasePrice: "",
    purchaseUnit: "",
    icon: ICONS[0],
  });

  const [baseUnit, setBaseUnit] = useState("USD");
  const [baseSymbol, setBaseSymbol] = useState("$");

  // Load base unit
  useEffect(() => {
    const savedBase = localStorage.getItem("baseUnit") || "USD";
    setBaseUnit(savedBase);
  }, []);

  useEffect(() => {
    const u = units.find((u) => u.code === baseUnit);
    setBaseSymbol(u?.symbol || "$");
  }, [baseUnit, units]);

  // Load account
  useEffect(() => {
    const saved: Account[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const numericId = Number(id);
    let found = saved.find((a) => a.id === numericId);

    if (!found) {
      found = {
        id: numericId,
        name: t('accounts.add'),
        currency: units[0]?.code || "GBP",
        balance: 0,
        icon: "🏦",
        color: "#8b79f7",
        transactions: [],
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify([...saved, found]));
    }

    if (!found.transactions) found.transactions = [];
    setAccount(found);
  }, [id, units, t]);

  const persistAccount = (updated: Account) => {
    const all: Account[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const newAll = all.some((a) => a.id === updated.id)
      ? all.map((a) => (a.id === updated.id ? updated : a))
      : [...all, updated];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newAll));
  };

  const deleteAccount = () => {
    Modal.confirm({
      title: t('accounts.delete'),
      okType: "danger",
      okText: t('common.yesDelete'),
      cancelText: t('common.cancel'),
      onOk: () => {
        const all: Account[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
        localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify(all.filter((a) => a.id !== Number(id)))
        );
        navigate("/accounts");
      },
    });
  };

  const saveEdit = () => {
    if (!account) return;
    if (!editForm.name || !editForm.currency || !editForm.icon || !editForm.color) {
      Modal.warning({ content: `${t('common.save')} ${t('common.delete')}` });
      return;
    }

    const updated: Account = {
      ...account,
      name: editForm.name,
      currency: editForm.currency,
      icon: editForm.icon,
      color: editForm.color,
    };

    setAccount(updated);
    persistAccount(updated);
    setIsEditing(false);
  };

  const addTransaction = () => {
    if (!form.amount || Number.isNaN(Number(form.amount))) {
      Modal.warning({ content: t('accounts.amount') });
      return;
    }
    if (!account) return;

    const amountNum = Number(form.amount);
    const tx: Transaction = {
      id: Date.now(),
      type: form.type,
      amount: amountNum,
      description: form.description || "",
      timestamp: new Date().toLocaleString(),
      trackPrice,
      purchasePrice: trackPrice ? Number(form.purchasePrice || 0) : undefined,
      purchaseUnit: trackPrice ? form.purchaseUnit : undefined,
      icon: form.icon,
    };

    const updated: Account = {
      ...account,
      transactions: [tx, ...(account.transactions || [])],
      balance: tx.type === "deposit"
        ? account.balance + amountNum
        : account.balance - amountNum,
    };

    setAccount(updated);
    persistAccount(updated);

    setIsAdding(false);
    setTrackPrice(false);
    setForm({
      type: "deposit",
      amount: "",
      description: "",
      purchasePrice: "",
      purchaseUnit: units[0]?.code || "GBP",
      icon: ICONS[0],
    });
  };

  const deleteTransaction = (txId: number) => {
    if (!account) return;

    Modal.confirm({
      title: t('common.delete'),
      okType: "danger",
      okText: t('common.yesDelete'),
      cancelText: t('common.cancel'),
      onOk: () => {
        const newTxs = (account.transactions || []).filter((t) => t.id !== txId);
        const updated: Account = {
          ...account,
          transactions: newTxs,
          balance: newTxs.reduce(
            (acc, t) => (t.type === "deposit" ? acc + t.amount : acc - t.amount),
            0
          ),
        };
        setAccount(updated);
        persistAccount(updated);
      },
    });
  };

  const { profitLoss } = useMemo(() => {
    if (!account) return { profitLoss: 0 };
    let pl = 0;
    (account.transactions || []).forEach((t) => {
      if (t.trackPrice && t.purchaseUnit === account.currency) {
        pl += t.amount - (t.purchasePrice ?? 0);
      }
    });
    return { profitLoss: pl };
  }, [account]);

  const openEdit = () => {
    if (!account) return;
    setEditForm({
      name: account.name,
      currency: account.currency,
      icon: account.icon,
      color: account.color,
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  if (!account) return null;

  const balanceBase = convert(account.balance, account.currency, baseUnit);

  return (
    <div style={{ padding: 20 }}>
      {/* ✅ RTL-Aware Header Row */}
      <Row align="middle" style={{ marginBottom: 20 }}>
        {/* ✅ RTL: Back button moves to RIGHT side */}
        <ArrowLeftOutlined
          style={{ 
            fontSize: 22, 
            cursor: "pointer", 
            marginInlineEnd: 12  // ✅ RTL-aware spacing
          }}
          onClick={() => navigate(-1)}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: account.color + "25",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 28,
            }}
          >
            {account.icon}
          </div>

          <div>
            <Title level={3} style={{ margin: 0 }}>{account.name}</Title>
            <Text type="secondary">{account.currency}</Text>
          </div>
        </div>

        {/* ✅ RTL: Buttons move to LEFT side */}
        <div style={{ marginInlineStart: "auto", display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={openEdit} title={t('common.edit')} />
          <Button danger icon={<DeleteOutlined />} onClick={deleteAccount} title={t('common.delete')} />
          <Button icon={<PlusOutlined />} onClick={() => setIsAdding(true)}>
            {t('common.add')}
          </Button>
        </div>
      </Row>

      {isEditing && (
        <Card style={{ borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", background: "#fafafa" }}>
          <Title level={4} style={{ marginTop: 0 }}>{t('accounts.edit')}</Title>

          <Text strong>{t('accounts.title')}</Text>
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
            placeholder={t('accounts.title')}
            style={{ marginBottom: 16, marginTop: 4 }}
          />

          <Text strong>{t('accounts.currency', { defaultValue: 'Currency' })}</Text>
          <Select
            value={editForm.currency}
            onChange={(v) => setEditForm((s) => ({ ...s, currency: v }))}
            style={{ width: "100%", marginBottom: 16, marginTop: 4 }}
          >
            {units.map((u) => (
              <Option key={u.code} value={u.code}>
                {u.symbol} {u.code}
              </Option>
            ))}
          </Select>

          {/* Icon & Color selectors - keep as visual */}
          <Text strong>Icon</Text>
          <Row gutter={[12, 12]} style={{ marginTop: 8, marginBottom: 16 }}>
            {ICONS.map((emoji) => {
              const isSelected = editForm.icon === emoji;
              return (
                <Col xs={6} sm={4} md={3} key={emoji} style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    onClick={() => setEditForm({ ...editForm, icon: emoji })}
                    style={{
                      width: 55, height: 55, borderRadius: 14,
                      border: isSelected ? "2px solid #1677ff" : "1px solid #ddd",
                      display: "flex", justifyContent: "center", alignItems: "center",
                      cursor: "pointer", fontSize: 28, background: "#fff",
                      boxShadow: isSelected ? "0 2px 8px rgba(22, 119, 255, 0.3)" : "0 1px 4px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {emoji}
                  </div>
                </Col>
              );
            })}
          </Row>

          <Text strong>Color</Text>
          <Row style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginTop: 8, marginBottom: 16 }}>
            {COLORS.map((color) => {
              const isSelected = editForm.color === color;
              return (
                <div
                  key={color}
                  onClick={() => setEditForm({ ...editForm, color: color })}
                  style={{
                    flex: "1 0 28px", maxWidth: 28, marginBottom: 12, height: 28,
                    borderRadius: "50%", background: color, cursor: "pointer",
                    border: isSelected ? "3px solid black" : "2px solid white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
                  }}
                />
              );
            })}
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Button type="primary" block onClick={saveEdit}>{t('common.save')}</Button>
            </Col>
            <Col span={12}>
              <Button block onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Text type="secondary">{t('accounts.balance')}</Text>
            <Title style={{ marginTop: 8 }}>
              {account.currency} {formatMoney(account.balance)}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ≈ {baseSymbol}{formatMoney(balanceBase)} {baseUnit}
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Text type="secondary">{t('accounts.profitLoss')}</Text>
            <Title style={{ marginTop: 8, color: profitLoss >= 0 ? "green" : "red" }}>
              {profitLoss >= 0 ? "+" : "-"}{account.currency}{formatMoney(Math.abs(profitLoss))}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16 }}>
        {isAdding && (
          <Card type="inner" style={{ marginBottom: 16, borderRadius: 12, background: "#fafafa", paddingBottom: 24 }}>
            <Title level={4} style={{ margin: 0, marginBottom: 12 }}>{t('accounts.addTransaction')}</Title>
            <Divider />

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Text strong>{t('accounts.type')}</Text>
                <Select value={form.type} onChange={(v) => setForm((s) => ({ ...s, type: v as any }))} style={{ width: "100%", marginTop: 6 }}>
                  <Option value="deposit">{t('accounts.deposit')}</Option>
                  <Option value="withdrawal">{t('accounts.withdrawal')}</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>{t('accounts.amount')}</Text>
                <Input
                  value={formatInputNumber(form.amount)}
                  onChange={(e) => {
                    const formatted = formatInputNumber(e.target.value);
                    setForm((s) => ({ ...s, amount: formatted.replace(/,/g, "") }));
                  }}
                  placeholder="0.00"
                  style={{ marginTop: 6 }}
                />
              </Col>
            </Row>

            <Row gutter={12} style={{ marginTop: 12 }}>
              <Col xs={24} md={16}>
                <Text strong>{t('accounts.description')}</Text>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="e.g. Salary, groceries…"
                  style={{ marginTop: 6 }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Text strong>{t('common.dateTime', { defaultValue: 'Date / Time' })}</Text>
                <Input disabled value={new Date().toLocaleString()} style={{ marginTop: 6 }} />
              </Col>
            </Row>

            <Divider />
            <Checkbox checked={trackPrice} onChange={(e) => setTrackPrice(e.target.checked)}>
              {t('accounts.trackPrice')}
            </Checkbox>

            {trackPrice && (
              <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Text strong>{t('accounts.purchasePrice')}</Text>
                    <Input
                      placeholder="Total paid"
                      value={formatInputNumber(form.purchasePrice)}
                      onChange={(e) => {
                        const formatted = formatInputNumber(e.target.value);
                        setForm((s) => ({ ...s, purchasePrice: formatted.replace(/,/g, "") }));
                      }}
                      style={{ marginTop: 6 }}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Text strong>{t('accounts.purchaseUnit')}</Text>
                    <Select
                      value={form.purchaseUnit || (units[0]?.code || "GBP")}
                      onChange={(v) => setForm((s) => ({ ...s, purchaseUnit: v }))}
                      style={{ width: "100%", marginTop: 6 }}
                    >
                      {units.map((u) => (
                        <Option key={u.code} value={u.code}>{u.symbol} {u.code}</Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </div>
            )}

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Button type="primary" block onClick={addTransaction}>{t('accounts.addTransaction')}</Button>
              </Col>
              <Col span={12}>
                <Button block onClick={() => setIsAdding(false)}>{t('common.cancel')}</Button>
              </Col>
            </Row>
          </Card>
        )}

        {(account.transactions?.length ?? 0) === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, opacity: 0.5 }}>📉</div>
            <Title level={4}>{t('accounts.noTransactions')}</Title>
          </div>
        ) : (
          <div>
            {(account.transactions || []).map((tx) => {
              const signedNative = tx.type === "deposit" ? tx.amount : -tx.amount;
              const baseValue = convert(Math.abs(signedNative), account.currency, baseUnit);
              const sign = signedNative >= 0 ? "+" : "-";
              const color = signedNative >= 0 ? "green" : "red";

              return (
                <Card key={tx.id} style={{ marginBottom: 14, borderRadius: 12 }}>
                  {/* ✅ RTL-Aware Transaction Row */}
                  <Row justify="space-between" align="middle" gutter={[12, 8]} wrap={false} style={{ flexWrap: "nowrap", minHeight: 60 }}>
                    <Col style={{ width: 52, flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        {signedNative >= 0 ? "📈" : "📉"}
                      </div>
                    </Col>

                    {/* ✅ RTL: Content padding flips correctly */}
                    <Col flex="auto" style={{ minWidth: 0, paddingInlineEnd: 12, overflow: "hidden" }}>
                      <div style={{ marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Text strong style={{ fontSize: 15 }}>
                          {tx.description || (tx.type === "deposit" ? t('accounts.deposit') : t('accounts.withdrawal'))}
                        </Text>
                      </div>

                      <Text type="secondary" style={{ fontSize: 12, display: "block", whiteSpace: "nowrap", overflow: "hidden" }}>
                        {tx.timestamp}
                      </Text>

                      <div style={{ marginTop: 4 }}>
                        <Text strong style={{ color, display: "block", fontSize: 14 }}>
                          {sign}{account.currency}{formatMoney(Math.abs(tx.amount), 8)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                          {sign}{baseSymbol}{formatMoney(baseValue, 2)} {baseUnit}
                        </Text>
                      </div>
                    </Col>

                    {/* ✅ RTL: Delete button stays on RIGHT */}
                    <Col style={{ width: 48, flexShrink: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingInlineStart: 8 }}>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteTransaction(tx.id)} size="small" style={{ padding: 0 }} title={t('common.delete')} />
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AccountDetails;
