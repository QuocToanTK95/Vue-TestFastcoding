<template>
	<div class="container mx-auto p-4">
		<h1 class="text-3xl font-bold mb-4">TODO List</h1>

		<!-- Form to add new tasks -->
		<form @submit.prevent="addTask" class="mb-4">
			<div class="flex flex-col sm:flex-row gap-2">
				<input
					type="text"
					v-model="newTask.text"
					placeholder="Enter task description"
					class="border rounded p-2 w-full sm:w-2/3"
					required
				/>
				<input
					type="datetime-local"
					v-model="newTask.dueDate"
					class="border rounded p-2 w-full sm:w-1/3"
					required
				/>
				<button
					type="submit"
					class="bg-blue-500 text-white py-2 px-4 rounded w-full sm:w-auto"
				>
					Add Task
				</button>
			</div>
		</form>

		<!-- List of tasks -->
		<div v-if="tasks.length > 0">
			<ul>
				<li
					v-for="(task, index) in tasks"
					:key="index"
					class="border p-4 my-2 flex flex-col sm:flex-row items-center justify-between"
				>
					<div>
						<p class="text-lg">{{ task.text }}</p>
						<p class="text-sm text-gray-500">{{ formatDate(task.dueDate) }}</p>
					</div>
					<button
						@click="removeTask(index)"
						class="bg-red-500 text-white py-2 px-4 rounded"
					>
						Delete
					</button>
				</li>
			</ul>
		</div>
		<div v-else>
			<p>No tasks yet.</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Initialize tasks from Local Storage
const tasks = ref([]);

// Initialize newTask object
const newTask = ref({
	text: '',
	dueDate: '',
});

// Function to add a new task
const addTask = () => {
	if (newTask.value.text && newTask.value.dueDate) {
		tasks.value.push({ ...newTask.value });
		saveTasksToLocalStorage();
		newTask.value.text = '';
		newTask.value.dueDate = '';
	}
};

// Function to remove a task
const removeTask = index => {
	tasks.value.splice(index, 1);
	saveTasksToLocalStorage();
};

// Function to format the due date for display
const formatDate = dateString => {
	const date = new Date(dateString);
	return date.toLocaleString();
};

// Function to save tasks to Local Storage
const saveTasksToLocalStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

// Watch tasks and show toast notifications when due date/time is reached
watchEffect(() => {
	tasks.value.forEach(task => {
		const dueDate = new Date(task.dueDate);
		if (dueDate <= new Date() && !task.notified) {
			toast.error(`Task "${task.text}" is due now!`);
			task.notified = true;
		}
	});
});

// Function to load tasks from Local Storage
const loadTasksFromLocalStorage = () => {
	const storedTasks = localStorage.getItem('tasks');
	tasks.value = storedTasks ? JSON.parse(storedTasks) : [];
};

// Load tasks from Local Storage when the component is mounted
onMounted(() => {
	loadTasksFromLocalStorage();
});
</script>
