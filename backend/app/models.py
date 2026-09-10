from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class PredictionLog(Base):
    __tablename__ = "prediction_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    lat = Column(Float, index=True)
    lon = Column(Float, index=True)
    district = Column(String, index=True)
    probability = Column(Float)
    alert_tier = Column(Integer)
    rainfall_mm = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String, index=True)
    state = Column(String, index=True)
    tier = Column(Integer)
    probability = Column(Float)
    message = Column(String)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    active = Column(Integer, default=1) # 1 for True, 0 for False (SQLite boolean)

class IngestionLog(Base):
    __tablename__ = "ingestion_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    rows_added = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class ModelMetadata(Base):
    __tablename__ = "model_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, unique=True, index=True)
    f1_score = Column(Float)
    threshold = Column(Float)
    trained_at = Column(DateTime(timezone=True), server_default=func.now())
    active = Column(Integer, default=0)

class UserAlertSubscription(Base):
    __tablename__ = "user_alert_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, unique=True)
    name = Column(String)
    avatar = Column(String, nullable=True)
    district = Column(String, index=True, default="Darjeeling")
    state = Column(String, default="West Bengal")
    notify_email = Column(Integer, default=1)
    last_notified_tier = Column(Integer, default=0)
    last_notified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmergencyEmailLog(Base):
    __tablename__ = "emergency_email_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    recipient_name = Column(String)
    district = Column(String, index=True)
    state = Column(String)
    tier = Column(Integer)
    hazard_title = Column(String)
    subject = Column(String)
    body_html = Column(Text)
    status = Column(String, default="DISPATCHED")
    sent_at = Column(DateTime(timezone=True), server_default=func.now())


class ModelPerformanceLedger(Base):
    __tablename__ = "model_performance_ledger"
    
    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, index=True)
    run_number = Column(Integer, default=1)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    training_samples = Column(Integer, default=28450)
    f1_score = Column(Float)
    recall = Column(Float)
    precision = Column(Float)
    roc_auc = Column(Float, default=0.923)
    threshold = Column(Float, default=0.470)
    drift_psi = Column(Float, default=0.038)
    delta_f1 = Column(Float, default=0.0)
    delta_recall = Column(Float, default=0.0)
    delta_precision = Column(Float, default=0.0)
    status = Column(String, default="ACTIVE_CHAMPION")
    is_active = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
