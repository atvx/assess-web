<!-- 评审流程配置 -->
<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="12">
        <!-- 流程环节设置 -->
        <a-card title="流程环节设置" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="流程类型">
              <a-select v-model:value="form.type" placeholder="请选择流程类型">
                <a-select-option value="single">单轮评审</a-select-option>
                <a-select-option value="double">初复审（两轮）</a-select-option>
                <a-select-option value="triple">初复终审（三轮）</a-select-option>
                <a-select-option value="custom">自定义流程</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="并行评审">
              <a-switch v-model:checked="form.parallel" />
              <div class="text-xs text-gray-500 mt-1">
                开启后，同一环节内多位评审专家可同时进行评审
              </div>
            </a-form-item>

            <a-form-item v-if="form.type === 'custom'" label="自定义环节">
              <a-button type="dashed" block @click="handleConfigStages">
                <PlusOutlined />
                配置评审环节
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 环节列表 -->
          <a-list
            v-if="stages.length > 0"
            :data-source="stages"
            size="small"
            class="mt-4"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" size="small" @click="handleEditStage(item)">
                    编辑
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ index + 1 }}. {{ item.name }}
                  </template>
                  <template #description>
                    至少 {{ item.minReviewers }} 位评审人 | 时限: {{ item.timeLimit }}天
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- 流程推进规则 -->
        <a-card title="流程推进规则" :bordered="false">
          <a-radio-group v-model:value="form.progressMode" class="w-full">
            <a-space direction="vertical" class="w-full">
              <a-radio value="auto">前一环节完成后自动推进</a-radio>
              <a-radio value="manual">手动确认推进</a-radio>
              <a-radio value="condition">满足条件后推进</a-radio>
            </a-space>
          </a-radio-group>

          <a-textarea
            v-if="form.progressMode === 'condition'"
            v-model:value="form.progressCondition"
            :rows="3"
            placeholder="输入推进条件，例如：评审完成率 >= 80%"
            class="mt-4"
          />
        </a-card>
      </a-col>

      <a-col :span="12">
        <!-- 评审人数配置 -->
        <a-card title="评审人数要求" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="初审最少人数">
              <a-input-number v-model:value="form.preliminaryMin" :min="1" />
            </a-form-item>
            <a-form-item label="复审最少人数">
              <a-input-number v-model:value="form.reauditMin" :min="1" />
            </a-form-item>
            <a-form-item label="终审最少人数">
              <a-input-number v-model:value="form.finalMin" :min="1" />
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 时间限制 -->
        <a-card title="评审时间限制" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="允许延期">
              <a-switch v-model:checked="form.allowDelay" />
            </a-form-item>
            <a-form-item label="超时提醒">
              <a-select
                v-model:value="form.timeoutAlert"
                mode="multiple"
                placeholder="选择提醒时间点"
              >
                <a-select-option value="1day">截止前1天</a-select-option>
                <a-select-option value="3days">截止前3天</a-select-option>
                <a-select-option value="1week">截止前1周</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 流程示意图 -->
        <a-card title="流程示意图" :bordered="false">
          <div class="workflow-diagram p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <a-steps direction="vertical" :current="1">
              <a-step
                v-for="(stage, index) in stages"
                :key="index"
                :title="stage.name"
                :description="`${stage.minReviewers}位评审人 | ${stage.timeLimit}天`"
              />
            </a-steps>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 保存按钮 -->
    <a-card :bordered="false" class="mt-4">
      <a-space class="w-full justify-end">
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="handleSave">
          <SaveOutlined />
          保存流程配置
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons-vue'

const form = reactive({
  type: 'double',
  parallel: true,
  progressMode: 'auto',
  progressCondition: '',
  preliminaryMin: 3,
  reauditMin: 2,
  finalMin: 1,
  allowDelay: false,
  timeoutAlert: ['1day', '3days'],
})

const stages = ref([
  { id: '1', name: '初审', minReviewers: 3, timeLimit: 7 },
  { id: '2', name: '复审', minReviewers: 2, timeLimit: 5 },
])

const handleConfigStages = () => {
  message.info('打开环节配置弹窗')
}

const handleEditStage = (stage: unknown) => {
  message.info('编辑环节：' + JSON.stringify(stage))
}

const handleSave = () => {
  message.success('保存流程配置')
}

const handleReset = () => {
  message.info('重置流程配置')
}
</script>

<style scoped>
.workflow-diagram :deep(.ant-steps-item-description) {
  font-size: 12px;
  color: #8c8c8c;
}
</style>

