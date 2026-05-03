
# ExamGenius AI – Past Paper Analyzer & Smart Study Planner

## 🚀 Overview

**ExamGenius AI** is an AI-powered academic assistant designed to help students prepare smarter for exams by analyzing previous year question papers and mapping trends against the official syllabus.

Instead of manually reviewing stacks of old papers, students can upload them and instantly discover:

✅ Frequently asked topics
✅ High-yield concepts
✅ Question pattern trends
✅ Difficulty distribution
✅ Syllabus coverage gaps
✅ Personalized study plans
✅ AI-generated practice questions
✅ Exam topic predictions

**Tagline:**

> **Decode Past Papers. Predict Important Topics. Study Smarter.**

---

## ✨ Features

### 📄 Multi Paper Upload

* Upload multiple PDFs/images
* Supports scanned papers
* OCR extraction for image-based content
* Automatic text parsing

### 🤖 AI Topic Extraction

* Identifies repeated concepts
* Groups similar questions
* Extracts units/topics automatically
* Detects subject domains

### 📊 Pattern Analysis

* Topic frequency analysis
* Year-wise trends
* Marks weightage distribution
* Question type classification
* Difficulty analysis

### 📘 Syllabus Cross Mapping

* Upload syllabus PDF
* Detect covered topics
* Highlight missing concepts
* Coverage heatmap

### 🎯 Topic Importance Scoring

Ranks topics based on:

* Frequency
* Recent appearances
* Marks allocation
* Semantic similarity
* Difficulty weight

### 🗓 Smart Study Planner

Generates:

* Daily schedules
* Revision slots
* Mock-test windows
* Buffer days
* Priority study paths

### 📝 Practice Question Generator

Creates:

* 2 mark questions
* 5 mark questions
* 10 mark questions
* MCQs
* Model answers

### 🔮 Exam Prediction Engine

Predicts likely topics:

* Probability scoring
* High-confidence recommendations
* Most probable exam questions

### 💬 AI Assistant

Students can ask:

* What topic should I study first?
* Which unit is most important?
* Generate revision plan
* Suggest mock questions

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Chart.js / Recharts

### Backend

* Python
* FastAPI

### Database

* MongoDB

### AI Layer

* Gemini API / OpenAI API

### OCR

* Tesseract OCR

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🏗 Architecture

User Upload → OCR → Text Extraction → AI Topic Mapping → Frequency Analysis → Syllabus Matching → Prediction Engine → Dashboard → Study Planner

---

## 📁 Project Structure

```bash
ExamGenius-AI/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── config.py
│
├── screenshots/
├── demo-video/
└── README.md
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ExamGenius-AI.git
cd ExamGenius-AI
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🌐 Environment Variables

Create `.env`

```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
OPENAI_API_KEY=
OCR_PATH=
```

---

## 📊 Example Output

**Top Topics**

1. Deadlock – 92%
2. CPU Scheduling – 88%
3. Normalization – 85%
4. Transactions – 79%

**Study Plan**
Day 1 → Deadlock
Day 2 → Scheduling
Day 3 → Normalization
Day 4 → Revision

---

## 🎥 Demo

Add project demo video link here:

```text
Google Drive Link
```

---

## 🔗 Live Demo

Add hosted project URL:

```text
Vercel / Netlify Link
```

---

## 📌 Future Enhancements

* College-specific prediction model
* Personalized weak-area detection
* Voice assistant
* Mobile application
* Community-shared question banks

---

## 👨‍💻 Team

Built for **AI DecodeX Hackathon** by passionate developers focused on transforming exam preparation through AI.

---

## 📄 License

MIT License

---

## ⭐ If you like this project

Give it a star on GitHub.
