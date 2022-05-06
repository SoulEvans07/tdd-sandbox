# Todo App

## Data structure

```
Users
  _id: int
  username: string -> 6-32
  email: string -> validate
  password: string -> min 8char, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/
  tenantId: int

Tenants
  _id: int
  name: string

Tasks
  _id: int
  parentId?: int
  tenantId?: int
  assigneeId: int
  order: int
  title: string -> 3-200
  description: string
  status: enum(todo, inProgress, blocked, done) -> transition
    todo -> inProgress
    inProgress -> blocked, done
    blocked -> todo, inProgress
  createdAt: timestamp
  updatedAt: timestamp
  deletedAt: timestamp
```
