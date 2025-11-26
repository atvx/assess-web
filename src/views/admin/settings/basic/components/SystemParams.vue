<template>
  <div class="content-section">
    <div class="section-header">
      <h3 class="section-title">系统参数</h3>
      <a-button type="primary" @click="handleEdit">
        <EditOutlined />
        编辑
      </a-button>
    </div>

    <div class="setting-groups">
      <div class="setting-item">
        <label class="setting-label">系统名称</label>
        <div class="setting-value">{{ systemParams.name }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">系统版本</label>
        <div class="setting-value">{{ systemParams.version }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">系统Logo</label>
        <div class="setting-value">
          <a-image :src="systemParams.logo" :width="100" />
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">系统Favicon</label>
        <div class="setting-value">
          <a-image :src="systemParams.favicon" :width="50" />
        </div>
      </div>
      <div class="setting-item">
        <label class="setting-label">版权信息</label>
        <div class="setting-value">{{ systemParams.copyright }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">备案号</label>
        <div class="setting-value">{{ systemParams.icp }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">联系方式</label>
        <div class="setting-value">{{ systemParams.contact }}</div>
      </div>
      <div class="setting-item">
        <label class="setting-label">系统描述</label>
        <div class="setting-value">{{ systemParams.description }}</div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      title="编辑系统参数"
      width="700px"
      @ok="handleSubmit"
    >
      <a-form
        :model="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="系统名称">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="系统版本">
          <a-input v-model:value="form.version" />
        </a-form-item>
        <a-form-item label="系统Logo">
          <a-upload
            :file-list="form.logoFiles"
            :before-upload="() => false"
            list-type="picture"
          >
            <a-button>
              <UploadOutlined />
              上传Logo
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="系统Favicon">
          <a-upload
            :file-list="form.faviconFiles"
            :before-upload="() => false"
            list-type="picture"
          >
            <a-button>
              <UploadOutlined />
              上传Favicon
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="版权信息">
          <a-input v-model:value="form.copyright" />
        </a-form-item>
        <a-form-item label="备案号">
          <a-input v-model:value="form.icp" />
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input v-model:value="form.contact" />
        </a-form-item>
        <a-form-item label="系统描述">
          <a-textarea v-model:value="form.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, UploadOutlined } from '@ant-design/icons-vue'

// 系统参数
const systemParams = reactive({
  name: '评审管理系统',
  version: '1.0.0',
  logo: 'https://via.placeholder.com/200x80?text=Logo',
  favicon: 'https://via.placeholder.com/50x50?text=Favicon',
  copyright: '© 2025 评审管理系统 版权所有',
  icp: '京ICP备xxxxxxxx号',
  contact: '400-xxx-xxxx',
  description: '专业的评审管理系统，提供活动管理、专家评审、数据分析等功能',
})

const modalVisible = ref(false)
const form = reactive({
  name: '',
  version: '',
  logoFiles: [] as unknown[],
  faviconFiles: [] as unknown[],
  copyright: '',
  icp: '',
  contact: '',
  description: '',
})

const handleEdit = () => {
  Object.assign(form, systemParams)
  modalVisible.value = true
}

const handleSubmit = () => {
  Object.assign(systemParams, form)
  message.success('系统参数已更新')
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

