<!-- 组织新增/编辑组件 -->
<template>
  <a-modal
    :open="visible"
    :title="formData.id ? '编辑组织' : '新增组织'"
    :width="800"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-divider orientation="left">基本信息</a-divider>
      <a-form-item label="组织名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入组织名称" />
      </a-form-item>
      <a-form-item label="组织编码" name="code">
        <a-input v-model:value="formData.code" placeholder="统一社会信用代码或组织编码" />
      </a-form-item>
      <a-form-item label="组织类型" name="type">
        <DictSelect
          v-model="formData.type"
          dict-code="org_type"
          placeholder="请选择组织类型"
        />
      </a-form-item>
      <a-form-item label="组织规模" name="scale">
        <DictSelect
          v-model="formData.scale"
          dict-code="org_scale"
          placeholder="请选择组织规模"
        />
      </a-form-item>
      <a-form-item label="所属行业" name="industry">
        <DictSelect
          v-model="formData.industry"
          dict-code="org_industry"
          placeholder="请选择所属行业"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio value="enabled">启用</a-radio>
          <a-radio value="disabled">禁用</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-divider orientation="left">联系信息</a-divider>
      <a-form-item label="负责人" name="leader">
        <a-input v-model:value="formData.leader" placeholder="请输入负责人姓名" />
      </a-form-item>
      <a-form-item label="负责人电话" name="leaderPhone">
        <a-input v-model:value="formData.leaderPhone" placeholder="请输入负责人电话" />
      </a-form-item>
      <a-form-item label="联系邮箱" name="email">
        <a-input v-model:value="formData.email" placeholder="请输入联系邮箱" />
      </a-form-item>
      <a-form-item label="联系电话" name="phone">
        <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
      </a-form-item>
      <a-form-item label="地区" name="region">
        <RegionCascaderForm
          v-model:province="formData.province"
          v-model:city="formData.city"
          v-model:district="formData.district"
          placeholder="请选择省/市/区"
        />
      </a-form-item>
      <a-form-item label="详细地址" name="address">
        <a-textarea v-model:value="formData.address" placeholder="请输入详细地址" :rows="2" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入组织描述"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { organizationApi, type Organization, type OrganizationFormDTO } from '@/api/organization'
import RegionCascaderForm from '@/components/common/RegionCascaderForm.vue'
import DictSelect from '@/components/common/DictSelect.vue'

interface Props {
  visible: boolean
  organization?: Organization | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<OrganizationFormDTO>({
  name: '',
  code: '',
  type: '',
  leader: '',
  leaderPhone: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  scale: undefined,
  industry: undefined,
  description: '',
  status: 'enabled',
})

const formRules = {
  name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    type: '',
    leader: '',
    leaderPhone: '',
    email: '',
    phone: '',
    province: undefined,
    city: undefined,
    district: undefined,
    address: '',
    scale: undefined,
    industry: undefined,
    description: '',
    status: 'enabled',
  })
  formRef.value?.clearValidate()
}

// 监听组织数据变化，填充表单
watch(
  () => props.organization,
  (org) => {
    if (org) {
      // 编辑模式
      Object.assign(formData, {
        id: org.id,
        name: org.name,
        code: org.code,
        type: org.dictType || org.type,
        leader: org.leader,
        leaderPhone: org.leaderPhone,
        email: org.email,
        phone: org.phone,
        province: org.province,
        city: org.city,
        district: org.district,
        address: org.address,
        scale: org.dictScale || org.scale,
        industry: org.dictIndustry || org.industry,
        description: org.description,
        status: org.status,
      })
    } else {
      // 新增模式
      resetForm()
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const api = formData.id
      ? organizationApi.updateOrganization
      : organizationApi.createOrganization

    const response = await api(formData)

    if (response.code === 200) {
      message.success(formData.id ? '更新成功' : '创建成功')
      emit('success')
      handleClose()
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  formRef.value?.resetFields()
}
</script>

