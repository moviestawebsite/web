from flask import Flask, jsonify
import requests

app = Flask(__name__)

API_KEY = "ضع هنا مفتاح YouTube API"
CHANNEL_ID = "UCHxZfWDxxumOyTN0nvbRM5A"

@app.route("/api/live")
def check_live():
    try:
        url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={CHANNEL_ID}&eventType=live&type=video&key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        if data.get("items"):
            video_id = data["items"][0]["id"]["videoId"]
            title = data["items"][0]["snippet"]["title"]
            return jsonify({
                "live": True,
                "videoId": video_id,
                "title": title
            })
        else:
            return jsonify({"live": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
