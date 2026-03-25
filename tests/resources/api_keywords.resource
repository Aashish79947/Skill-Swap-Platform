*** Settings ***
Documentation     Reusable API test keywords
Library           RequestsLibrary
Library           Collections
Resource          common.resource

*** Keywords ***
Create API Session
    [Documentation]    Create a session for API testing
    Create Session    skillswap    ${BASE_URL}    verify=${False}

Register Test User
    [Documentation]    Register a new user via API
    [Arguments]    ${username}=${TEST_USERNAME}    ${email}=${TEST_EMAIL}    ${password}=${TEST_PASSWORD}
    ${body}=    Create Dictionary    username=${username}    email=${email}    password=${password}
    ${response}=    POST On Session    skillswap    /api/auth/register    json=${body}    expected_status=any
    RETURN    ${response}

Login And Get Token
    [Documentation]    Login and return the JWT token
    [Arguments]    ${email}=${TEST_EMAIL}    ${password}=${TEST_PASSWORD}
    ${body}=    Create Dictionary    email=${email}    password=${password}
    ${response}=    POST On Session    skillswap    /api/auth/login    json=${body}    expected_status=200
    ${token}=    Set Variable    ${response.json()}[token]
    RETURN    ${token}

Create Authenticated Session
    [Documentation]    Create a session with JWT auth headers
    [Arguments]    ${token}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    Create Session    skillswap_auth    ${BASE_URL}    headers=${headers}    verify=${False}

Get Profile With Token
    [Documentation]    Get user profile using authenticated session
    ${response}=    GET On Session    skillswap_auth    /api/auth/profile    expected_status=200
    RETURN    ${response}
