from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (for local testing)

def get_daily_irradiance(lat, lon):
    url = "https://re.jrc.ec.europa.eu/api/v5_2/seriescalc"
    params = {
        "lat": lat,
        "lon": lon,
        "startyear": 2020,
        "endyear": 2020,
        "pvtechchoice": "crystSi",
        "mountingplace": "free",
        "loss": 14,
        "outputformat": "json"
    }
    response = requests.get(url, params=params)
    data = response.json()
    print("PVGIS API response:", data) #REMOVE LATER

    # Extract hourly irradiance values
    hourly_data = data.get("outputs", {}).get("hourly", [])
    ghi_values = [entry.get("G(i)", 0) for entry in hourly_data if "G(i)" in entry]

    if not ghi_values:
        raise ValueError("No GHI values found in PVGIS response.")

    # Convert hourly GHI in W/m² to daily average in kWh/m²/day
    total_ghi_wh = sum(ghi_values)
    total_ghi_kwh = total_ghi_wh / 1000  # W -> kW
    days = len(set(entry["time"][:8] for entry in hourly_data))  # number of unique dates
    avg_ghi = total_ghi_kwh / days if days else 0

    return avg_ghi

@app.route('/api/irradiance', methods=['POST'])
def irradiance():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    area = data.get('area')
    efficiency = data.get('efficiency')
    lat = data.get('lat')
    lon = data.get('lon')

    # Check required parameters
    if area is None or efficiency is None or lat is None or lon is None:
        return jsonify({"error": "Missing required parameters (area, efficiency, lat, lon)"}), 400

    try:
        efficiency = float(efficiency)
        avg_ghi = get_daily_irradiance(lat, lon)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"avg_ghi": avg_ghi})

if __name__ == '__main__':
    app.run(debug=True)
