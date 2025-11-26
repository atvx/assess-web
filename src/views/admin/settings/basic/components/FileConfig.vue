<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">文件配置</h3>
      <a-button type="primary" @click="handleEdit">
        <EditOutlined />
        编辑
      </a-button>
    </div>

    <div class="setting-groups">
      <div class="setting-item">
        <label class="setting-label">上传方式</label>
        <div class="setting-value">
          <a-tag color="blue">{{ fileConfig.uploadType }}</a-tag>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">存储位置</label>
        <div class="setting-value">{{ fileConfig.storagePath }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">单文件大小限制</label>
        <div class="setting-value">{{ fileConfig.maxFileSize }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">允许的文件类型</label>
        <div class="setting-value">
          <a-space wrap>
            <a-tag v-for="type in fileConfig.allowedTypes" :key="type">
              {{ type }}
            </a-tag>
          </a-space>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">图片压缩</label>
        <div class="setting-value">
          <a-switch v-model:checked="fileConfig.imageCompression" disabled />
          <span class="ml-2">{{ fileConfig.imageCompression ? '已开启' : '已关闭' }}</span>
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">压缩质量</label>
        <div class="setting-value">{{ fileConfig.compressionQuality }}%</div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      title="编辑文件配置"
      width="700px"
      @ok="handleSubmit"
    >
      <a-form
        :model="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-item label="上传方式">
          <a-select v-model:value="form.uploadType">
            <a-select-option value="本地存储">本地存储</a-select-option>
            <a-select-option value="OSS">OSS</a-select-option>
            <a-select-option value="云存储">云存储</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="存储位置">
          <a-input v-model:value="form.storagePath" />
        </a-form-item>
        <a-form-item label="单文件大小限制">
          <a-input v-model:value="form.maxFileSize" placeholder="例如: 50MB" />
        </a-form-item>
        <a-form-item label="允许的文件类型">
          <a-select
            v-model:value="form.allowedTypes"
            mode="tags"
            placeholder="请选择或输入文件类型"
          >
            <a-select-option value=".jpg">.jpg</a-select-option>
            <a-select-option value=".png">.png</a-select-option>
            <a-select-option value=".pdf">.pdf</a-select-option>
            <a-select-option value=".doc">.doc</a-select-option>
            <a-select-option value=".docx">.docx</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图片压缩">
          <a-switch v-model:checked="form.imageCompression" />
        </a-form-item>
        <a-form-item label="压缩质量">
          <a-slider v-model:value="form.compressionQuality" :min="0" :max="100" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'

const fileConfig = reactive({
  uploadType: '本地存储',
  storagePath: '/uploads',
  maxFileSize: '50MB',
  allowedTypes: ['.jpg', '.png', '.pdf', '.doc', '.docx', '.zip'],
  imageCompression: true,
  compressionQuality: 80,
})

const modalVisible = ref(false)
const form = reactive({
  uploadType: '',
  storagePath: '',
  maxFileSize: '',
  allowedTypes: [] as string[],
  imageCompression: false,
  compressionQuality: 80,
})

const handleEdit = () => {
  Object.assign(form, fileConfig)
  modalVisible.value = true
}

const handleSubmit = () => {
  Object.assign(fileConfig, form)
  message.success('文件配置已更新')
  modalVisible.value = false
}
</script>

<style scoped>
.content-section {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.setting-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex-shrink: 0;
  width: 180px;
  font-size: 14px;
  color: #666;
  line-height: 32px;
}

.setting-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 32px;
}
</style>

