export default function MonitoringPage() {
  const monitoringData = [
    { id: 1, machine: '기계 A-001', temperature: 185.5, pressure: 1200, cycleTime: 45, timestamp: '2024-01-15 10:30:00' },
    { id: 2, machine: '기계 A-002', temperature: 190.2, pressure: 1250, cycleTime: 47, timestamp: '2024-01-15 10:29:00' },
    { id: 3, machine: '기계 B-001', temperature: 178.8, pressure: 1180, cycleTime: 43, timestamp: '2024-01-15 10:28:00' },
    { id: 4, machine: '기계 B-002', temperature: 192.1, pressure: 1280, cycleTime: 48, timestamp: '2024-01-15 10:27:00' },
    { id: 5, machine: '기계 C-001', temperature: 0, pressure: 0, cycleTime: 0, timestamp: '2024-01-15 10:26:00' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">모니터링</h1>
          <p className="text-gray-600 mt-1">실시간 기계 모니터링 데이터</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            내보내기
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            새로고침
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기업</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>전체</option>
              <option>삼성전자</option>
              <option>LG전자</option>
              <option>현대자동차</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기계</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option>전체</option>
              <option>기계 A-001</option>
              <option>기계 A-002</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
      </div>

      {/* Monitoring Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기계
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                온도 (°C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                압력 (bar)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사이클 시간 (s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                시간
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monitoringData.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.machine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.temperature.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.pressure}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.cycleTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
