import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react'
import { callLogs } from '../data/mockData'

function CallIcon({ type, status }) {
  if (status === 'Missed') return <PhoneMissed size={15} color="#ef4444" />
  if (type === 'Incoming') return <PhoneIncoming size={15} color="#22c55e" />
  return <PhoneOutgoing size={15} color="#4f46e5" />
}

export default function CallLogs() {
  const connected = callLogs.filter(c => c.status === 'Connected').length
  const missed = callLogs.filter(c => c.status === 'Missed').length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Call Logs</div>
          <div className="page-subtitle">Track all dealer communication history</div>
        </div>
        <button className="btn btn-primary"><Phone size={14} /> New Call</button>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Calls', value: callLogs.length, color: '#4f46e5', bg: '#eff6ff' },
          { label: 'Connected', value: connected, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Missed', value: missed, color: '#dc2626', bg: '#fef2f2' },
          { label: 'Avg Duration', value: '4:52', color: '#d97706', bg: '#fffbeb' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: s.bg, borderRadius: 10,
            padding: '16px', border: `1px solid ${s.color}22`
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Dealer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {callLogs.map((log, i) => (
                <tr key={log.id}>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CallIcon type={log.type} status={log.status} />
                      <span style={{ fontSize: 12 }}>{log.type}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.dealer}</td>
                  <td style={{ color: '#64748b' }}>{log.date}</td>
                  <td style={{ color: '#64748b' }}>{log.time}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {log.duration}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${log.status === 'Connected' ? 'green' : 'red'}`}>{log.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline"><Phone size={12} /> Call Back</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
