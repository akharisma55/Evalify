import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ScoreRing from '../../components/ui/ScoreRing'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../context/ToastContext'
import { mockCVResult } from '../../data/mockData'
import { sleep } from '../../utils/helpers'

const ALLOWED = ['.pdf', '.doc', '.docx']

export default function ReviewCVPage() {
  const { addToast } = useToast()
  const inputRef = useRef()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const handleFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ALLOWED.includes(ext)) {
      addToast('Only PDF, DOC, DOCX files are allowed.', 'error')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleReview = async () => {
    if (!file) {
      addToast('Please upload a CV file first.', 'warning')
      return
    }
    setLoading(true)
    setProgress(0)
    // Simulate progress
    for (let i = 0; i <= 90; i += 10) {
      await sleep(150)
      setProgress(i)
    }
    await sleep(400)
    setProgress(100)
    await sleep(200)
    setResult(mockCVResult)
    setLoading(false)
    addToast('CV reviewed successfully!', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CV Review</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Buat CV anda lebih baik di mata recruiter
        </p>
      </div>

      {/* Upload section */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">
          Upload Resume/CV
        </p>

        {/* Drop zone */}
        <div
          className={`relative bg-white/10 backdrop-blur-sm border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
            dragging ? 'border-white bg-white/20 scale-[1.01]' : 'border-white/40 hover:border-white/70 hover:bg-white/15'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={20} className="text-white" />
              <span className="text-white font-medium text-sm truncate max-w-[200px]">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null) }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Upload size={16} />
              <span className="text-sm">
                <span className="text-white font-semibold">Pilih File</span> atau drag & drop
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="mt-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/60 text-xs mt-1">Analyzing... {progress}%</p>
          </div>
        )}

        <p className="text-white/50 text-xs mt-2">Supported: PDF, DOC, DOCX</p>

        <Button
          onClick={handleReview}
          loading={loading}
          className="mt-4 bg-blue-800/80 hover:bg-blue-900 text-white border-0"
          icon={<Sparkles size={16} />}
        >
          Review
        </Button>
      </div>

      {/* Results */}
      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Overall Score', empty: true },
            { label: 'Overall Analytic', empty: true },
          ].map((c) => (
            <Card key={c.label} className="p-5 min-h-[160px] flex flex-col">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{c.label}</p>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
              </div>
            </Card>
          ))}
          <Card className="p-5 min-h-[160px] border-2 border-blue-200 dark:border-blue-700/50 md:col-span-2 flex flex-col">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CV and job match</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
            </div>
          </Card>
          <Card className="p-5 min-h-[120px] md:col-span-2 flex flex-col">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recommendation</p>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-300 dark:text-gray-600">No data yet</p>
            </div>
          </Card>
        </div>
      )}

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className={`${i >= 3 ? 'md:col-span-2' : ''}`}>
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score + Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Overall Score</p>
                <div className="flex justify-center">
                  <ScoreRing score={result.overallScore} />
                </div>
              </Card>
              <Card className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Overall Analytic</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{result.overallAnalysis}</p>
              </Card>
            </div>

            {/* CV Job Match */}
            <Card className="p-5 border-2 border-blue-200 dark:border-blue-700/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CV and job match</p>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  result.cvJobMatch.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.cvJobMatch.score}% Match
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{result.cvJobMatch.summary}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle size={12} /> Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.cvJobMatch.matched.map((s) => (
                      <span key={s} className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.cvJobMatch.missing.map((s) => (
                      <span key={s} className="text-xs bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendation */}
            <Card className="p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recommendation</p>
              <ul className="space-y-2">
                {result.recommendation.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <ChevronRight size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
