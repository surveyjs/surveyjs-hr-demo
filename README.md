# Acme HR

Employee directory demo. SurveyJS Form Library renders the business forms. SurveyJS Creator lets a business user change those forms during the session. Employee, review, and leave data stay in memory and in `localStorage`.

Survey Creator reads `SURVEYJS_KEY` and calls `slk` before the builder opens. With that variable set, the license banner is removed. Form Library does not need a key. Copy `.env.example` to `.env.local` for a local key. The published site at `https://hr.demos.surveyjs.io` receives the key from the demo host.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build
npm run preview
```

## Forms

The JSON files in `src/schemas` are the supplied definitions. The app imports them as-is.

| File | Screen |
| --- | --- |
| `Employee Registration Form.json` | Register Employee |
| `Search for an Employee.json` | Manage Employees |
| `Edit Employee.json` | Edit Employee drawer |
| `Add Performance Review.json` | Add Performance Review drawer |
| `Performance Reviews dynamic panel.json` | Read-only review collection on the profile |
| `Add Leave Request.json` | Add Leave Request drawer |
| `Leave Requests dynamic panel.json` | Read-only leave collection on the profile |

Creator writes the edited schema back into application state. The next time that form renders, it builds a new SurveyJS model from the saved schema.

## Demo data

Emma Thompson (`EMP-1002`, born April 12, 1990) is the sample profile. Every search field is optional. An empty search lists the directory. Surname `Thompson` lists Emma and Liam Thompson. Employee ID `EMP-1002` or Emma’s date of birth limits the result to Emma.

## Schema notes

- The registration and edit forms do not collect sex. The profile shows Sex as “Not collected”.
- Overall review rating is a 1–10 smiley scale (`rateMax: 10`). The sample reviews use ratings 4, 5, and 4 on that scale.
- Phone and postcode questions use pattern masks (`99999 999999` and `aa99 9aa`). Emma’s saved phone `(415) 555-0147` and postcode `94105` do not match those masks, so the edit form leaves those inputs empty and keeps the saved values if you leave them blank.
- The leave dynamic panel shows Reason only when `leave_list[0].leave_type` is unpaid leave. That condition is part of the supplied schema.
- New reviews and leave requests are created with the single-record forms, then prepended to the employee. The dynamic panels display that collection. `allowRemovePanel` is false, and the profile renders the panels in display mode.
