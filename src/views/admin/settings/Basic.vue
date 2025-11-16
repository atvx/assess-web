<template>
  <div class="settings-basic-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">基础配置</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        管理系统基础设置、消息配置和第三方集成
      </p>
    </div>

    <!-- 标签页 -->
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeTab" type="card" size="large">
        <!-- 基础设置 -->
        <a-tab-pane key="basic" tab="基础设置">
          <a-collapse v-model:activeKey="basicActiveKeys" :bordered="false">
            <!-- 系统参数 -->
            <a-collapse-panel key="params" header="系统参数">
              <template #extra>
                <a-button type="link" size="small" @click.stop="handleEditParams">
                  <EditOutlined />
                  编辑
                </a-button>
              </template>

              <a-descriptions bordered :column="2">
                <a-descriptions-item label="系统名称">
                  {{ systemParams.name }}
                </a-descriptions-item>
                <a-descriptions-item label="系统版本">
                  {{ systemParams.version }}
                </a-descriptions-item>
                <a-descriptions-item label="系统Logo">
                  <a-image :src="systemParams.logo" :width="100" />
                </a-descriptions-item>
                <a-descriptions-item label="系统Favicon">
                  <a-image :src="systemParams.favicon" :width="50" />
                </a-descriptions-item>
                <a-descriptions-item label="版权信息" :span="2">
                  {{ systemParams.copyright }}
                </a-descriptions-item>
                <a-descriptions-item label="备案号">
                  {{ systemParams.icp }}
                </a-descriptions-item>
                <a-descriptions-item label="联系方式">
                  {{ systemParams.contact }}
                </a-descriptions-item>
                <a-descriptions-item label="系统描述" :span="2">
                  {{ systemParams.description }}
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>

            <!-- 系统公告 -->
            <a-collapse-panel key="announcements" header="系统公告">
              <template #extra>
                <a-button type="primary" size="small" @click.stop="handleAddAnnouncement">
                  <PlusOutlined />
                  新增公告
                </a-button>
              </template>

              <a-list
                :data-source="announcements"
                :pagination="false"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <template #actions>
                      <a-switch
                        :checked="item.status === 'active'"
                        @change="(checked: boolean) => handleToggleAnnouncementStatus(item, checked)"
                        checked-children="显示"
                        un-checked-children="隐藏"
                      />
                      <a-button type="link" size="small" @click="handleEditAnnouncement(item)">
                        <EditOutlined />
                        编辑
                      </a-button>
                      <a-button type="link" size="small" danger @click="handleDeleteAnnouncement(item)">
                        <DeleteOutlined />
                        删除
                      </a-button>
                    </template>
                    <a-list-item-meta>
                      <template #avatar>
                        <a-avatar :style="{ backgroundColor: getAnnouncementTypeColor(item.type) }">
                          <NotificationOutlined />
                        </a-avatar>
                      </template>
                      <template #title>
                        <a-tag :color="getAnnouncementTypeColor(item.type)" size="small">
                          {{ getAnnouncementTypeLabel(item.type) }}
                        </a-tag>
                        {{ item.title }}
                      </template>
                      <template #description>
                        <div class="space-y-1">
                          <div class="text-sm">{{ item.content }}</div>
                          <div class="text-xs text-gray-400">
                            发布时间: {{ item.publishedAt }} | 发布者: {{ item.publisher }}
                          </div>
                        </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>

            <!-- 文件配置 -->
            <a-collapse-panel key="file" header="文件配置">
              <template #extra>
                <a-button type="link" size="small" @click.stop="handleEditFileConfig">
                  <EditOutlined />
                  编辑
                </a-button>
              </template>

              <a-descriptions bordered :column="2">
                <a-descriptions-item label="上传方式">
                  <a-tag color="blue">{{ fileConfig.uploadType }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="存储位置">
                  {{ fileConfig.storagePath }}
                </a-descriptions-item>
                <a-descriptions-item label="单文件大小限制">
                  {{ fileConfig.maxFileSize }}
                </a-descriptions-item>
                <a-descriptions-item label="允许的文件类型">
                  <a-space wrap>
                    <a-tag v-for="type in fileConfig.allowedTypes" :key="type">
                      {{ type }}
                    </a-tag>
                  </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="图片压缩">
                  <a-tag :color="fileConfig.imageCompression ? 'green' : 'default'">
                    {{ fileConfig.imageCompression ? '开启' : '关闭' }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="压缩质量">
                  {{ fileConfig.compressionQuality }}%
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>

        <!-- 消息设置 -->
        <a-tab-pane key="message" tab="消息设置">
          <a-collapse v-model:activeKey="messageActiveKeys" :bordered="false">
            <!-- 消息模板 -->
            <a-collapse-panel key="templates" header="消息模板">
              <template #extra>
                <a-button type="primary" size="small" @click.stop="handleAddMessageTemplate">
                  <PlusOutlined />
                  新增模板
                </a-button>
              </template>

              <a-table
                :columns="messageTemplateColumns"
                :data-source="messageTemplates"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'type'">
                    <a-tag :color="getMessageTypeColor(record.type)">
                      {{ getMessageTypeLabel(record.type) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-switch
                      :checked="record.status === 'active'"
                      @change="(checked: boolean) => handleToggleTemplateStatus(record, checked)"
                      size="small"
                    />
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-space>
                      <a-button type="link" size="small" @click="handleEditMessageTemplate(record)">
                        <EditOutlined />
                        编辑
                      </a-button>
                      <a-button type="link" size="small" @click="handlePreviewTemplate(record)">
                        <EyeOutlined />
                        预览
                      </a-button>
                      <a-button type="link" size="small" danger @click="handleDeleteMessageTemplate(record)">
                        <DeleteOutlined />
                        删除
                      </a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-collapse-panel>

            <!-- 消息发送记录 -->
            <a-collapse-panel key="records" header="消息发送记录">
              <template #extra>
                <a-space size="small">
                  <a-date-picker placeholder="选择日期" size="small" @click.stop />
                  <a-button size="small" @click.stop="handleExportRecords">
                    <ExportOutlined />
                    导出
                  </a-button>
                </a-space>
              </template>

              <a-table
                :columns="messageRecordColumns"
                :data-source="messageRecords"
                :pagination="messageRecordPagination"
                size="small"
                @change="handleMessageRecordTableChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'type'">
                    <a-tag :color="getMessageTypeColor(record.type)">
                      {{ getMessageTypeLabel(record.type) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="getRecordStatusColor(record.status)">
                      {{ record.status }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="handleViewRecord(record)">
                      <EyeOutlined />
                      详情
                    </a-button>
                  </template>
                </template>
              </a-table>
            </a-collapse-panel>

            <!-- 邮件配置 -->
            <a-collapse-panel key="email" header="邮件配置">
              <template #extra>
                <a-space size="small">
                  <a-button size="small" @click.stop="handleTestEmail">
                    <SendOutlined />
                    测试发送
                  </a-button>
                  <a-button type="link" size="small" @click.stop="handleEditEmailConfig">
                    <EditOutlined />
                    编辑
                  </a-button>
                </a-space>
              </template>

              <a-descriptions bordered :column="2">
                <a-descriptions-item label="SMTP服务器">
                  {{ emailConfig.smtpHost }}
                </a-descriptions-item>
                <a-descriptions-item label="SMTP端口">
                  {{ emailConfig.smtpPort }}
                </a-descriptions-item>
                <a-descriptions-item label="发件人邮箱">
                  {{ emailConfig.fromEmail }}
                </a-descriptions-item>
                <a-descriptions-item label="发件人名称">
                  {{ emailConfig.fromName }}
                </a-descriptions-item>
                <a-descriptions-item label="加密方式">
                  <a-tag>{{ emailConfig.encryption }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="状态">
                  <a-tag :color="emailConfig.enabled ? 'green' : 'default'">
                    {{ emailConfig.enabled ? '已启用' : '未启用' }}
                  </a-tag>
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>

            <!-- 短信配置 -->
            <a-collapse-panel key="sms" header="短信配置">
              <template #extra>
                <a-space size="small">
                  <a-button size="small" @click.stop="handleTestSms">
                    <SendOutlined />
                    测试发送
                  </a-button>
                  <a-button type="link" size="small" @click.stop="handleEditSmsConfig">
                    <EditOutlined />
                    编辑
                  </a-button>
                </a-space>
              </template>

              <a-descriptions bordered :column="2">
                <a-descriptions-item label="服务提供商">
                  <a-tag color="blue">{{ smsConfig.provider }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="AccessKey ID">
                  {{ maskString(smsConfig.accessKeyId) }}
                </a-descriptions-item>
                <a-descriptions-item label="签名">
                  {{ smsConfig.signName }}
                </a-descriptions-item>
                <a-descriptions-item label="状态">
                  <a-tag :color="smsConfig.enabled ? 'green' : 'default'">
                    {{ smsConfig.enabled ? '已启用' : '未启用' }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="剩余条数">
                  <span class="text-lg font-bold text-blue-600">{{ smsConfig.remainingCount }}</span> 条
                </a-descriptions-item>
                <a-descriptions-item label="本月已用">
                  {{ smsConfig.monthlyUsed }} 条
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>

        <!-- 集成配置 -->
        <a-tab-pane key="integration" tab="集成配置">
          <a-collapse v-model:activeKey="integrationActiveKeys" :bordered="false">
            <!-- 第三方应用集成 -->
            <a-collapse-panel key="apps" header="第三方应用集成">
              <template #extra>
                <a-button type="primary" size="small" @click.stop="handleAddIntegration">
                  <PlusOutlined />
                  添加集成
                </a-button>
              </template>

              <a-row :gutter="16">
                <a-col
                  :span="8"
                  v-for="app in integrationApps"
                  :key="app.id"
                  class="mb-4"
                >
                  <a-card size="small" :hoverable="true">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center">
                        <a-avatar :src="app.icon" :size="48" class="mr-3">
                          {{ app.name.substring(0, 1) }}
                        </a-avatar>
                        <div>
                          <div class="font-medium text-base">{{ app.name }}</div>
                          <div class="text-xs text-gray-500 mt-1">{{ app.description }}</div>
                        </div>
                      </div>
                    </div>
                    <a-divider class="my-3" />
                    <div class="flex justify-between items-center">
                      <a-tag :color="app.status === 'active' ? 'green' : 'default'">
                        {{ app.status === 'active' ? '已启用' : '未启用' }}
                      </a-tag>
                      <a-space size="small">
                        <a-button
                          type="link"
                          size="small"
                          @click="handleConfigIntegration(app)"
                        >
                          <SettingOutlined />
                          配置
                        </a-button>
                        <a-switch
                          :checked="app.status === 'active'"
                          @change="(checked: boolean) => handleToggleIntegrationStatus(app, checked)"
                          size="small"
                        />
                      </a-space>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </a-collapse-panel>

            <!-- Webhook配置 -->
            <a-collapse-panel key="webhooks" header="Webhook配置">
              <template #extra>
                <a-button type="primary" size="small" @click.stop="handleAddWebhook">
                  <PlusOutlined />
                  新增Webhook
                </a-button>
              </template>

              <a-table
                :columns="webhookColumns"
                :data-source="webhooks"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'events'">
                    <a-space wrap>
                      <a-tag v-for="event in record.events" :key="event" size="small">
                        {{ event }}
                      </a-tag>
                    </a-space>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-switch
                      :checked="record.status === 'active'"
                      @change="(checked: boolean) => handleToggleWebhookStatus(record, checked)"
                      size="small"
                    />
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-space>
                      <a-button type="link" size="small" @click="handleTestWebhook(record)">
                        <SendOutlined />
                        测试
                      </a-button>
                      <a-button type="link" size="small" @click="handleEditWebhook(record)">
                        <EditOutlined />
                        编辑
                      </a-button>
                      <a-button type="link" size="small" @click="handleViewWebhookLogs(record)">
                        <HistoryOutlined />
                        日志
                      </a-button>
                      <a-button type="link" size="small" danger @click="handleDeleteWebhook(record)">
                        <DeleteOutlined />
                        删除
                      </a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 系统参数编辑弹窗 -->
    <a-modal
      v-model:open="paramsModalVisible"
      title="编辑系统参数"
      width="700px"
      @ok="handleSubmitParams"
    >
      <a-form
        :model="paramsForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="系统名称">
          <a-input v-model:value="paramsForm.name" />
        </a-form-item>
        <a-form-item label="系统版本">
          <a-input v-model:value="paramsForm.version" />
        </a-form-item>
        <a-form-item label="系统Logo">
          <a-upload
            :file-list="paramsForm.logoFiles"
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
            :file-list="paramsForm.faviconFiles"
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
          <a-input v-model:value="paramsForm.copyright" />
        </a-form-item>
        <a-form-item label="备案号">
          <a-input v-model:value="paramsForm.icp" />
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input v-model:value="paramsForm.contact" />
        </a-form-item>
        <a-form-item label="系统描述">
          <a-textarea v-model:value="paramsForm.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 公告编辑弹窗 -->
    <a-modal
      v-model:open="announcementModalVisible"
      :title="isEditAnnouncement ? '编辑公告' : '新增公告'"
      width="700px"
      @ok="handleSubmitAnnouncement"
    >
      <a-form
        :model="announcementForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item label="公告类型">
          <a-select v-model:value="announcementForm.type">
            <a-select-option value="info">通知</a-select-option>
            <a-select-option value="warning">警告</a-select-option>
            <a-select-option value="important">重要</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公告标题">
          <a-input v-model:value="announcementForm.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item label="公告内容">
          <a-textarea v-model:value="announcementForm.content" :rows="4" placeholder="请输入公告内容" />
        </a-form-item>
        <a-form-item label="发布者">
          <a-input v-model:value="announcementForm.publisher" placeholder="请输入发布者" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="announcementForm.status">
            <a-radio value="active">显示</a-radio>
            <a-radio value="inactive">隐藏</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 文件配置编辑弹窗 -->
    <a-modal
      v-model:open="fileConfigModalVisible"
      title="编辑文件配置"
      width="700px"
      @ok="handleSubmitFileConfig"
    >
      <a-form
        :model="fileConfigForm"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-item label="上传方式">
          <a-select v-model:value="fileConfigForm.uploadType">
            <a-select-option value="本地存储">本地存储</a-select-option>
            <a-select-option value="OSS">OSS</a-select-option>
            <a-select-option value="云存储">云存储</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="存储位置">
          <a-input v-model:value="fileConfigForm.storagePath" />
        </a-form-item>
        <a-form-item label="单文件大小限制">
          <a-input v-model:value="fileConfigForm.maxFileSize" placeholder="例如: 50MB" />
        </a-form-item>
        <a-form-item label="允许的文件类型">
          <a-select
            v-model:value="fileConfigForm.allowedTypes"
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
          <a-switch v-model:checked="fileConfigForm.imageCompression" />
        </a-form-item>
        <a-form-item label="压缩质量">
          <a-slider v-model:value="fileConfigForm.compressionQuality" :min="0" :max="100" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 其他弹窗省略，实际使用时需要补充 -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  NotificationOutlined,
  EyeOutlined,
  ExportOutlined,
  SendOutlined,
  SettingOutlined,
  UploadOutlined,
  HistoryOutlined,
} from '@ant-design/icons-vue'

// 当前标签页
const activeTab = ref('basic')

// 基础设置折叠面板
const basicActiveKeys = ref(['params', 'announcements', 'file'])

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

// 系统参数编辑
const paramsModalVisible = ref(false)
const paramsForm = reactive({
  name: '',
  version: '',
  logoFiles: [] as unknown[],
  faviconFiles: [] as unknown[],
  copyright: '',
  icp: '',
  contact: '',
  description: '',
})

// 系统公告
const announcements = ref([
  {
    id: '1',
    type: 'important',
    title: '系统维护通知',
    content: '本系统将于2025年1月20日凌晨2:00-4:00进行系统维护升级，期间将暂停服务',
    status: 'active',
    publisher: '系统管理员',
    publishedAt: '2025-01-15 10:00',
  },
  {
    id: '2',
    type: 'info',
    title: '新功能上线',
    content: '评审进度实时监控功能已上线，欢迎使用',
    status: 'active',
    publisher: '系统管理员',
    publishedAt: '2025-01-10 14:30',
  },
])

const announcementModalVisible = ref(false)
const isEditAnnouncement = ref(false)
const announcementForm = reactive({
  id: '',
  type: 'info',
  title: '',
  content: '',
  publisher: '',
  status: 'active',
})

// 文件配置
const fileConfig = reactive({
  uploadType: '本地存储',
  storagePath: '/uploads',
  maxFileSize: '50MB',
  allowedTypes: ['.jpg', '.png', '.pdf', '.doc', '.docx', '.zip'],
  imageCompression: true,
  compressionQuality: 80,
})

const fileConfigModalVisible = ref(false)
const fileConfigForm = reactive({
  uploadType: '',
  storagePath: '',
  maxFileSize: '',
  allowedTypes: [] as string[],
  imageCompression: false,
  compressionQuality: 80,
})

// 消息设置折叠面板
const messageActiveKeys = ref(['templates'])

// 消息模板
const messageTemplates = ref([
  {
    id: '1',
    name: '评审邀请',
    type: 'email',
    subject: '您有新的评审任务',
    content: '尊敬的{{name}}专家，您有新的评审任务等待处理...',
    status: 'active',
  },
  {
    id: '2',
    name: '任务提醒',
    type: 'sms',
    subject: '任务即将到期',
    content: '【评审系统】您的评审任务将于{{deadline}}到期，请及时完成',
    status: 'active',
  },
])

const messageTemplateColumns = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '类型', key: 'type', width: 100 },
  { title: '主题/标题', dataIndex: 'subject', key: 'subject', width: 200 },
  { title: '状态', key: 'status', width: 80, align: 'center' as const },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const },
]

// 消息发送记录
const messageRecords = ref([
  {
    id: '1',
    type: 'email',
    receiver: 'expert@example.com',
    subject: '您有新的评审任务',
    status: '成功',
    sentAt: '2025-01-16 10:30',
  },
  {
    id: '2',
    type: 'sms',
    receiver: '138****8888',
    subject: '任务即将到期',
    status: '成功',
    sentAt: '2025-01-16 09:15',
  },
])

const messageRecordColumns = [
  { title: '类型', key: 'type', width: 80 },
  { title: '接收人', dataIndex: 'receiver', key: 'receiver', width: 150 },
  { title: '主题/内容', dataIndex: 'subject', key: 'subject', width: 200 },
  { title: '状态', key: 'status', width: 80 },
  { title: '发送时间', dataIndex: 'sentAt', key: 'sentAt', width: 150 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' as const },
]

const messageRecordPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 邮件配置
const emailConfig = reactive({
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  fromEmail: 'noreply@example.com',
  fromName: '评审系统',
  encryption: 'SSL',
  enabled: true,
})

// 短信配置
const smsConfig = reactive({
  provider: '阿里云',
  accessKeyId: '**********************',
  signName: '评审系统',
  enabled: true,
  remainingCount: 8500,
  monthlyUsed: 1500,
})

// 集成配置折叠面板
const integrationActiveKeys = ref(['apps'])

// 第三方应用集成
const integrationApps = ref([
  {
    id: '1',
    name: '钉钉',
    icon: '',
    description: '接入钉钉，实现消息通知和单点登录',
    status: 'active',
  },
  {
    id: '2',
    name: '企业微信',
    icon: '',
    description: '接入企业微信，实现消息推送',
    status: 'inactive',
  },
  {
    id: '3',
    name: '飞书',
    icon: '',
    description: '接入飞书，实现团队协作',
    status: 'inactive',
  },
])

// Webhook配置
const webhooks = ref([
  {
    id: '1',
    name: '评审完成通知',
    url: 'https://api.example.com/webhook/review-complete',
    events: ['评审完成', '任务结束'],
    status: 'active',
  },
  {
    id: '2',
    name: '参赛者注册通知',
    url: 'https://api.example.com/webhook/participant-register',
    events: ['报名提交', '审核通过'],
    status: 'active',
  },
])

const webhookColumns = [
  { title: 'Webhook名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'URL', dataIndex: 'url', key: 'url', width: 250 },
  { title: '触发事件', key: 'events', width: 200 },
  { title: '状态', key: 'status', width: 80, align: 'center' as const },
  { title: '操作', key: 'action', width: 280, fixed: 'right' as const },
]

// 辅助函数
const getAnnouncementTypeColor = (type: string) => {
  const colors = {
    info: '#1890ff',
    warning: '#faad14',
    important: '#ff4d4f',
  }
  return colors[type as keyof typeof colors] || '#8c8c8c'
}

const getAnnouncementTypeLabel = (type: string) => {
  const labels = {
    info: '通知',
    warning: '警告',
    important: '重要',
  }
  return labels[type as keyof typeof labels] || type
}

const getMessageTypeColor = (type: string) => {
  const colors = {
    email: 'blue',
    sms: 'green',
    notification: 'orange',
  }
  return colors[type as keyof typeof colors] || 'default'
}

const getMessageTypeLabel = (type: string) => {
  const labels = {
    email: '邮件',
    sms: '短信',
    notification: '站内通知',
  }
  return labels[type as keyof typeof labels] || type
}

const getRecordStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '成功': 'green',
    '失败': 'red',
    '发送中': 'blue',
  }
  return colors[status] || 'default'
}

const maskString = (str: string) => {
  if (str.length <= 8) return str
  return str.substring(0, 4) + '********' + str.substring(str.length - 4)
}

// 事件处理 - 系统参数
const handleEditParams = () => {
  Object.assign(paramsForm, systemParams)
  paramsModalVisible.value = true
}

const handleSubmitParams = () => {
  Object.assign(systemParams, paramsForm)
  message.success('系统参数已更新')
  paramsModalVisible.value = false
}

// 事件处理 - 系统公告
const handleAddAnnouncement = () => {
  isEditAnnouncement.value = false
  Object.assign(announcementForm, {
    id: '',
    type: 'info',
    title: '',
    content: '',
    publisher: '系统管理员',
    status: 'active',
  })
  announcementModalVisible.value = true
}

const handleEditAnnouncement = (item: typeof announcements.value[0]) => {
  isEditAnnouncement.value = true
  Object.assign(announcementForm, item)
  announcementModalVisible.value = true
}

const handleSubmitAnnouncement = () => {
  if (isEditAnnouncement.value) {
    const index = announcements.value.findIndex((a) => a.id === announcementForm.id)
    if (index > -1) {
      Object.assign(announcements.value[index], announcementForm)
    }
    message.success('公告已更新')
  } else {
    announcements.value.unshift({
      ...announcementForm,
      id: String(Date.now()),
      publishedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    })
    message.success('公告已发布')
  }
  announcementModalVisible.value = false
}

const handleToggleAnnouncementStatus = (item: typeof announcements.value[0], checked: boolean) => {
  item.status = checked ? 'active' : 'inactive'
  message.success(`公告已${checked ? '显示' : '隐藏'}`)
}

const handleDeleteAnnouncement = (item: typeof announcements.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除公告「${item.title}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = announcements.value.findIndex((a) => a.id === item.id)
      if (index > -1) {
        announcements.value.splice(index, 1)
        message.success('公告已删除')
      }
    },
  })
}

// 事件处理 - 文件配置
const handleEditFileConfig = () => {
  Object.assign(fileConfigForm, fileConfig)
  fileConfigModalVisible.value = true
}

const handleSubmitFileConfig = () => {
  Object.assign(fileConfig, fileConfigForm)
  message.success('文件配置已更新')
  fileConfigModalVisible.value = false
}

// 事件处理 - 消息模板
const handleAddMessageTemplate = () => {
  message.info('新增消息模板功能待实现')
}

const handleEditMessageTemplate = (template: typeof messageTemplates.value[0]) => {
  message.info(`编辑模板: ${template.name}`)
}

const handlePreviewTemplate = (template: typeof messageTemplates.value[0]) => {
  message.info(`预览模板: ${template.name}`)
}

const handleToggleTemplateStatus = (template: typeof messageTemplates.value[0], checked: boolean) => {
  template.status = checked ? 'active' : 'inactive'
  message.success(`模板已${checked ? '启用' : '禁用'}`)
}

const handleDeleteMessageTemplate = (template: typeof messageTemplates.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除模板「${template.name}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      message.success('模板已删除')
    },
  })
}

// 事件处理 - 消息发送记录
const handleMessageRecordTableChange = (pag: typeof messageRecordPagination) => {
  messageRecordPagination.current = pag.current
  messageRecordPagination.pageSize = pag.pageSize
}

const handleExportRecords = () => {
  message.success('导出功能待实现')
}

const handleViewRecord = (record: typeof messageRecords.value[0]) => {
  message.info(`查看记录详情: ${record.id}`)
}

// 事件处理 - 邮件/短信配置
const handleEditEmailConfig = () => {
  message.info('编辑邮件配置功能待实现')
}

const handleTestEmail = () => {
  message.loading('正在发送测试邮件...', 2)
  setTimeout(() => {
    message.success('测试邮件发送成功')
  }, 2000)
}

const handleEditSmsConfig = () => {
  message.info('编辑短信配置功能待实现')
}

const handleTestSms = () => {
  message.loading('正在发送测试短信...', 2)
  setTimeout(() => {
    message.success('测试短信发送成功')
  }, 2000)
}

// 事件处理 - 第三方应用集成
const handleAddIntegration = () => {
  message.info('添加集成功能待实现')
}

const handleConfigIntegration = (app: typeof integrationApps.value[0]) => {
  message.info(`配置: ${app.name}`)
}

const handleToggleIntegrationStatus = (app: typeof integrationApps.value[0], checked: boolean) => {
  app.status = checked ? 'active' : 'inactive'
  message.success(`${app.name}已${checked ? '启用' : '禁用'}`)
}

// 事件处理 - Webhook
const handleAddWebhook = () => {
  message.info('新增Webhook功能待实现')
}

const handleEditWebhook = (webhook: typeof webhooks.value[0]) => {
  message.info(`编辑Webhook: ${webhook.name}`)
}

const handleTestWebhook = (webhook: typeof webhooks.value[0]) => {
  message.loading('正在测试Webhook...', 2)
  setTimeout(() => {
    message.success('Webhook测试成功')
  }, 2000)
}

const handleViewWebhookLogs = (webhook: typeof webhooks.value[0]) => {
  message.info(`查看Webhook日志: ${webhook.name}`)
}

const handleToggleWebhookStatus = (webhook: typeof webhooks.value[0], checked: boolean) => {
  webhook.status = checked ? 'active' : 'inactive'
  message.success(`Webhook已${checked ? '启用' : '禁用'}`)
}

const handleDeleteWebhook = (webhook: typeof webhooks.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除Webhook「${webhook.name}」吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = webhooks.value.findIndex((w) => w.id === webhook.id)
      if (index > -1) {
        webhooks.value.splice(index, 1)
        message.success('Webhook已删除')
      }
    },
  })
}
</script>

<style scoped>
.settings-basic-page {
  padding: 0;
}
</style>
