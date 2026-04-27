# Task Tracker UI Wireframe

## Page Layout

```text
+--------------------------------------------------------------+
| Task Tracker                                                 |
| Create tasks, edit details, and move work through statuses.   |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
| Create Task                                                  |
|                                                              |
| Title                                                        |
| [ Write task title                                      ]     |
|                                                              |
| Description                                                  |
| [ Write task description                               ]      |
| [                                                    ]        |
|                                                              |
| [ Create task ]                                              |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
| Tasks                                                        |
|                                                              |
| +----------------------------------------------------------+ |
| | Plan API                                      [ TODO ]    | |
| | Write backend endpoints                                  | |
| |                                                          | |
| | [ Move to in progress ] [ Edit ] [ Delete ]              | |
| +----------------------------------------------------------+ |
|                                                              |
| +----------------------------------------------------------+ |
| | Build UI                              [ IN_PROGRESS ]     | |
| | Create React components                                  | |
| |                                                          | |
| | [ Move to done ] [ Edit ] [ Delete ]                     | |
| +----------------------------------------------------------+ |
|                                                              |
| +----------------------------------------------------------+ |
| | Ship                                         [ DONE ]     | |
| | Finish the practice app                                  | |
| |                                                          | |
| | [ Edit ] [ Delete ]                                      | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+
```

## Create Form

```text
+--------------------------------------------------------------+
| Create Task                                                  |
|                                                              |
| Title                                                        |
| [                                                    ]        |
|                                                              |
| Description                                                  |
| [                                                    ]        |
| [                                                    ]        |
|                                                              |
| [ Create task ]                                              |
+--------------------------------------------------------------+
```

The create form collects the required task title and description. New tasks start in the `TODO` status.

## Edit Form

```text
+--------------------------------------------------------------+
| Edit Task                                                    |
|                                                              |
| Title                                                        |
| [ Plan task API                                      ]        |
|                                                              |
| Description                                                  |
| [ Update the endpoint design                         ]        |
| [                                                    ]        |
|                                                              |
| [ Save ] [ Cancel ]                                          |
+--------------------------------------------------------------+
```

The edit form reuses the same task fields. Saving updates the title and description. Canceling returns to the task list item without applying changes.

## Status Badge

```text
[ TODO ]
[ IN_PROGRESS ]
[ DONE ]
```

The status badge appears next to the task title. It gives a quick visual cue for the task's current state.

## Action Buttons

```text
TODO task:
[ Move to in progress ] [ Edit ] [ Delete ]

IN_PROGRESS task:
[ Move to done ] [ Edit ] [ Delete ]

DONE task:
[ Edit ] [ Delete ]
```

Status actions follow the allowed transition rules:

- `TODO` can move to `IN_PROGRESS`.
- `IN_PROGRESS` can move to `DONE`.
- `DONE` is terminal and has no status movement button.

## User Flow

1. The user opens the Task Tracker page.
2. The app loads the current task list.
3. The user enters a title and description in the create form.
4. The user selects `Create task`.
5. The new task appears at the top of the task list with a `TODO` badge.
6. The user can select `Move to in progress` to advance a `TODO` task.
7. The user can select `Move to done` to complete an `IN_PROGRESS` task.
8. A `DONE` task remains visible but cannot move back to another status.
9. The user can select `Edit` to update a task's title or description.
10. The user can select `Delete` to remove a task from the list.
