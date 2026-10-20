# Acme HR

Employee directory demo. SurveyJS Form Library renders the business forms. SurveyJS Creator lets a business user change those forms during the session. Employee, review, and leave data stay in memory and in `localStorage`.

Survey Creator reads `SURVEYJS_KEY` and calls `slk` before the builder opens. With that variable set, the license banner is removed. Form Library does not need a key. Copy `.env.example` to `.env.local` for a local key. The published site at `https://hr.demos.surveyjs.io` receives the key from the demo host.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. A new visit opens the employee directory signed in as Olivia Carter (HR). Log out returns to the sign-in form for the rest of that tab. Every account uses the password `demo1234`.

| Username | Role | Opens |
| --- | --- | --- |
| `olivia.carter` | HR | Employee directory |
| `james.patel` | HR | Employee directory |
| `emma.thompson` | Employee | Emma Thompson (`EMP-1002`) |
| `daniel.okonkwo` | Employee | Daniel Okonkwo (`EMP-1044`) |
| `priya.shah` | Employee | Priya Shah (`EMP-1108`) |
| `liam.thompson` | Employee | Liam Thompson (`EMP-1077`) |

The roster dropdown fills the username and password. “Keep me signed in on this device” stores the account in `localStorage`. Otherwise the session ends when the tab closes. Log out returns to the sign-in form. HR accounts can register and edit employees and open Survey Creator. Employee accounts see only their own profile and can add a leave request.

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
- Phone and postcode questions use pattern masks (`99999 999999` and `aa99 9aa`). Saved demo values use those patterns, so Edit Employee opens with the phone and postcode filled.
- The leave dynamic panel shows Reason only when `leave_list[0].leave_type` is unpaid leave. That condition is part of the supplied schema.
- New reviews and leave requests are created with the single-record forms, then prepended to the employee. The dynamic panels display that collection. `allowRemovePanel` is false, and the profile renders the panels in display mode.
