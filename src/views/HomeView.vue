<script setup lang="ts">
import {useTasksStore} from "@/stores/tasks";
import {storeToRefs} from "pinia";

const tasksStore = useTasksStore();
const {tasks, tasksCount} = storeToRefs(tasksStore);

const remove = (id: string) => {
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
        <v-card class="mb-3" :key="task.id" v-for="task in tasks">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            c {{ task.timeFrom }} по {{ task.timeTo }},
            Попыток: {{ task.tries }}
          </v-card-text>
          <v-card-text>
            <v-chip
                :color="active ? 'indigo' : 'black'"
                class="mr-1"
                :key="name"
                v-for="(active, name) in task.weekSchedule"
            >
              {{ name }}
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="indigo-darken-3"
                size="small"
                @click="$router.push({name: 'task', params: {id: task.id}})"
            >Редактировать</v-btn>
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
