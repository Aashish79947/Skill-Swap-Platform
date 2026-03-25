*** Settings ***
Documentation     Navigation and routing UI tests for Skill-Swap-Platform
Library           Browser
Resource          ../resources/common.resource
Resource          ../resources/ui_keywords.resource

Suite Teardown    Close Test Browser

*** Test Cases ***
Navigate From Login To Register
    [Documentation]    Click "Create an account" on login page to go to register
    Open Login Page
    Click    //a[contains(text(),"Create an account")]
    Wait For Elements State    //h2[contains(text(),"Create Account")]    visible    timeout=${TIMEOUT}
    ${url}=    Get Url
    Should Contain    ${url}    /register

Navigate From Register To Login
    [Documentation]    Click "Sign in" on register page to go to login
    Open Register Page
    Click    //a[contains(text(),"Sign in")]
    Wait For Elements State    //h2[contains(text(),"Sign in")]    visible    timeout=${TIMEOUT}
    ${url}=    Get Url
    Should Contain    ${url}    /login

404 Page For Unknown Route
    [Documentation]    Visiting an unknown route should show 404 message
    New Browser    chromium    headless=true
    New Page    ${FRONTEND_URL}/some-nonexistent-page
    Wait For Elements State    text=404    visible    timeout=${TIMEOUT}
