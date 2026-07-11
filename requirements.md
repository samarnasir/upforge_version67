# Startup Diagnostic Funnel Requirements

## Objective

Build a multi-step startup diagnostic questionnaire that helps founders identify their current challenge and then book a free diagnostic call.

The experience should feel conversational, modern, and low-friction.

---

## Flow Overview

Landing Page

↓

Question 1 (Startup Stage)

↓

Question 2 (Biggest Problem)

↓

Question 3 (Main Roadblock)

↓

Question 4 (Common Question)

↓

Question 5 (Common Question)

↓

Question 6 (Common Question)

↓

Book a Free Diagnostic Call

---

## Data Source

Use `questionnaire.json` as the source of truth.

Question 2 options depend on the selected Question 1 option.

Question 3 options depend on the selected Question 2 option.

Do not hardcode any stage/problem/roadblock values.

Everything should be generated dynamically from the JSON.

---

## Landing Page

Title:

Find Out How We Can Help

Subtitle:

Answer a few quick questions and we'll identify the biggest opportunities and challenges in your business.

CTA Button:

Start Assessment

---

## Question Behaviour

### Question 1

Prompt:

Where are you right now?

Display all startup stages from JSON.

Single-select only.

Auto-advance after selection.

---

### Question 2

Prompt:

What's your biggest challenge right now?

Display only problems associated with the selected stage.

Single-select only.

Auto-advance after selection.

---

### Question 3

Prompt:

What's the main thing causing that challenge?

Display only roadblocks associated with the selected problem.

Single-select only.

Auto-advance after selection.

---

## Other Option Behaviour

At every level:

If the selected option contains:

"type": "text_input"

Then:

1. Show a text field.
2. Ask the user to describe their situation.
3. Require input before continuing.
4. Save both:

   * Selected option
   * Custom text response

---

## Common Questions

Question 4

What outcome are you hoping to achieve in the next 6 months?

Text area.

Required.

---

Question 5

What is currently stopping you from reaching that outcome faster?

Text area.

Required.

---

Question 6

If we could solve one thing for you immediately, what would it be?

Text area.

Required.

---

## Progress Tracking

Display progress bar.

Steps:

1. Stage
2. Problem
3. Roadblock
4. Goal
5. Obstacle
6. Priority
7. Book Call

Show percentage completion.

---

## Navigation

Allow:

* Next
* Back

User should never lose previous answers.

Persist answers in state.

---

## Validation

Required:

* Stage
* Problem
* Roadblock
* All common questions

If "Other" is selected:

Custom text is required.

---

## Answer Storage

Store answers in the following structure:

{
stage: {},
problem: {},
roadblock: {},
customInputs: {},
goal: "",
obstacle: "",
priority: ""
}

---

## Final Page

Title:

Your Assessment Is Ready

Description:

Based on your responses, we'd like to offer a free diagnostic session to help identify your biggest opportunities, bottlenecks, and next steps.

Display a summary of answers.

Allow user to review responses.

CTA:

Book Free Diagnostic Call

---

## Booking Integration

Prepare payload containing:

* Stage
* Problem
* Roadblock
* Custom inputs
* Question 4 answer
* Question 5 answer
* Question 6 answer

Pass payload to booking system.

The booking system should receive the full context before the call.

---

## Design Requirements

* Modern SaaS aesthetic
* Mobile-first
* Responsive
* Clean typography
* Minimal distractions
* Fast transitions
* Accessible
* Professional but friendly

---

## Technical Requirements

* Typescript
* Reusable components
* Dynamic rendering from JSON
* No hardcoded question trees
* Easy to add/edit stages later through JSON only
* Maintainable architecture
* Form state management
* Loading states
* Error handling

---

## Success Criteria

A user should be able to:

1. Complete the entire assessment in under 2 minutes.
2. Provide enough context for a meaningful diagnostic call.
3. Reach the booking page with all answers preserved.
4. Complete the experience on both desktop and mobile.
