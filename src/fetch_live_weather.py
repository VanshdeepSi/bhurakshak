import requests
import time

def get_24h_rainfall(lat, lon):
    """
    Fetches the 24-hour forecasted precipitation for a specific latitude and longitude 
    using the Open-Meteo API.
    """
    url = f"https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "precipitation_sum",
        "timezone": "Asia/Kolkata",
        "forecast_days": 1
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Open-Meteo returns daily precipitation sum in mm
        rainfall_mm = data['daily']['precipitation_sum'][0]
        
        # Standardize for the ML model (if our model expects a 0-10 scaled value, we cap/scale)
        # Assuming maximum realistic extreme rainfall in NER is ~200mm, we scale it to our 0-10 range
        # Note: If the model expects raw mm, do not scale. Assuming model expects a 0-10 index.
        rainfall_scaled = min((rainfall_mm / 20.0), 10.0) 
        
        return {
            "success": True,
            "rainfall_mm": rainfall_mm,
            "rainfall_scaled": round(rainfall_scaled, 2)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "rainfall_mm": 50.0, # Fallback average
            "rainfall_scaled": 2.5
        }

if __name__ == "__main__":
    # Test for Gangtok, Sikkim
    print("Testing Live Weather API for Gangtok (Lat: 27.3314, Lon: 88.6138)...")
    result = get_24h_rainfall(27.3314, 88.6138)
    print(f"Result: {result}")
