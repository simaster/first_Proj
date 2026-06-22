export default function MachinePage() {
  const machines = [
    { id: 1, name: '기계 A-001', code: 'M001', enterprise: '삼성전자', status: 'ONLINE' },
    { id: 2, name: '기계 A-002', code: 'M002', enterprise: '삼성전자', status: 'ONLINE' },
    { id: 3, name: '기계 B-001', code: 'M003', enterprise: 'LG전자', status: 'MAINTENANCE' },
    { id: 4, name: '기계 B-002', code: 'M004', enterprise: 'LG전자', status: 'ONLINE' },
    { id: 5, name: '기계 C-001', code: 'M005', enterprise: '현대자동차', status: 'OFFLINE' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-100 text-green-700'
      case 'OFFLINE': return 'bg-red-100 text-red-700'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ONLINE': return '운영 중'
      case 'OFFLINE': return '중지'
      case 'MAINTENANCE': return '점검 중'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">기계 관리</h1>
          <p className="text-gray-600 mt-1">등록된 기계 정보를 관리하세요</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          + 기계 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기계명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                코드
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소속 기업
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {machines.map((machine) => (
              <tr key={machine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-primary-600 mr-3">precision_manufacturing</span>
                    <div className="text-sm font-medium text-gray-900">{machine.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {machine.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {machine.enterprise}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(machine.status)}`}>
                    {getStatusLabel(machine.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-4">수정</button>
                  <button className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
