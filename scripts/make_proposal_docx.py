from docx import Document
from pathlib import Path

proposal = """
Student Performance Prediction System

This project delivers a full‑stack Student Performance Prediction System designed to help educators and students quickly assess current academic standing and forecast final outcomes. It combines a secure Node/Express/MongoDB backend (JWT authentication, bcrypt password hashing) with a reactive front end built on React (Vite), Tailwind CSS, Framer Motion and Recharts. The backend implements rigorous, transparent calculation logic (weighted averages across assignments, quizzes and midterms) and a rule‑based suggestions engine that provides actionable study recommendations.

The application offers history and analytics endpoints so instructors and students can track trends over time, and the UI visualizes comparisons such as midterm percentage vs predicted final with animated charts and summaries. The stack is containerization‑ready (Docker + docker‑compose) for reliable deployment. This solution accelerates decision‑making, supports early intervention for at‑risk students, and is designed for extensibility — e.g., adding more predictors, improving the ML model, or integrating institutional data sources.
"""

out = Path(__file__).resolve().parent.parent / 'proposal.docx'

doc = Document()
for para in proposal.strip().split('\n\n'):
    doc.add_paragraph(para)

doc.save(str(out))
print(f"Saved: {out}")
