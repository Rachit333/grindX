import { create } from "zustand"

interface Submission {
  title: string
  titleSlug: string
  timestamp: string
  statusDisplay: string
  lang: string
}

interface SubmissionResponse {
  count: number
  submission: Submission[]
}

interface LeetCodeStats {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
  acceptanceRate: number
  ranking: number
  submissionCalendar: Record<string, number>
  totalSubmissions: number
  totalUsers: number
}

interface LeetCodeStore {
  leetCodeData: LeetCodeStats | null
  submissions: Submission[]
  setLeetCodeData: (data: LeetCodeStats) => void
  setSubmissions: (submissionResponse: SubmissionResponse) => void
}

export const useLeetCodeStore = create<LeetCodeStore>((set) => ({
  leetCodeData: null,
  submissions: [],
  setLeetCodeData: (data) => set({ leetCodeData: data }),
  setSubmissions: (submissionResponse) => set({ submissions: submissionResponse.submission }),
}))

