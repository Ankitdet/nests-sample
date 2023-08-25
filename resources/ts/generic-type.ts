export enum TaskType {
    feature = "feature",
    bug = "bug"
}

type Task<T = TaskType> = {
    name: string
    type: T
}

const whatever: Task = { name: 'task1', type: TaskType.bug }


type featureTask = Task<TaskType.feature>

const feature: featureTask = { name: 'featuretask 1', type: TaskType.feature }

// Diff between the type and interface
