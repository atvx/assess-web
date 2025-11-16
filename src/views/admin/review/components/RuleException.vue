<!-- 异常处理规则 -->
<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="12">
        <!-- 分数异常预警 -->
        <a-card title="分数异常预警" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="启用分数预警">
              <a-switch v-model:checked="form.scoreAlert" />
            </a-form-item>
            <a-form-item label="分差预警阈值">
              <a-input-number
                v-model:value="form.scoreDiffThreshold"
                :min="0"
                :disabled="!form.scoreAlert"
              />
              <div class="text-xs text-gray-500 mt-1">
                同一作品不同评审人分数差异超过此值时预警
              </div>
            </a-form-item>
            <a-form-item label="处理方式">
              <a-select
                v-model:value="form.scoreAlertAction"
                :disabled="!form.scoreAlert"
                placeholder="选择处理方式"
              >
                <a-select-option value="notify">仅提示</a-select-option>
                <a-select-option value="confirm">需人工确认</a-select-option>
                <a-select-option value="reject">自动驳回</a-select-option>
                <a-select-option value="reassign">重新分配评审</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 雷同评审提示 -->
        <a-card title="雷同评审检测" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="启用雷同检测">
              <a-switch v-model:checked="form.duplicateCheck" />
            </a-form-item>
            <a-form-item label="评分相似度阈值">
              <a-slider
                v-model:value="form.scoreSimilarity"
                :min="0"
                :max="100"
                :disabled="!form.duplicateCheck"
                :marks="{ 0: '0%', 50: '50%', 80: '80%', 100: '100%' }"
              />
            </a-form-item>
            <a-form-item label="文案相似度阈值">
              <a-slider
                v-model:value="form.textSimilarity"
                :min="0"
                :max="100"
                :disabled="!form.duplicateCheck"
                :marks="{ 0: '0%', 50: '50%', 80: '80%', 100: '100%' }"
              />
            </a-form-item>
            <a-form-item label="检测后处理">
              <a-checkbox-group
                v-model:value="form.duplicateActions"
                :disabled="!form.duplicateCheck"
              >
                <a-space direction="vertical">
                  <a-checkbox value="notify">发送预警通知</a-checkbox>
                  <a-checkbox value="mark">标记异常记录</a-checkbox>
                  <a-checkbox value="review">提交人工复核</a-checkbox>
                </a-space>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="12">
        <!-- 自动预警配置 -->
        <a-card title="自动预警配置" :bordered="false" class="mb-4">
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="缺评预警">
              <a-switch v-model:checked="form.missingAlert" />
              <div class="text-xs text-gray-500 mt-1">
                评审人长时间未完成评审时发送提醒
              </div>
            </a-form-item>
            <a-form-item label="截止预警">
              <a-switch v-model:checked="form.deadlineAlert" />
              <div class="text-xs text-gray-500 mt-1">
                评审时间即将截止时发送提醒
              </div>
            </a-form-item>
            <a-form-item label="结果异常预警">
              <a-switch v-model:checked="form.resultAlert" />
              <div class="text-xs text-gray-500 mt-1">
                某作品评审结果明显异常时发送预警
              </div>
            </a-form-item>
            <a-form-item label="预警接收人">
              <a-select
                v-model:value="form.alertReceivers"
                mode="multiple"
                placeholder="选择预警通知接收人"
              >
                <a-select-option value="admin">系统管理员</a-select-option>
                <a-select-option value="organizer">活动组织者</a-select-option>
                <a-select-option value="supervisor">评审监督员</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 异常记录查询 -->
        <a-card title="异常记录查询" :bordered="false">
          <div class="space-y-3">
            <a-button block @click="handleView('score')">
              <WarningOutlined />
              查看分数异常记录
            </a-button>
            <a-button block @click="handleView('duplicate')">
              <CopyOutlined />
              查看雷同评审记录
            </a-button>
            <a-button block @click="handleView('missing')">
              <ClockCircleOutlined />
              查看缺评记录
            </a-button>
            <a-button block @click="handleView('all')">
              <UnorderedListOutlined />
              查看所有异常记录
            </a-button>
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
          保存异常规则
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'

const form = reactive({
  scoreAlert: true,
  scoreDiffThreshold: 20,
  scoreAlertAction: 'confirm',
  duplicateCheck: true,
  scoreSimilarity: 80,
  textSimilarity: 80,
  duplicateActions: ['notify', 'mark'],
  missingAlert: true,
  deadlineAlert: true,
  resultAlert: true,
  alertReceivers: ['admin', 'organizer'],
})

const handleView = (type: string) => {
  message.info(`查看异常记录：${type}`)
}

const handleSave = () => {
  message.success('保存异常处理规则')
}

const handleReset = () => {
  message.info('重置异常处理规则')
}
</script>

