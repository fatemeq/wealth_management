import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Select, Divider, Button } from "antd";
import { GlobalOutlined, SyncOutlined, DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const Settings: React.FC = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // Load units + selected base unit
  useEffect(() => {
    const savedUnits = JSON.parse(localStorage.getItem("units") || "[]");

    // fallback if empty
    const defaultUnits = [
      { id: 1, code: "USD", name: "US Dollar", symbol: "$" },
      { id: 2, code: "EUR", name: "Euro", symbol: "€" },
      { id: 3, code: "GBP", name: "British Pound", symbol: "£" },
      { id: 4, code: "BTC", name: "Bitcoin", symbol: "₿" },
    ];

    const finalUnits = savedUnits.length > 0 ? savedUnits : defaultUnits;
    setUnits(finalUnits);

    const savedBase = localStorage.getItem("baseUnit");
    if (savedBase) {
      const found = finalUnits.find((u) => u.code === savedBase);
      setSelectedUnit(found || finalUnits[0]);
    } else {
      setSelectedUnit(finalUnits[0]);
    }
  }, []);

  const handleChange = (value: string) => {
    const unit = units.find((u) => u.code === value);
    if (!unit) return;

    setSelectedUnit(unit);
    localStorage.setItem("baseUnit", unit.code);
  };

  if (!selectedUnit) return null;

  return (
    <div style={{ marginLeft: "5px", marginRight: "5px" }}>
      <Row align="middle" gutter={16}>
        <Col>
          <Avatar
            style={{ borderRadius: "25%" }}
            size={48}
            icon={<GlobalOutlined />}
          />
        </Col>

        <Col flex="auto">
          <div style={{ fontSize: 16, fontWeight: 600 }}>Settings</div>
          <div style={{ color: "#888" }}>Manage your preferences</div>
        </Col>
      </Row>

      <Card style={{ marginTop: "16px", borderRadius: "16px" }}>
        {/* GENERAL SETTINGS */}
        <Row align="middle">
          <Col>
            <h1 style={{ marginTop: "5px" }}>General Settings</h1>
            <p style={{ marginBottom: "0", fontWeight: "500", color: "grey" }}>
              Base Unit
            </p>
            <p style={{ marginTop: "2px" }}>
              All values will be converted to this unit on the dashboard
            </p>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Select
              value={selectedUnit.code}
              onChange={handleChange}
              style={{
                width: "100%",
                borderRadius: 16,
                padding: "10px",
                marginTop: 8,
              }}
              placeholder="Select a unit"
            >
              {units.map((unit) => (
                <Option key={unit.id} value={unit.code}>
                  <span style={{ marginRight: 6 }}>{unit.symbol}</span>
                  {unit.code} - {unit.name}
                </Option>
              ))}
            </Select>
            <Divider style={{ marginTop: 16 }} />
          </Col>
        </Row>

        {/* APP UPDATES */}
        <Row align="middle">
          <Col>
            <p style={{ marginBottom: "0", fontWeight: "500", color: "grey" }}>
              App Updates
            </p>
            <p style={{ marginTop: "2px" }}>Fetch the latest release instantly</p>
          </Col>
          <Col span={24}>
            <Button
              style={{ width: "100%", borderRadius: "30px" }}
              icon={<SyncOutlined style={{ marginRight: 6 }} />}
            >
              Update Manually
            </Button>
          </Col>
          <Divider style={{ marginTop: 16 }} />
        </Row>

        {/* INSTALL APP */}
        <Row align="middle">
          <Col>
            <p style={{ marginBottom: "0", fontWeight: "500", color: "grey" }}>
              Install WealthFlow
            </p>
            <p style={{ marginTop: "2px" }}>
              Add the app to your home screen for a native feel
            </p>
          </Col>
          <Col span={24}>
            <Button
              style={{ width: "100%", borderRadius: "30px" }}
              icon={<DownloadOutlined style={{ marginRight: 6 }} />}
            >
              Add to Home Screen
            </Button>
          </Col>
          <Divider style={{ marginTop: 16 }} />
        </Row>

        {/* ABOUT */}
        <Row>
          <p style={{ fontWeight: "500" }}>About</p>
        </Row>
        <Row justify="space-between">
          <Col>
            <p>version</p> <p>storage</p>
          </Col>
          <Col>
            <p>1.0.0</p> <p>Local Browser</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Settings;
