import {defineStore} from "pinia";
import {computed, ref} from "vue";

export interface Task {
    id: string,
    name: string,
    tries: number,
    frequency: number,
    timeFrom: string,
    timeTo: string,
    weekSchedule: {
        sun: boolean,
        mon: boolean,
        tue: boolean,
        wen: boolean,
        thi: boolean,
        fri: boolean,
        sat: boolean,
    },
}

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Record<string, Task>>({});
    const addTask = (task: Task) => {
        const id = Date.now();
        task.id = id.toString();
        tasks.value[id] = task;
    }
    const removeTask = (id: string) => {
        delete tasks.value[id];
    }
    const tasksCount = computed(() => Object.keys(tasks.value).length)

    return {
        tasks,
        tasksCount,
        addTask,
        removeTask,
    }
});
