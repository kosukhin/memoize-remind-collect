<script setup lang="ts">
import {useTasksStore} from "@/stores/tasks";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const tasksStore = useTasksStore();
const {tasks, activeTasks, tasksCount, taskDates} = storeToRefs(tasksStore);

const tasksArr = computed(() => {
  const arr = Object.values(tasks.value);
  arr.reverse();
  return arr;
})

const remove = (id: string) => {
  if(!confirm('Вы уверены?')) {
    return;
  }

  tasksStore.removeTask(id);
}
</script>

<template>
  <main>
    <v-container>
      <v-btn
        @click="$router.push('/task/new')"
        class="mb-4"
        color="indigo-darken-3"
      >Добавить задачу</v-btn>
      <v-card v-if="!tasksCount">
        <v-card-title>Нет задач</v-card-title>
        <v-card-text>
          Чтобы добавить задачу нажмите "Добавить задачу"
        </v-card-text>
      </v-card>
      <div v-else>
        <h3>Следующий запуск</h3>
        <div :key="taskId" v-for="(task, taskId) in taskDates">
          <span v-if="tasks[taskId]">
            {{ tasks[taskId].name }}: {{ (new Date(task.nextDate)).toLocaleString() }}, repeats: {{ task.counter }}
          </span>
        </div>
        <v-alert class="mb-2">
          Активных задач: {{ activeTasks.length }}
        </v-alert>
        <v-card class="mb-3" :key="task.id" v-for="task in tasksArr">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            Попыток: {{ task.tries }},
            Период напоминаний: {{ task.frequency }} минут
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="indigo-darken-3"
                size="small"
                @click="$router.push({name: 'task', params: {id: task.id}})"
            >Редактировать</v-btn>
            <v-btn
                color="green"
                size="small"
                @click="$router.push({name: 'results', params: {id: task.id}})"
            >Результаты</v-btn>
            <v-btn
                color="red"
                size="small"
                @click="remove(task.id)"
            >Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-container>
  </main>
</template>
