<template>
	<div class="settings-page">
		<h1 class="page-title">Settings</h1>

		<div class="settings-container">
			<section class="settings-section">
				<h2 class="section-title">Account</h2>
				<div class="settings-content">
					<div class="setting-item">
						<div class="setting-info">
							<h3 class="setting-name">Email</h3>
							<p class="setting-value">{{ user?.email }}</p>
						</div>
						<button class="setting-button">Change</button>
					</div>

					<div class="setting-item">
						<div class="setting-info">
							<h3 class="setting-name">Password</h3>
							<p class="setting-value">••••••••</p>
						</div>
						<button class="setting-button">Change</button>
					</div>
				</div>
			</section>

			<section class="settings-section">
				<h2 class="section-title">Preferences</h2>
				<div class="settings-content">
					<div class="setting-item">
						<div class="setting-info">
							<h3 class="setting-name">Theme</h3>
							<p class="setting-value">{{ colorMode.preference }}</p>
						</div>
						<select v-model="colorMode.preference" class="setting-select">
							<option value="system">System</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</div>

					<div class="setting-item">
						<div class="setting-info">
							<h3 class="setting-name">Notifications</h3>
							<p class="setting-value">Enabled</p>
						</div>
						<ToggleSwitch v-model="notificationsEnabled" />
					</div>
				</div>
			</section>

			<section class="settings-section">
				<h2 class="section-title">Danger Zone</h2>
				<div class="settings-content">
					<button @click="handleLogout" class="danger-button">
						Sign Out
					</button>
					<button @click="showDeleteModal = true" class="danger-button destructive">
						Delete Account
					</button>
				</div>
			</section>
		</div>

		<Modal :show="showDeleteModal" title="Delete Account" @close="showDeleteModal = false">
			<div class="delete-modal-content">
				<p>Are you sure you want to delete your account? This action cannot be undone.</p>
				<div class="modal-actions">
					<button @click="showDeleteModal = false" class="modal-button cancel">
						Cancel
					</button>
					<button @click="handleDeleteAccount" class="modal-button confirm" :disabled="isDeleting">
						<span v-if="!isDeleting">Delete</span>
						<Icon v-else name="svg-spinners:90-ring-with-bg" class="w-5 h-5" />
					</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '~/composables/state/useAuthStore'
import { useColorMode } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()
const colorMode = useColorMode()
const router = useRouter()

const user = computed(() => authStore.user)
const notificationsEnabled = ref(true)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const handleLogout = async () => {
	try {
		authStore.logout()
		router.push('/auth/login')
	} catch (error) {
		console.error('Logout failed:', error)
	}
}

const handleDeleteAccount = async () => {
	isDeleting.value = true
	try {
		// TODO: Implement account deletion
		await authStore.deleteAccount()
		authStore.logout()
		router.push('/auth/login')
	} catch (error) {
		console.error('Account deletion failed:', error)
	} finally {
		isDeleting.value = false
		showDeleteModal.value = false
	}
}
</script>

<style scoped>
.settings-page {
	@apply max-w-3xl mx-auto p-4 md:p-6;
}

.page-title {
	@apply text-2xl font-bold text-gray-800 dark:text-white mb-8;
}

.settings-container {
	@apply space-y-8;
}

.settings-section {
	@apply border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden;
}

.section-title {
	@apply px-6 py-4 bg-gray-50 dark:bg-gray-800 text-lg font-semibold;
	@apply text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700;
}

.settings-content {
	@apply divide-y divide-gray-200 dark:divide-gray-700;
}

.setting-item {
	@apply px-6 py-4 flex items-center justify-between;
}

.setting-info {
	@apply flex-1;
}

.setting-name {
	@apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.setting-value {
	@apply text-sm text-gray-500 dark:text-gray-400 mt-1;
}

.setting-button {
	@apply px-4 py-2 text-sm font-medium rounded-lg;
	@apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30;
	@apply hover:bg-primary-100 dark:hover:bg-primary-800/50 transition-normal;
}

.setting-select {
	@apply px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600;
	@apply bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200;
	@apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.danger-button {
	@apply w-full px-4 py-3 text-left font-medium rounded-lg;
	@apply transition-normal border border-transparent;

	&:not(.destructive) {
		@apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
	}

	&.destructive {
		@apply text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20;
	}
}

.delete-modal-content {
	@apply p-4;
}

.modal-actions {
	@apply flex justify-end gap-3 mt-6;
}

.modal-button {
	@apply px-4 py-2 rounded-lg font-medium transition-normal;

	&.cancel {
		@apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
	}

	&.confirm {
		@apply bg-red-600 text-white hover:bg-red-700;
		@apply disabled:opacity-70 disabled:cursor-not-allowed;
	}
}
</style>
