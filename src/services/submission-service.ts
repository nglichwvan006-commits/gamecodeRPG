const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL
const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY

const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  cpp: 54,
  java: 62,
  csharp: 51,
}

export interface Judge0Result {
  stdout: string | null
  time: string
  memory: number
  stderr: string | null
  token: string
  status: {
    id: number
    description: string
  }
}

export const submissionService = {
  async executeCode(sourceCode: string, language: string, stdin: string = ''): Promise<string> {
    const languageId = LANGUAGE_MAP[language] || 63
    
    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': JUDGE0_API_KEY!,
        'x-rapidapi-host': JUDGE0_API_URL!.split('//')[1],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: btoa(sourceCode),
        language_id: languageId,
        stdin: btoa(stdin),
      }),
    })

    const data = await response.json()
    if (!data.token) throw new Error('Failed to create submission')
    return data.token
  },

  async getStatus(token: string): Promise<Judge0Result> {
    const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': JUDGE0_API_KEY!,
        'x-rapidapi-host': JUDGE0_API_URL!.split('//')[1],
      },
    })

    const data = await response.json()
    
    // Decode base64 outputs
    return {
      ...data,
      stdout: data.stdout ? atob(data.stdout) : null,
      stderr: data.stderr ? atob(data.stderr) : null,
    }
  },

  async pollStatus(token: string): Promise<Judge0Result> {
    let result = await this.getStatus(token)
    
    // Status 1: In Queue, 2: Processing
    while (result.status.id <= 2) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      result = await this.getStatus(token)
    }

    return result
  }
}
