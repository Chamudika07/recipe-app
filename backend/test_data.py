#!/usr/bin/env python3
"""
Script to add sample recipes for testing the voting functionality
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def create_test_user():
    """Create a test chef user"""
    user_data = {
        "email": "testchef@example.com",
        "password": "testpass123",
        "role": "chef"
    }
    
    response = requests.post(f"{BASE_URL}/users/signup", json=user_data)
    if response.status_code == 200:
        print("✅ Test chef user created successfully")
        return user_data
    else:
        print(f"❌ Failed to create user: {response.text}")
        return None

def login_user(user_data):
    """Login and get access token"""
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    response = requests.post(f"{BASE_URL}/users/login", json=login_data)
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ Login successful")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def create_sample_recipes(token):
    """Create sample recipes"""
    recipes = [
        {
            "title": "Spaghetti Carbonara",
            "description": "Classic Italian pasta dish with eggs, cheese, and pancetta"
        },
        {
            "title": "Chicken Tikka Masala",
            "description": "Creamy and flavorful Indian curry with tender chicken"
        },
        {
            "title": "Chocolate Chip Cookies",
            "description": "Soft and chewy cookies with melted chocolate chips"
        },
        {
            "title": "Caesar Salad",
            "description": "Fresh romaine lettuce with parmesan cheese and croutons"
        },
        {
            "title": "Beef Tacos",
            "description": "Mexican street tacos with seasoned ground beef and fresh toppings"
        }
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    for recipe in recipes:
        response = requests.post(f"{BASE_URL}/recipes/", json=recipe, headers=headers)
        if response.status_code == 200:
            print(f"✅ Created recipe: {recipe['title']}")
        else:
            print(f"❌ Failed to create recipe {recipe['title']}: {response.text}")

def main():
    print("🍳 Setting up test data for Recipe Voting System...")
    
    # Create test user
    user_data = create_test_user()
    if not user_data:
        print("Skipping recipe creation due to user creation failure")
        return
    
    # Login to get token
    token = login_user(user_data)
    if not token:
        print("Skipping recipe creation due to login failure")
        return
    
    # Create sample recipes
    create_sample_recipes(token)
    
    print("\n🎉 Test data setup complete!")
    print("You can now test the voting functionality with these sample recipes.")
    print("Login credentials:")
    print(f"Email: {user_data['email']}")
    print(f"Password: {user_data['password']}")

if __name__ == "__main__":
    main()