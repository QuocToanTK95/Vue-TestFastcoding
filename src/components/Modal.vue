<template>
    <div class="modal-overlay">
      <div class="modal">
        <p>{{ props.message }}</p>
        <button @click="confirmDelete">Delete</button>
        <button @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['message']);
const emit = defineEmits(['confirmed', 'cancelled'])

const confirmDelete = () => {
  emit('confirmed');
};

const cancelDelete = () => {
  emit('cancelled');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 200px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin: 0 10px;
}
</style>
