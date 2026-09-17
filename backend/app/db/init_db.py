import sys
import os
from datetime import datetime, timedelta, timezone

# Ensure backend root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.db.session import engine, Base, SessionLocal
from app.models.department import Department
from app.models.user import User
from app.models.complaint import Complaint, ComplaintStatusHistory, ResolutionNote
from app.core.security import get_password_hash

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Departments
        dept_data = [
            {
                "name": "Roads & Infrastructure",
                "description": "Responsible for municipal roadways, pothole repairs, bridges, footpaths, and traffic safety signage.",
                "contact_email": "roads@civic.gov",
                "contact_phone": "+91 44 2841 0001"
            },
            {
                "name": "Electrical & Streetlighting",
                "description": "Manages street lights, electrical poles, underground cables, transformers, and public lighting safety.",
                "contact_email": "electrical@civic.gov",
                "contact_phone": "+91 44 2841 0002"
            },
            {
                "name": "Sanitation & Waste Management",
                "description": "Oversees residential garbage collection, public dustbins, street sweeping, and solid waste processing.",
                "contact_email": "sanitation@civic.gov",
                "contact_phone": "+91 44 2841 0003"
            },
            {
                "name": "Water Supply & Drainage",
                "description": "Maintains municipal drinking water supply, pipeline networks, storm water drains, and sewage flow.",
                "contact_email": "water@civic.gov",
                "contact_phone": "+91 44 2841 0004"
            },
            {
                "name": "Public Health & Safety",
                "description": "Handles vector control, public sanitation hazards, animal welfare, and general civic health concerns.",
                "contact_email": "health@civic.gov",
                "contact_phone": "+91 44 2841 0005"
            }
        ]

        dept_map = {}
        for d in dept_data:
            existing = db.query(Department).filter(Department.name == d["name"]).first()
            if not existing:
                new_dept = Department(**d)
                db.add(new_dept)
                db.flush()
                dept_map[d["name"]] = new_dept
                print(f"Created department: {d['name']}")
            else:
                dept_map[d["name"]] = existing

        db.commit()

        # 2. Seed Users
        users_data = [
            {
                "name": "System Administrator",
                "email": "admin@civic.gov",
                "password": "admin123",
                "role": "admin",
                "phone": "+91 98765 00001",
                "department_id": None
            },
            {
                "name": "Rajesh Kumar (Roads Lead)",
                "email": "staff.roads@civic.gov",
                "password": "staff123",
                "role": "staff",
                "phone": "+91 98765 00002",
                "department_id": dept_map["Roads & Infrastructure"].id
            },
            {
                "name": "Sindhu Priya (Sanitation Officer)",
                "email": "staff.sanitation@civic.gov",
                "password": "staff123",
                "role": "staff",
                "phone": "+91 98765 00003",
                "department_id": dept_map["Sanitation & Waste Management"].id
            },
            {
                "name": "Mahitha Mohan (Citizen)",
                "email": "citizen@example.com",
                "password": "citizen123",
                "role": "citizen",
                "phone": "+91 98765 11111",
                "department_id": None
            },
            {
                "name": "Vijayasankar B (Citizen)",
                "email": "citizen2@example.com",
                "password": "citizen123",
                "role": "citizen",
                "phone": "+91 98765 22222",
                "department_id": None
            }
        ]

        user_map = {}
        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                pwd_hash = get_password_hash(u["password"])
                new_user = User(
                    name=u["name"],
                    email=u["email"],
                    password_hash=pwd_hash,
                    role=u["role"],
                    phone=u["phone"],
                    department_id=u["department_id"],
                    is_active=True
                )
                db.add(new_user)
                db.flush()
                user_map[u["email"]] = new_user
                print(f"Created user: {u['name']} ({u['role']})")
            else:
                user_map[u["email"]] = existing

        db.commit()

        # 3. Seed Realistic Complaints if none exist
        complaint_count = db.query(Complaint).count()
        if complaint_count == 0:
            print("Seeding initial demo complaints...")
            citizen1 = user_map["citizen@example.com"]
            citizen2 = user_map["citizen2@example.com"]
            admin_user = user_map["admin@civic.gov"]
            staff_roads = user_map["staff.roads@civic.gov"]
            staff_sanitation = user_map["staff.sanitation@civic.gov"]

            now = datetime.now(timezone.utc)

            seed_complaints = [
                {
                    "code": "CMP-202609-RD001",
                    "citizen": citizen1,
                    "title": "Severe Pothole Cluster near Krishnankoil Bus Stop",
                    "description": "Deep potholes covering a 15-meter stretch right near the primary bus shelter. Poses dangerous risk to two-wheelers especially during rainy evenings.",
                    "category": "Roads & Infrastructure",
                    "address": "NH 744, Near Bus Stand, Krishnankoil, Srivilliputhur",
                    "latitude": 9.5812,
                    "longitude": 77.6711,
                    "image_url": None,
                    "priority": "High",
                    "is_emergency": False,
                    "status": "In Progress",
                    "dept": dept_map["Roads & Infrastructure"],
                    "staff": staff_roads,
                    "created_offset_days": 4,
                    "history": [
                        ("Submitted", None, citizen1, "Complaint registered by citizen"),
                        ("Assigned", "Submitted", admin_user, "Assigned to Roads & Infrastructure Department"),
                        ("In Progress", "Assigned", staff_roads, "Road maintenance crew dispatched for cold-mix asphalt filling")
                    ],
                    "notes": [
                        (staff_roads, "Asphalt patch team scheduled for morning 10 AM shift. Material requisition confirmed.", False)
                    ]
                },
                {
                    "code": "CMP-202609-EL002",
                    "citizen": citizen1,
                    "title": "Continuous Sparking from Pole-Mounted Transformer",
                    "description": "Overhead transformer on 4th Cross Street is violently sparking during peak loads with buzzing sound. Immediate electrocution and fire hazard for pedestrians.",
                    "category": "Electrical & Streetlighting",
                    "address": "4th Cross Street, College Road, Krishnankoil",
                    "latitude": 9.5835,
                    "longitude": 77.6698,
                    "image_url": None,
                    "priority": "Emergency",
                    "is_emergency": True,
                    "status": "Assigned",
                    "dept": dept_map["Electrical & Streetlighting"],
                    "staff": None,
                    "created_offset_days": 1,
                    "history": [
                        ("Submitted", None, citizen1, "EMERGENCY: Immediate electrical hazard reported"),
                        ("Assigned", "Submitted", admin_user, "Fast-track escalated to Electrical & Streetlighting Emergency Unit")
                    ],
                    "notes": []
                },
                {
                    "code": "CMP-202609-SN003",
                    "citizen": citizen2,
                    "title": "Uncollected Garbage Accumulation near Market Corner",
                    "description": "Community waste bin has been overflowing for the past 5 days. Foul smell spreading across the residential colony and blocking pedestrian walkway.",
                    "category": "Sanitation & Waste Management",
                    "address": "Daily Market Road, Near Srivilliputhur Arch",
                    "latitude": 9.5123,
                    "longitude": 77.6321,
                    "image_url": None,
                    "priority": "Medium",
                    "is_emergency": False,
                    "status": "Resolved",
                    "dept": dept_map["Sanitation & Waste Management"],
                    "staff": staff_sanitation,
                    "created_offset_days": 6,
                    "history": [
                        ("Submitted", None, citizen2, "Sanitation grievance submitted"),
                        ("Assigned", "Submitted", admin_user, "Assigned to Sanitation & Waste Management"),
                        ("In Progress", "Assigned", staff_sanitation, "Compactor truck allocated for clearing"),
                        ("Resolved", "In Progress", staff_sanitation, "Area cleared, sanitized with bleaching powder, and bin replaced")
                    ],
                    "notes": [
                        (staff_sanitation, "Site cleared by sanitary team batch #3 at 11:30 AM. Bleaching applied.", False)
                    ]
                },
                {
                    "code": "CMP-202609-WT004",
                    "citizen": citizen2,
                    "title": "Major Drinking Water Pipeline Leakage",
                    "description": "Main distribution pipe cracked, clean drinking water gushing onto the road since early morning. Low pressure in surrounding 40 households.",
                    "category": "Water Supply & Drainage",
                    "address": "Gandhi Nagar Main Road, Krishnankoil",
                    "latitude": 9.5855,
                    "longitude": 77.6744,
                    "image_url": None,
                    "priority": "High",
                    "is_emergency": False,
                    "status": "Under Review",
                    "dept": dept_map["Water Supply & Drainage"],
                    "staff": None,
                    "created_offset_days": 2,
                    "history": [
                        ("Submitted", None, citizen2, "Water leakage reported"),
                        ("Under Review", "Submitted", admin_user, "Assessing valve shutdown requirements before excavation")
                    ],
                    "notes": []
                },
                {
                    "code": "CMP-202609-RD005",
                    "citizen": citizen1,
                    "title": "Broken Drainage Slab on Pedestrian Walkway",
                    "description": "Concrete cover slab broken open over 4-foot deep storm drain. Open hole is completely unlit at night, creating severe fall risk.",
                    "category": "Roads & Infrastructure",
                    "address": "University North Gate Road, KARE Campus",
                    "latitude": 9.5888,
                    "longitude": 77.6780,
                    "image_url": None,
                    "priority": "High",
                    "is_emergency": True,
                    "status": "In Progress",
                    "dept": dept_map["Roads & Infrastructure"],
                    "staff": staff_roads,
                    "created_offset_days": 3,
                    "history": [
                        ("Submitted", None, citizen1, "Urgent fall hazard reported"),
                        ("Assigned", "Submitted", admin_user, "Assigned with high priority to Roads Dept"),
                        ("In Progress", "Assigned", staff_roads, "Barricade placed immediately, replacement RCC slab casted")
                    ],
                    "notes": [
                        (staff_roads, "Warning barricade and reflective tape erected immediately. Precast slab ordered.", False)
                    ]
                },
                {
                    "code": "CMP-202609-SN006",
                    "citizen": citizen2,
                    "title": "Open Drain Clogging and Sewage Overflow",
                    "description": "Plastic and silt accumulation blocking the open culvert, resulting in black stagnant wastewater overflowing onto the residential lane.",
                    "category": "Water Supply & Drainage",
                    "address": "Teachers Colony 2nd Street",
                    "latitude": 9.5801,
                    "longitude": 77.6702,
                    "image_url": None,
                    "priority": "Medium",
                    "is_emergency": False,
                    "status": "Submitted",
                    "dept": None,
                    "staff": None,
                    "created_offset_days": 0,
                    "history": [
                        ("Submitted", None, citizen2, "Complaint lodged by citizen")
                    ],
                    "notes": []
                }
            ]

            for item in seed_complaints:
                created_dt = now - timedelta(days=item["created_offset_days"])
                c = Complaint(
                    complaint_code=item["code"],
                    citizen_id=item["citizen"].id,
                    title=item["title"],
                    description=item["description"],
                    category=item["category"],
                    address=item["address"],
                    latitude=item["latitude"],
                    longitude=item["longitude"],
                    image_url=item["image_url"],
                    priority=item["priority"],
                    is_emergency=item["is_emergency"],
                    status=item["status"],
                    assigned_department_id=item["dept"].id if item["dept"] else None,
                    assigned_staff_id=item["staff"].id if item["staff"] else None,
                    created_at=created_dt,
                    updated_at=created_dt
                )
                db.add(c)
                db.flush()

                # Add histories
                for step_idx, h_entry in enumerate(item["history"]):
                    new_st, old_st, user_actor, remarks = h_entry
                    h_dt = created_dt + timedelta(hours=step_idx * 6)
                    h = ComplaintStatusHistory(
                        complaint_id=c.id,
                        old_status=old_st,
                        new_status=new_st,
                        changed_by_id=user_actor.id,
                        remarks=remarks,
                        created_at=h_dt
                    )
                    db.add(h)

                # Add notes
                for n_entry in item["notes"]:
                    staff_actor, note_text, is_int = n_entry
                    n = ResolutionNote(
                        complaint_id=c.id,
                        staff_id=staff_actor.id,
                        note=note_text,
                        is_internal=is_int,
                        created_at=created_dt + timedelta(hours=8)
                    )
                    db.add(n)

            db.commit()
            print("Successfully seeded demo complaints and history!")

    except Exception as e:
        db.rollback()
        print(f"Error during init_db: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
