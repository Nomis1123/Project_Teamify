# This file makes API calls to Steams API.
# Used to get a users owned games list.

# More info can be found here:
# https://developer.valvesoftware.com/wiki/Steam_Web_API

import os
import requests
from dotenv import load_dotenv
load_dotenv()

# NOTE: everyone needs to get their own STEAM_API_KEY and store it in their .env file
STEAM_API_KEY = os.getenv("STEAM_API_KEY")
STEAM_OWNED_GAMES_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/"


# Returns a list of games a player owns
def get_owned_games(steam_id: str):
    if not STEAM_API_KEY:
        raise Exception("STEAM_API_KEY not set")
    
    # Request format sent to Steam
    params = {"key": STEAM_API_KEY,
              "steamid": steam_id,
              "include_appinfo": True,
              "include_played_free_games": True}

    # Send request + Get response
    response = requests.get(STEAM_OWNED_GAMES_URL, params=params, timeout=10)
    response.raise_for_status()   
    data = response.json()

    # Select what information to keep and return
    games = []
    for game in data.get("response", {}).get("games", []):
        # Picture of the games if needed
        icon_hash = game.get("img_icon_url")
        icon_url = None

        if icon_hash:
            icon_url = f"https://media.steampowered.com/steamcommunity/public/images/apps/{game['appid']}/{icon_hash}.jpg"

        games.append({"appid": game["appid"],
                      "name": game.get("name", "Unknown"),
                      "playtime_forever": game.get("playtime_forever", 0),
                      "icon_url": icon_url})
    return games

# NOTE: EXAMPLE RETURN FROM STEAM
# {
#   "response": {
#     "game_count": 4,
#     "games": [
#       {
#         "appid": 341800,
#         "name": "Keep Talking and Nobody Explodes",
#         "playtime_forever": 208,
#         "img_icon_url": "1d0a322b0184faa755ad99af803dfd7e14add30f",
#         "has_community_visible_stats": true,
#         "playtime_windows_forever": 208,
#         "playtime_mac_forever": 0,
#         "playtime_linux_forever": 0,
#         "playtime_deck_forever": 0,
#         "rtime_last_played": 1763245219,
#         "has_leaderboards": true,
#         "playtime_disconnected": 0
#       }
#       ... More games ...
