<!-- 评分说明 -->
<template>
  <a-card :bordered="false">
    <template #title>
      <span class="text-base font-semibold">评分标准说明</span>
    </template>
    <template #extra>
      <a-space>
        <a-button @click="handlePreview">
          <EyeOutlined />
          预览
        </a-button>
        <a-button type="primary" @click="handleSave">
          <SaveOutlined />
          保存并发布
        </a-button>
      </a-space>
    </template>

    <a-tabs v-model:activeKey="activeTab" type="card">
      <a-tab-pane key="standard" tab="评分标准说明">
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          为评审专家提供总体的评分标准和要求说明
        </div>
        <a-textarea
          v-model:value="form.standard"
          :rows="10"
          placeholder="请输入评分标准说明..."
        />
      </a-tab-pane>

      <a-tab-pane key="details" tab="评分细则">
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          为每个评分项提供详细的评分标准和说明
        </div>
        <a-collapse v-model:activeKey="activeDetailKeys" accordion>
          <a-collapse-panel
            v-for="item in scoringItems"
            :key="item.id"
            :header="`${item.name} (${item.maxScore}分)`"
          >
            <a-textarea
              v-model:value="form.details[item.id]"
              :rows="6"
              :placeholder="`请输入「${item.name}」的评分细则...`"
            />
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>

      <a-tab-pane key="tips" tab="常见误区提示">
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          提醒评审专家注意的常见评分误区和注意事项
        </div>
        <a-textarea
          v-model:value="form.tips"
          :rows="10"
          placeholder="请输入常见误区提示..."
        />
      </a-tab-pane>

      <a-tab-pane key="examples" tab="评分示例">
        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
          为评审专家提供典型的评分示例，帮助理解评分标准
        </div>
        <a-button type="dashed" block class="mb-4" @click="handleAddExample">
          <PlusOutlined />
          添加评分示例
        </a-button>
        <a-list :data-source="form.examples" item-layout="vertical">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <template #actions>
                <a-button type="link" size="small" @click="handleRemoveExample(index)">
                  删除
                </a-button>
              </template>
              <a-list-item-meta :title="`示例 ${index + 1}`">
                <template #description>
                  <a-textarea
                    v-model:value="item.content"
                    :rows="4"
                    placeholder="请输入评分示例内容..."
                  />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons-vue'

const activeTab = ref('standard')
const activeDetailKeys = ref<string[]>([])

const scoringItems = ref([
  { id: '1', name: '创新性', maxScore: 100 },
  { id: '2', name: '实用性', maxScore: 100 },
  { id: '3', name: '完整性', maxScore: 100 },
  { id: '4', name: '表现力', maxScore: 100 },
])

const form = reactive({
  standard: '',
  details: {} as Record<string, string>,
  tips: '',
  examples: [] as Array<{ content: string }>,
})

const handlePreview = () => {
  message.info('预览评分说明')
}

const handleSave = () => {
  message.success('保存并发布评分说明')
}

const handleAddExample = () => {
  form.examples.push({ content: '' })
}

const handleRemoveExample = (index: number) => {
  form.examples.splice(index, 1)
}
</script>

