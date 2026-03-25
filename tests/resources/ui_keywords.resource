*** Settings ***
Documentation     Reusable UI test keywords
Library           Browser
Resource          common.resource

*** Keywords ***
Open Login Page
    [Documentation]    Navigate to the login page
    New Browser    chromium    headless=true
    New Page    ${FRONTEND_URL}/login
    Wait For Elements State    //h2[contains(text(),"Sign in")]    visible    timeout=${TIMEOUT}

Open Register Page
    [Documentation]    Navigate to the register page
    New Browser    chromium    headless=true
    New Page    ${FRONTEND_URL}/register
    Wait For Elements State    //h2[contains(text(),"Create Account")]    visible    timeout=${TIMEOUT}

Fill Login Form
    [Documentation]    Fill in the login form fields
    [Arguments]    ${email}    ${password}
    Fill Text    input[type="email"]    ${email}
    Fill Text    input[type="password"]    ${password}

Fill Register Form
    [Documentation]    Fill in the registration form fields
    [Arguments]    ${username}    ${email}    ${password}
    Fill Text    input[type="text"]    ${username}
    Fill Text    input[type="email"]    ${email}
    Fill Text    input[type="password"]    ${password}

Submit Login Form
    [Documentation]    Click the Sign in button
    Click    button >> text=Sign in

Submit Register Form
    [Documentation]    Click the Register button
    Click    button >> text=Register

Close Test Browser
    [Documentation]    Close all browser instances
    Close Browser    ALL
