import os
import json
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional, Dict, Any

CONFIG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "smtp_config.json")

def get_smtp_config() -> Dict[str, Any]:
    """Retrieve current SMTP configuration from file or environment."""
    config = {
        "smtp_host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "smtp_port": int(os.getenv("SMTP_PORT", "587")),
        "smtp_user": os.getenv("SMTP_USER", ""),
        "smtp_password": os.getenv("SMTP_PASSWORD", ""),
        "smtp_from_name": os.getenv("SMTP_FROM_NAME", "NDMA BhuRakshak Automated Mesh"),
        "smtp_from_email": os.getenv("SMTP_FROM_EMAIL", ""),
        "smtp_use_tls": True
    }
    
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                config.update(saved)
        except Exception as e:
            print(f"Error loading smtp_config.json: {e}")
            
    # Normalize
    if not config.get("smtp_from_email") and config.get("smtp_user"):
        config["smtp_from_email"] = config["smtp_user"]
        
    return config

def save_smtp_config(new_config: Dict[str, Any]) -> Dict[str, Any]:
    """Persist SMTP configuration to disk."""
    current = get_smtp_config()
    current.update(new_config)
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2)
        return {"success": True, "message": "SMTP configuration saved successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}

def send_real_smtp_email(
    to_email: str, 
    recipient_name: str, 
    subject: str, 
    html_body: str,
    district: str = "Darjeeling"
) -> Dict[str, Any]:
    """
    Attempts real SMTP email delivery using configured mail server.
    Returns status detailing whether the email was truly transmitted or if SMTP setup is required.
    """
    config = get_smtp_config()
    smtp_host = config.get("smtp_host", "smtp.gmail.com").strip()
    smtp_port = int(config.get("smtp_port", 587))
    smtp_user = config.get("smtp_user", "").strip()
    smtp_password = config.get("smtp_password", "").strip()
    from_name = config.get("smtp_from_name", "NDMA BhuRakshak Automated Mesh")
    from_email = config.get("smtp_from_email", smtp_user).strip() or smtp_user
    
    if not smtp_user or not smtp_password:
        return {
            "success": False,
            "real_sent": False,
            "status": "UNCONFIGURED",
            "message": "SMTP credentials not configured. Please enter your Gmail / SMTP App Password in Settings to send real emails to your personal inbox.",
            "recipient": to_email
        }
        
    try:
        # Build MIME message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = to_email
        
        # Plain text fallback
        plain_text = f"""
NDMA BHURAKSHAK GEOLOGICAL EARLY WARNING SYSTEM
=================================================
TIER 4 RED ALERT: EVACUATION ADVISORY FOR {district.upper()}

Dear {recipient_name},

Autonomous sensor telemetry and rainfall thresholds indicate imminent slope failure in {district}.
Please initiate immediate life-safety evacuation protocols:
1. Evacuate valley floors and scarps.
2. Move to designated high-elevation shelter zones.
3. Monitor emergency telemetry at BhuRakshak Portal.

National Disaster Management Authority (NDMA)
Direct Citizen Alert Mesh
"""
        msg.attach(MIMEText(plain_text, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        
        # Connect & Send
        if smtp_port == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=12) as server:
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=12) as server:
                server.ehlo()
                context = ssl.create_default_context()
                server.starttls(context=context)
                server.ehlo()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
                
        return {
            "success": True,
            "real_sent": True,
            "status": "DELIVERED",
            "message": f"Real email successfully dispatched to {to_email} via {smtp_host}.",
            "recipient": to_email
        }
    except smtplib.SMTPAuthenticationError as e:
        error_msg = (
            f"SMTP Authentication Error: Could not log in to {smtp_host}. "
            "If using Gmail, make sure to use a 16-character Google App Password (not your normal password)."
        )
        print(f"[EMAIL SERVICE ERROR] {error_msg} (Details: {e})")
        return {
            "success": False,
            "real_sent": False,
            "status": "AUTH_ERROR",
            "error": error_msg,
            "message": error_msg,
            "recipient": to_email
        }
    except Exception as e:
        error_msg = f"SMTP Transmission Error: {str(e)}"
        print(f"[EMAIL SERVICE ERROR] {error_msg}")
        return {
            "success": False,
            "real_sent": False,
            "status": "TRANSMISSION_ERROR",
            "error": error_msg,
            "message": error_msg,
            "recipient": to_email
        }
