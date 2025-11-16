<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PlaceholderPage :title="isEditMode ? '编辑活动' : '新增活动'" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PlaceholderPage from '@/components/common/PlaceholderPage.vue'

const route = useRoute()
const isEditMode = computed(() => !!route.params.id)
</script>

