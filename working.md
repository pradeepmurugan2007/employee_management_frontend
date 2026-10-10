# EmpLy — Complete Functional Specification

Project: EmpLy — Employee Management System Project type: Minor project Recommended stack: React + TypeScript + Vite, Java Spring Boot REST API, Spring Data JPA, Spring Security, and PostgreSQL.&#x20;

Your EmpLy project should be a complete working application, not just a collection of attractive UI screens. Every button, form, filter, table, calendar, status badge, and dashboard card should have a defined purpose and connect to the correct backend functionality.

I'll break the implementation into the frontend, backend, database, CRUD operations, validation rules, page-by-page behavior, and the complete data flow.

## 1. Overall application architecture

React + TypeScript frontend

Pages, forms, tables, calendar, search, filters, dialogs, loading and error states

Spring Boot REST backend

Controllers → Services → Repositories, validation, authentication, authorization and business rules

PostgreSQL database

Persistent employee records, attendance, departments, leave requests, users and audit data

### What happens when a user clicks a button?

For example, when the administrator clicks Save Employee:

1. React collects the form values.
2. The frontend checks required fields and basic formatting.
3. Axios sends a `POST` or `PUT` request to Spring Boot.
4. Spring Security verifies that the user is authenticated and authorized.
5. The controller receives the request DTO.
6. The service applies business rules, such as checking for duplicate employee codes.
7. The repository saves the employee to PostgreSQL.
8. The backend returns the saved record and an HTTP status.
9. React displays a success message and refreshes the employee list.

Important: Frontend validation improves the user experience, but the backend must independently validate all data. A user can bypass frontend checks and call your API directly.

# 2. Full page list and navigation

These are the screens I recommend for your minor project.

| No. | Page                  | Main purpose                                        |
| --- | --------------------- | --------------------------------------------------- |
| 1   | Login                 | Authenticate users                                  |
| 2   | Dashboard             | Show live employee and attendance summaries         |
| 3   | Employee List         | Search, filter, view, edit and deactivate employees |
| 4   | Add/Edit Employee     | Create or update employee information               |
| 5   | Employee Profile      | View one employee's details and history             |
| 6   | Attendance            | View and manage attendance records                  |
| 7   | Mark Attendance modal | Record check-in, check-out and attendance status    |
| 8   | Leave Requests        | Apply for leave and process approval decisions      |
| 9   | Departments           | Manage departments and designations                 |
| 10  | Reports               | Generate and export employee and attendance reports |
| 11  | Settings              | Configure account and application preferences       |
| 12  | Forgot Password       | Optional password recovery screen                   |

You do not need a separate page for every small action. For example, marking attendance can use a modal, and adding a department can use a dialog.

## 3. User roles and access permissions

Keep the project focused on employee management, with two main roles and an optional employee self-service role.

| Action                        | Admin                              | Employee                        |
| ----------------------------- | ---------------------------------- | ------------------------------- |
| View dashboard                | Organization-wide                  | Personal summary                |
| Add/edit employee             | Yes                                | No                              |
| Deactivate employee           | Yes                                | No                              |
| View all employees            | Yes                                | No, unless explicitly permitted |
| View own profile              | Yes                                | Yes                             |
| Manage departments            | Yes                                | No                              |
| View all attendance           | Yes                                | Own records                     |
| Correct attendance            | Authorized admin                   | Request correction              |
| Apply for leave               | Own request, if needed             | Yes                             |
| Approve/reject leave          | Yes                                | No                              |
| Generate organization reports | Yes                                | No                              |
| View payroll data             | Not required for the initial scope | Not required                    |

For a minor project, you can initially build the application with Admin and Employee roles. The employee role should only access its own records unless the backend explicitly grants additional permissions.

# 4. Page 1 — Login

Frontend: `LoginPage.tsx` · Backend: `AuthController.java`

## Frontend functionality

The page contains:

- Email input
- Password input
- Show/hide password button
- Remember-me option, if implemented securely
- Login button
- Forgot Password link, if implemented
- Loading indicator
- Validation and API error messages

### Exact frontend behavior

1. When the page opens, display the login form.
2. When Login is clicked, reject empty email or password fields.
3. Validate email formatting.
4. Disable the button while the request is in progress.
5. Submit the credentials to the backend over HTTPS in production.
6. On success, establish the authenticated session and navigate to the dashboard.
7. On failure, display a generic message such as “Invalid email or password.”
8. On logout, clear the client-side authentication state and invalidate the server session or refresh token, as appropriate.

Do not reveal whether a particular email address exists through overly specific login errors.

## Backend API

| Method | Endpoint                    | Purpose                               |
| ------ | --------------------------- | ------------------------------------- |
| POST   | `/api/auth/login`           | Authenticate the user                 |
| GET    | `/api/auth/me`              | Return the current authenticated user |
| POST   | `/api/auth/logout`          | End the session                       |
| POST   | `/api/auth/forgot-password` | Optional password recovery            |
| POST   | `/api/auth/reset-password`  | Optional password reset               |

### Backend logic

- Look up the account by normalized email.
- Verify the submitted password against a secure password hash.
- Reject disabled accounts.
- Establish the session or issue a correctly configured access token.
- Return the user ID, role and other non-sensitive account information.
- Never return the password hash to React.

Database tables: `users`, `roles`, `user_roles`.

Passwords should be hashed using BCrypt or another appropriate password-hashing algorithm. Do not store plaintext passwords in PostgreSQL or browser storage.

# 5. Page 2 — Dashboard

Frontend: `DashboardPage.tsx` · Backend: `DashboardController.java`

The dashboard should display real information calculated from the database.

## UI components and behavior

Total Employees

# 128

Click to open employee list

Present Today

# 112

Click to open attendance

On Leave

# 8

Click to view approved leave

New Employees

# 6

Click to view recent joiners

Illustrative values only. In the application, the numbers must come from API responses.

### A. Total Employees

- Count employees included in your defined organization headcount.
- Decide whether inactive employees are excluded from the headline total.
- Clicking the card navigates to Employees with the relevant filter applied.

### B. Present Today

- Count employees whose attendance status qualifies as present on the selected date.
- Do not count the same employee twice if duplicate attendance records exist.
- Define how half-days, late arrivals and work-from-home attendance contribute.

### C. On Leave

- Count employees with an approved leave request covering the selected date.
- Exclude pending and rejected requests.
- Avoid double-counting employees if leave requests overlap.

### D. New Employees

- Count employees whose joining date falls within the selected period.
- Define the period consistently, such as the current month.

### E. Attendance chart

- Show present and absent counts by day or week.
- Allow the user to switch between This Week, This Month and a custom date range.
- Re-fetch the data when the selected period changes.

### F. Department overview

- Display department names, employee counts and optional attendance rates.
- Clicking a department opens the employee list filtered to that department.

### G. Recent employees

- Display the latest employee records, ordered by joining date or creation time.
- Clicking a row opens the employee profile.

### H. Pending leave requests

- Show pending requests awaiting review.
- Provide View All and Review actions.

## Backend APIs

| Method | Endpoint                                      | Responsibility        |
| ------ | --------------------------------------------- | --------------------- |
| GET    | `/api/dashboard/summary?date=2026-10-10`      | KPI counts            |
| GET    | `/api/dashboard/attendance-trend?period=week` | Attendance chart      |
| GET    | `/api/dashboard/departments`                  | Department statistics |
| GET    | `/api/dashboard/recent-employees?limit=5`     | Recent employees      |
| GET    | `/api/dashboard/pending-leaves?limit=5`       | Pending requests      |

The service layer should perform aggregate database queries instead of loading every employee into memory and counting records in Java.

# 6. Pages 3 and 4 — Employee List and Add/Edit Employee

These are the most important pages in EmpLy. Implement these completely before building advanced reports.

## 6.1 Employee List page

Frontend: `EmployeesPage.tsx` · Backend: `EmployeeController.java`

### Frontend components

- Search input
- Department filter
- Designation filter
- Employment status filter
- Add Employee button
- Employee table
- View, Edit and Deactivate actions
- Pagination
- Loading indicator
- Empty-state message
- Error message
- Confirmation dialog for deactivation

### How each control works

| UI control          | Expected behavior                                   |
| ------------------- | --------------------------------------------------- |
| Search              | Search employee name, code or email                 |
| Department dropdown | Show employees in the selected department           |
| Status dropdown     | Filter Active, Inactive or other supported statuses |
| Add Employee        | Navigate to the employee form                       |
| View icon           | Open the selected employee's profile                |
| Edit icon           | Open the form populated with the existing record    |
| Deactivate icon     | Ask for confirmation, then deactivate the employee  |
| Pagination          | Load the selected page from the backend             |
| Reset filters       | Restore default filters                             |

Search should be debounced, for example by 300 milliseconds, so the application does not send a request for every keystroke.

When multiple filters are applied, the backend must combine them. For example, searching for `Arun` in Engineering should return matching Engineering employees, not all employees named Arun.

### Employee table columns

1. Photo
2. Employee name
3. Employee ID
4. Department
5. Designation
6. Email
7. Joining date
8. Employment status
9. Actions

Keep the table horizontally scrollable on smaller screens or hide lower-priority columns at narrow widths.

### Backend APIs — Employee CRUD

CRUD means Create, Read, Update and Delete.

| CRUD operation            | Method | Endpoint                     |
| ------------------------- | ------ | ---------------------------- |
| Create                    | POST   | `/api/employees`             |
| Read all                  | GET    | `/api/employees`             |
| Read one                  | GET    | `/api/employees/{id}`        |
| Update                    | PUT    | `/api/employees/{id}`        |
| Deactivate                | PATCH  | `/api/employees/{id}/status` |
| Optional permanent delete | DELETE | `/api/employees/{id}`        |

Recommended list API:

```
GET /api/employees?page=0&size=10&search=arun&departmentId=2&status=ACTIVE&sortBy=firstName&sortDir=asc
```

Example response:

```
{
  "content": [
    {
      "id": "employee-uuid",
      "employeeCode": "EMP001",
      "firstName": "Arun",
      "lastName": "Kumar",
      "email": "arun@example.com",
      "departmentId": 2,
      "departmentName": "Engineering",
      "designation": "Software Developer",
      "status": "ACTIVE"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 128,
  "totalPages": 13
}
```

This is an illustrative response format. Your actual field names can differ, but the frontend and backend must agree on the contract.

### Backend business rules

- Employee code must be unique.
- Login email should be unique after normalization.
- Required fields cannot be null or blank.
- Department and designation IDs must reference valid records.
- Joining date must satisfy your business rules.
- Only authorized users can create, edit or deactivate employees.
- Employees with attendance or leave history should normally be deactivated rather than permanently deleted.
- A department cannot be deleted while it has assigned employees.

### How deactivation works

When the administrator confirms deactivation:

1. React sends a PATCH request.
2. Spring Boot checks the administrator's permission.
3. The service loads the employee.
4. The employee's status is changed to `INACTIVE`.
5. PostgreSQL saves the change.
6. React refreshes the table.
7. The inactive employee remains available for historical reports.

Do not permanently delete an employee just because the user clicks a trash icon. Historical attendance and leave records need to remain consistent.

## 6.2 Add/Edit Employee page

Frontend: `EmployeeFormPage.tsx` · Backend: `EmployeeService.java`

Use one reusable form for both adding and editing.

When adding, fields start empty. When editing, fetch the existing record and populate the fields.

### Form section A — Personal information

| Field         | Validation                                             |
| ------------- | ------------------------------------------------------ |
| First name    | Required                                               |
| Last name     | Required if used in your naming rules                  |
| Date of birth | Must be a valid date                                   |
| Gender        | Optional or required according to project requirements |
| Profile photo | Allowed file type and size                             |
| Address       | Optional unless required by your project               |

### Form section B — Job information

| Field             | Validation                                 |
| ----------------- | ------------------------------------------ |
| Employee ID       | Generated by backend, unique               |
| Department        | Required; must exist                       |
| Designation       | Required; must exist                       |
| Joining date      | Required                                   |
| Employment type   | Full-time, part-time, contract, etc.       |
| Reporting manager | Optional valid employee                    |
| Employment status | Active or inactive, subject to permissions |

### Form section C — Contact information

| Field           | Validation                                           |
| --------------- | ---------------------------------------------------- |
| Email           | Required and valid                                   |
| Phone           | Validate according to your chosen country rules      |
| Alternate phone | Optional                                             |
| Address         | Optional or required according to your specification |

### Exact Save button behavior

1. Validate required fields.
2. Highlight invalid fields.
3. Display a message next to each invalid field.
4. Prevent duplicate submissions while saving.
5. Send the appropriate POST or PUT request.
6. If successful, display a success message.
7. Navigate back to the employee list or profile.
8. Refresh the relevant dashboard metrics.
9. If the API fails, retain the user's input and show a useful error.

### Backend creation workflow

```
POST /api/employees
        |
        v
Authenticate and authorize
        |
        v
Validate request DTO
        |
        v
Check email and employee code uniqueness
        |
        v
Verify department, designation and manager
        |
        v
Generate employee code if required
        |
        v
Save employee in PostgreSQL
        |
        v
Return 201 Created
```

### Important implementation details

- Generate employee codes on the backend to avoid duplicate IDs when two users create records simultaneously.
- Use database unique constraints in addition to service-level duplicate checks.
- Keep the employee form's state separate from the employee table's state.
- For profile uploads, send multipart form data to a protected upload endpoint and store the file in a controlled storage location. Store its URL or storage key in the database.
- Never trust the original file name or file extension when accepting uploads.
- Do not send password fields through the employee form. Account credentials belong to the authentication module.

# 7. Page 5 — Employee Profile

Frontend: `EmployeeProfilePage.tsx` · Backend: `EmployeeProfileController.java` or the existing employee controller

This page displays the selected employee's information without requiring the administrator to edit the record.

## Profile layout

## Arun Kumar

EMP001 · Software Developer

Active

Department

Engineering

Joining Date

05 Jun 2023

Overview

Attendance

Leave History

Documents

Conceptual layout using sample employee information.

### How the page works

Overview tab

- Display personal information.
- Display employment information.
- Display contact details.
- Display current employment status.
- Show the Edit Profile action to authorized users.

Attendance tab

- Fetch attendance records for this employee.
- Allow date-range filtering.
- Show check-in, check-out, working duration and status.

Leave History tab

- Show leave type, dates, duration, status and reviewer comments.
- Include pending requests only when they belong to the selected employee.

Documents tab — optional

- Display uploaded document names and upload dates.
- Permit authorized users to download files.
- Restrict access to private documents.

### Backend APIs

| Method | Endpoint                             | Purpose                |
| ------ | ------------------------------------ | ---------------------- |
| GET    | `/api/employees/{id}`                | Employee details       |
| GET    | `/api/employees/{id}/attendance`     | Attendance history     |
| GET    | `/api/employees/{id}/leave-requests` | Leave history          |
| PUT    | `/api/employees/{id}`                | Update employee        |
| GET    | `/api/employees/{id}/documents`      | Optional document list |

The backend must verify access to the employee ID. An employee must not be able to change the URL to view another person's private information.

# 8. Pages 6 and 7 — Attendance and Mark Attendance

Attendance is one of the most logic-heavy modules in your project. It should not simply save a status entered by the user. The system needs to validate the employee, date, time and allowed state transitions.

## 8.1 Attendance page

Frontend: `AttendancePage.tsx` · Backend: `AttendanceController.java`

### Frontend components

- Month selector
- Date picker
- Mark Attendance button
- Employee search
- Department filter
- Attendance status filter
- Attendance table
- Pagination
- View and correction actions
- Loading, empty and error states

### Table fields

- Employee name and code
- Department
- Attendance date
- Check-in time
- Check-out time
- Total working hours
- Attendance status
- Actions

### How the month selector works

1. The user selects a month and year, such as October 2026.
2. React sends the first and last dates of that month to the backend.
3. The backend returns attendance records within that date range.
4. React displays the results.
5. Selecting a particular date applies a date filter.
6. Changing department or status updates the query.
7. Pagination retrieves only the requested page.

Use ISO date values for API requests, such as `2026-10-10`, rather than localized display strings such as `10 Oct 2026`.

### Attendance APIs

| Method | Endpoint                                                | Purpose                       |
| ------ | ------------------------------------------------------- | ----------------------------- |
| GET    | `/api/attendance?from=2026-10-01&to=2026-10-31`         | List records for a date range |
| GET    | `/api/attendance/{id}`                                  | View one record               |
| POST   | `/api/attendance/check-in`                              | Record check-in               |
| POST   | `/api/attendance/check-out`                             | Record check-out              |
| PUT    | `/api/attendance/{id}`                                  | Correct an authorized record  |
| GET    | `/api/attendance/summary?date=2026-10-10`               | Daily summary                 |
| GET    | `/api/attendance/summary?from=2026-10-01&to=2026-10-31` | Period summary                |

You can also support manual attendance marking by an authorized administrator. Keep it separate from normal employee check-in/check-out so you can track who entered or corrected the record.

## 8.2 Mark Attendance modal

The Mark Attendance button should open a modal, not navigate away from the Attendance page.

### Fields and controls

| Field           | Frontend behavior                                          | Backend responsibility              |
| --------------- | ---------------------------------------------------------- | ----------------------------------- |
| Attendance type | Select Check In, Check Out or permitted work mode          | Validate allowed action             |
| Employee        | Preselect current user or select an employee if authorized | Verify employee access              |
| Date            | Open a calendar                                            | Validate allowed date               |
| Time            | Default to current time or permit authorized entry         | Validate time and policy            |
| Location        | Optional location display                                  | Validate supplied data and access   |
| Remarks         | Optional text with character limit                         | Validate length and sanitize output |
| Save Attendance | Submit and show loading state                              | Persist transactionally             |
| Cancel          | Close modal                                                | No database change                  |

### Check-in workflow

1. The user opens Mark Attendance.
2. The frontend selects Check In by default.
3. The date and time fields receive appropriate defaults.
4. The user confirms the action.
5. React submits the request.
6. Spring Boot checks authorization and the employee's status.
7. The service checks for an existing open attendance session.
8. If a session is already open, reject the duplicate check-in.
9. Otherwise, save the check-in timestamp.
10. Return the saved attendance record.
11. React closes the modal and refreshes the table and summary cards.

### Check-out workflow

1. The user selects Check Out.
2. The backend finds the employee's open attendance session.
3. If there is no open session, return a validation error.
4. Check-out time must not precede check-in time.
5. Save the check-out timestamp.
6. Calculate the elapsed duration.
7. Apply any configured break deductions.
8. Update the session and return the completed record.

### How working hours should be calculated

A simple initial rule is:

\\[ \text{Duration}=\text{Check-out time}-\text{Check-in time} \\]

If unpaid breaks are configured:

\\[ \text{Net working time}=\text{Duration}-\text{Unpaid breaks} \\]

For example, 09:00 to 18:00 is nine elapsed hours. If the policy deducts a one-hour unpaid break, net working time is eight hours.

Do not automatically classify overtime, half-days or late arrivals without defining the organization's working hours and grace period.

### State-transition rules

| Current state    | Requested action      | Result                    |
| ---------------- | --------------------- | ------------------------- |
| No open session  | Check In              | Create session            |
| Session open     | Check In again        | Reject                    |
| Session open     | Check Out             | Complete session          |
| No open session  | Check Out             | Reject                    |
| Session complete | Check Out again       | Reject                    |
| Any saved record | Authorized correction | Update with audit history |

Important: If the administrator manually corrects attendance, store the original values, corrected values, actor, timestamp and reason in an audit log.

### Calendar month and date selection

Use one consistent calendar component throughout EmpLy.

### October 2026

October 2026

Su

Mo

Tu

We

Th

Fr

Sa

27

28

29

30

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

Illustrative calendar. A production calendar must calculate month lengths, weekday offsets, disabled dates and selected dates dynamically.

When the month/year header is clicked, display a month/year selection view. When a month is chosen, display its actual dates. Clicking a date updates the input field. Previous and next arrows change the visible month. Date restrictions must be applied according to the operation: attendance history can usually show past dates, while normal employee check-in should use the current date unless your policy permits otherwise.

# 9. Page 8 — Leave Requests

Frontend: `LeaveRequestsPage.tsx` · Backend: `LeaveRequestController.java`

This module manages leave applications and approval decisions. You do not need a complex HR workflow for a minor project; a clear Apply → Pending → Approved/Rejected process is sufficient.

## 9.1 Leave Requests page

### Frontend components

- New Leave Request button
- Search by employee name or code
- Leave type filter
- Status filter
- Date range filter
- Leave requests table
- View details action
- Approve and Reject actions for authorized users
- Pagination

### Leave request form

| Field               | Required?        | Behavior                                                          |
| ------------------- | ---------------- | ----------------------------------------------------------------- |
| Employee            | Yes              | Current employee for self-service; selectable by authorized admin |
| Leave type          | Yes              | Casual, Sick, Annual or configured types                          |
| Start date          | Yes              | Select from calendar                                              |
| End date            | Yes              | Must be on or after start date                                    |
| Reason              | Yes, recommended | Explain the request                                               |
| Supporting document | Optional         | Restricted file upload if needed                                  |
| Submit              | —                | Validate and create request                                       |

### Leave request workflow

1\. Employee submits request

Dates, leave type and reason

2\. Pending

Wait for an authorized reviewer

Approved

Update leave balance and approved leave summary

Rejected

Record reviewer and rejection reason

## 9.2 Leave CRUD APIs

| Method | Endpoint                            | Function                                  |
| ------ | ----------------------------------- | ----------------------------------------- |
| POST   | `/api/leave-requests`               | Create a request                          |
| GET    | `/api/leave-requests`               | List authorized requests                  |
| GET    | `/api/leave-requests/{id}`          | View one request                          |
| PUT    | `/api/leave-requests/{id}`          | Edit an eligible request                  |
| PATCH  | `/api/leave-requests/{id}/decision` | Approve or reject                         |
| DELETE | `/api/leave-requests/{id}`          | Cancel/delete an eligible request         |
| GET    | `/api/leave-balances/me`            | Get the current employee's leave balances |

For approval decisions, a dedicated endpoint is better than allowing unrestricted edits to the status field.

Example decision request:

```
{
  "decision": "APPROVED",
  "comments": "Approved by the administrator."
}
```

### Backend business rules

1. Start date cannot be after end date.
2. Dates must follow the configured leave policy.
3. Reject overlapping requests where appropriate.
4. Only the request owner or an authorized administrator may edit an eligible request.
5. Employees cannot approve their own requests unless the application explicitly allows it.
6. Only pending requests may be approved or rejected.
7. The backend must calculate leave duration, not trust a client-supplied `days` value.
8. Approved leave must update the balance consistently.
9. Rejected leave must not consume leave balance.
10. Canceling approved leave must reverse its balance effect where policy permits.
11. Store the reviewer, decision timestamp and comments.
12. A repeated approval request must not deduct leave balance twice.

### Leave duration calculation

Define your policy before coding:

- Calendar days: count every date from start to end, inclusive.
- Working days: count eligible working days, excluding configured weekends and holidays.

For example, a request from 12 October to 14 October is three calendar days, but may be fewer working days depending on the configured calendar.

Use a database transaction when approving a request and updating the leave balance. This prevents partial updates if one operation fails.

# 10. Page 9 — Departments

Frontend: `DepartmentsPage.tsx` · Backend: `DepartmentController.java`

This page organizes employees into departments such as Engineering, Design, Operations and Finance.

## Frontend features

- Total department count
- Active department count
- Department search
- Status filter
- Add Department button
- Edit Department action
- Deactivate Department action
- Employee count per department
- Department details, if needed

### Add/Edit Department dialog

Fields:

- Department name
- Department code, if required
- Description
- Department head, if required
- Status

The Save button should validate the department name and send the data to the backend. The department table refreshes only after a successful save.

## Department CRUD APIs

| Method | Endpoint                          | Purpose                                  |
| ------ | --------------------------------- | ---------------------------------------- |
| POST   | `/api/departments`                | Create department                        |
| GET    | `/api/departments`                | List departments                         |
| GET    | `/api/departments/{id}`           | Get department details                   |
| PUT    | `/api/departments/{id}`           | Update department                        |
| PATCH  | `/api/departments/{id}/status`    | Activate/deactivate                      |
| DELETE | `/api/departments/{id}`           | Optional permanent delete when permitted |
| GET    | `/api/departments/{id}/employees` | List department employees                |

### Backend rules

- Department name or code must be unique according to your requirements.
- A designation must belong to a valid department.
- Do not permanently delete a department with assigned employees.
- Changing a department name should update its displayed name everywhere through the database relationship.
- Department employee counts should be calculated from employee records, not manually maintained in a separate counter unless you have a strong reason.
- Restrict create, edit and deactivate actions to authorized users.

Recommended improvement: Add a Designations module or a small designation management dialog. This allows the Add Employee form to load designations based on the selected department.

# 11. Page 10 — Reports

Frontend: `ReportsPage.tsx` · Backend: `ReportController.java`

Reports should display useful summaries and allow users to export filtered results. Do not simply duplicate the dashboard.

## Report types

Attendance Report

Present, absent, late and on-leave counts, working hours and attendance percentage by employee or department.

Employee Report

Employee code, name, department, designation, joining date and employment status.

Leave Report

Leave requests by date range, type, status, employee and department.

Department Report

Employee counts, active employees and optional department-wise attendance summaries.

## Frontend behavior

1. Select report type.
2. Select start date and end date, if relevant.
3. Select department, status or employee filters.
4. Click Generate Report.
5. Display a loading indicator.
6. Send the filter parameters to the backend.
7. Render the returned summary cards, charts and table.
8. Allow sorting and pagination if the report is large.
9. Export the current filtered dataset to CSV.

Filters should remain visible after generating a report. If a user changes a filter, either update the report explicitly when Generate is clicked or apply the change immediately—choose one consistent interaction.

## Report APIs

| Method | Endpoint                   | Purpose           |
| ------ | -------------------------- | ----------------- |
| GET    | `/api/reports/employees`   | Employee report   |
| GET    | `/api/reports/attendance`  | Attendance report |
| GET    | `/api/reports/leaves`      | Leave report      |
| GET    | `/api/reports/departments` | Department report |

Example:

```
GET /api/reports/attendance?from=2026-10-01&to=2026-10-31&departmentId=2
```

### Backend responsibilities

- Validate the date range.
- Apply all filters consistently.
- Use database aggregation for summary metrics.
- Restrict results according to the authenticated user's permissions.
- Return paginated data for large reports.
- Export only the filtered and authorized records.
- Format CSV fields safely to prevent spreadsheet formula injection.
- Use a stable date and time format for exported files.

For a minor project, CSV export is sufficient. PDF export can be added later if you have time.

### Attendance percentage

Choose a precise definition, for example:

\\[ \text{Attendance \\%}= \frac{\text{Days Present}}{\text{Eligible Working Days}}\times100 \\]

Define how approved leave, half-days and holidays affect the denominator. Different definitions produce different results, so the report and dashboard must use the same rules.

# 12. Page 11 — Settings

Frontend: `SettingsPage.tsx` · Backend: `SettingsController.java`

Keep Settings simple and within your employee management project scope.

## Recommended sections

| Section                 | Fields or functions                          | Priority              |
| ----------------------- | -------------------------------------------- | --------------------- |
| My Profile              | Name, email, profile photo                   | Required              |
| Change Password         | Current password, new password, confirmation | Recommended           |
| Application Preferences | Date format, timezone                        | Recommended           |
| Attendance Settings     | Working hours, grace period                  | Optional              |
| Leave Settings          | Leave types and annual allocation            | Optional              |
| User Accounts           | Enable/disable accounts and assign roles     | Recommended for Admin |
| Notifications           | Basic in-app notification preferences        | Optional              |

You do not need every setting shown in the reference image. Company branding, complex security policies, integrations and payroll settings can be omitted from your minor project.

### Frontend behavior

- Load the current settings when the page opens.
- Show current values in editable controls.
- Validate numeric settings and required fields.
- Keep Save Changes disabled when nothing has changed, if desired.
- Display a confirmation message after a successful save.
- Revert unsaved changes when Reset is clicked, with confirmation if necessary.
- Display errors without discarding the user's input.

### Backend APIs

| Method | Endpoint                       | Purpose                            |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/settings/me`             | Get current user's preferences     |
| PUT    | `/api/settings/me`             | Update preferences                 |
| PUT    | `/api/auth/change-password`    | Change password                    |
| GET    | `/api/settings/attendance`     | Optional attendance rules          |
| PUT    | `/api/settings/attendance`     | Update authorized attendance rules |
| GET    | `/api/admin/users`             | Optional account administration    |
| PATCH  | `/api/admin/users/{id}/status` | Enable or disable account          |

Do not allow a user to change their own role by submitting a modified profile request. Role changes must be handled through a separate, protected administrative operation.

# 13. Complete database design

The database is the foundation of the entire application. Every page should read from or write to the appropriate database tables through Spring Boot.

I recommend starting with these tables and adding optional tables only when their features are implemented.

## 13.1 Core database tables

### 1. employees

Stores employee personal and employment details.

`id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `date_of_birth`, `address`, `photo_url`, `department_id`, `designation_id`, `manager_id`, `joining_date`, `employment_type`, `status`, `created_at`, `updated_at`

### 2. departments

Stores department information.

`id`, `code`, `name`, `description`, `status`, `created_at`, `updated_at`

### 3. designations

Stores job titles linked to departments.

`id`, `department_id`, `name`, `status`

### 4. users

Stores login accounts and their linked employees.

`id`, `employee_id`, `email`, `password_hash`, `enabled`, `created_at`, `last_login_at`

### 5. roles and user_roles

Stores roles and account-role assignments.

`roles(id, name)` · `user_roles(user_id, role_id)`

### 6. attendance_records

Stores attendance sessions and their timestamps.

`id`, `employee_id`, `work_date`, `check_in_at`, `check_out_at`, `status`, `remarks`, `source`, `created_at`, `updated_at`

### 7. leave_types

Stores configurable leave categories.

`id`, `name`, `default_annual_allowance`, `active`

### 8. leave_requests

Stores leave applications and approval decisions.

`id`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `requested_days`, `reason`, `status`, `reviewed_by`, `reviewed_at`, `review_comments`, `created_at`, `updated_at`

### 9. leave_balances

Stores leave allocation and usage by employee and year.

`id`, `employee_id`, `leave_type_id`, `year`, `allocated_days`, `used_days`

### 10. audit_logs

Records important changes and their actors.

`id`, `actor_user_id`, `entity_type`, `entity_id`, `action`, `old_values`, `new_values`, `reason`, `created_at`

## 13.2 Database relationships

- One department can have many employees.
- One department can have many designations.
- One designation can be assigned to many employees.
- One employee can have one login account, if self-service login is enabled.
- One employee can have many attendance records.
- One employee can submit many leave requests.
- One leave type can be used by many requests.
- One employee can have multiple yearly leave-balance records.
- One user can hold one or more roles.
- One manager can be linked to multiple employees through `manager_id`.

Use foreign keys to enforce these relationships.

### Important database constraints

| Constraint                                            | Why it matters                                     |
| ----------------------------------------------------- | -------------------------------------------------- |
| Unique employee code                                  | Prevents duplicate employee IDs                    |
| Unique normalized login email                         | Prevents duplicate accounts                        |
| Foreign keys                                          | Prevent orphaned employee or department references |
| Valid status values                                   | Prevents inconsistent status strings               |
| Nonnegative leave balances                            | Prevents invalid leave calculations                |
| Unique employee/date attendance rule where applicable | Helps prevent duplicate sessions                   |
| Unique employee/leave-type/year balance               | Prevents duplicate balance records                 |

Attendance design note: If you allow multiple shifts or sessions per day, do not impose a simple unique constraint on `(employee_id, work_date)`. Instead, model sessions explicitly and enforce at most one open session per employee using a suitable database constraint or transactional locking strategy.

For date and time storage, use PostgreSQL date/time types consistently. `work_date` is the local business date, while actual check-in/check-out timestamps should be stored with timezone-aware semantics. Configure the organization's timezone explicitly.

# 14. Frontend implementation — exact responsibilities

The frontend should manage the interface and user interaction. It should not be the authority for permissions, employee IDs, attendance calculations or leave approval.

## 14.1 Recommended React structure

```
frontend/src/
├── api/
│   ├── axiosClient.ts
│   ├── authApi.ts
│   ├── employeeApi.ts
│   ├── departmentApi.ts
│   ├── attendanceApi.ts
│   ├── leaveApi.ts
│   ├── dashboardApi.ts
│   ├── reportApi.ts
│   └── settingsApi.ts
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── AppLayout.tsx
│   ├── common/
│   │   ├── DataTable.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Pagination.tsx
│   │   └── DatePicker.tsx
│   └── forms/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── attendance/
│   ├── leave/
│   ├── departments/
│   ├── reports/
│   └── settings/
├── hooks/
├── routes/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## 14.2 What React should handle

| Frontend responsibility | Expected behavior                                               |
| ----------------------- | --------------------------------------------------------------- |
| Navigation              | Open pages using React Router                                   |
| Forms                   | Collect and validate user input                                 |
| API calls               | Use Axios to call backend endpoints                             |
| Loading state           | Show progress while waiting for the API                         |
| Error state             | Display readable errors                                         |
| Tables                  | Display API data and handle pagination                          |
| Filters                 | Build query parameters                                          |
| Calendar                | Manage visible month, year and selected date                    |
| Modals                  | Open/close dialogs and prevent accidental duplicate submissions |
| Status badges           | Display backend statuses consistently                           |
| Dashboard charts        | Visualize values returned by the backend                        |
| Authorization UX        | Hide actions that the current role cannot perform               |
| Responsive UI           | Adapt layouts for smaller screens                               |

### Every page needs four UI states

Do not design only the successful data view. Every data-driven page should handle:

1. Loading: Show a spinner or skeleton while fetching data.
2. Success: Render the returned records.
3. Empty: Show “No employees found” or a relevant empty state.
4. Error: Show a useful error and, where appropriate, a Retry action.

If the backend returns `403 Forbidden`, the frontend should not keep retrying the same unauthorized operation.

## 14.3 Shared frontend components

Build reusable components instead of rewriting them on every page.

- `AppLayout` — sidebar, header and content layout
- `DataTable` — common table structure
- `SearchInput` — debounced search
- `FilterSelect` — department and status filters
- `DatePicker` — month/year and date selection
- `ConfirmDialog` — deactivate employee, cancel request or similar actions
- `StatusBadge` — Active, Inactive, Present, Pending, Approved and Rejected
- `Pagination` — previous, next and page numbers
- `FormField` — label, input, error message and required indicator
- `Toast` — success and error feedback

The same date picker should be used in attendance filters, leave requests and report filters, with configurable minimum and maximum dates.

# 15. Backend implementation — exact responsibilities

Use layered architecture in Spring Boot.

```
backend/src/main/java/com/emp ly/
```

Use a valid Java package name such as `com.emply`.

```
com.emply/
├── config/
├── security/
├── controller/
├── dto/
├── entity/
├── repository/
├── service/
├── exception/
└── EmpLyApplication.java
```

## 15.1 What each backend layer does

Controller layer

Receives HTTP requests, validates DTOs and returns appropriate status codes. It should not contain complex business rules.

Service layer

Implements business rules, including employee validation, attendance transitions, leave approvals, transactional updates and dashboard calculations.

Repository layer

Uses Spring Data JPA to query and persist PostgreSQL data, including pagination, filtering and aggregate queries.

Entity layer

Defines database mappings and relationships.

DTO layer

Defines the request and response structures exposed by the API. Prevents exposing internal entity fields unnecessarily.

Security and exception handling

Verifies identity and permissions, and converts expected failures into consistent API responses.

## 15.2 Example backend request flow

Suppose React submits:

```
POST /api/employees
Content-Type: application/json
```

```
{
  "firstName": "Arun",
  "lastName": "Kumar",
  "email": "arun@example.com",
  "departmentId": 2,
  "designationId": 4,
  "joiningDate": "2026-10-05"
}
```

Spring Boot should:

1. Authenticate the request.
2. Check that the user has employee-creation permission.
3. Validate the JSON request DTO.
4. Check for duplicate email and employee code.
5. Verify the department and designation.
6. Generate the employee code if the client did not supply it.
7. Map the DTO to an entity.
8. Save through the repository in a transaction.
9. Return HTTP `201 Created` and the created employee DTO.

If the department does not exist, return a validation error instead of saving an invalid employee.

## 15.3 Standard error response

Use a consistent error format, for example:

```
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Please correct the highlighted fields.",
  "fieldErrors": {
    "email": "A valid email address is required."
  }
}
```

Handle at least:

- `400 Bad Request` — invalid input
- `401 Unauthorized` — missing or invalid authentication
- `403 Forbidden` — insufficient permissions
- `404 Not Found` — record does not exist
- `409 Conflict` — duplicate employee code or conflicting operation
- `500 Internal Server Error` — unexpected failure

Never expose stack traces, database credentials or internal exception details in production responses.

# 16. Complete CRUD operations checklist

This is the master checklist for implementing every module. You can use it to track frontend and backend development separately.

## Implementation tracker

0/47 completed

### Authentication

Login and logout

Load current authenticated user

Change password

Forgot/reset password, if implemented

### Employees

Create employee

List/search/filter employees

View employee details

Edit employee

Deactivate/reactivate employee

Profile photo upload

### Departments and designations

Create department

List/search departments

View department

Edit department

Deactivate department

Create/edit designations

### Attendance

Check in

Check out

List records by date range

Filter by employee, department and status

View attendance record

Correct attendance with reason

Calculate working hours

View daily and monthly summary

### Leave requests

Submit leave request

List authorized requests

View request details

Edit eligible request

Approve/reject pending request

Cancel eligible request

Calculate leave duration

Maintain leave balances

### Dashboard and reports

Calculate live dashboard metrics

Load attendance trend

Load department statistics

Load recent employees

Load pending requests

Generate employee report

Generate attendance report

Generate leave report

Export filtered CSV

### Settings and security

View/update profile preferences

Change password

Manage authorized user accounts

Enforce role permissions

Record important audit events

Handle errors and session expiry

Reset tracker

# 17. Important validation and edge cases

These small details often distinguish a functional application from a UI-only project.

## Employee management

- Prevent duplicate employee IDs and emails.
- Prevent saving a form multiple times during one submission.
- Prevent invalid department/designation assignments.
- Preserve historical records when employees leave.
- Show confirmation before deactivation.
- Handle records that are deleted or modified by another administrator while the current user is viewing them.

## Attendance

- Prevent duplicate check-ins.
- Prevent check-out without an open session.
- Reject check-out before check-in.
- Decide how overnight shifts work.
- Define how weekends, holidays and approved leave affect attendance.
- Handle the user selecting a past date.
- Record the reason for manual corrections.
- Ensure concurrent requests cannot create duplicate open sessions.

## Leave requests

- Reject invalid date ranges.
- Calculate leave duration on the backend.
- Prevent repeated approval from deducting the balance twice.
- Prevent employees from approving their own requests.
- Handle cancellations and balance restoration.
- Avoid negative balances if your policy prohibits them.

## Calendar and filters

- Calculate month lengths and weekday offsets dynamically.
- Support leap years.
- Keep the selected date separate from the currently displayed month.
- Handle empty search results.
- Reset pagination when filters change.
- Use consistent date and timezone rules throughout the application.

## Security

- Hash passwords securely.
- Validate permissions on every protected endpoint.
- Prevent unauthorized access by changing record IDs.
- Protect uploaded files.
- Avoid exposing private employee details in error messages or logs.
- Keep credentials in environment variables.
- Use HTTPS in production and configure CORS for the intended frontend origins.

# 18. Testing plan

Test each feature at three levels.

| Test type               | Example                                                     |
| ----------------------- | ----------------------------------------------------------- |
| Frontend component test | Required employee fields show validation errors             |
| Backend unit test       | Duplicate employee email is rejected                        |
| API integration test    | Creating an employee persists a record in PostgreSQL        |
| Authorization test      | An employee cannot edit another employee                    |
| Workflow test           | Check-in followed by check-out produces a completed session |
| Workflow test           | Approving a leave request updates its balance exactly once  |
| UI integration test     | Creating an employee refreshes the employee table           |
| Reporting test          | Dashboard attendance counts match the filtered records      |
| Regression test         | Editing an employee does not remove attendance history      |

For Spring Boot, use JUnit, Mockito and Spring Boot Test. For React, use Vitest and React Testing Library.

# 19. Recommended implementation order

Do not build every page and then connect all the APIs at the end. Complete one vertical feature at a time.

### 1

Foundation

Set up React, Spring Boot, PostgreSQL, migrations, authentication, shared layout and protected routes.

### 2

Departments

Complete department CRUD and designation relationships.

### 3

Employees

Complete employee CRUD, search, filters, pagination, employee profiles and validation.

### 4

Attendance

Implement the calendar, check-in/check-out, attendance list, corrections and summaries.

### 5

Leave

Implement requests, validation, approval, cancellation and leave balances.

### 6

Dashboard and reports

Build aggregate queries, charts, report filters and CSV exports from the completed modules.

### 7

Settings, testing and deployment

Complete account preferences, permissions, edge-case tests, documentation and deployment.

## 20. Final definition of a completed EmpLy project

Your project is complete when:

- All primary pages load real data from PostgreSQL through Spring Boot.
- Employee, department, attendance and leave operations work end to end.
- Forms validate data on both frontend and backend.
- Search, filters, sorting and pagination operate correctly.
- The calendar handles month/year selection and date selection properly.
- Dashboard cards and reports use consistent backend calculations.
- Authentication and record-level permissions are enforced.
- Important actions show loading, success and error feedback.
- Historical attendance and leave data remain consistent after employee changes.
- The application is tested, documented and deployable.

My strongest recommendation: Focus first on the employee CRUD flow, then attendance, then leave requests. These three workflows contain most of the essential business logic. Build the dashboard and reports after the underlying data is reliable.

That approach gives EmpLy a clear scope for a minor project while demonstrating real full-stack development, relational database design, API integration, business rules and security—not just UI design.