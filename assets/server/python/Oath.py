from flask import Flask, jsonify
import requests

app = Flask(__name__)

YOUTUBE_API_KEY = "AIzaSyCTjK97VrKfcu9zeV3V4PnPPE_UzfpSPOs"
CHANNEL_ID = "UCHxZfWDxxumOyTN0nvbRM5A"

@app.route("/api/live")
def check_live():
    url = (
        f"https://www.googleapis.com/youtube/v3/search?"
        f"part=snippet&channelId={CHANNEL_ID}&eventType=live&type=video&key={YOUTUBE_API_KEY}"
    )

    try:
        response = requests.get(url)
        data = response.json()

        if "items" in data and len(data["items"]) > 0:
            live_video_id = data["items"][0]["id"]["videoId"]
            return jsonify({"live": True, "videoId": live_video_id})
        else:
            return jsonify({"live": False})
    except Exception as e:
        return jsonify({"live": False, "error": str(e)})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
