<template>
  <div class="review-create-page">
    <a-card title="创建评审" :bordered="false">
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="评审标题" required>
          <a-input v-model:value="formState.title" placeholder="请输入评审标题" />
        </a-form-item>

        <a-form-item label="评审类型">
          <a-select v-model:value="formState.type" placeholder="请选择评审类型">
            <a-select-option value="code">代码评审</a-select-option>
            <a-select-option value="design">设计评审</a-select-option>
            <a-select-option value="product">产品评审</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评审描述">
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入评审描述"
            :rows="4"
          />
        </a-form-item>

        <a-form-item label="评审人员">
          <a-select
            v-model:value="formState.reviewers"
            mode="multiple"
            placeholder="请选择评审人员"
          >
            <a-select-option value="user1">张三</a-select-option>
            <a-select-option value="user2">李四</a-select-option>
            <a-select-option value="user3">王五</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="截止时间">
          <a-date-picker v-model:value="formState.deadline" style="width: 100%" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-space>
            <a-button type="primary" @click="handleSubmit">创建</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()

const formState = reactive({
  title: '',
  type: undefined,
  description: '',
  reviewers: [],
  deadline: null,
})

const handleSubmit = () => {
  // TODO: 实现创建逻辑
  message.success('创建成功')
  router.push('/admin/review/list')
}

const handleCancel = () => {
  router.back()
}
</script>
