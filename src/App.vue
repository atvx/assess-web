<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <ConfigProvider :theme="themeStore.antdThemeConfig">
    <router-view />
  </ConfigProvider>
</template>

<style scoped></style>
