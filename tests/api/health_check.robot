*** Settings ***
Documentation     Health check tests for Skill-Swap-Platform API
Library           RequestsLibrary
Resource          ../resources/common.resource

Suite Setup       Create Session    skillswap    ${BASE_URL}    verify=${False}

*** Test Cases ***
Server Is Running
    [Documentation]    Verify the API server is up and responding
    ${response}=    GET On Session    skillswap    /
    Should Be Equal As Strings    ${response.status_code}    200
    Should Contain    ${response.text}    API running

Auth Endpoint Exists
    [Documentation]    Verify the auth login endpoint is reachable (not 404)
    ${body}=    Create Dictionary    email=test@test.com    password=test
    ${response}=    POST On Session    skillswap    /api/auth/login    json=${body}    expected_status=any
    Should Not Be Equal As Strings    ${response.status_code}    404

Skills Endpoint Exists
    [Documentation]    Verify the skills endpoint is reachable
    ${response}=    GET On Session    skillswap    /api/skills/marketplace    expected_status=any
    Should Not Be Equal As Strings    ${response.status_code}    404
