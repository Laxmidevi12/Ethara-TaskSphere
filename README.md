# Ethara.AI TaskSphere

## Enterprise Workforce & Team Task Management Platform

Ethara.AI TaskSphere is a full-stack enterprise workflow management platform designed to streamline project collaboration, task assignment, attendance tracking, and team productivity through a role-based access system.

The application supports:
- Project Leads
- Reviewers
- Taskers

with secure authentication and workflow-specific permissions.

---

# Features

## Authentication & Security

- JWT-based authentication
- Secure login and signup
- Password hashing using bcrypt
- Protected API routes
- Role-Based Access Control (RBAC)

---

# Role-Based Workflow

## Project Lead

- Create projects
- Manage team members
- Assign tasks
- Monitor workflows
- Access analytics dashboard

## Tasker

- View assigned tasks only
- Update task progress
- Send completed tasks for review
- Punch in / Punch out attendance

## Reviewer

- Review submitted tasks
- Approve or reject tasks
- Track review workflow

---

# Task Workflow

```text
Project Lead
    ↓
Assign Task
    ↓
Tasker
    ↓
Move to Review
    ↓
Reviewer
    ↓
Approve / Reject
