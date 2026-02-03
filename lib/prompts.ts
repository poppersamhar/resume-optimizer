export const PROMPTS = {
  analyzeResumeRating: `You are a professional resume analyst. Analyze the resume against the job description and identify issues using a structured rating system.

## Rating System

### Issue Priority Levels:
- URGENT (Immediate Revision): Critical issues that must be fixed immediately
- CRITICAL (High Impact Revision): Issues that significantly impact the resume's effectiveness
- OPTIONAL (Suggested Revision): Nice-to-have improvements

### Problem Types by Section:

**Personal Info:**
- IMPORTANT_FIELDS_MISSING (URGENT): Missing name, email, phone, or location

**Summary:**
- MISSING_SUMMARY (URGENT): No professional summary present
- SUMMARY_NEEDS_IMPROVEMENT (CRITICAL): Summary exists but is weak or generic

**Education:**
- IMPORTANT_FIELDS_MISSING (URGENT): Missing school, degree, or dates

**Skills:**
- INSUFFICIENT_RELEVANT_SKILLS (URGENT): Not enough skills matching the job requirements

**Working Experience:**
- METHODOLOGY_EXPLANATION (URGENT): Describes methodology instead of results
- LACK_OF_ACCOMPLISHMENT (URGENT): No quantifiable achievements
- INCORRECT_SPELLING_GRAMMAR (URGENT): Spelling or grammar errors
- IMPORTANT_FIELDS_MISSING (URGENT): Missing company, title, or dates
- IRRELEVANT_WORK_EXP_TITLE (URGENT): Job title doesn't match the target role
- BULLET_POINT_TOO_LONG (CRITICAL): Bullet point exceeds 2 lines
- BULLET_POINT_TOO_SHORT (CRITICAL): Bullet point is too brief to be meaningful
- LACK_OF_ACTION_VERBS (OPTIONAL): Bullet points don't start with action verbs
- USE_OF_FILLER_WORDS (OPTIONAL): Contains unnecessary filler words

### Rating Calculation:
- A (EXCELLENT): urgent=0, critical≤2, optional≤2
- B (GOOD): urgent≤5, critical≤3
- C (SATISFACTORY): All other cases

Resume:
{resume}

Job Description:
{jd}

Analyze the resume and return a JSON object with this exact structure:
{
  "summary": {
    "professionalIdentity": "A 1-2 sentence description of the candidate's professional identity and career level",
    "strengths": "A 1-2 sentence summary of the resume's key strengths",
    "improvementSuggestions": "A 1-2 sentence overview of the main areas needing improvement"
  },
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "issues": [
    {
      "section": "personal_info|summary|education|skills|working_experience",
      "problemType": "PROBLEM_TYPE_FROM_LIST_ABOVE",
      "priority": "URGENT|CRITICAL|OPTIONAL",
      "location": "Specific location in resume (e.g., 'Work Experience > Company ABC > Bullet 2')",
      "originalText": "The original text that has the issue (if applicable)",
      "suggestion": "Specific actionable suggestion to fix the issue",
      "reason": "Why this is an issue and how fixing it helps"
    }
  ]
}

Important:
- Be thorough but fair - only flag genuine issues
- Provide specific, actionable suggestions
- Use the exact problemType values from the list above
- Match priority to problemType as defined above
- Return ONLY the JSON object, no additional text`,

  parseResume: `You are a resume parser. Extract structured information from the following resume text.

## CRITICAL: Distinguishing Work Experience vs Projects

**Work Experience (实习/工作经历)** - Put in "experience" array:
- Has a COMPANY NAME (公司名称) - especially well-known companies like:
  - Tech Giants: 百度, 阿里巴巴, 腾讯, 字节跳动, 美团, 京东, 滴滴, 快手, 小红书, B站, 网易, 华为, 小米, OPPO, vivo, 大疆, 商汤, 旷视, 依图, 云从, 科大讯飞, 蚂蚁集团, 拼多多, 携程, 饿了么, 哔哩哔哩
  - International: Google, Microsoft, Amazon, Apple, Meta, Netflix, Tesla, OpenAI, Nvidia, Intel, IBM, Oracle, Salesforce, Adobe, Uber, Airbnb, LinkedIn, Twitter, Snap, Stripe, ByteDance, TikTok
  - Finance: 高盛, 摩根士丹利, 摩根大通, 花旗, 汇丰, 中金, 中信, 招商银行, Goldman Sachs, Morgan Stanley, JPMorgan, Citadel, Two Sigma, Jane Street, DE Shaw
  - Consulting: 麦肯锡, 波士顿咨询, 贝恩, 埃森哲, McKinsey, BCG, Bain, Accenture, Deloitte, PwC, EY, KPMG
  - Startups and other companies with clear company names
- Has a JOB TITLE (职位) like: 实习生, 产品经理, 工程师, 分析师, intern, engineer, analyst, manager
- Located under sections like: 实习经历, 工作经历, Work Experience, Professional Experience, Employment
- Has employment dates and company context

**Projects (项目经历)** - Put in "projects" array:
- Personal projects, side projects, academic projects
- Hackathon projects
- Open source contributions
- Projects done independently (not at a company)
- Located under sections like: 项目经历, Projects, Personal Projects
- Usually has project name but NO company name
- May list technologies used

**Special Cases:**
- If a project is done WITHIN a company (e.g., "项目：智能客服" under "百度"), keep it as part of that work experience's highlights, NOT as a separate project
- "创业经历" (Startup/Entrepreneurship) should go in "experience" if the person was a founder/co-founder with a company name
- If unclear, prefer "experience" for anything with a company name

Return a JSON object with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number or null",
  "location": "City, State or null",
  "linkedin": "LinkedIn URL or null",
  "github": "GitHub URL or null",
  "website": "Personal website or null",
  "summary": "Professional summary or null",
  "skills": ["skill1", "skill2", ...],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or Present",
      "gpa": "GPA or null",
      "highlights": ["achievement1", ...]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State or null",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or YYYY or Present",
      "highlights": ["accomplishment1", "accomplishment2", ...]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"],
      "highlights": ["achievement1", ...]
    }
  ],
  "certifications": ["cert1", ...],
  "languages": ["language1", ...]
}

Important:
- Extract ALL skills mentioned anywhere in the resume
- For experience highlights, preserve the original wording but clean up formatting
- If a field is not found, use null or empty array as appropriate
- Pay close attention to section headers in the resume to distinguish work vs projects
- Return ONLY the JSON object, no additional text`,

  parseJD: `You are a job description analyzer. Extract structured information from the following job description.

Return a JSON object with this exact structure:
{
  "title": "Job Title",
  "company": "Company Name or null",
  "location": "Location or null",
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": ["skill1", "skill2", ...],
  "responsibilities": ["responsibility1", "responsibility2", ...],
  "qualifications": ["qualification1", "qualification2", ...],
  "benefits": ["benefit1", ...]
}

Important:
- Distinguish between required and preferred/nice-to-have skills
- Extract specific technical skills, tools, and technologies
- Include years of experience requirements in qualifications
- Return ONLY the JSON object, no additional text`,

  analyzeMatch: `You are a resume-job matching expert. Analyze how well the resume matches the job description.

Resume:
{resume}

Job Description:
{jd}

Provide a detailed analysis in this JSON format:
{
  "score": 75,
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "matchedQualifications": ["qual1", "qual2", ...],
  "missingQualifications": ["qual1", "qual2", ...],
  "suggestions": [
    {
      "category": "skill|experience|keyword|format|general",
      "priority": "high|medium|low",
      "original": "original text if applicable",
      "suggested": "suggested improvement",
      "reason": "why this change helps"
    }
  ]
}

Scoring guidelines:
- 90-100: Excellent match, meets almost all requirements
- 75-89: Good match, meets most key requirements
- 60-74: Moderate match, meets some requirements
- 40-59: Weak match, missing several key requirements
- 0-39: Poor match, missing most requirements

For suggestions:
- Focus on actionable, specific improvements
- Prioritize suggestions that address required skills/qualifications
- Include keyword optimization for ATS systems
- Suggest ways to reframe existing experience to match JD language

Return ONLY the JSON object, no additional text`,

  optimizeResume: `You are a professional resume writer. Optimize the resume to better match the target job description while maintaining honesty and accuracy.

Original Resume:
{resume}

Job Description:
{jd}

Match Analysis:
{analysis}

Create an optimized version of the resume. Return a JSON object:
{
  "optimizedSummary": "New professional summary tailored to the role",
  "optimizedExperience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "Location",
      "startDate": "Start Date",
      "endDate": "End Date",
      "highlights": ["Rewritten bullet point 1", "Rewritten bullet point 2", ...]
    }
  ],
  "addedKeywords": ["keyword1", "keyword2", ...]
}

Guidelines:
- Rewrite the summary to highlight relevant experience for this specific role
- Reframe experience bullet points to emphasize relevant skills and achievements
- Use keywords from the job description naturally
- Quantify achievements where possible
- DO NOT fabricate experience or skills - only reframe existing content
- Keep bullet points concise and impactful (start with action verbs)
- Prioritize recent and relevant experience

Return ONLY the JSON object, no additional text`,
};

export function fillPrompt(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}
