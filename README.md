# Todo List App with PocketBase

A modern, realtime todo list application with authentication, drag & drop, and celebration effects.

## Features

- ✅ Realtime updates with PocketBase
- 🔐 User authentication
- 🎨 Dark/light mode
- 🎉 Celebration effects for completed tasks
- 📅 Due dates and priorities
- 🏷️ Tagging system
- 📱 Responsive design
- 🚀 Optimized performance

## Tech Stack

- Frontend: Nuxt 3, Vue 3, TypeScript, Pinia
- Backend: PocketBase
- Styling: Tailwind CSS
- Icons: Phosphor Icons

## Development

1. Install dependencies:

todolist-app
├── assets
│   └── icons
├── backend
│   ├── pb_data
│   │   ├── auxiliary.db
│   │   ├── backups
│   │   │   ├── pb_backup_todolist_app_20250329155010.zip
│   │   │   └── pb_backup_todolist_app_20250329155010.zip.attrs
│   │   ├── data.db
│   │   ├── storage
│   │   │   └── _pb_users_auth_
│   │   └── types.d.ts
│   ├── pb_migrations
│   │   └── 1743262702_created_todos.js
│   └── pocketbase
├── eslint.config.mjs
├── frontend
│   ├── app.vue
│   ├── assets
│   │   ├── sounds
│   │   │   ├── complete.mp3
│   │   │   └── delete.mp3
│   │   └── styles
│   │       ├── animations.css
│   │       └── global.css
│   ├── components
│   │   ├── auth
│   │   │   └── AuthButton.vue
│   │   ├── CelebrationOverlay.vue
│   │   ├── todo
│   │   │   ├── TodoFilters.vue
│   │   │   ├── TodoForm.vue
│   │   │   ├── TodoHeader.vue
│   │   │   ├── TodoItem.vue
│   │   │   └── TodoList.vue
│   │   └── ui
│   │       ├── AchievementToast.vue
│   │       ├── ConfettiEffect.vue
│   │       ├── EmptyState.vue
│   │       ├── NotificationsContainer.vue
│   │       ├── ProgressHeader.vue
│   │       ├── ScrollToTopButton.vue
│   │       └── ThemeToggleButton.vue
│   ├── composables
│   │   ├── api
│   │   │   ├── types
│   │   │   ├── usePocketBase.ts
│   │   │   ├── useRecordService.ts
│   │   │   └── useTodosApi.ts
│   │   ├── effects
│   │   │   ├── useCelebration.ts
│   │   │   ├── useDragAndDrop.ts
│   │   │   └── useSoundEffects.ts
│   │   ├── state
│   │   │   ├── useAuthStore.ts
│   │   │   └── useTodosStore.ts
│   │   ├── useNotification.ts
│   │   └── useScroll.ts
│   ├── middleware
│   │   └── auth.global.ts
│   ├── pages
│   │   ├── auth
│   │   │   ├── login.vue
│   │   │   └── signup.vue
│   │   ├── index.vue
│   │   └── settings.vue
│   └── utils
│       ├── constants.ts
│       ├── date.ts
│       └── validation.ts
├── nuxt.config.ts
├── package.json
├── README.md
├── tailwind.config.js
├── tests
└── tsconfig.json
