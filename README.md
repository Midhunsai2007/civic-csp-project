# AI-Powered Community Complaint & Smart Civic Issue Management System

> **Community Service Project (CSP) – First Review 2025–2026**  
> **Department of Computer Science & Engineering (AI & ML)**  
> **Kalasalingam Academy of Research and Education (Deemed to be University)**

---

## 👥 Project Team & Guide

| Role | Name | Register Number |
| :--- | :--- | :--- |
| **Team Member** | M. Mahitha | 99240041229 |
| **Team Member** | C. Sindhu | 99240040807 |
| **Team Member** | B. Vijayasankar | 99240040398 |
| **Team Member** | D. Rajesh | 99240040897 |
| **Faculty Guide** | **Dr. M. Vijay** | Associate Professor / CSE |

---

## 🏛️ Project Overview

**CivicConnect** is a full-stack, centralized municipal grievance management platform designed to eliminate scattered, manual reporting channels, reduce resolution delays, and maintain an immutable audit trail for civic issues.

### Key Capabilities
- **Public Landing Portal**: Live database-driven metrics, 4-stage workflow walkthrough, feature breakdowns, and academic context.
- **Citizen Grievance Submission**: Multi-category complaint intake, photographic evidence upload, browser GPS coordinate pinpointing, priority classification, and critical emergency escalation.
- **Role-Based Access Control**: Secure JWT-based access separation across **Citizen**, **Department Staff**, and **Administrator** roles.
- **Department Queue Management**: Work-crews manage issues assigned to their municipal unit (Roads, Sanitation, Electrical, Water Supply, Public Health), advance lifecycle stages, and record official resolution reports.
- **Administrator Oversight**: Master registry assignment, real-time Recharts analytics (category volume, status ratio, department workloads, monthly intake vs resolution trends), department directory, and user security access.
- **Proposed AI Intelligence Layer**: Dedicated architecture blueprint and functional simulation endpoints (`/api/ai/*`) demonstrating NLP text classification, hazard priority estimation, and automated department recommendation (*clearly delineated as proposed Phase 2 enhancements in adherence with Slide 4 & 15*).

---

## 🔑 Demo Evaluation Accounts

The system is pre-seeded with ready-to-test accounts across all roles:

| Role | Name / Department | Email Address | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | System Administrator | `admin@civic.gov` | `admin123` |
| **Staff** | Rajesh Kumar (*Roads & Infrastructure*) | `staff.roads@civic.gov` | `staff123` |
| **Staff** | Sindhu Priya (*Sanitation & Waste*) | `staff.sanitation@civic.gov` | `staff123` |
| **Citizen** | Mahitha Mohan (*Citizen Demo*) | `citizen@example.com` | `citizen123` |
| **Citizen 2** | Vijayasankar B (*Citizen Demo*) | `citizen2@example.com` | `citizen123` |

> *Tip: The Login page includes a **1-Click Demo Switcher** for instantaneous academic evaluation.*

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React icons, Recharts, Axios
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy ORM, Pydantic v2, Python-Jose (JWT), Passlib / Bcrypt
- **Database**: SQLite (Development) structured for seamless PostgreSQL migration
- **File Storage**: Local uploads mounted via FastAPI `StaticFiles` at `/uploads`

---

## 🚀 Quickstart Instructions

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+ and npm**

### 2. Backend Setup & Run

```bash
# Navigate to backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and seed demo data
python -m app.db.init_db

# Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend interactive Swagger API documentation will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### 3. Frontend Setup & Run

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
*Frontend application will be accessible at: [http://localhost:5173](http://localhost:5173)*

---

## 📑 API Endpoint Map

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new citizen account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Retrieve profile and permissions | Authenticated |
| `POST` | `/api/complaints` | Submit grievance with photo & GPS | Citizen / Admin |
| `GET` | `/api/complaints` | List complaints with query filters | Authenticated |
| `GET` | `/api/complaints/{id}` | Inspect full complaint case file | Authenticated |
| `GET` | `/api/citizen/dashboard` | Personal complaint metrics | Citizen |
| `GET` | `/api/staff/dashboard` | Department queue metrics | Staff / Admin |
| `PUT` | `/api/staff/complaints/{id}/status` | Transition lifecycle status | Staff / Admin |
| `POST` | `/api/staff/complaints/{id}/notes` | Record official resolution note | Staff / Admin |
| `GET` | `/api/admin/dashboard` | Master analytics & chart statistics | Admin |
| `PUT` | `/api/admin/complaints/{id}/assign` | Assign grievance to department | Admin |
| `GET/POST` | `/api/admin/departments` | Manage municipal departments | Admin |
| `GET/PUT` | `/api/admin/users` | Manage user roles & activation | Admin |
| `POST` | `/api/ai/classify-complaint` | NLP category prediction simulation | Public / Auth |
| `POST` | `/api/ai/detect-priority` | Urgency & hazard detection simulation | Public / Auth |

---

## 📜 Academic Research References

1. **Cao et al. (2020)**: Deep learning-based road damage detection. *Advanced Engineering Informatics*, vol. 46.
2. **Caldeira et al. (2022)**: Multi-label classification of public administration complaints. *11th SLATE, OASIcs*.
3. **Arya et al. (2022)**: RDD2022 multi-national road damage dataset. *arXiv:2209.08538*.
4. **Saha et al. (2024)**: Federated learning for global road damage detection. *Computer-Aided Civil Engineering*.
5. **Xavier et al. (2025)**: Complaint classification using CRISP-DM methodology. *Journal on Interactive Systems*, vol. 16.
6. **Joshi et al. (2025)**: *Cityzen*: multi-modal AI pipeline for urban governance. *ICIRSET 2025*.
7. **Rajkumar et al. (2025)**: Zero-shot LLM framework for multimodal grievance classification. *Scientific Reports*.
8. **Madan et al. (2026)**: Cross-platform smart utility management using MobileNetV2. *IJASC*.
