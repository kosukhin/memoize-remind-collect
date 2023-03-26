<script setup lang="ts">
import {useTasksStore} from "@/stores/tasks";
import {storeToRefs} from "pinia";

const tasksStore = useTasksStore();
const {tasks, tasksCount} = storeToRefs(tasksStore);
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
            {{ task.timeFrom }} - {{ task.timeTo }}
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </main>
</template>
