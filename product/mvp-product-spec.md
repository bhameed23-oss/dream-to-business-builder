# MVP Product Specification

This file defines the first real release of the product in practical feature terms.

## Product goal

Help a user understand their business lifecycle, identify their current phase, see key risks, and get a prioritized action plan.

## Core user workflow

### 1. Onboarding
- choose a starting situation
- answer a short intake questionnaire
- confirm the business profile summary

### 2. Phase identification
- identify the most relevant lifecycle phase
- display the relevant phase description
- show the current state of the business

### 3. Dashboard
Display the most important signals:
- current phase
- business health score
- top risks
- top priorities
- next actions
- tool and automation overview

### 4. Phase output
The user receives a clear summary for the chosen phase:
- what is happening now
- what needs attention
- what should happen next
- whether human review is recommended

### 5. Persistence
The system stores the shared business profile and allows the user to revisit it later.

## Functional requirements

### Required features
- lifecycle intake form
- business profile generation
- phase recommendation engine
- dashboard summary view
- business health score
- phase output summary
- risk summary and review triggers
- persistent profile updates

### Nice-to-have early features
- automation opportunities list
- integration map
- tool review checklist
- local AI helper overview
- exportable summary

## Non-functional requirements

- clear language
- low cognitive load
- safety-aware messaging
- human review prompts where important
- easy reuse over time
- maintain a single source of truth for the business profile

## Success criteria

The MVP is successful when a user can:
- start quickly
- understand their business phase
- understand the main risks and bottlenecks
- see the next most relevant action
- continue working with the same business profile later
