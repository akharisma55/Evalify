import { motion } from 'framer-motion'
import {
  TrendingUp,
  FileText,
  Mic2,
  Star,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Card from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { mockStats, mockActivities, mockChartData } from '../../data/mockData'

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } },
}

const statConfig = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600', ring: 'bg-blue-600' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600', ring: 'bg-green-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600', ring: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600', ring: 'bg-orange-500' },
}

const statIcons = [FileText, Mic2, Star, TrendingUp]

const PIE_DATA = [
  { name: 'CV Reviews', value: 12 },
  { name: 'Interviews', value: 7 },
  { name: 'Feedback', value: 3 },
]
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b']

export default function HomePage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
          {greeting}, <span className="font-semibold text-blue-600">{user?.fullName?.split(' ')[0]}</span>! Here's your overview.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, i) => {
          const cfg = statConfig[stat.color]
          const Icon = statIcons[i]
          return (
            <Card key={stat.label} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                  <Icon size={18} className={cfg.icon} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUpRight size={10} />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </Card>
          )
        })}
      </motion.div>

      {/* Charts row */}
      <motion.div variants={stagger.item} className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">AI Usage This Week</h3>
              <p className="text-xs text-gray-400 mt-0.5">Score trends for CV & Interview</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full font-semibold">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="iv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="cv" stroke="#3b82f6" strokeWidth={2} fill="url(#cv)" name="CV Score" />
              <Area type="monotone" dataKey="interview" stroke="#8b5cf6" strokeWidth={2} fill="url(#iv)" name="Interview Score" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">Activity Split</h3>
          <p className="text-xs text-gray-400 mb-4">Usage breakdown</p>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie data={PIE_DATA} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="mt-3 space-y-2">
            {PIE_DATA.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-300">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent activity */}
      <motion.div variants={stagger.item}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Recent Activity</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View all</span>
          </div>
          <div className="space-y-3">
            {mockActivities.map((act) => (
              <div key={act.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  act.type === 'cv' ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-purple-50 dark:bg-purple-900/30'
                }`}>
                  {act.type === 'cv' ? (
                    <FileText size={16} className="text-blue-600" />
                  ) : (
                    <Mic2 size={16} className="text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{act.title}</p>
                  <p className="text-xs text-gray-400 truncate">{act.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    act.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : act.score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-600'
                  }`}>
                    {act.score}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} />
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
