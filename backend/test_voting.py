#!/usr/bin/env python3
"""
Test script to verify voting functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_voting():
    print("🧪 Testing Voting Functionality...")
    
    # 1. Login to get token
    login_data = {
        "email": "testchef@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/users/login", json=login_data)
    if response.status_code != 200:
        print("❌ Login failed")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Login successful")
    
    # 2. Get recipes
    response = requests.get(f"{BASE_URL}/recipes/")
    if response.status_code != 200:
        print("❌ Failed to get recipes")
        return
    
    recipes = response.json()
    if not recipes:
        print("❌ No recipes found")
        return
    
    recipe = recipes[0]  # Use first recipe
    recipe_id = recipe["id"]
    print(f"✅ Found recipe: {recipe['title']} (ID: {recipe_id})")
    
    # 3. Test upvote
    print("\n📈 Testing upvote...")
    vote_data = {
        "vote_type": "upvote",
        "recipe_id": recipe_id
    }
    
    response = requests.post(f"{BASE_URL}/recipes/{recipe_id}/vote", 
                           json=vote_data, headers=headers)
    print(f"Upvote response: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ Upvote successful: {response.json()}")
    else:
        print(f"❌ Upvote failed: {response.text}")
    
    # 4. Get vote stats
    print("\n📊 Getting vote stats...")
    response = requests.get(f"{BASE_URL}/recipes/{recipe_id}/votes")
    if response.status_code == 200:
        stats = response.json()
        print(f"✅ Vote stats: {stats}")
    else:
        print(f"❌ Failed to get vote stats: {response.text}")
    
    # 5. Test downvote
    print("\n📉 Testing downvote...")
    vote_data = {
        "vote_type": "downvote",
        "recipe_id": recipe_id
    }
    
    response = requests.post(f"{BASE_URL}/recipes/{recipe_id}/vote", 
                           json=vote_data, headers=headers)
    print(f"Downvote response: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ Downvote successful: {response.json()}")
    else:
        print(f"❌ Downvote failed: {response.text}")
    
    # 6. Get updated vote stats
    print("\n📊 Getting updated vote stats...")
    response = requests.get(f"{BASE_URL}/recipes/{recipe_id}/votes")
    if response.status_code == 200:
        stats = response.json()
        print(f"✅ Updated vote stats: {stats}")
    else:
        print(f"❌ Failed to get updated vote stats: {response.text}")
    
    # 7. Test best recipes endpoint
    print("\n🏆 Testing best recipes endpoint...")
    response = requests.get(f"{BASE_URL}/recipes/best")
    if response.status_code == 200:
        best_recipes = response.json()
        print(f"✅ Best recipes: {len(best_recipes)} recipes found")
        for i, recipe in enumerate(best_recipes[:3]):
            print(f"  {i+1}. {recipe['title']} - {recipe['vote_count']} votes")
    else:
        print(f"❌ Failed to get best recipes: {response.text}")

if __name__ == "__main__":
    test_voting()