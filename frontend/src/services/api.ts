import { JobData, PersonalInfo, GeneratedEmail } from '../types';

// API configuration that reads from the .env.local file
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30-second timeout for requests
  retryAttempts: 2
};

/**
 * A robust utility function for making API calls to the backend.
 * It includes a timeout, retry logic for network errors, and detailed error handling.
 * @param endpoint The API endpoint to call (e.g., '/api/extract-job').
 * @param options The standard RequestInit options for fetch().
 * @param retryCount The current retry attempt number.
 * @returns A promise that resolves with the JSON data from the API.
 */
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  retryCount = 0
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to parse a detailed error message from the backend, otherwise use statusText
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry on network errors or timeouts
    if (retryCount < API_CONFIG.retryAttempts && 
        (error instanceof TypeError || (error as any).name === 'AbortError')) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      return apiCall<T>(endpoint, options, retryCount + 1);
    }
    
    // Re-throw the error after retries or for other error types
    throw error;
  }
}

/**
 * Calls the backend to extract job data from a given URL.
 * @param url The URL of the job posting.
 * @returns A promise that resolves with the extracted JobData.
 */
export async function extractJobData(url: string): Promise<JobData> {
  console.log(`Sending URL to backend: ${url}`);
  // Makes a POST request to the /api/extract-job endpoint
  return apiCall<JobData>('/api/extract-job', {
    method: 'POST',
    body: JSON.stringify({ url: url })
  });
}

/**
 * Calls the backend to generate a personalized email.
 * @param jobData The extracted job data.
 * @param personalInfo The user's personal information.
 * @returns A promise that resolves with the GeneratedEmail.
 */
export async function generateEmail(
  jobData: JobData, 
  personalInfo: PersonalInfo
): Promise<GeneratedEmail> {
  console.log('Sending job and personal data to backend for email generation');
  // Makes a POST request to the /api/generate-email endpoint
  return apiCall<GeneratedEmail>('/api/generate-email', {
    method: 'POST',
    body: JSON.stringify({ 
      jobData: jobData, 
      personalInfo: personalInfo 
    })
  });
}