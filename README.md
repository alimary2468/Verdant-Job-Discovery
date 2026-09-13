# 🌱 Verdant — AI-Powered Job Discovery Platform

> **"Grow into your next role."**

Verdant is a complete, portfolio-quality, full-stack AI-powered job discovery platform designed to help students, recent graduates, and career switchers discover high-alignment career opportunities based on their **skills, experience level, education, and preferred career field**.

Unlike traditional black-box platforms, Verdant provides mathematical transparency and explainable match rationale using an embedded, local NLP recommendation engine built with **TF-IDF (Term Frequency-Inverse Document Frequency)** and **Cosine Similarity** in pure JavaScript/TypeScript.

---

## 🚀 Key Features

* **Real Job Dataset**: Powered by 50 verified LinkedIn job listings normalized with industry titles, company details, required competencies, salary ranges, and remote eligibility.
* **Explainable AI Matching**: Every job displays a precision match percentage alongside transparent, human-readable bullet points detailing why the position matches your profile.
* **Interactive Career Profile**: Create and persist your career attributes with dynamic skill pills, automated synonym resolution, experience levels, and career field preferences.
* **Multi-Parameter Search & Filter**:
  * Free-text search matching across job title, company, skills, description, and location.
  * Filters for Location, Seniority Level, Job Type (Full-time, Part-time, Contract, Internship), and Remote availability.
* **Interactive Match Progression Rings**: Distinct circular indicators (Strong, Good, and General alignment) color-coded to guide exploration.
* **One-Click Application Flow**: Apply directly through verified employer portals or submit applications to the employer's review queue (`/server/data/applications.json`) with input validation and instant toast feedback.
* **Bookmark & Saved Jobs**: Pin interesting positions to local storage for quick access across sessions.

---

## 🧠 AI Matching Engine Architecture

Verdant runs a transparent, explainable local recommendation engine that requires **no external API keys** and executes deterministically.

### 1. Multi-Factor Scoring Formula

Each job's match score is calculated using a weighted composite formula:

$$\text{Final Score} = (\text{Skill Score} \times 0.60) + (\text{Experience Score} \times 0.20) + (\text{Field Score} \times 0.20)$$

* **Skills (60% weight)**:
  * **Direct Synonym & Substring Overlap (70% of skill score)**: Matches normalized user skills against the job's explicit competencies and full text.
  * **TF-IDF Cosine Similarity (30% of skill score)**: Evaluates semantic relevance between the candidate's complete profile document and the job's title, description, and keywords.
* **Experience Alignment (20% weight)**:
  * Compares candidate seniority (`Intern` $\rightarrow$ `Entry` $\rightarrow$ `Mid` $\rightarrow$ `Senior`) against the role requirement. Exact match receives 100%, 1 level difference receives 75–85%, and 2+ levels receive scaled lower weights.
* **Field Specialization (20% weight)**:
  * Matches domain-specific lexicons (`AI/ML`, `Web Development`, `Data`, `Design`, `Marketing`, `Other`) against job metadata.

### 2. Skill Synonym Mapping

The system automatically resolves industry aliases into unified canonical concepts:
* `reactjs`, `react.js`, `react` $\rightarrow$ `react`
* `node`, `nodejs`, `node.js` $\rightarrow$ `node.js`
* `ml`, `deep learning`, `ai` $\rightarrow$ `machine learning`
* `postgres`, `postgresql` $\rightarrow$ `postgresql`
* `py`, `python3` $\rightarrow$ `python`
* `ts`, `typescript` $\rightarrow$ `typescript`
* `nlp`, `natural language processing` $\rightarrow$ `nlp`

---

## 🛠️ Tech Stack

* **Frontend**:
  * **React 19** with **Vite 6**
  * **TypeScript** for end-to-end type safety
  * **Tailwind CSS v4** with a custom light, fresh aesthetic (Mint `#D1FAE5`, Primary Green `#10B981`, Sage `#A7F3D0`, Peach `#FED7AA`, and Cream `#FEF3C7`)
  * **React Router v7** for fluid client-side routing
  * **Lucide React** for clean iconography
  * **React Hot Toast** for interaction feedback
* **Backend**:
  * **Node.js** & **Express**
  * Custom REST API (`/api/jobs`, `/api/jobs/featured`, `/api/jobs/stats`, `/api/jobs/:id`, `/api/recommend`, `/api/apply`)
  * Local file persistence for application queues (`applications.json`) and job records (`jobs.json`)
* **Matching**:
  * Native TypeScript implementation of **TF-IDF vectorization** and **Cosine Similarity**

---

## 📊 Dataset Structure

Jobs are structured in `/server/data/jobs.json` according to the normalized schema:

```json
{
  "id": "job-1",
  "title": "Machine Learning Engineer",
  "company": "Afiniti",
  "location": "Islamabad, Pakistan",
  "job_type": "Full-time",
  "experience_level": "Entry",
  "skills": ["Python", "Machine Learning", "PyTorch", "SQL", "Docker"],
  "description": "Afiniti is seeking an Entry-level Machine Learning Engineer...",
  "posted_date": "2025-01-08T00:00:00.000Z",
  "apply_url": "https://careers.afiniti.com",
  "is_remote": false,
  "company_size": "1000-5000",
  "industry": "Artificial Intelligence",
  "salary_range": "$60k - $85k"
}
```

---

## 💻 Local Installation & Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000) in your web browser.

4. **Run production build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License
MIT License. Created as an academic and professional engineering portfolio showcase.
