import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Clock,
  ChevronRight, Search, Sparkles,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import ScoreRing from '../../components/ui/ScoreRing'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { mockInterviewResult, mockInterviewQuestions } from '../../data/mockData'
import { sleep } from '../../utils/helpers'

export default function InterviewAIPage() {
  const { addToast } = useToast()
  const [role, setRole] = useState('')
  const [roleError, setRoleError] = useState('')
  const [phase, setPhase] = useState('idle') // idle | call | loading | result
  const [result, setResult] = useState(null)
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const timerRef = useRef(null)

  const startInterview = () => {
    if (!role.trim()) { setRoleError('Pilih role yang diinginkan'); return }
    setRoleError('')
    setPhase('call')
    setSeconds(0)
    setCurrentQ(0)
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }

  const endInterview = async () => {
    clearInterval(timerRef.current)
    setPhase('loading')
    await sleep(2000)
    setResult({ ...mockInterviewResult, role })
    setPhase('result')
    addToast('Interview completed! Results are ready.', 'success')
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Interview AI</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Buat CV anda lebih baik di mata recruiter
        </p>
      </div>

      {/* Setup / Call */}
      {(phase === 'idle' || phase === 'call') && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg">
          {phase === 'idle' ? (
            <>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                Role yang diinginkan
              </p>
              <input
                type="text"
                placeholder="e.g. UI/UX Designer"
                value={role}
                onChange={(e) => { setRole(e.target.value); setRoleError('') }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 mb-1"
              />
              {roleError && <p className="text-white/80 text-xs mb-1">{roleError}</p>}
              <p className="text-white/50 text-xs mb-4">Pilih role yang terdekat jika tidak ada.</p>
              <Button
                onClick={startInterview}
                className="bg-blue-800/80 hover:bg-blue-900 text-white border-0"
                icon={<Sparkles size={16} />}
              >
                Mulai Interview
              </Button>
            </>
          ) : (
            /* Video call UI */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-semibold">{role}</p>
                  <p className="text-white/60 text-xs">AI Interview Session</p>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-mono">
                  <Clock size={14} />
                  {fmt(seconds)}
                </div>
              </div>

              {/* Video placeholders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-white/10 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/20">
                  <div className="w-12 h-12 rounded-full bg-blue-400/30 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-white/70 text-xs">AI Interviewer</p>
                </div>
                <div className="aspect-video bg-white/10 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/20 relative">
                  {cam ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="text-white/70 text-xs">You</p>
                    </>
                  ) : (
                    <p className="text-white/50 text-xs">Camera Off</p>
                  )}
                </div>
              </div>

              {/* Current question */}
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/60 text-xs mb-1">Current Question {currentQ + 1}/{mockInterviewQuestions.length}</p>
                <p className="text-white text-sm font-medium">{mockInterviewQuestions[currentQ]}</p>
                <div className="flex gap-2 mt-3">
                  {currentQ < mockInterviewQuestions.length - 1 && (
                    <button
                      onClick={() => setCurrentQ((q) => q + 1)}
                      className="text-xs text-white/70 hover:text-white border border-white/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Next Question →
                    </button>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setMic((v) => !v)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    mic ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {mic ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  onClick={() => setCam((v) => !v)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    cam ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {cam ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
                <button
                  onClick={endInterview}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                >
                  <PhoneOff size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results skeleton */}
      {phase === 'loading' && (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* Empty state placeholders when idle */}
      {phase === 'idle' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {['Overall Score', 'Overall Analytic'].map((label) => (
              <Card key={label} className="p-5 min-h-[160px] border-2 border-blue-100 dark:border-blue-700/30 flex flex-col">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {['Kelebihan', 'Bagian yang perlu diperbaiki'].map((label) => (
              <Card key={label} className="p-5 min-h-[120px] flex flex-col">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5 min-h-[100px] flex flex-col">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recommendation</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
            </div>
          </Card>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {phase === 'result' && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score + Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5 border-2 border-blue-100 dark:border-blue-700/30">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Overall Score</p>
                <div className="flex justify-center">
                  <ScoreRing score={result.overallScore} />
                </div>
              </Card>
              <Card className="p-5 border-2 border-blue-100 dark:border-blue-700/30">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Analytic</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{result.overallAnalysis}</p>
              </Card>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kelebihan</p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bagian yang perlu diperbaiki</p>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Recommendation */}
            <Card className="p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recommendation</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{result.recommendation}</p>
            </Card>

            <Button onClick={() => { setPhase('idle'); setResult(null); setRole('') }} variant="secondary">
              Start New Interview
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
