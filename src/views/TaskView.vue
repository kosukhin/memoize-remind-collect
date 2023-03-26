<script lang="ts" setup>
import {Task, useTasksStore} from "@/stores/tasks";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {params: {id}} = useRoute();
const {push} = useRouter();
const tasksStore = useTasksStore();
const form = ref<Task>({
  name: 'Новая задача',
  timeTo: '',
  timeFrom: '',
  tries: 1,
  weekSchedule: {
    sun: false,
    mon: false,
    tue: false,
    wen: false,
    thi: false,
    fri: false,
    sat: false,
  },
  id: 0,
});

const task = tasksStore.tasks[id as string];

if (task) {
  form.value = JSON.parse(JSON.stringify(task));
}

const addTask = () => {
  if (task) {
    tasksStore.removeTask(task.id);
  }

  tasksStore.addTask(form.value);
  push('/')
}
</script>

<template>
  <v-container>
    <v-btn
        @click="$router.push('/')"
        class="mb-4"
        color="indigo-darken-3"
    >Назад</v-btn>
    <v-card>
      <v-card-title>Новая задача</v-card-title>
      <v-card-text>
        Чтобы добавить задачу нажмите "Добавить задачу"
      </v-card-text>
      <v-form class="form-padded" @submit.prevent="addTask">
        <v-text-field
            v-model="form.name"
            label="Название задачи"
        ></v-text-field>
        <v-text-field
            v-model="form.timeTo"
            label="Время с"
        ></v-text-field>
        <v-text-field
            v-model="form.timeFrom"
            label="Время по"
        ></v-text-field>
        <v-switch color="indigo" v-model="form.weekSchedule.mon" label="Понедельник"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.tue" label="Вторник"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.wen" label="Среда"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.thi" label="Четверг"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.fri" label="Пятница"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.sat" label="Суббота"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.sun" label="Воскресенье"></v-switch>
        <v-btn type="submit" block class="mt-2">Сохранить</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
