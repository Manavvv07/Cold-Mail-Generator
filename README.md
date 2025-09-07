# Outreach AI - AI-Powered Cold Email Generator

Outreach AI is a full-stack application that helps job seekers generate personalized cold emails for job applications. The application extracts job details from job postings and uses AI to create tailored emails based on the user's skills and experience.

## Features

- **Job Data Extraction**: Automatically extracts job information from job posting URLs
- **AI-Powered Email Generation**: Creates personalized cold emails using AI
- **Customizable Templates**: Edit and customize generated emails
- **Multiple Export Options**: Copy to clipboard or download as text file
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)
- A Groq API key (sign up at https://console.groq.com)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install Playwright browsers:
   ```bash
   python -m playwright install
   ```

4. Set up your environment variables:
   - Create a `.env` file in the `backend` directory
   - Add your Groq API key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the `frontend` directory
   - Add the API URL:
     ```
     VITE_API_URL=http://localhost:8000
     ```

## Running the Application

### Option 1: Run Backend and Frontend Separately

1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Run Both Services with Concurrently (from root directory)

```bash
npm run dev
```

## Usage

1. Visit the application in your browser (typically http://localhost:5173)
2. Enter a job posting URL (LinkedIn, Indeed, etc.)
3. Review and edit the extracted job details if needed
4. Provide your personal information and skills
5. Generate a personalized cold email
6. Copy or download the email for use

## Supported Job Boards

- LinkedIn Jobs
- Indeed
- Glassdoor
- Company career pages
- Lever
- Greenhouse
- Stack Overflow Jobs
- Remote.co
- We Work Remotely

## Troubleshooting

### Common Issues

1. **Port already in use**: If you get an error about port 8000 being in use, you can change the port in the backend startup command:
   ```bash
   python -m uvicorn main:app --reload --port 8001
   ```
   Remember to update the `VITE_API_URL` in your frontend `.env.local` file accordingly.

2. **Playwright browser issues**: If you encounter issues with Playwright, try reinstalling browsers:
   ```bash
   cd backend
   python -m playwright install-deps
   python -m playwright install
   ```

3. **API Key Issues**: Make sure your Groq API key is correctly set in the backend `.env` file and that you have sufficient credits.

## Development

### Backend

The backend is built with:
- FastAPI (Python web framework)
- Playwright (for web scraping)
- LangChain (for AI integration)
- Groq (for LLM inference)

### Frontend

The frontend is built with:
- React (with TypeScript)
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.