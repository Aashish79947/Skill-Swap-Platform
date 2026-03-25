*** Settings ***
Documentation     Register page UI tests for Skill-Swap-Platform
Library           Browser
Resource          ../resources/common.resource
Resource          ../resources/ui_keywords.resource

Suite Teardown    Close Test Browser

*** Test Cases ***
Register Page Should Load Successfully
    [Documentation]    Verify the register page loads with all expected elements
    Open Register Page
    # Check for heading
    Get Text    //h2[contains(text(),"Create Account")]    ==    Create Account
    # Check for username input
    Wait For Elements State    input[type="text"]    visible    timeout=${TIMEOUT}
    # Check for email input
    Wait For Elements State    input[type="email"]    visible    timeout=${TIMEOUT}
    # Check for password input
    Wait For Elements State    input[type="password"]    visible    timeout=${TIMEOUT}
    # Check for submit button
    Wait For Elements State    button >> text=Register    visible    timeout=${TIMEOUT}

Register Page Has Login Link
    [Documentation]    Verify the register page has a link to sign in
    Open Register Page
    Wait For Elements State    //a[contains(text(),"Sign in")]    visible    timeout=${TIMEOUT}

Register Page Has Google Sign Up
    [Documentation]    Verify the register page shows Google sign-up option
    Open Register Page
    Wait For Elements State    text=Or sign up with    visible    timeout=${TIMEOUT}
