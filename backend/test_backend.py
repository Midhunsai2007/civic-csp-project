import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.main import app

client = TestClient(app)

def test_full_system():
    print("--- 1. Testing Root Endpoint ---")
    resp = client.get("/")
    assert resp.status_code == 200, resp.text
    print("[OK] Root OK:", resp.json()["project"])

    print("\n--- 2. Testing Authentication ---")
    # Admin login
    resp = client.post("/api/auth/login", json={"email": "admin@civic.gov", "password": "admin123"})
    assert resp.status_code == 200, resp.text
    admin_token = resp.json()["access_token"]
    print("[OK] Admin login successful. Role:", resp.json()["user"]["role"])

    # Staff login
    resp = client.post("/api/auth/login", json={"email": "staff.roads@civic.gov", "password": "staff123"})
    assert resp.status_code == 200, resp.text
    staff_token = resp.json()["access_token"]
    print("[OK] Staff login successful. Department:", resp.json()["user"]["department_name"])

    # Citizen login
    resp = client.post("/api/auth/login", json={"email": "citizen@example.com", "password": "citizen123"})
    assert resp.status_code == 200, resp.text
    citizen_token = resp.json()["access_token"]
    print("[OK] Citizen login successful. Name:", resp.json()["user"]["name"])

    print("\n--- 3. Testing Citizen Complaint Submission ---")
    citizen_headers = {"Authorization": f"Bearer {citizen_token}"}
    complaint_data = {
        "title": "Broken Streetlight outside Library",
        "description": "The sodium street light outside the central library has been flickering and completely off for 3 days.",
        "category": "Electrical & Streetlighting",
        "address": "Library Avenue, East Block",
        "latitude": "9.5820",
        "longitude": "77.6710",
        "priority": "Medium",
        "is_emergency": "false"
    }
    resp = client.post("/api/complaints", data=complaint_data, headers=citizen_headers)
    assert resp.status_code == 201, resp.text
    new_complaint = resp.json()
    complaint_id = new_complaint["id"]
    print("[OK] Complaint created:", new_complaint["complaint_code"], "Status:", new_complaint["status"])

    # Fetch citizen dashboard
    resp = client.get("/api/citizen/dashboard", headers=citizen_headers)
    assert resp.status_code == 200, resp.text
    print("[OK] Citizen Dashboard Stats:", resp.json())

    print("\n--- 4. Testing Admin Assignment & Oversight ---")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Assign new complaint to Electrical dept (dept_id = 2)
    resp = client.put(f"/api/admin/complaints/{complaint_id}/assign", json={"department_id": 2, "remarks": "Assigned to electrical team"}, headers=admin_headers)
    assert resp.status_code == 200, resp.text
    print("[OK] Admin assigned complaint to:", resp.json()["department_name"], "New Status:", resp.json()["status"])

    # Admin Analytics
    resp = client.get("/api/admin/dashboard", headers=admin_headers)
    assert resp.status_code == 200, resp.text
    analytics = resp.json()
    print("[OK] Admin Analytics Total Complaints:", analytics["stats"]["total_complaints"])
    print("[OK] Category breakdown count:", len(analytics["by_category"]))

    print("\n--- 5. Testing Staff Status Update and Notes ---")
    # Roads staff login & status update on a roads complaint
    staff_headers = {"Authorization": f"Bearer {staff_token}"}
    resp = client.get("/api/staff/complaints", headers=staff_headers)
    assert resp.status_code == 200, resp.text
    roads_complaints = resp.json()
    print(f"[OK] Roads staff has {len(roads_complaints)} assigned complaints.")

    if roads_complaints:
        target_cmp_id = roads_complaints[0]["id"]
        # Update status
        resp = client.put(f"/api/staff/complaints/{target_cmp_id}/status", json={"status": "In Progress", "remarks": "Material loaded on truck"}, headers=staff_headers)
        assert resp.status_code == 200, resp.text
        print("[OK] Staff updated status to:", resp.json()["status"])

        # Add resolution note
        resp = client.post(f"/api/staff/complaints/{target_cmp_id}/notes", json={"note": "Initial site inspection completed successfully.", "is_internal": False}, headers=staff_headers)
        assert resp.status_code == 200, resp.text
        print("[OK] Staff added resolution note ID:", resp.json()["id"])

    print("\n--- 6. Testing Proposed AI Endpoints ---")
    # Classification
    resp = client.post("/api/ai/classify-complaint", json={
        "title": "Severe road cavity and broken asphalt",
        "description": "Car tires getting damaged due to huge crater pothole"
    })
    assert resp.status_code == 200, resp.text
    ai_class = resp.json()
    print("[OK] Proposed AI Classify Result:", ai_class["predicted_category"], "Confidence:", ai_class["confidence_score"])

    # Priority
    resp = client.post("/api/ai/detect-priority", json={
        "title": "Sparking overhead transformer cable",
        "description": "Live wire snapped and sparking near water puddle",
        "is_emergency_flagged": True
    })
    assert resp.status_code == 200, resp.text
    ai_priority = resp.json()
    print("[OK] Proposed AI Priority Result:", ai_priority["estimated_priority"], "Urgency:", ai_priority["urgency_score"])

    print("\n==========================================")
    print("ALL 6 BACKEND VALIDATION TEST SUITES PASSED!")
    print("==========================================")

if __name__ == "__main__":
    test_full_system()
