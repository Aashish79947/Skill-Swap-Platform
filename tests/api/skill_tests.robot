*** Settings ***
Documentation     Skills API test cases for Skill-Swap-Platform
Library           RequestsLibrary
Library           Collections
Library           String
Resource          ../resources/common.resource
Resource          ../resources/api_keywords.resource

Suite Setup       Setup Test User And Session

*** Variables ***
${SKILL_ID}    ${EMPTY}

*** Keywords ***
Setup Test User And Session
    [Documentation]    Register a test user, login, and create auth session
    Create API Session
    ${random}=    Generate Random String    6    [LOWER]
    ${unique_email}=    Set Variable    skill_${random}@example.com
    Register Test User    username=skill_${random}    email=${unique_email}    password=${TEST_PASSWORD}
    ${token}=    Login And Get Token    email=${unique_email}    password=${TEST_PASSWORD}
    Create Authenticated Session    ${token}

*** Test Cases ***
Create A New Skill
    [Documentation]    Create a skill via the API
    ${skill_data}=    Create Dictionary
    ...    title=Python Programming
    ...    description=Expert in Python development
    ...    category=Programming
    ...    level=Advanced
    ${response}=    POST On Session    skillswap_auth    /api/skills    json=${skill_data}    expected_status=any
    Should Be True    ${response.status_code} == 200 or ${response.status_code} == 201
    # Store skill ID for later tests
    ${resp_json}=    Set Variable    ${response.json()}
    ${skill_id}=    Set Variable    ${resp_json}[_id]
    Set Suite Variable    ${SKILL_ID}    ${skill_id}

Get My Skills
    [Documentation]    Retrieve the logged-in user's skills
    ${response}=    GET On Session    skillswap_auth    /api/skills/my    expected_status=200
    Should Be True    len(${response.json()}) >= 1

Get Marketplace Skills
    [Documentation]    Retrieve skills from the marketplace
    ${response}=    GET On Session    skillswap_auth    /api/skills/marketplace    expected_status=200
    Should Be Equal As Strings    ${response.status_code}    200

Delete A Skill
    [Documentation]    Delete a skill by ID
    Skip If    '${SKILL_ID}' == '${EMPTY}'    No skill ID available
    ${response}=    DELETE On Session    skillswap_auth    /api/skills/${SKILL_ID}    expected_status=200
    Should Be Equal As Strings    ${response.status_code}    200
