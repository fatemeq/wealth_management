import React, { useState } from "react";
import { Card, Tabs, Row, Col, Button, Modal, Input, Select, Flex } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useUnits } from "./hooks/useUnits";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./styles.css";
import { formatMoney } from "./utils/format";

const { Option } = Select;

// =======================================================================================
// UNIT FORM
// =======================================================================================
const UnitForm = ({
  editingUnit,
  isAddingUnit,
  onChange,
  onSave,
  onCancel,
}: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 8,
      marginBottom: 16,
    }}
  >
    <h3>{isAddingUnit ? "Add New Unit" : "Edit Unit"}</h3>

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>Unit Code</p>
    <Input
      placeholder="USD, BTC, GOLD"
      value={editingUnit?.code || ""}
      onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
    />

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>Unit Name</p>
    <Input
      placeholder="US Dollar, Bitcoin, Gold Ounce"
      value={editingUnit?.name || ""}
      onChange={(e) => onChange({ name: e.target.value })}
    />

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>Symbol</p>
    <Input
      placeholder="$ / ₿ / 🟡"
      value={editingUnit?.symbol || ""}
      onChange={(e) => onChange({ symbol: e.target.value })}
    />

    <Flex gap={12} style={{ marginTop: 16 }} wrap="wrap">
      <Button
        type="primary"
        style={{ flex: 1, minWidth: 100 }}
        onClick={onSave}
      >
        {isAddingUnit ? "Add" : "Update"}
      </Button>
      <Button style={{ flex: 1, minWidth: 100 }} onClick={onCancel}>
        Cancel
      </Button>
    </Flex>
  </Card>
);

// =======================================================================================
// RATE FORM
// =======================================================================================
const RateForm = ({
  editingRate,
  isAddingRate,
  currencyUnits,
  onChange,
  onSave,
  onCancel,
}: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 8,
      marginBottom: 16,
    }}
  >
    <h3>{isAddingRate ? "Add Exchange Rate" : "Edit Exchange Rate"}</h3>

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>From Unit</p>
    <Select
      value={editingRate?.from || undefined}
      placeholder="Select Base Unit"
      style={{ width: "100%", borderRadius: 12 }}
      onChange={(value) => onChange({ from: value })}
    >
      {currencyUnits.map((u: any) => (
        <Option key={u.code} value={u.code}>
          {u.symbol} {u.code} - {u.name}
        </Option>
      ))}
    </Select>

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>To Unit</p>
    <Select
      value={editingRate?.to || undefined}
      placeholder="Select Target Unit"
      style={{ width: "100%", borderRadius: 12 }}
      onChange={(value) => onChange({ to: value })}
    >
      {currencyUnits.map((u: any) => (
        <Option key={u.code} value={u.code}>
          {u.symbol} {u.code} - {u.name}
        </Option>
      ))}
    </Select>

    <p style={{ marginTop: 12, marginBottom: 0, fontWeight: 500 }}>
      Exchange Rate
    </p>
    <Input
      type="number"
      placeholder="1.0"
      step="0.00000001"
      value={editingRate?.value || ""}
      onChange={(e) => onChange({ value: parseFloat(e.target.value) || 0 })}
    />

    <Flex gap={12} style={{ marginTop: 16 }} wrap="wrap">
      <Button
        type="primary"
        style={{ flex: 1, minWidth: 100 }}
        onClick={onSave}
      >
        {isAddingRate ? "Add" : "Update"}
      </Button>
      <Button style={{ flex: 1, minWidth: 100 }} onClick={onCancel}>
        Cancel
      </Button>
    </Flex>
  </Card>
);

// =======================================================================================
// RATE CARD
// =======================================================================================
const RateCard = ({ r, onEdit, onDelete }: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 12,
    }}
  >
    <Row justify="space-between" align="middle" style={{ marginTop: 5 }}>
      <Col>
        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.05)",
            marginRight: 8,
          }}
        >
          {r.symbolFrom} {r.from}
        </div>
        →
        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.05)",
            marginLeft: 8,
          }}
        >
          {r.symbolTo} {r.to}
        </div>
      </Col>
      <Col>
        <EditOutlined
          style={{
            color: "#fa8c16",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={onEdit}
        />
        <DeleteOutlined
          style={{
            color: "#ff0115",
            marginLeft: 12,
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={onDelete}
        />
      </Col>
    </Row>

    <p style={{ marginTop: 30 }}>
      1 {r.from} = {formatMoney(Number(r.value), 8)} {r.to}
    </p>

    <p
      style={{
        marginTop: 8,
        fontSize: 13,
        color: "#666",
        marginBottom: 5,
      }}
    >
      Updated {r.updated}
    </p>
  </Card>
);

// =======================================================================================
// MAIN COMPONENT
// =======================================================================================
const Units: React.FC = () => {
  const { units, addUnit, updateUnit, deleteUnit } = useUnits();

  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [isAddingUnit, setIsAddingUnit] = useState(false);

  const defaultRates = [
    {
      id: 1,
      from: "EUR",
      to: "USD",
      symbolFrom: "€",
      symbolTo: "$",
      value: 1.09,
      updated: "11/25/2025",
    },
    {
      id: 2,
      from: "BTC",
      to: "USD",
      symbolFrom: "₿",
      symbolTo: "$",
      value: 43250,
      updated: "11/25/2025",
    },
    {
      id: 3,
      from: "GBP",
      to: "USD",
      symbolFrom: "£",
      symbolTo: "$",
      value: 1.27,
      updated: "11/25/2025",
    },
  ];

  const [rates, setRates] = useLocalStorage("exchangeRates", defaultRates);
  const [editingRate, setEditingRate] = useState<any | null>(null);
  const [isAddingRate, setIsAddingRate] = useState(false);

  const currencyUnits = units.map((u: any) => ({
    code: u.code,
    symbol: u.symbol,
    name: u.name,
  }));

  // UNIT HANDLERS
  const handleUnitChange = (updates: any) => {
    setEditingUnit((prev: any) => ({ ...prev, ...updates }));
  };

  const handleDeleteUnit = (id: number) => {
    const unitToDelete = units.find((u: any) => u.id === id);
    if (!unitToDelete) return;

    Modal.confirm({
      title: "Are you sure you want to delete this unit?",
      content: "All related exchange rates will also be deleted.",
      okText: "Yes, delete",
      okType: "danger",
      onOk: () => {
        deleteUnit(id);
        setRates(
          rates.filter(
            (r: any) =>
              r.from !== unitToDelete.code && r.to !== unitToDelete.code
          )
        );
      },
    });
  };

  const updateUnitNow = () => {
    updateUnit(editingUnit.id, editingUnit);
    setEditingUnit(null);
  };

  const createUnit = () => {
    setEditingUnit({
      id: Date.now(),
      code: "",
      name: "",
      symbol: "",
    });
    setIsAddingUnit(true);
  };

  const saveNewUnit = () => {
    addUnit(editingUnit);
    setEditingUnit(null);
    setIsAddingUnit(false);
  };

  const cancelUnitEdit = () => {
    setEditingUnit(null);
    setIsAddingUnit(false);
  };

  // RATE HANDLERS
  const handleRateChange = (updates: any) => {
    setEditingRate((prev: any) => ({ ...prev, ...updates }));
  };

  const deleteRate = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this rate?",
      okText: "Yes, delete",
      okType: "danger",
      onOk: () => setRates(rates.filter((r: any) => r.id !== id)),
    });
  };

  const createRate = () => {
    if (currencyUnits.length < 2) {
      Modal.error({
        title: "Not enough units",
        content: "You need at least two money units to create an exchange rate.",
      });
      return;
    }

    setEditingRate({
      id: Date.now(),
      from: "",
      to: "",
      symbolFrom: "",
      symbolTo: "",
      value: 0,
      updated: new Date().toLocaleDateString(),
    });
    setIsAddingRate(true);
  };

  const saveNewRate = () => {
    const { from, to } = editingRate;

    if (from === to) {
      Modal.error({
        title: "Invalid exchange pair",
        content: "From and To units cannot be the same.",
      });
      return;
    }

    const exactExists = rates.some(
      (r: any) => r.from === from && r.to === to
    );
    const reverseExists = rates.some(
      (r: any) => r.from === to && r.to === from
    );

    if (exactExists || reverseExists) {
      Modal.error({
        title: "Rate already exists",
        content: "A conversion rate between these two units already exists.",
      });
      return;
    }

    const fromU = currencyUnits.find((u: any) => u.code === from);
    const toU = currencyUnits.find((u: any) => u.code === to);

    const newRate = {
      ...editingRate,
      symbolFrom: fromU?.symbol || "",
      symbolTo: toU?.symbol || "",
      updated: new Date().toLocaleDateString(),
    };

    setRates([...rates, newRate]);
    setEditingRate(null);
    setIsAddingRate(false);
  };

  const saveRateUpdate = () => {
    const fromU = currencyUnits.find(
      (u: any) => u.code === editingRate.from
    );
    const toU = currencyUnits.find((u: any) => u.code === editingRate.to);

    setRates(
      rates.map((r: any) =>
        r.id === editingRate.id
          ? {
              ...editingRate,
              symbolFrom: fromU?.symbol || "",
              symbolTo: toU?.symbol || "",
              updated: new Date().toLocaleDateString(),
            }
          : r
      )
    );

    setEditingRate(null);
    setIsAddingRate(false);
  };

  const cancelRateEdit = () => {
    setEditingRate(null);
    setIsAddingRate(false);
  };

  return (
    <div style={{ marginLeft: 5, marginRight: 5 }}>
      <Tabs defaultActiveKey="units" className="custom-tabs">
        {/* UNITS TAB */}
        <Tabs.TabPane tab="Units" key="units">
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
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
                <p
                  style={{
                    margin: 0,
                    fontWeight: 500,
                    color: "grey",
                  }}
                >
                  Your units
                </p>
                <p style={{ margin: 2 }}>Manage currencies and assets</p>
              </div>
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="add-btn-responsive"
                style={{ borderRadius: 10 }}
                onClick={createUnit}
              >
                + Add Unit
              </Button>
            </Col>
          </Row>

          {editingUnit && (
            <UnitForm
              editingUnit={editingUnit}
              isAddingUnit={isAddingUnit}
              onChange={handleUnitChange}
              onSave={isAddingUnit ? saveNewUnit : updateUnitNow}
              onCancel={cancelUnitEdit}
            />
          )}

          <Row gutter={[16, 16]}>
            {units.map((unit: any) => (
              <Col xs={24} md={12} key={unit.id}>
                <Card
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    padding: 12,
                  }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 600,
                          marginRight: 6,
                        }}
                      >
                        {unit.symbol}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 500 }}>
                        {unit.code}
                      </span>
                    </Col>
                    <Col>
                      <EditOutlined
                        style={{
                          color: "#fa8c16",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        onClick={() => {
                          setEditingUnit({ ...unit });
                          setIsAddingUnit(false);
                        }}
                      />
                      <DeleteOutlined
                        style={{
                          color: "red",
                          marginLeft: 12,
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        onClick={() => handleDeleteUnit(unit.id)}
                      />
                    </Col>
                  </Row>
                  <p style={{ marginTop: 4, fontSize: 14 }}>{unit.name}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>

        {/* EXCHANGE RATES TAB */}
        <Tabs.TabPane tab="Exchange Rates" key="exchange">
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
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
                <p
                  style={{
                    margin: 0,
                    fontWeight: 500,
                    color: "grey",
                  }}
                >
                  Exchange Rates
                </p>
                <p style={{ margin: 2 }}>
                  Define conversion rates between units
                </p>
              </div>
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="add-btn-responsive"
                style={{ borderRadius: 10 }}
                onClick={createRate}
              >
                + Add Rate
              </Button>
            </Col>
          </Row>

          {editingRate && (
            <RateForm
              editingRate={editingRate}
              isAddingRate={isAddingRate}
              currencyUnits={currencyUnits}
              onChange={handleRateChange}
              onSave={isAddingRate ? saveNewRate : saveRateUpdate}
              onCancel={cancelRateEdit}
            />
          )}

          <Row gutter={[16, 16]}>
            {rates.map((r: any) => (
              <Col xs={24} md={12} key={r.id}>
                <RateCard
                  r={r}
                  onEdit={() => {
                    setEditingRate({ ...r });
                    setIsAddingRate(false);
                  }}
                  onDelete={() => deleteRate(r.id)}
                />
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Units;
