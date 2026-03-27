:root {
  --bg: #f2f7ff;
  --card: #ffffff;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #d1d5db;

  --green: #22c55e;
  --orange: #f97316;
  --red: #ef4444;

  --radius: 16px;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

/* ===== BASE ===== */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Noto Sans JP", system-ui, sans-serif;
  background: linear-gradient(180deg, #e0f2fe 0%, #f2f7ff 100%);
  color: var(--text);
  -webkit-text-size-adjust: 100%;
}

/* ===== LAYOUT ===== */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

/* ===== PANEL ===== */
.panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-top: 18px;
  box-shadow: var(--shadow);
}

/* ===== TITLE ===== */
h1 {
  font-size: clamp(20px, 5vw, 26px);
  margin-bottom: 8px;
}

h2 {
  font-size: clamp(16px, 4vw, 20px);
  margin-top: 0;
}

/* ===== STATUS ===== */
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.label-name {
  width: 80px;
  font-size: 13px;
}

.bar {
  flex: 1;
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  background: var(--green);
  transition: width .25s ease;
}

.bar-inner.heat {
  background: #3b82f6;
}

.bar-inner.fatigue {
  background: #a855f7;
}

.status-value {
  width: 48px;
  text-align: right;
  font-size: 12px;
  color: var(--muted);
}

.risk-label {
  font-weight: bold;
  margin-top: 8px;
}

/* ===== CHOICES ===== */
.choices-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-btn {
  position: relative;
  padding: 12px 12px 12px 28px;
  font-size: 14px;
  text-align: left;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* タップしやすさ */
}

.choice-btn:hover {
  background: #eef2ff;
}

.choice-btn:active {
  transform: scale(0.98);
}

.choice-btn::before {
  content: "▶";
  position: absolute;
  left: 8px;
  color: #9ca3af;
}

/* ===== TAG ===== */
.tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  margin-right: 6px;
}

.tag-good {
  background: #dcfce7;
  color: #166534;
}

.tag-neutral {
  background: #e0f2fe;
  color: #075985;
}

.tag-warn {
  background: #fef9c3;
  color: #92400e;
}

.tag-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.choice-number {
  font-weight: bold;
  color: #4f46e5;
  margin-right: 4px;
}

/* ===== LOG ===== */
.log-list {
  list-style: none;
  padding: 8px;
  font-size: 13px;
  max-height: 200px;
  overflow-y: auto;
  background: #f1f5f9;
  border-radius: 8px;
}

.log-list li {
  border-bottom: 1px dashed #e5e7eb;
  padding: 4px 0;
}

/* ===== BUTTON ===== */
.btn-restart {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #22c55e);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-restart:active {
  transform: scale(0.97);
}

/* ===== FOOTER ===== */
.footer {
  margin: 24px 0 16px;
  text-align: center;
  font-size: 12px;
  color: var(--muted);
}

/* ===== MOBILE ===== */
@media (max-width: 480px) {
  .container {
    padding: 12px;
  }

  .label-name {
    width: 70px;
    font-size: 12px;
  }

  .status-value {
    width: 40px;
  }
}
