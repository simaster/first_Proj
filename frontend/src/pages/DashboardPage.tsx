export default function DashboardPage() {
  const stats = [
    { label: '총 기업 수', value: '12', icon: 'business', color: 'blue' },
    { label: '총 기계 수', value: '48', icon: 'precision_manufacturing', color: 'green' },
    { label: '운영 중', value: '42', icon: 'play_circle', color: 'green' },
    { label: '점검 중', value: '6', icon: 'build', color: 'yellow' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <span
                className={`material-symbols-outlined text-4xl ${
                  stat.color === 'blue' ? 'text-primary-600' : 
                  stat.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <span className="material-symbols-outlined text-primary-600">notifications</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  기계 #{i} 상태 업데이트
                </p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                정상
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
