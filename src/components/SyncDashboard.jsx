import React, { useState, useEffect } from 'react';
import { syncAPI, woocommerceAPI } from '../services/api';
import './SyncDashboard.css';

const SyncDashboard = ({ stats, onRefresh }) => {
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [wcStatus, setWcStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await syncAPI.getLogs({ limit: 20 });
      setLogs(response.data.data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    if (showLogs) {
      fetchLogs();
    }
  }, [showLogs]);

  const handleSyncAll = async () => {
    if (!confirm(`Sync all ${stats?.pending || 0} pending products to WooCommerce?`)) {
      return;
    }

    setSyncing(true);
    try {
      const response = await syncAPI.syncAllPending();
      alert(`Sync complete!\nSuccessful: ${response.data.data.successful}\nFailed: ${response.data.data.failed}`);
      onRefresh();
      fetchLogs();
    } catch (error) {
      alert(error.message || 'Failed to sync products');
    } finally {
      setSyncing(false);
    }
  };

  const handleTestWooCommerce = async () => {
    setTesting(true);
    try {
      const response = await woocommerceAPI.test();
      setWcStatus(response.data.data);
      alert(`✅ WooCommerce Connected!\n\nStore: ${response.data.data.storeName}\nVersion: ${response.data.data.wcVersion}`);
    } catch (error) {
      setWcStatus(null);
      alert(`❌ Connection Failed!\n\n${error.message || 'Unable to connect to WooCommerce'}`);
    } finally {
      setTesting(false);
    }
  };

  if (!stats) {
    return <div className="sync-dashboard loading">Loading stats...</div>;
  }

  return (
    <div className="sync-dashboard">
      <h2>Sync Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card synced">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.synced}</div>
            <div className="stat-label">Synced</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.failed}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      {stats.pending > 0 && (
        <div className="sync-actions">
          <button 
            onClick={handleSyncAll} 
            disabled={syncing}
            className="btn-primary btn-large"
          >
            {syncing ? '🔄 Syncing...' : `🚀 Sync All ${stats.pending} Pending Products`}
          </button>
          <button 
            onClick={handleTestWooCommerce} 
            disabled={testing}
            className="btn-secondary btn-large"
          >
            {testing ? '🔄 Testing...' : '🔗 Test WooCommerce Connection'}
          </button>
          {wcStatus && (
            <div className="wc-status-indicator">
              <span className="status-green">✅ Connected to {wcStatus.storeName}</span>
            </div>
          )}
        </div>
      )}

      {stats.categories && Object.keys(stats.categories).length > 0 && (
        <div className="categories-section">
          <h3>Products by Category</h3>
          <div className="categories-list">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="logs-section">
        <button 
          onClick={() => setShowLogs(!showLogs)} 
          className="btn-secondary"
        >
          {showLogs ? '📋 Hide' : '📋 Show'} Sync Logs
        </button>

        {showLogs && (
          <div className="logs-container">
            {logs.length === 0 ? (
              <p>No sync logs yet</p>
            ) : (
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Product SKU</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className={log.status}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td><code>{log.productSku}</code></td>
                      <td>
                        <span className={`action-badge ${log.action}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${log.status}`}>
                          {log.status === 'success' ? '✅' : '❌'} {log.status}
                        </span>
                      </td>
                      <td>{log.duration ? `${log.duration}ms` : '-'}</td>
                      <td>
                        {log.error ? (
                          <span className="error-message" title={log.error.message}>
                            {log.error.code}
                          </span>
                        ) : (
                          log.woocommerceId ? `WC ID: ${log.woocommerceId}` : '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncDashboard;
