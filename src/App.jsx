import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import "./App.css";
const initialInstances = [
  {
    id: "i-0a7c91f2",
    name: "web-server-01",
    status: "Running",
    cpu: 34,
    ip: "10.0.1.21",
  },
  {
    id: "i-0b82d4e7",
    name: "api-server-01",
    status: "Running",
    cpu: 62,
    ip: "10.0.1.35",
  },
  {
    id: "i-0c45f8a2",
    name: "database-01",
    status: "Stopped",
    cpu: 0,
    ip: "10.0.2.14",
  },
  {
    id: "i-0d73b9c1",
    name: "monitoring-01",
    status: "Running",
    cpu: 48,
    ip: "10.0.3.18",
  },
];

function App() {
  const [region, setRegion] = useState("US-East-1");

  const [instances, setInstances] = useState(() => {
    const saved = localStorage.getItem("cloudMonitorInstances");

    return saved ? JSON.parse(saved) : initialInstances;
  });

  const [logs, setLogs] = useState([
    {
      time: "10:16:42",
      type: "INFO",
      message: "Health check completed successfully",
    },
    {
      time: "10:16:35",
      type: "INFO",
      message: "Network interface eth0 is operational",
    },
    {
      time: "10:16:21",
      type: "WARN",
      message: "API server CPU usage above 60%",
    },
    {
      time: "10:15:58",
      type: "INFO",
      message: "Backup process completed",
    },
  ]);

  useEffect(() => {
    localStorage.setItem(
      "cloudMonitorInstances",
      JSON.stringify(instances)
    );
  }, [instances]);

  const addLog = (type, message) => {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
    });

    setLogs((currentLogs) => [
      {
        time,
        type,
        message,
      },
      ...currentLogs,
    ].slice(0, 6));
  };
 const updateInstance = (id, action) => {
  const instance = instances.find((item) => item.id === id);

  if (!instance) return;

  if (action === "start") {
    setInstances((currentInstances) =>
      currentInstances.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Running",
              cpu: Math.floor(Math.random() * 35) + 15,
            }
          : item
      )
    );

    addLog("INFO", `${instance.name} started successfully`);
  }

  if (action === "stop") {
    setInstances((currentInstances) =>
      currentInstances.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Stopped",
              cpu: 0,
            }
          : item
      )
    );

    addLog("INFO", `${instance.name} stopped successfully`);
  }

  if (action === "terminate") {
    setInstances((currentInstances) =>
      currentInstances.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Terminated",
              cpu: 0,
            }
          : item
      )
    );

    addLog("WARN", `${instance.name} terminated`);
  }
}; 
useEffect(() => {
  const messages = [
    {
      type: "INFO",
      message: "Health check completed successfully",
    },
    {
      type: "INFO",
      message: "Network interface eth0 is operational",
    },
    {
      type: "INFO",
      message: "Monitoring agent connected",
    },
    {
      type: "INFO",
      message: "System metrics collected successfully",
    },
    {
      type: "WARN",
      message: "Network latency slightly increased",
    },
  ];

  const interval = setInterval(() => {
    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];

    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
    });

    addLog(
      randomMessage.type,
      randomMessage.message
    );
  }, 8000);

  return () => clearInterval(interval);
}, []);
  const runningInstances = instances.filter(
    (instance) => instance.status === "Running"
  ).length;

  const averageCpu =
    runningInstances > 0
      ? Math.round(
          instances
            .filter((instance) => instance.status === "Running")
            .reduce((total, instance) => total + instance.cpu, 0) /
            runningInstances
        )
      : 0;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">☁</div>

          <div>
            <h2>CloudMonitor</h2>
            <span>Infrastructure Console</span>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Instances</a>
          <a>Network</a>
          <a>Logs</a>
          <a>Alerts</a>
        </nav>

        <div className="sidebar-bottom">
          <span>System Status</span>

          <strong>
            <i></i> Operational
          </strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">CLOUD INFRASTRUCTURE</p>
            <h1>Monitoring Dashboard</h1>
          </div>

          <div className="header-actions">
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <option>US-East-1</option>
              <option>US-West-2</option>
              <option>EU-West-1</option>
              <option>AP-South-1</option>
            </select>

            <div className="user">
              <div className="avatar">AS</div>
              <span>Aryan</span>
            </div>
          </div>
        </header>

        <section className="health-card">
          <div className="health-left">
            <div className="health-icon">✓</div>

            <div>
              <span>System Health</span>
              <h2>All systems operational</h2>
            </div>
          </div>

          <div className="health-right">
            <span>Region</span>
            <strong>{region}</strong>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Active Instances</span>
            <strong>{runningInstances}</strong>
            <small>of {instances.length} total</small>
          </div>

          <div className="stat-card">
            <span>Average CPU</span>
            <strong>{averageCpu}%</strong>
            <small>Current utilization</small>
          </div>

          <div className="stat-card">
            <span>Network Latency</span>
            <strong>24 ms</strong>
            <small>Within normal range</small>
          </div>

          <div className="stat-card">
            <span>Bandwidth</span>
            <strong>2.8 Gbps</strong>
            <small>Current throughput</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel instances-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">COMPUTE</span>
                <h2>Instances</h2>
              </div>

              <button className="outline-btn">
                + Launch Instance
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Instance</th>
                    <th>Status</th>
                    <th>CPU</th>
                    <th>Private IP</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {instances.map((instance) => (
                    <tr key={instance.id}>
                      <td>
                        <strong>{instance.name}</strong>
                        <small>{instance.id}</small>
                      </td>

                      <td>
                        <span
                          className={`status ${instance.status.toLowerCase()}`}
                        >
                          <i></i>
                          {instance.status}
                        </span>
                      </td>

                      <td>
                        <div className="cpu">
                          <div className="cpu-bar">
                            <span
                              style={{
                                width: `${instance.cpu}%`,
                              }}
                            ></span>
                          </div>

                          <b>{instance.cpu}%</b>
                        </div>
                      </td>

                      <td className="ip">{instance.ip}</td>

                      <td>
                        <div className="vm-actions">
                          {instance.status === "Stopped" && (
                            <button
                              className="vm-btn start"
                              onClick={() =>
                                updateInstance(instance.id, "start")
                              }
                            >
                              Start
                            </button>
                          )}

                          {instance.status === "Running" && (
                            <button
                              className="vm-btn stop"
                              onClick={() =>
                                updateInstance(instance.id, "stop")
                              }
                            >
                              Stop
                            </button>
                          )}

                          {instance.status !== "Terminated" && (
                            <button
                              className="vm-btn terminate"
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Terminate ${instance.name}?`
                                );

                                if (confirmed) {
                                  updateInstance(
                                    instance.id,
                                    "terminate"
                                  );
                                }
                              }}
                            >
                              Terminate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel logs-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">SYSTEM</span>
                <h2>Live Logs</h2>
              </div>

              <span className="live">
                <i></i> LIVE
              </span>
            </div>

            <div className="logs">
              {logs.map((log, index) => (
                <div key={`${log.time}-${index}`}>
                  <time>{log.time}</time>

                  <span
                    className={
                      log.type === "WARN" ? "warn" : "info"
                    }
                  >
                    {log.type}
                  </span>

                  <p>{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer>
          CloudMonitor v1.0 • {instances.length} virtual machines • Region:{" "}
          {region}
        </footer>
      </main>
    </div>
  );
}

export default App;