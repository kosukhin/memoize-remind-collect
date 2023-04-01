import {defineStore, storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {useResultsStore} from "@/stores/results";
import {nowDay} from "@/utils/nowDay";

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

export type TaskDates = Record<string, {lastDate: Date, nextDate: Date, counter: number}>;

export const useTasksStore = defineStore('tasks', () => {
    const resultsStore = useResultsStore();
    const {results} = storeToRefs(resultsStore);
    const tasks = ref<Record<string, Task>>({});
    const taskDates = ref<TaskDates>({});
    const addTask = (task: Task) => {
        const id = Date.now();
        task.id = id.toString();
        tasks.value[id] = task;
    }
    const updateTask = (taskId: string, task: Task) => {
        tasks.value[taskId] = task;
    }
    const removeTask = (id: string) => {
        delete tasks.value[id];
    }
    const tasksCount = computed(() => Object.keys(tasks.value).length)
    const activeTasks = computed(() => {
        return Object.values(tasks.value).filter(task => {
            const today = nowDay();
            const todayResults = (results.value[task.id] ?? []).filter(res => {
                return res.day === today;
            });

            return todayResults.length < task.tries;
        })
    })

    return {
        tasks,
        activeTasks,
        taskDates,
        tasksCount,
        addTask,
        updateTask,
        removeTask,
    }
});
