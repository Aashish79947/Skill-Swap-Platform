*** Settings ***
Documentation     Authentication API test cases for Skill-Swap-Platform
Library           RequestsLibrary
Library           Collections
Library           String
Resource          ../resources/common.resource
Resource          ../resources/api_keywords.resource

Suite Setup       Create API Session

*** Test Cases ***
Register New User Successfully
    [Documentation]    Register a new user with valid credentials
    # Use a unique email to avoid conflicts
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    test_${random}@example.com
    ${response}=    Register Test User    username=robot_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    Should Be True    ${response.status_code} == 200 or ${response.status_code} == 201

Register With Duplicate Email Should Fail
    [Documentation]    Registering with an already-used email should fail
    # First registration
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    dup_${random}@example.com
    Register Test User    username=dup_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    # Second registration with same email
    ${response}=    Register Test User    username=dup2_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    Should Be True    ${response.status_code} >= 400

Login With Valid Credentials
    [Documentation]    Login with correct email and password should return a token
    # Register a user first
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    login_${random}@example.com
    Register Test User    username=login_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    # Login
    ${token}=    Login And Get Token    email=${unique_email}    password=${TEST_PASSWORD}
    Should Not Be Empty    ${token}

Login With Wrong Password Should Fail
    [Documentation]    Login with incorrect password should return an error
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    wrongpw_${random}@example.com
    Register Test User    username=wrongpw_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    # Try login with wrong password
    ${body}=    Create Dictionary    email=${unique_email}    password=WrongPassword123
    ${response}=    POST On Session    skillswap    /api/auth/login    json=${body}    expected_status=any
    Should Be True    ${response.status_code} >= 400

Get Profile Without Token Should Fail
    [Documentation]    Accessing profile without auth token should return 401
    ${response}=    GET On Session    skillswap    /api/auth/profile    expected_status=any
    Should Be True    ${response.status_code} == 401 or ${response.status_code} == 403

Get Profile With Valid Token
    [Documentation]    Accessing profile with valid JWT should return user data
    # Register and login
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    profile_${random}@example.com
    Register Test User    username=profile_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    ${token}=    Login And Get Token    email=${unique_email}    password=${TEST_PASSWORD}
    Create Authenticated Session    ${token}
    # Get profile
    ${response}=    Get Profile With Token
    Should Be Equal As Strings    ${response.status_code}    200
    Dictionary Should Contain Key    ${response.json()}    email
