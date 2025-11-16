<!-- 评分规则配置 -->
<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <!-- 单项评分标准 -->
      <a-card title="单项评分标准" :bordered="false" class="mb-4">
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="评分方式">
            <a-select v-model:value="form.scoringMethod" placeholder="请选择评分方式">
              <a-select-option value="percentage">百分制 (0-100)</a-select-option>
              <a-select-option value="grade">等级制 (A/B/C/D)</a-select-option>
              <a-select-option value="five">五分制 (1-5)</a-select-option>
              <a-select-option value="ten">十分制 (1-10)</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="分数范围">
            <a-space>
              <a-input-number v-model:value="form.minScore" :min="0" placeholder="最低分" />
              <span>至</span>
              <a-input-number v-model:value="form.maxScore" :min="0" placeholder="最高分" />
            </a-space>
          </a-form-item>

          <a-form-item label="等级描述">
            <a-button type="dashed" block @click="handleConfigGrades">
              <PlusOutlined />
              配置等级描述
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 总分计算方式 -->
      <a-card title="总分计算方式" :bordered="false">
        <a-radio-group v-model:value="form.calculationMethod" class="w-full">
          <a-space direction="vertical" class="w-full">
            <a-radio value="weighted">加权求和（根据权重计算）</a-radio>
            <a-radio value="average">简单平均</a-radio>
            <a-radio value="trimmed">去掉最高分和最低分后平均</a-radio>
            <a-radio value="custom">自定义公式</a-radio>
          </a-space>
        </a-radio-group>

        <a-textarea
          v-if="form.calculationMethod === 'custom'"
          v-model:value="form.customFormula"
          :rows="3"
          placeholder="输入自定义计算公式，例如：(score1 * 0.3 + score2 * 0.7)"
          class="mt-4"
        />
      </a-card>
    </a-col>

    <a-col :span="12">
      <!-- 最终成绩设置 -->
      <a-card title="最终成绩设置" :bordered="false" class="mb-4">
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="成绩范围">
            <a-space>
              <a-input-number v-model:value="form.finalMinScore" :min="0" placeholder="0" />
              <span>至</span>
              <a-input-number v-model:value="form.finalMaxScore" :min="0" placeholder="100" />
            </a-space>
          </a-form-item>

          <a-form-item label="保留小数">
            <a-input-number v-model:value="form.decimalPlaces" :min="0" :max="4" />
            <div class="text-xs text-gray-500 mt-1">建议保留1-2位小数</div>
          </a-form-item>

          <a-form-item label="及格分数">
            <a-input-number v-model:value="form.passScore" :min="0" placeholder="60" />
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 保存按钮 -->
      <a-card :bordered="false">
        <a-space class="w-full justify-end">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSave">
            <SaveOutlined />
            保存规则配置
          </a-button>
        </a-space>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons-vue'

const form = reactive({
  scoringMethod: 'percentage',
  minScore: 0,
  maxScore: 100,
  calculationMethod: 'weighted',
  customFormula: '',
  finalMinScore: 0,
  finalMaxScore: 100,
  decimalPlaces: 2,
  passScore: 60,
})

const handleConfigGrades = () => {
  message.info('打开等级配置弹窗')
}

const handleSave = () => {
  message.success('保存评分规则配置')
}

const handleReset = () => {
  message.info('重置评分规则')
}
</script>

