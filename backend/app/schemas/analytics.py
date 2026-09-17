from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    emergency_complaints: int
    total_users: Optional[int] = None
    total_departments: Optional[int] = None

class DistributionItem(BaseModel):
    name: str
    count: int

class AdminAnalytics(BaseModel):
    stats: DashboardStats
    by_category: List[DistributionItem]
    by_status: List[DistributionItem]
    by_department: List[DistributionItem]
    monthly_trend: List[Dict[str, Any]]

# AI Schemas
class AIClassifyRequest(BaseModel):
    title: str
    description: str

class AIClassifyResponse(BaseModel):
    predicted_category: str
    confidence_score: float
    is_simulated: bool = True
    proposed_model: str = "BERT / DistilBERT (Fine-tuned for Civic NLP)"
    suggested_departments: List[str]
    detected_keywords: List[str]
    disclaimer: str

class AIPriorityRequest(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    is_emergency_flagged: bool = False

class AIPriorityResponse(BaseModel):
    estimated_priority: str  # "Low", "Medium", "High", "Emergency"
    urgency_score: float
    is_simulated: bool = True
    proposed_model: str = "MobileBERT + Heuristic Urgency Scoring"
    risk_factors: List[str]
    disclaimer: str
