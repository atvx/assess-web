<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile-page">
    <a-row :gutter="24">
      <!-- 左侧导航 -->
      <a-col :xs="24" :lg="6">
        <a-card :bordered="false" class="rounded-lg shadow mb-6">
          <!-- 用户头像和基本信息 -->
          <div class="text-center mb-6">
            <a-avatar :size="80" :src="userInfo.avatar" class="mb-3">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ userInfo.realName || userInfo.username }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              @{{ userInfo.username }}
            </div>
            <a-tag v-if="userInfo.isAdmin" color="blue" class="mt-2">管理员</a-tag>
          </div>

          <!-- 导航菜单 -->
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            :style="{ border: 'none' }"
          >
            <a-menu-item key="info" @click="activeTab = 'info'">
              <template #icon>
                <IdcardOutlined />
              </template>
              个人信息
            </a-menu-item>
            <a-menu-item key="security" @click="activeTab = 'security'">
              <template #icon>
                <SafetyOutlined />
              </template>
              账户安全
            </a-menu-item>
            <a-menu-item key="notification" @click="activeTab = 'notification'">
              <template #icon>
                <BellOutlined />
              </template>
              通知偏好
            </a-menu-item>
            <a-menu-item key="stats" @click="activeTab = 'stats'">
              <template #icon>
                <BarChartOutlined />
              </template>
              我的统计
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>

      <!-- 右侧内容 -->
      <a-col :xs="24" :lg="18">
        <!-- 个人信息 -->
        <a-card v-show="activeTab === 'info'" :bordered="false" class="rounded-lg shadow mb-6">
          <template #title>
            <span class="text-lg font-semibold">个人信息</span>
          </template>

          <a-form
            ref="infoFormRef"
            :model="userInfo"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <!-- 头像上传 -->
            <a-form-item label="头像">
              <div class="flex items-center">
                <a-avatar :size="80" :src="userInfo.avatar">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <a-upload
                  :show-upload-list="false"
                  :before-upload="handleAvatarUpload"
                  accept="image/*"
                  class="ml-4"
                >
                  <a-button>
                    <template #icon>
                      <UploadOutlined />
                    </template>
                    更换头像
                  </a-button>
                </a-upload>
              </div>
              <div class="text-xs text-gray-500 mt-2">
                支持 JPG、PNG 格式，文件大小不超过 2MB
              </div>
            </a-form-item>

            <!-- 用户名 -->
            <a-form-item label="用户名">
              <a-input v-model:value="userInfo.username" disabled />
              <div class="text-xs text-gray-500 mt-1">用户名不可修改</div>
            </a-form-item>

            <!-- 真实姓名 -->
            <a-form-item label="真实姓名" name="realName">
              <a-input v-model:value="userInfo.realName" placeholder="请输入真实姓名" />
            </a-form-item>

            <!-- 邮箱 -->
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="userInfo.email" placeholder="请输入邮箱" />
            </a-form-item>

            <!-- 手机号 -->
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="userInfo.phone" placeholder="请输入手机号" />
            </a-form-item>

            <!-- 个人简介 -->
            <a-form-item label="个人简介" name="bio">
              <a-textarea
                v-model:value="userInfo.bio"
                placeholder="介绍一下自己吧..."
                :rows="4"
                :maxlength="200"
                show-count
              />
            </a-form-item>

            <!-- 操作按钮 -->
            <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
              <a-space>
                <a-button type="primary" :loading="savingInfo" @click="handleSaveInfo">
                  保存修改
                </a-button>
                <a-button @click="handleResetInfo">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 账户安全 -->
        <a-card v-show="activeTab === 'security'" :bordered="false" class="rounded-lg shadow mb-6">
          <template #title>
            <span class="text-lg font-semibold">账户安全</span>
          </template>

          <!-- 密码修改 -->
          <div class="mb-8">
            <h3 class="text-base font-semibold mb-4 flex items-center">
              <KeyOutlined class="mr-2" />
              密码修改
            </h3>
            <a-form
              ref="passwordFormRef"
              :model="passwordForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-form-item label="当前密码" name="oldPassword">
                <a-input-password
                  v-model:value="passwordForm.oldPassword"
                  placeholder="请输入当前密码"
                />
              </a-form-item>
              <a-form-item label="新密码" name="newPassword">
                <a-input-password
                  v-model:value="passwordForm.newPassword"
                  placeholder="请输入新密码（6-20位）"
                />
              </a-form-item>
              <a-form-item label="确认密码" name="confirmPassword">
                <a-input-password
                  v-model:value="passwordForm.confirmPassword"
                  placeholder="请再次输入新密码"
                />
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
                <a-button type="primary" :loading="changingPassword" @click="handleChangePassword">
                  修改密码
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <a-divider />

          <!-- 账号绑定 -->
          <div class="mb-8">
            <h3 class="text-base font-semibold mb-4 flex items-center">
              <LinkOutlined class="mr-2" />
              账号绑定
            </h3>
            <a-list :data-source="bindings">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :style="{ backgroundColor: item.color }">
                        <template #icon>
                          <component :is="item.icon" />
                        </template>
                      </a-avatar>
                    </template>
                    <template #title>
                      {{ item.name }}
                    </template>
                    <template #description>
                      <span v-if="item.bound" class="text-green-600">
                        已绑定：{{ item.account }}
                      </span>
                      <span v-else class="text-gray-500">未绑定</span>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button v-if="!item.bound" type="link" size="small">
                      绑定
                    </a-button>
                    <a-button v-else type="link" danger size="small">
                      解绑
                    </a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <a-divider />

          <!-- 登录设备管理 -->
          <div>
            <h3 class="text-base font-semibold mb-4 flex items-center">
              <LaptopOutlined class="mr-2" />
              登录设备管理
            </h3>
            <a-list :data-source="devices">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :style="{ backgroundColor: item.current ? '#1890ff' : '#8c8c8c' }">
                        <template #icon>
                          <component :is="item.icon" />
                        </template>
                      </a-avatar>
                    </template>
                    <template #title>
                      {{ item.device }}
                      <a-tag v-if="item.current" color="blue" size="small" class="ml-2">
                        当前设备
                      </a-tag>
                    </template>
                    <template #description>
                      <div class="text-sm">
                        <div>{{ item.browser }} • {{ item.os }}</div>
                        <div class="text-gray-500">
                          {{ item.location }} • {{ item.ip }} • {{ item.time }}
                        </div>
                      </div>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button v-if="!item.current" type="link" danger size="small">
                      移除
                    </a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-card>

        <!-- 通知偏好 -->
        <a-card v-show="activeTab === 'notification'" :bordered="false" class="rounded-lg shadow mb-6">
          <template #title>
            <span class="text-lg font-semibold">通知偏好</span>
          </template>

          <!-- 消息订阅设置 -->
          <div class="mb-8">
            <h3 class="text-base font-semibold mb-4">消息订阅设置</h3>
            <a-list :data-source="subscriptions">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <div class="flex items-center justify-between">
                        <span>{{ item.name }}</span>
                        <a-switch v-model:checked="item.enabled" />
                      </div>
                    </template>
                    <template #description>
                      {{ item.description }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <a-divider />

          <!-- 通知方式设置 -->
          <div>
            <h3 class="text-base font-semibold mb-4">通知方式设置</h3>
            <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
              <a-form-item label="站内通知">
                <a-checkbox-group v-model:value="notificationMethods.site">
                  <a-checkbox value="task">任务提醒</a-checkbox>
                  <a-checkbox value="review">评审通知</a-checkbox>
                  <a-checkbox value="system">系统公告</a-checkbox>
                  <a-checkbox value="activity">活动消息</a-checkbox>
                </a-checkbox-group>
              </a-form-item>

              <a-form-item label="邮件通知">
                <a-checkbox-group v-model:value="notificationMethods.email">
                  <a-checkbox value="task">任务提醒</a-checkbox>
                  <a-checkbox value="review">评审通知</a-checkbox>
                  <a-checkbox value="system">系统公告</a-checkbox>
                </a-checkbox-group>
                <div class="text-xs text-gray-500 mt-2">
                  邮件将发送至：{{ userInfo.email || '未设置邮箱' }}
                </div>
              </a-form-item>

              <a-form-item label="短信通知">
                <a-checkbox-group v-model:value="notificationMethods.sms">
                  <a-checkbox value="task">紧急任务</a-checkbox>
                  <a-checkbox value="security">安全提醒</a-checkbox>
                </a-checkbox-group>
                <div class="text-xs text-gray-500 mt-2">
                  短信将发送至：{{ userInfo.phone || '未设置手机号' }}
                </div>
              </a-form-item>

              <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
                <a-button type="primary" :loading="savingNotification" @click="handleSaveNotification">
                  保存设置
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-card>

        <!-- 我的统计 -->
        <a-card v-show="activeTab === 'stats'" :bordered="false" class="rounded-lg shadow mb-6">
          <template #title>
            <span class="text-lg font-semibold">我的统计</span>
          </template>

          <a-row :gutter="[16, 16]" class="mb-6">
            <a-col :xs="24" :sm="12" :lg="6">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div class="text-3xl font-bold mb-2 text-blue-600">{{ stats.activities }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">参与活动</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div class="text-3xl font-bold mb-2 text-green-600">{{ stats.reviews }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">完成评审</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div class="text-3xl font-bold mb-2 text-orange-600">{{ stats.tasks }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">待办任务</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :lg="6">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div class="text-3xl font-bold mb-2 text-purple-600">{{ stats.messages }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">未读消息</div>
              </div>
            </a-col>
          </a-row>

          <!-- 最近活动记录 -->
          <h3 class="text-base font-semibold mb-4">最近活动记录</h3>
          <a-timeline>
            <a-timeline-item
              v-for="log in activityLogs"
              :key="log.id"
              :color="log.color"
            >
              <template #dot>
                <component :is="log.icon" />
              </template>
              <div class="text-sm">
                <div class="font-medium text-gray-900 dark:text-white">{{ log.action }}</div>
                <div class="text-gray-500 text-xs mt-1">{{ log.time }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { changePassword, type ChangePasswordRequest } from '@/api/auth'
import {
  UserOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BellOutlined,
  BarChartOutlined,
  KeyOutlined,
  LinkOutlined,
  LaptopOutlined,
  UploadOutlined,
  WechatOutlined,
  AlipayOutlined,
  QqOutlined,
  MobileOutlined,
  DesktopOutlined,
  CheckCircleOutlined,
  EditOutlined,
  LoginOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

// 当前选中的标签
const activeTab = ref('info')
const selectedKeys = ref(['info'])

// 用户信息
const userInfo = reactive({
  username: userStore.username || 'admin',
  realName: userStore.realName || '系统管理员',
  email: 'admin@example.com',
  phone: '138****8888',
  avatar: '',
  bio: '这个人很懒，什么都没有留下...',
  isAdmin: userStore.isAdmin || true,
})

// 表单引用
const infoFormRef = ref()
const passwordFormRef = ref()

// 保存状态
const savingInfo = ref(false)
const changingPassword = ref(false)
const savingNotification = ref(false)

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 账号绑定
const bindings = ref([
  {
    id: 1,
    name: '微信',
    icon: WechatOutlined,
    color: '#07c160',
    bound: false,
    account: '',
  },
  {
    id: 2,
    name: '支付宝',
    icon: AlipayOutlined,
    color: '#1677ff',
    bound: false,
    account: '',
  },
  {
    id: 3,
    name: 'QQ',
    icon: QqOutlined,
    color: '#12b7f5',
    bound: false,
    account: '',
  },
])

// 登录设备
const devices = ref([
  {
    id: 1,
    device: 'MacBook Pro',
    browser: 'Chrome 120',
    os: 'macOS 14.0',
    location: '北京市',
    ip: '192.168.1.100',
    time: '刚刚',
    current: true,
    icon: DesktopOutlined,
  },
  {
    id: 2,
    device: 'iPhone 15 Pro',
    browser: 'Safari',
    os: 'iOS 17',
    location: '上海市',
    ip: '192.168.1.101',
    time: '2小时前',
    current: false,
    icon: MobileOutlined,
  },
])

// 消息订阅
const subscriptions = ref([
  {
    id: 1,
    name: '评审任务通知',
    description: '有新的评审任务分配时接收通知',
    enabled: true,
  },
  {
    id: 2,
    name: '活动报名通知',
    description: '有新的活动报名时接收通知',
    enabled: true,
  },
  {
    id: 3,
    name: '系统公告',
    description: '接收系统重要公告和维护通知',
    enabled: true,
  },
  {
    id: 4,
    name: '评审进度提醒',
    description: '评审进度更新时接收提醒',
    enabled: false,
  },
  {
    id: 5,
    name: '周报汇总',
    description: '每周接收工作数据汇总报告',
    enabled: false,
  },
])

// 通知方式
const notificationMethods = reactive({
  site: ['task', 'review', 'system', 'activity'],
  email: ['task', 'review'],
  sms: ['security'],
})

// 统计数据
const stats = reactive({
  activities: 12,
  reviews: 45,
  tasks: 8,
  messages: 15,
})

// 活动日志
const activityLogs = ref([
  {
    id: 1,
    action: '完成了评审任务《2024年度创新大赛初审》',
    time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    icon: CheckCircleOutlined,
    color: 'green',
  },
  {
    id: 2,
    action: '修改了个人信息',
    time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'),
    icon: EditOutlined,
    color: 'blue',
  },
  {
    id: 3,
    action: '登录系统',
    time: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
    icon: LoginOutlined,
    color: 'gray',
  },
  {
    id: 4,
    action: '完成了评审任务《科技创新项目评审》',
    time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    icon: CheckCircleOutlined,
    color: 'green',
  },
  {
    id: 5,
    action: '登录系统',
    time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    icon: LoginOutlined,
    color: 'gray',
  },
])

// 头像上传
const handleAvatarUpload = (file: File) => {
  // 验证文件大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }

  // 验证文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  // 这里应该上传到服务器，现在只是演示
  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target?.result as string
    message.success('头像上传成功')
  }
  reader.readAsDataURL(file)

  return false
}

// 保存个人信息
const handleSaveInfo = async () => {
  try {
    savingInfo.value = true
    // 这里应该调用API保存
    await new Promise((resolve) => setTimeout(resolve, 1000))
    message.success('保存成功')
  } catch {
    message.error('保存失败')
  } finally {
    savingInfo.value = false
  }
}

// 重置个人信息
const handleResetInfo = () => {
  // 重置为原始数据
  message.info('已重置')
}

// 修改密码
const handleChangePassword = async () => {
  try {
    // 表单验证
    if (!passwordForm.oldPassword) {
      message.error('请输入当前密码')
      return
    }
    if (!passwordForm.newPassword) {
      message.error('请输入新密码')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    if (passwordForm.newPassword.length < 6 || passwordForm.newPassword.length > 20) {
      message.error('密码长度应在6-20位之间')
      return
    }
    if (passwordForm.oldPassword === passwordForm.newPassword) {
      message.error('新密码不能与旧密码相同')
      return
    }

    // 检查用户ID
    if (!userStore.userInfo?.id) {
      message.error('无法获取用户信息，请重新登录')
      return
    }

    changingPassword.value = true

    // 调用API修改密码
    const requestData: ChangePasswordRequest = {
      userId: userStore.userInfo.id,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    }

    const response = await changePassword(requestData)

    if (response.code === 200) {
      message.success('密码修改成功，请重新登录')

      // 清空表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''

      // 延迟后退出登录并跳转到登录页
      setTimeout(async () => {
        await userStore.logout()
        router.replace({
          path: '/login',
          query: { redirect: '/admin/profile' }
        })
      }, 1500)
    } else {
      message.error(response.message || '密码修改失败')
    }
  } catch (error: unknown) {
    console.error('修改密码失败:', error)
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const errorMsg = err.response?.data?.message || err.message || '密码修改失败，请检查旧密码是否正确'
    message.error(errorMsg)
  } finally {
    changingPassword.value = false
  }
}

// 保存通知设置
const handleSaveNotification = async () => {
  try {
    savingNotification.value = true
    // 这里应该调用API保存
    await new Promise((resolve) => setTimeout(resolve, 1000))
    message.success('设置保存成功')
  } catch {
    message.error('保存失败')
  } finally {
    savingNotification.value = false
  }
}
</script>

<style scoped>
:deep(.ant-menu-inline .ant-menu-item) {
  margin: 4px 0;
  border-radius: 8px;
}

:deep(.ant-list-item) {
  padding: 16px 0;
}
</style>

