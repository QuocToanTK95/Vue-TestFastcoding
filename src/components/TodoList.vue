<template>
	<div class="min-h-screen bg-blue-100 py-8 px-4 flex items-center">
		<div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-4">
			<!-- Language Select -->
			<div class="mb-4 text-center">
				<label for="languageSelect" class="mr-2">{{ t('app.language') }}:</label>
				<select v-model="selectedLanguage" @change="changeLanguage" id="languageSelect">
					<option v-for="lang in supportedLanguages" :key="lang" :value="lang">
						{{ lang }}
					</option>
				</select>
			</div>
			<!-- Title -->
			<h1 class="text-2xl font-bold mb-4 text-center">{{ t('app.title') }}</h1>
			<!-- Form Add Todo -->
			<form @submit.prevent="addTodo" class="flex flex-col mb-4">
				<!-- TinyMCE -->
				<Editor
					:init="configEditor"
					v-model="newTodo.text"
					:placeholder="t('app.placeholder')"
				></Editor>
				<!-- Due Date/Time -->
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between my-2">
					<label for="dateTime" class="mb-2 sm:mb-0">{{ t('app.labelDueDate') }}</label>
					<input
						id="dateTime"
						v-model="newTodo.dueDate"
						type="datetime-local"
						required
						class="w-full sm:w-auto rounded-lg border border-darkgray p-2"
					/>
				</div>
				<!-- Button Add -->
				<button
					type="submit"
					:disabled="!newTodo.text"
					class="mt-4 w-full sm:w-auto px-4 py-2 text-white rounded-lg"
					:class="{ 'bg-blue-500': newTodo.text, 'bg-gray-400': !newTodo.text }"
				>
					{{ isEditingTodo ? t('app.save') : t('app.add') }}
				</button>
			</form>
			<table v-if="todos.length > 0" class="w-full text-center">
				<thead>
					<tr>
						<th>{{ t('app.task') }}</th>
						<th>{{ t('app.dueDate') }}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(todo, index) in todos"
						:key="index"
						class="border-b border-gray-300 py-2"
					>
						<td>
							<span v-html="todo.text"></span>
						</td>
						<td>
							<span class="text-sm text-gray-500">{{ todo.dueDate }}</span>
						</td>
						<td>
							<button
								@click="editTodo(index)"
								class="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg"
							>
								<font-awesome-icon icon="fa-solid fa-pen-to-square" />
							</button>
							<button
								@click="showRemoveModal(index)"
								class="px-4 py-2 bg-red-500 text-white rounded-lg"
							>
								<font-awesome-icon icon="fa-solid fa-trash" />
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<Modal
			v-if="showModal"
			:message="confirmMessage"
			@confirmed="onConfirmRemove"
			@cancelled="onCancelRemove"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';
import Editor from '@tinymce/tinymce-vue';
import { useI18n } from 'vue-i18n';
import Modal from './Modal.vue';

// Get data from local storage
const todos = ref(JSON.parse(localStorage.getItem('todos')) || []);

const newTodo = ref({ text: '', dueDate: '' });
const toast = useToast();

// config tinymce
const configEditor = ref({
	height: 150,
	menubar: false,
	toolbar:
		'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
});

// Multi Language
const { t } = useI18n();
const supportedLanguages = ['en', 'vi'];
const i18n = useI18n();
const { locale } = useI18n();
const selectedLanguage = ref(locale);

// The flag to change the text of the button
const isEditingTodo = ref(false);

// Modal
const showModal = ref(false);
const confirmMessage = ref('');
let taskToRemoveIndex;

// Function to add the task
const addTodo = () => {
	if (newTodo.value.text.trim() !== '') {
		todos.value.push({
			text: newTodo.value.text,
			dueDate: newTodo.value.dueDate,
		});
		newTodo.value.text = '';
		newTodo.value.dueDate = '';
		saveTodosToLocalStorage();
		isEditingTodo.value = false;
	}
};

// Function to remove the task
const removeTodo = index => {
	const todoToRemove = cleanHtml(todos.value[index].text);
	if (todoToRemove) {
		todos.value.splice(index, 1);
		saveTodosToLocalStorage();
		toast.success(`The task "${todoToRemove}" was removed!`, {
			timeout: 3000, // Duration of the toast (in ms)
		});
		showModal.value = false;
	}
};

// Function to edit the task
const editTodo = index => {
	isEditingTodo.value = true;
	const todoToEdit = todos.value[index];
	newTodo.value.text = cleanHtml(todoToEdit.text);
	newTodo.value.dueDate = todoToEdit.dueDate;
	todos.value.splice(index, 1);
	saveTodosToLocalStorage();
};

// Save data to local storage
const saveTodosToLocalStorage = () => {
	localStorage.setItem('todos', JSON.stringify(todos.value));
};

// Function to remove HTML tags from the text
const cleanHtml = html => {
	return html.replace(/<[^>]+>/g, '');
};

// Check if the due date is within 5 minutes from now
watchEffect(() => {
	if (todos.value.length > 0) {
		const lastTodo = todos.value[todos.value.length - 1];
		const dueDateTime = new Date(lastTodo.dueDate);
		const currentTime = new Date();
		const timeDiff = dueDateTime - currentTime;
		if (!lastTodo.notified && timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
			lastTodo.notified = true;
			const cleanText = cleanHtml(lastTodo.text);
			toast.error(`Task "${cleanText}" is due soon!`, {
				timeout: 3000, // Duration of the toast (in ms)
			});
		}
	}
});

// Function to handle language change
const changeLanguage = () => {
	i18n.locale = selectedLanguage.value;
};

// Function to show Modal
const showRemoveModal = index => {
	showModal.value = true;
	const hideTiny = document.querySelector('.tox-editor-header');
	hideTiny.style['z-index'] = 0;
	taskToRemoveIndex = index;
	confirmMessage.value = `Are you sure you want to delete "${cleanHtml(
		todos.value[index].text
	)}"?`;
};

// Function received emit from modal
const onConfirmRemove = () => {
	removeTodo(taskToRemoveIndex);
};

// Function received emit from modal
const onCancelRemove = () => {
	showModal.value = false;
};

// Create the Local Storage when the component is mounted
onMounted(saveTodosToLocalStorage);
</script>

<style>
.tox-notification {
	display: none !important;
}
</style>
