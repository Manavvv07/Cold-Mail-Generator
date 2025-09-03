import { JobData, PersonalInfo, GeneratedEmail } from '../types';

// Mock API configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.outreachai.com',
  timeout: 30000,
  retryAttempts: 3
};

// Utility function for API calls with retry logic
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retryCount < API_CONFIG.retryAttempts && 
        (error instanceof TypeError || (error as any).name === 'AbortError')) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      return apiCall<T>(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
}

// Mock function to simulate job data extraction
export async function extractJobData(url: string): Promise<JobData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  // Mock validation
  if (!url || !url.startsWith('http')) {
    throw new Error('Invalid URL provided');
  }

  // Simulate different responses based on URL
  const mockResponses: Record<string, Partial<JobData>> = {
    'linkedin.com': {
      role: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA (Remote)',
      description: `We are seeking a talented Senior Frontend Developer to join our innovative team. You will be responsible for building responsive, user-friendly web applications using modern technologies.

Key Responsibilities:
• Develop and maintain high-quality frontend applications using React, TypeScript, and modern CSS
• Collaborate with designers and backend developers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain coding standards
• Mentor junior developers and contribute to technical decisions

Requirements:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript
• Strong understanding of CSS, HTML5, and responsive design
• Experience with state management (Redux, Zustand)
• Familiarity with testing frameworks (Jest, Cypress)
• Strong problem-solving skills and attention to detail`,
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'HTML5', 'Redux', 'Node.js', 'Git', 'Webpack', 'Jest'],
      experience: '5+ years'
    },
    'indeed.com': {
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      description: `Join our growing startup as a Full Stack Developer and help build the next generation of SaaS products. We're looking for someone passionate about clean code and user experience.

What you'll do:
• Build and maintain web applications using React and Node.js
• Design and implement RESTful APIs
• Work with databases (PostgreSQL, MongoDB)
• Collaborate in an agile development environment
• Participate in product planning and technical architecture decisions

What we're looking for:
• 3+ years of full-stack development experience
• Proficiency in React, Node.js, and JavaScript/TypeScript
• Experience with databases and API design
• Understanding of cloud platforms (AWS, Google Cloud)
• Excellent communication and teamwork skills`,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Express.js', 'Docker'],
      experience: '3+ years'
    },
    'greenhouse.io': {
      role: 'Software Engineer',
      company: 'Enterprise Solutions Ltd',
      location: 'Austin, TX',
      description: `We're hiring a Software Engineer to join our platform team. You'll work on large-scale distributed systems that serve millions of users worldwide.

Responsibilities:
• Design and implement scalable backend services
• Optimize system performance and reliability
• Work with microservices architecture
• Collaborate with cross-functional teams
• Contribute to technical documentation and best practices

Requirements:
• Bachelor's degree in Computer Science or related field
• 4+ years of software development experience
• Strong knowledge of Java, Python, or Go
• Experience with cloud computing and containerization
• Understanding of system design principles`,
      skills: ['Java', 'Python', 'Go', 'Kubernetes', 'Docker', 'AWS', 'Microservices', 'SQL', 'Redis'],
      experience: '4+ years'
    }
  };

  // Determine response based on URL
  let mockData = mockResponses['linkedin.com']; // default
  Object.keys(mockResponses).forEach(domain => {
    if (url.includes(domain)) {
      mockData = mockResponses[domain];
    }
  });

  // Add some randomization
  const variations = [
    { role: 'Senior Software Engineer', company: 'Innovation Labs' },
    { role: 'Frontend Architect', company: 'Digital Agency Pro' },
    { role: 'React Developer', company: 'Modern Web Solutions' }
  ];
  
  if (Math.random() > 0.7) {
    const variation = variations[Math.floor(Math.random() * variations.length)];
    mockData = { ...mockData, ...variation };
  }

  return {
    role: mockData.role || 'Software Developer',
    company: mockData.company || 'Tech Company',
    location: mockData.location || 'Remote',
    description: mockData.description || 'Exciting opportunity to join our team.',
    skills: mockData.skills || ['JavaScript', 'React', 'Node.js'],
    experience: mockData.experience || '2+ years',
    salary: generateRandomSalary(),
    remote: Math.random() > 0.4,
    jobType: 'full-time'
  } as JobData;
}

// Mock function to generate personalized emails
export async function generateEmail(
  jobData: JobData, 
  personalInfo: PersonalInfo
): Promise<GeneratedEmail> {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

  // Mock error simulation (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('AI service temporarily unavailable. Please try again.');
  }

  const templates = {
    formal: generateFormalEmail(jobData, personalInfo),
    casual: generateCasualEmail(jobData, personalInfo),
    creative: generateCreativeEmail(jobData, personalInfo)
  };

  const templateType = selectBestTemplate(jobData, personalInfo);
  const selectedTemplate = templates[templateType];

  return {
    ...selectedTemplate,
    confidence_score: 0.85 + Math.random() * 0.1,
    personalization_level: 'high',
    suggestions: [
      'Consider adding a specific example of your relevant work',
      'Mention why you\'re specifically interested in this company',
      'Include a brief call-to-action in your closing'
    ]
  };
}

// Helper functions
function generateRandomSalary(): string {
  const ranges = ['$80,000 - $120,000', '$100,000 - $150,000', '$120,000 - $180,000', 'Competitive'];
  return ranges[Math.floor(Math.random() * ranges.length)];
}

function selectBestTemplate(jobData: JobData, personalInfo: PersonalInfo): 'formal' | 'casual' | 'creative' {
  // Simple logic to select template based on company and role
  if (jobData.company.toLowerCase().includes('startup') || jobData.role.toLowerCase().includes('creative')) {
    return 'creative';
  }
  if (jobData.company.toLowerCase().includes('corp') || jobData.role.toLowerCase().includes('senior')) {
    return 'formal';
  }
  return 'casual';
}

function generateFormalEmail(jobData: JobData, personalInfo: PersonalInfo): Omit<GeneratedEmail, 'confidence_score' | 'personalization_level' | 'suggestions'> {
  return {
    subject: `Application for ${jobData.role} Position - ${personalInfo.name}`,
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobData.role} position at ${jobData.company}. With my background in software development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.

${personalInfo.skills}

My experience aligns well with your requirements, particularly in the areas of ${jobData.skills.slice(0, 3).join(', ')}. I am excited about the opportunity to contribute to ${jobData.company}'s continued success and would welcome the chance to discuss how my skills and enthusiasm can benefit your team.

${personalInfo.portfolio ? `I invite you to review my portfolio at ${personalInfo.portfolio} to see examples of my work.` : ''}

Thank you for considering my application. I look forward to the opportunity to discuss this position further.

Best regards,
${personalInfo.name}
${personalInfo.email}${personalInfo.phone ? `\n${personalInfo.phone}` : ''}`
  };
}

function generateCasualEmail(jobData: JobData, personalInfo: PersonalInfo): Omit<GeneratedEmail, 'confidence_score' | 'personalization_level' | 'suggestions'> {
  return {
    subject: `Excited about the ${jobData.role} role at ${jobData.company}`,
    content: `Hi there!

I came across the ${jobData.role} position at ${jobData.company} and couldn't help but get excited. The role seems like a perfect match for my skills and interests.

${personalInfo.skills}

I have solid experience with ${jobData.skills.slice(0, 4).join(', ')}, which I noticed are key requirements for this position. What really draws me to ${jobData.company} is your innovative approach to technology and the impact you're making in the industry.

${personalInfo.portfolio ? `Feel free to check out some of my work at ${personalInfo.portfolio} - I think you'll find it relevant to what you're looking for.` : ''}

I'd love to chat more about how I can contribute to your team. Are you available for a quick call this week?

Cheers,
${personalInfo.name}
${personalInfo.email}`
  };
}

function generateCreativeEmail(jobData: JobData, personalInfo: PersonalInfo): Omit<GeneratedEmail, 'confidence_score' | 'personalization_level' | 'suggestions'> {
  return {
    subject: `Why I'm the missing piece for your ${jobData.role} puzzle`,
    content: `Hello ${jobData.company} team!

Picture this: a developer who not only writes clean, efficient code but also brings fresh perspectives and creative problem-solving to every project. That's exactly what you'll get with me as your new ${jobData.role}.

${personalInfo.skills}

Here's what makes me different:
• I don't just code - I craft digital experiences
• My expertise in ${jobData.skills.slice(0, 3).join(', ')} goes beyond the technical
• I believe great software is born from great collaboration

${jobData.company} caught my attention because you're not just another tech company - you're innovators who understand that great products come from great people. I want to be part of that story.

${personalInfo.portfolio ? `Want to see my work in action? Check out ${personalInfo.portfolio} for a taste of what I can bring to your team.` : ''}

Ready to add some creative energy to your development team? Let's talk!

Best,
${personalInfo.name}
${personalInfo.email}`
  };
}

// Export additional utility functions
export { API_CONFIG };