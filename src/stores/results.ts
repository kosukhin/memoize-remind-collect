import {defineStore} from "pinia";
import {ref} from "vue";
import {nowDay} from "@/utils/nowDay";

export interface Result {
    taskId: string,
    day: string,
    value: string,
}

export const useResultsStore = defineStore('results', () => {
    const results = ref<Record<string, Result[]>>({});
    const addResult = (taskId: string, value: string) => {
        if (!results.value[taskId]) {
            results.value[taskId] = [];
        }

        results.value[taskId].push({
           taskId,
           day: nowDay(),
           value,
        });
    }

    return {
        results,
        addResult,
    }
});
