import { History } from 'lucide-react';
import { logEntries } from '../../data/adminData';

export default function AdminLogSistem() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Log Sistem</h1>
      <p className="text-sm text-gray-500 mb-6">Riwayat aktivitas admin dan sistem Siap Siaga.</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {logEntries.map((log) => (
          <div key={log.id} className="flex items-start gap-3 px-5 py-4">
            <span className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
              <History size={14} />
            </span>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{log.actor}</span> — {log.action}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
