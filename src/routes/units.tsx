import React, { useState } from "react";
import { Card, Tabs, Row, Col, Button, Modal, Input, Select, Flex } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
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
  t,
}: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 8,
      marginBottom: 16,
    }}
  >
    <h3>{isAddingUnit ? t('units.addUnitTitle') : t('units.editUnitTitle')}</h3>

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.unitCode')}
    </p>
    <Input
      placeholder={t('units.unitCodePlaceholder')}
      value={editingUnit?.code || ""}
      onChange={(e: any) => onChange({ code: e.target.value.toUpperCase() })}
    />

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.unitName')}
    </p>
    <Input
      placeholder={t('units.unitNamePlaceholder')}
      value={editingUnit?.name || ""}
      onChange={(e: any) => onChange({ name: e.target.value })}
    />

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.unitSymbol')}
    </p>
    <Input
      placeholder={t('units.unitSymbolPlaceholder')}
      value={editingUnit?.symbol || ""}
      onChange={(e: any) => onChange({ symbol: e.target.value })}
    />

    <Flex gap={12} style={{ marginBlockStart: 16 }} wrap="wrap">
      <Button
        type="primary"
        style={{ flex: 1, minWidth: 100 }}
        onClick={onSave}
      >
        {isAddingUnit ? t('common.add') : t('common.save')}
      </Button>
      <Button style={{ flex: 1, minWidth: 100 }} onClick={onCancel}>
        {t('common.cancel')}
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
  t,
}: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 8,
      marginBottom: 16,
    }}
  >
    <h3>{isAddingRate ? t('units.addRateTitle') : t('units.editRateTitle')}</h3>

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.fromUnit')}
    </p>
    <Select
      value={editingRate?.from || undefined}
      placeholder={t('units.fromUnitPlaceholder')}
      style={{ width: "100%", borderRadius: 12 }}
      onChange={(value: string) => onChange({ from: value })}
    >
      {currencyUnits.map((u: any) => (
        <Option key={u.code} value={u.code}>
          {u.symbol} {u.code} - {u.name}
        </Option>
      ))}
    </Select>

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.toUnit')}
    </p>
    <Select
      value={editingRate?.to || undefined}
      placeholder={t('units.toUnitPlaceholder')}
      style={{ width: "100%", borderRadius: 12 }}
      onChange={(value: string) => onChange({ to: value })}
    >
      {currencyUnits.map((u: any) => (
        <Option key={u.code} value={u.code}>
          {u.symbol} {u.code} - {u.name}
        </Option>
      ))}
    </Select>

    <p style={{ marginBlockStart: 12, marginBlockEnd: 0, fontWeight: 500 }}>
      {t('units.exchangeRate')}
    </p>
    <Input
      type="number"
      placeholder="1.0"
      step="0.00000001"
      value={editingRate?.value || ""}
      onChange={(e: any) => onChange({ value: parseFloat(e.target.value) || 0 })}
    />

    <Flex gap={12} style={{ marginBlockStart: 16 }} wrap="wrap">
      <Button
        type="primary"
        style={{ flex: 1, minWidth: 100 }}
        onClick={onSave}
      >
        {isAddingRate ? t('common.add') : t('common.save')}
      </Button>
      <Button style={{ flex: 1, minWidth: 100 }} onClick={onCancel}>
        {t('common.cancel')}
      </Button>
    </Flex>
  </Card>
);

// =======================================================================================
// RATE CARD
// =======================================================================================
const RateCard = ({ r, onEdit, onDelete, t }: any) => (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      padding: 12,
    }}
  >
    <Row justify="space-between" align="middle" style={{ marginBlockStart: 5 }}>
      <Col>
        <div
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.05)",
            marginInlineEnd: 8,  // ✅ RTL-aware
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
            marginInlineStart: 8,  // ✅ RTL-aware
          }}
        >
          {r.symbolTo} {r.to}
        </div>
      </Col>
      <Col style={{ display: "flex", gap: 12 }}> {/* ✅ RTL-aware button spacing */}
        <EditOutlined
          style={{
            color: "#fa8c16",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={onEdit}
          title={t('common.edit')}
        />
        <DeleteOutlined
          style={{
            color: "#ff0115",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={onDelete}
          title={t('common.delete')}
        />
      </Col>
    </Row>

    <p style={{ marginBlockStart: 30 }}>
      1 {r.from} = {formatMoney(Number(r.value), 8)} {r.to}
    </p>

    <p
      style={{
        marginBlockStart: 8,
        marginBlockEnd: 5,
        fontSize: 13,
        color: "#666",
      }}
    >
      {t('units.updated')} {r.updated}
    </p>
  </Card>
);

// =======================================================================================
// MAIN COMPONENT
// =======================================================================================
const Units: React.FC = () => {
  const { t } = useTranslation();
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
      title: t('units.deleteUnitConfirmTitle'),
      content: t('units.deleteUnitConfirmContent'),
      okText: t('common.yesDelete'),
      okType: "danger",
      cancelText: t('common.cancel'),
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
      title: t('units.deleteRateConfirmTitle'),
      okText: t('common.yesDelete'),
      okType: "danger",
      cancelText: t('common.cancel'),
      onOk: () => setRates(rates.filter((r: any) => r.id !== id)),
    });
  };

  const createRate = () => {
    if (currencyUnits.length < 2) {
      Modal.error({
        title: t('units.notEnoughUnitsTitle'),
        content: t('units.notEnoughUnitsContent'),
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
        title: t('units.invalidExchangePairTitle'),
        content: t('units.invalidExchangePairContent'),
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
        title: t('units.rateExistsTitle'),
        content: t('units.rateExistsContent'),
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
    <div style={{ paddingInline: 5 }}> {/* ✅ RTL-aware container */}
      <Tabs defaultActiveKey="units" className="custom-tabs">
        {/* UNITS TAB */}
        <Tabs.TabPane tab={t('units.units')} key="units">
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
                  {t('units.yourUnits')}
                </p>
                <p style={{ marginBlockStart: 2 }}>
                  {t('units.unitsSubtitle')}
                </p>
              </div>
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="add-btn-responsive"
                style={{ borderRadius: 10 }}
                onClick={createUnit}
              >
                {t('units.addUnit')}
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
              t={t}
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
                          marginInlineEnd: 6,  // ✅ RTL-aware
                        }}
                      >
                        {unit.symbol}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 500 }}>
                        {unit.code}
                      </span>
                    </Col>
                    <Col style={{ display: "flex", gap: 12 }}> {/* ✅ RTL-aware buttons */}
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
                        title={t('common.edit')}
                      />
                      <DeleteOutlined
                        style={{
                          color: "red",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        onClick={() => handleDeleteUnit(unit.id)}
                        title={t('common.delete')}
                      />
                    </Col>
                  </Row>
                  <p style={{ marginBlockStart: 4, fontSize: 14 }}>{unit.name}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>

        {/* EXCHANGE RATES TAB */}
        <Tabs.TabPane tab={t('units.rates')} key="exchange">
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
                  {t('units.exchangeRates')}
                </p>
                <p style={{ marginBlockStart: 2 }}>
                  {t('units.ratesSubtitle')}
                </p>
              </div>
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="add-btn-responsive"
                style={{ borderRadius: 10 }}
                onClick={createRate}
              >
                {t('units.addRate')}
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
              t={t}
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
                  t={t}
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
