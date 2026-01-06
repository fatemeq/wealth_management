import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Select, Divider, Button } from "antd";
import { GlobalOutlined, SyncOutlined, DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  useEffect(() => {
    const savedUnits = JSON.parse(localStorage.getItem("units") || "[]");

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
      const found = finalUnits.find((u: any) => u.code === savedBase);
      setSelectedUnit(found || finalUnits[0]);
    } else {
      setSelectedUnit(finalUnits[0]);
    }
  }, []);

  const handleChange = (value: string) => {
    const unit = units.find((u: any) => u.code === value);
    if (!unit) return;

    setSelectedUnit(unit);
    localStorage.setItem("baseUnit", unit.code);
  };

  if (!selectedUnit) return null;

  return (
    <div style={{ paddingInline: "5px" }}>
      <Row align="middle" gutter={16}>
        <Col>
          <Avatar
            style={{ borderRadius: "25%" }}
            size={48}
            icon={<GlobalOutlined />}
          />
        </Col>

        <Col flex="auto">
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {t('settings.title')}
          </div>
          <div style={{ color: "#888" }}>
            {t('settings.subtitle')}
          </div>
        </Col>
      </Row>

      <Card style={{ marginBlockStart: "16px", borderRadius: "16px" }}>
        <Row align="middle">
          <Col>
            <h1 style={{ marginBlockStart: "5px" }}>
              {t('settings.general', { defaultValue: 'General Settings' })}
            </h1>
            <p style={{ marginBlockEnd: "0", fontWeight: "500", color: "grey" }}>
              {t('settings.baseUnit')}
            </p>
            <p style={{ marginBlockStart: "2px" }}>
              {t('settings.baseUnitDescription', { 
                defaultValue: 'All values will be converted to this unit on the dashboard' 
              })}
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
                marginBlockStart: 8,
              }}
              placeholder={t('settings.selectUnit', { defaultValue: 'Select a unit' })}
            >
              {units.map((unit: any) => (
                <Option key={unit.id} value={unit.code}>
                  <span style={{ marginInlineEnd: 6 }}>{unit.symbol}</span>
                  {unit.code} - {unit.name}
                </Option>
              ))}
            </Select>
            <Divider style={{ marginBlockStart: 16 }} />
          </Col>
        </Row>

        <Row align="middle">
          <Col>
            <p style={{ marginBlockEnd: "0", fontWeight: "500", color: "grey" }}>
              {t('settings.appUpdates')}
            </p>
            <p style={{ marginBlockStart: "2px" }}>
              {t('settings.appUpdatesDescription', { 
                defaultValue: 'Fetch the latest release instantly' 
              })}
            </p>
          </Col>
          <Col span={24}>
            <Button
              style={{ width: "100%", borderRadius: "30px" }}
              icon={<SyncOutlined style={{ marginInlineEnd: 6 }} />}
            >
              {t('settings.updateManually', { defaultValue: 'Update Manually' })}
            </Button>
          </Col>
          <Divider style={{ marginBlockStart: 16 }} />
        </Row>

        <Row align="middle">
          <Col>
            <p style={{ marginBlockEnd: "0", fontWeight: "500", color: "grey" }}>
              {t('settings.installApp')}
            </p>
            <p style={{ marginBlockStart: "2px" }}>
              {t('settings.installAppDescription', { 
                defaultValue: 'Add the app to your home screen for a native feel' 
              })}
            </p>
          </Col>
          <Col span={24}>
            <Button
              style={{ width: "100%", borderRadius: "30px" }}
              icon={<DownloadOutlined style={{ marginInlineEnd: 6 }} />}
            >
              {t('settings.addToHomeScreen', { defaultValue: 'Add to Home Screen' })}
            </Button>
          </Col>
          <Divider style={{ marginBlockStart: 16 }} />
        </Row>

        <Row>
          <p style={{ fontWeight: "500" }}>
            {t('settings.about')}
          </p>
        </Row>
        <Row justify="space-between">
          <Col>
            <p>{t('settings.version', { defaultValue: 'version' })}</p>
            <p>{t('settings.storage', { defaultValue: 'storage' })}</p>
          </Col>
          <Col>
            <p>1.0.0</p>
            <p>{t('settings.localBrowser', { defaultValue: 'Local Browser' })}</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Settings;
