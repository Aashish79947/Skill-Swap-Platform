*** Settings ***
Documentation     Login page UI tests for Skill-Swap-Platform
Library           Browser
Resource          ../resources/common.resource
Resource          ../resources/ui_keywords.resource

Suite Teardown    Close Test Browser

*** Test Cases ***
Login Page Should Load Successfully
    [Documentation]    Verify the login page loads with all expected elements
    Open Login Page
    # Check for heading
    Get Text    //h2[contains(text(),"Sign in")]    ==    Sign in here
    # Check for email input
    Wait For Elements State    input[type="email"]    visible    timeout=${TIMEOUT}
    # Check for password input
    Wait For Elements State    input[type="password"]    visible    timeout=${TIMEOUT}
    # Check for submit button
    Wait For Elements State    button >> text=Sign in    visible    timeout=${TIMEOUT}

Login Page Has Register Link
    [Documentation]    Verify the login page has a link to create an account
    Open Login Page
    Wait For Elements State    //a[contains(text(),"Create an account")]    visible    timeout=${TIMEOUT}

Login Page Has Google Sign In
    [Documentation]    Verify the login page shows Google sign-in option
    Open Login Page
    Wait For Elements State    text=Or continue with    visible    timeout=${TIMEOUT}

Login With Empty Fields Shows Validation
    [Documentation]    Submitting empty login form should trigger browser validation
    Open Login Page
    # Try to click sign in without filling fields
    Click    button >> text=Sign in
    # HTML5 validation should prevent form submission
    # The email field should still be empty and visible (form wasn't submitted)
    ${url}=    Get Url
    Should Contain    ${url}    /login
