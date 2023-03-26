<script lang="ts" setup>
import {Task, useTasksStore} from "@/stores/tasks";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const {params: {id}} = useRoute();
const {push} = useRouter();
const tasksStore = useTasksStore();
const form = ref<Task>({
  name: 'Новая задача',
  timeTo: '',
  timeFrom: '',
  tries: 1,
  frequency: 1,
  weekSchedule: {
    sun: false,
    mon: false,
    tue: false,
    wen: false,
    thi: false,
    fri: false,
    sat: false,
  },
  id: '0',
});

const task = tasksStore.tasks[id as string];

watch(tasksStore, () => {
  if (task) {
    form.value = JSON.parse(JSON.stringify(task));
  }
}, {
  immediate: true,
});

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
      <v-card-title>{{ form.name }}</v-card-title>
      <v-form class="form-padded" @submit.prevent="addTask">
        <v-text-field
            v-model="form.name"
            label="Название задачи"
        ></v-text-field>
        <v-text-field
            v-model="form.tries"
            type="number"
            label="Повторов"
        ></v-text-field>
        <v-text-field
            v-model="form.frequency"
            type="number"
            label="Частота, минут"
        ></v-text-field>
        <v-text-field
            type="time"
            v-model="form.timeFrom"
            label="Время с"
        ></v-text-field>
        <v-text-field
            type="time"
            v-model="form.timeTo"
            label="Время по"
        ></v-text-field>
        <v-switch color="indigo" v-model="form.weekSchedule.mon" label="Понедельник"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.tue" label="Вторник"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.wen" label="Среда"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.thi" label="Четверг"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.fri" label="Пятница"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.sat" label="Суббота"></v-switch>
        <v-switch color="indigo" v-model="form.weekSchedule.sun" label="Воскресенье"></v-switch>
        <v-btn color="green" type="submit" block class="mt-2">Сохранить</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
