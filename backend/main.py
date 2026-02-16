from fastapi import Depends
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Add this new line!
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

# 1. READ THE SECRET PASSWORD
# We read the password directly from the text file we made earlier
with open("/run/secrets/db_password", "r") as file:
    db_password = file.read().strip()

# 2. CONNECT TO THE DATABASE
# The URL format is: postgresql://username:password@host:port/database_name
# Note: We use "localhost" for now because we will test this on your PC first
DATABASE_URL = f"postgresql://admin:{db_password}@db:5432/marketplace"

engine = create_engine(DATABASE_URL)
# This creates a temporary "workspace" for each user request to talk to the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
Base = declarative_base()

# ==========================================
# 3. SHAPE THE TABLES (The ORM Magic)
# ==========================================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # "buyer" or "seller"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    price = Column(Float)
    seller_id = Column(Integer, ForeignKey("users.id")) # Links to the User table

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    status = Column(String, default="pending")

# ==========================================
# 4. START FASTAPI AND CREATE THE TABLES
# ==========================================

app = FastAPI(title="Marketplace API")
# ==========================================
# THE CORS BOUNCER (Security VIP List)
# ==========================================
app.add_middleware(
    CORSMiddleware,
    # Port 5173 is the default port for our upcoming React/Vite frontend
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, DELETE, etc.
    allow_headers=["*"], # Allows all headers
)
@app.on_event("startup")
def startup_event():
    # This is the magic line! When FastAPI starts, it looks at the classes above
    # and automatically creates the actual Postgres tables if they don't exist yet.
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
# This tells FastAPI exactly what data to expect from the React frontend when creating a product
class ProductCreate(BaseModel):
    title: str
    price: float
class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "seller"

@app.get("/")
def read_root():
    return {"message": "Welcome to the Marketplace Engine!"}
@app.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    # Create the new product. (We hardcode seller_id=1 for now just to test the database!)
    new_product = Product(title=product.title, price=product.price, seller_id=1)
    db.add(new_product)
    db.commit()               # Save it permanently
    db.refresh(new_product)   # Get the newly generated ID back from Postgres
    return new_product

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    # Ask Postgres for every single product in the table
    products = db.query(Product).all()
    return products
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # In a real app we would hash the password, but we keep it raw for this test!
    new_user = User(email=user.email, hashed_password=user.password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user