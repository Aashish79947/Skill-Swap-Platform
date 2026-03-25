*** Settings ***
Documentation     Common variables and keywords for Skill-Swap-Platform tests

*** Variables ***
${BASE_URL}           http://localhost:8000
${FRONTEND_URL}       http://localhost:5173
${API_URL}            ${BASE_URL}/api

# Test user credentials (unique per run via timestamp)
${TEST_USERNAME}      testuser_robot
${TEST_EMAIL}         testrobot@example.com
${TEST_PASSWORD}      Test@1234

# Timeout settings
${TIMEOUT}            10s
