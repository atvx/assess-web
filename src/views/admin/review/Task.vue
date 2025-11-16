<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="review-task-page">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">评审任务管理</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        创建评审任务、分配评审专家、管理评审进度
      </p>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="总任务数"
            :value="taskStats.total"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="进行中"
            :value="taskStats.ongoing"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <SyncOutlined spin />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="待分配"
            :value="taskStats.pending"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="已完成"
            :value="taskStats.completed"
            :value-style="{ color: '#595959' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 搜索筛选区域 -->
    <a-card :bordered="false" class="mb-4">
      <a-form layout="inline" :model="queryParams">
        <a-form-item label="任务名称">
          <a-input
            v-model:value="queryParams.keyword"
            placeholder="请输入任务名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="关联活动">
          <a-select
            v-model:value="queryParams.activityId"
            placeholder="请选择活动"
            allow-clear
            style="width: 200px"
          >
            <a-select-option value="1">2025年度创新设计大赛</a-select-option>
            <a-select-option value="2">优秀项目评审活动</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="评审轮次">
          <a-select
            v-model:value="queryParams.round"
            placeholder="请选择轮次"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="preliminary">初审</a-select-option>
            <a-select-option value="semifinal">复审</a-select-option>
            <a-select-option value="final">终审</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务状态">
          <a-select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="pending">待分配</a-select-option>
            <a-select-option value="assigned">已分配</a-select-option>
            <a-select-option value="ongoing">进行中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 工具栏 -->
    <a-card :bordered="false">
      <div class="flex justify-between items-center mb-4">
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            创建任务
          </a-button>
          <a-button @click="handleBatchAssign" :disabled="selectedRowKeys.length === 0">
            <template #icon><UsergroupAddOutlined /></template>
            批量分配
          </a-button>
          <a-button @click="handleCheckConflict">
            <template #icon><WarningOutlined /></template>
            冲突检查
          </a-button>
        </a-space>
      </div>

      <!-- 任务列表表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys,
          onChange: (keys: (string | number)[]) => { selectedRowKeys = keys as string[] }
        }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 任务信息 -->
          <template v-if="column.key === 'task'">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ record.name }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                活动: {{ record.activityName }}
              </div>
              <div class="text-xs text-gray-500">
                轮次:
                <a-tag :color="getRoundColor(record.round)" size="small">
                  {{ getRoundLabel(record.round) }}
                </a-tag>
              </div>
            </div>
          </template>

          <!-- 分配信息 -->
          <template v-else-if="column.key === 'assignment'">
            <div>
              <div class="text-sm">
                <span class="text-gray-500">策略: </span>
                <a-tag :color="getStrategyColor(record.assignStrategy)">
                  {{ getStrategyLabel(record.assignStrategy) }}
                </a-tag>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                专家数: {{ record.expertCount || 0 }}
              </div>
              <div class="text-xs text-gray-500">
                作品数: {{ record.workCount || 0 }}
              </div>
            </div>
          </template>

          <!-- 评审进度 -->
          <template v-else-if="column.key === 'progress'">
            <div>
              <a-progress
                :percent="record.progress"
                :size="'small'"
                :status="record.progress === 100 ? 'success' : 'active'"
              />
              <div class="text-xs text-gray-500 mt-1 text-center">
                {{ record.completedCount || 0 }} / {{ record.totalCount || 0 }}
              </div>
            </div>
          </template>

          <!-- 时间信息 -->
          <template v-else-if="column.key === 'time'">
            <div class="text-xs">
              <div class="text-gray-500">开始: {{ record.startTime }}</div>
              <div class="text-gray-500 mt-1">截止: {{ record.endTime }}</div>
              <div v-if="record.remainingDays !== undefined" class="mt-1">
                <a-tag :color="record.remainingDays < 3 ? 'red' : 'blue'">
                  剩余 {{ record.remainingDays }} 天
                </a-tag>
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
            <div v-if="record.conflictCount > 0" class="mt-1">
              <a-tag color="red" size="small">
                <WarningOutlined />
                {{ record.conflictCount }} 个冲突
              </a-tag>
            </div>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />
                查看
              </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }: { key: string }) => handleMenuClick(key, record)">
                    <a-menu-item key="assign" v-if="record.status === 'pending'">
                      <UsergroupAddOutlined />
                      分配专家
                    </a-menu-item>
                    <a-menu-item key="reassign" v-if="record.status !== 'pending'">
                      <RedoOutlined />
                      重新分配
                    </a-menu-item>
                    <a-menu-item key="edit">
                      <EditOutlined />
                      编辑任务
                    </a-menu-item>
                    <a-menu-item key="conflict" v-if="record.conflictCount > 0">
                      <WarningOutlined />
                      处理冲突
                    </a-menu-item>
                    <a-menu-item key="export">
                      <ExportOutlined />
                      导出数据
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger>
                      <DeleteOutlined />
                      删除任务
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" size="small">
                  更多
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 任务详情抽屉 -->
    <a-drawer
      v-model:open="detailDrawerVisible"
      :title="`任务详情 - ${currentTask?.name}`"
      width="900"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-tabs v-model:activeKey="detailTab">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="任务名称" :span="2">
              {{ currentTask?.name }}
            </a-descriptions-item>
            <a-descriptions-item label="关联活动" :span="2">
              {{ currentTask?.activityName }}
            </a-descriptions-item>
            <a-descriptions-item label="评审轮次">
              <a-tag :color="getRoundColor(currentTask?.round)">
                {{ getRoundLabel(currentTask?.round) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="任务状态">
              <a-tag :color="getStatusColor(currentTask?.status)">
                {{ getStatusLabel(currentTask?.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="开始时间">
              {{ currentTask?.startTime }}
            </a-descriptions-item>
            <a-descriptions-item label="截止时间">
              {{ currentTask?.endTime }}
            </a-descriptions-item>
            <a-descriptions-item label="分配策略">
              <a-tag :color="getStrategyColor(currentTask?.assignStrategy)">
                {{ getStrategyLabel(currentTask?.assignStrategy) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="每个作品评审人数">
              {{ currentTask?.reviewersPerWork || 0 }} 人
            </a-descriptions-item>
            <a-descriptions-item label="任务描述" :span="2">
              {{ currentTask?.description || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <a-divider>评审进度</a-divider>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-statistic title="待评作品" :value="currentTask?.totalCount || 0" suffix="个" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="已完成" :value="currentTask?.completedCount || 0" suffix="个" />
            </a-col>
            <a-col :span="8">
              <a-statistic
                title="完成率"
                :value="currentTask?.progress || 0"
                suffix="%"
                :value-style="{ color: '#3f8600' }"
              />
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- 分配情况 -->
        <a-tab-pane key="assignment" tab="分配情况">
          <div class="mb-4">
            <a-button type="primary" @click="handleAssignExperts(currentTask)">
              <UsergroupAddOutlined />
              分配专家
            </a-button>
          </div>

          <a-table
            :columns="assignmentColumns"
            :data-source="currentTask?.assignments || []"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'expert'">
                <div class="flex items-center">
                  <a-avatar :src="record.expertAvatar" size="small" class="mr-2">
                    {{ record.expertName.substring(0, 1) }}
                  </a-avatar>
                  <div>
                    <div class="font-medium">{{ record.expertName }}</div>
                    <div class="text-xs text-gray-500">{{ record.expertOrg }}</div>
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'workload'">
                <div>
                  <a-progress
                    :percent="Math.round((record.completedWorks / record.totalWorks) * 100)"
                    :size="'small'"
                  />
                  <div class="text-xs text-gray-500 text-center mt-1">
                    {{ record.completedWorks }} / {{ record.totalWorks }}
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'completed' ? 'green' : 'blue'">
                  {{ record.status === 'completed' ? '已完成' : '进行中' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 冲突处理 -->
        <a-tab-pane key="conflict" tab="冲突处理" v-if="currentTask && currentTask.conflictCount > 0">
          <a-alert
            message="检测到评审冲突"
            :description="`当前任务存在 ${currentTask.conflictCount} 个冲突，需要及时处理`"
            type="warning"
            show-icon
            class="mb-4"
          />

          <a-list
            :data-source="currentTask.conflicts || []"
            bordered
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" size="small" @click="handleResolveConflict(item)">
                    解决
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a-tag color="red">{{ item.type }}</a-tag>
                    {{ item.description }}
                  </template>
                  <template #description>
                    涉及专家: {{ item.expertName }} | 作品: {{ item.workTitle }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <a-space>
          <a-button @click="detailDrawerVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleEdit(currentTask)">
            <EditOutlined />
            编辑任务
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 创建/编辑任务弹窗 -->
    <a-modal
      v-model:open="taskModalVisible"
      :title="isEdit ? '编辑任务' : '创建任务'"
      width="800px"
      @ok="handleSubmitTask"
      @cancel="handleCancelTask"
    >
      <a-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="taskFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="任务名称" name="name">
          <a-input v-model:value="taskForm.name" placeholder="请输入任务名称" />
        </a-form-item>

        <a-form-item label="关联活动" name="activityId">
          <a-select v-model:value="taskForm.activityId" placeholder="请选择活动">
            <a-select-option value="1">2025年度创新设计大赛</a-select-option>
            <a-select-option value="2">优秀项目评审活动</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评审轮次" name="round">
          <a-select v-model:value="taskForm.round" placeholder="请选择评审轮次">
            <a-select-option value="preliminary">初审</a-select-option>
            <a-select-option value="semifinal">复审</a-select-option>
            <a-select-option value="final">终审</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评审时间" name="timeRange">
          <a-range-picker
            v-model:value="taskForm.timeRange"
            show-time
            class="w-full"
            :placeholder="['开始时间', '截止时间']"
          />
        </a-form-item>

        <a-form-item label="每个作品评审人数" name="reviewersPerWork">
          <a-input-number
            v-model:value="taskForm.reviewersPerWork"
            :min="1"
            :max="10"
            class="w-full"
            placeholder="设置每个作品需要的评审人数"
          />
        </a-form-item>

        <a-form-item label="任务描述">
          <a-textarea
            v-model:value="taskForm.description"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配专家弹窗 -->
    <a-modal
      v-model:open="assignModalVisible"
      title="分配专家"
      width="900px"
      @ok="handleSubmitAssignment"
      @cancel="assignModalVisible = false"
    >
      <a-tabs v-model:activeKey="assignTab">
        <!-- 分配策略 -->
        <a-tab-pane key="strategy" tab="分配策略">
          <a-radio-group v-model:value="assignForm.strategy" class="w-full">
            <a-space direction="vertical" class="w-full" :size="16">
              <a-radio value="manual">
                <div class="ml-2">
                  <div class="font-medium">手动分配</div>
                  <div class="text-xs text-gray-500">
                    手动选择专家并指定评审的作品
                  </div>
                </div>
              </a-radio>

              <a-radio value="auto">
                <div class="ml-2">
                  <div class="font-medium">自动分配</div>
                  <div class="text-xs text-gray-500">
                    系统根据专家专业领域自动匹配作品
                  </div>
                </div>
              </a-radio>

              <a-radio value="balanced">
                <div class="ml-2">
                  <div class="font-medium">负载均衡</div>
                  <div class="text-xs text-gray-500">
                    考虑专家当前工作量，均衡分配任务
                  </div>
                </div>
              </a-radio>
            </a-space>
          </a-radio-group>

          <a-divider />

          <!-- 分配参数 -->
          <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="每个作品评审人数">
              <a-input-number
                v-model:value="assignForm.reviewersPerWork"
                :min="1"
                :max="10"
                class="w-full"
              />
            </a-form-item>

            <a-form-item label="避免利益冲突" v-if="assignForm.strategy !== 'manual'">
              <a-switch v-model:checked="assignForm.avoidConflict" />
              <div class="text-xs text-gray-500 mt-1">
                自动排除与参赛者存在利益关系的专家
              </div>
            </a-form-item>

            <a-form-item label="专业领域匹配" v-if="assignForm.strategy === 'auto'">
              <a-switch v-model:checked="assignForm.matchExpertise" />
              <div class="text-xs text-gray-500 mt-1">
                优先分配专业领域匹配的专家
              </div>
            </a-form-item>

            <a-form-item label="工作量上限" v-if="assignForm.strategy === 'balanced'">
              <a-input-number
                v-model:value="assignForm.maxWorkload"
                :min="1"
                :max="100"
                class="w-full"
                addon-after="个作品"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 选择专家 -->
        <a-tab-pane key="experts" tab="选择专家">
          <div class="mb-4">
            <a-input-search
              v-model:value="expertSearchKeyword"
              placeholder="搜索专家姓名或专业领域"
              style="width: 300px"
            />
          </div>

          <a-table
            :columns="expertColumns"
            :data-source="filteredExperts"
            :row-selection="{
              selectedRowKeys: assignForm.selectedExperts,
              onChange: (keys: (string | number)[]) => { assignForm.selectedExperts = keys as string[] }
            }"
            :pagination="false"
            row-key="id"
            :scroll="{ y: 400 }"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'expert'">
                <div class="flex items-center">
                  <a-avatar :src="record.avatar" size="small" class="mr-2">
                    {{ record.name.substring(0, 1) }}
                  </a-avatar>
                  <div>
                    <div class="font-medium">
                      {{ record.name }}
                      <a-tag :color="getLevelColor(record.level)" size="small" class="ml-1">
                        {{ getLevelLabel(record.level) }}
                      </a-tag>
                    </div>
                    <div class="text-xs text-gray-500">{{ record.organization }}</div>
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'expertise'">
                <a-space>
                  <a-tag
                    v-for="field in record.expertiseFields.slice(0, 2)"
                    :key="field"
                    size="small"
                    color="blue"
                  >
                    {{ field }}
                  </a-tag>
                  <span v-if="record.expertiseFields.length > 2" class="text-xs text-gray-500">
                    +{{ record.expertiseFields.length - 2 }}
                  </span>
                </a-space>
              </template>
              <template v-else-if="column.key === 'workload'">
                <div class="text-center">
                  <div class="font-medium">{{ record.currentWorkload || 0 }}</div>
                  <a-progress
                    :percent="Math.min((record.currentWorkload / 50) * 100, 100)"
                    :size="'small'"
                    :show-info="false"
                  />
                </div>
              </template>
            </template>
          </a-table>

          <div class="mt-4 text-gray-500 text-sm">
            已选择 {{ assignForm.selectedExperts.length }} 位专家
          </div>
        </a-tab-pane>

        <!-- 预览分配 -->
        <a-tab-pane key="preview" tab="预览分配" v-if="assignForm.strategy !== 'manual'">
          <a-alert
            message="分配预览"
            description="以下是根据所选策略生成的分配方案预览，您可以调整后再确认"
            type="info"
            show-icon
            class="mb-4"
          />

          <a-button type="primary" @click="handleGeneratePreview" class="mb-4">
            <ReloadOutlined />
            生成预览
          </a-button>

          <a-table
            :columns="previewColumns"
            :data-source="assignmentPreview"
            :pagination="false"
            size="small"
            :scroll="{ y: 400 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'expert'">
                {{ record.expertName }}
              </template>
              <template v-else-if="column.key === 'works'">
                {{ record.workCount }} 个作品
              </template>
              <template v-else-if="column.key === 'conflicts'">
                <a-tag v-if="record.conflictCount > 0" color="red">
                  {{ record.conflictCount }} 个冲突
                </a-tag>
                <a-tag v-else color="green">无冲突</a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <!-- 冲突处理弹窗 -->
    <a-modal
      v-model:open="conflictModalVisible"
      title="处理评审冲突"
      width="700px"
      @ok="handleSubmitConflictResolution"
      @cancel="conflictModalVisible = false"
    >
      <a-descriptions bordered :column="1" v-if="currentConflict">
        <a-descriptions-item label="冲突类型">
          <a-tag color="red">{{ currentConflict.type }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="冲突描述">
          {{ currentConflict.description }}
        </a-descriptions-item>
        <a-descriptions-item label="涉及专家">
          {{ currentConflict.expertName }}
        </a-descriptions-item>
        <a-descriptions-item label="涉及作品">
          {{ currentConflict.workTitle }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider>解决方案</a-divider>

      <a-radio-group v-model:value="conflictResolution.action" class="w-full">
        <a-space direction="vertical" class="w-full" :size="16">
          <a-radio value="reassign">
            <div class="ml-2">
              <div class="font-medium">重新分配专家</div>
              <div class="text-xs text-gray-500">
                将此作品分配给其他专家评审
              </div>
            </div>
          </a-radio>

          <a-radio value="remove">
            <div class="ml-2">
              <div class="font-medium">移除该专家</div>
              <div class="text-xs text-gray-500">
                从当前任务中移除该专家的所有分配
              </div>
            </div>
          </a-radio>

          <a-radio value="ignore">
            <div class="ml-2">
              <div class="font-medium">忽略冲突</div>
              <div class="text-xs text-gray-500">
                如果确认不存在实际冲突，可以选择忽略
              </div>
            </div>
          </a-radio>
        </a-space>
      </a-radio-group>

      <div class="mt-4">
        <div class="mb-2 text-gray-700 dark:text-gray-300">备注说明</div>
        <a-textarea
          v-model:value="conflictResolution.remark"
          :rows="3"
          placeholder="请输入处理说明"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  RedoOutlined,
  ExportOutlined,
  FileTextOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'

// 统计数据
const taskStats = reactive({
  total: 24,
  ongoing: 8,
  pending: 5,
  completed: 11,
})

// 查询参数
const queryParams = reactive({
  keyword: '',
  activityId: undefined as string | undefined,
  round: undefined as string | undefined,
  status: undefined as string | undefined,
})

// 表格数据
const loading = ref(false)
const selectedRowKeys = ref<string[]>([])
const dataSource = ref([
  {
    id: '1',
    name: '2025创新大赛初审任务',
    activityName: '2025年度创新设计大赛',
    round: 'preliminary',
    assignStrategy: 'balanced',
    expertCount: 10,
    workCount: 50,
    totalCount: 50,
    completedCount: 32,
    progress: 64,
    startTime: '2025-01-15 09:00',
    endTime: '2025-01-25 18:00',
    remainingDays: 7,
    status: 'ongoing',
    conflictCount: 2,
    description: '对所有初审作品进行评审',
    reviewersPerWork: 3,
    assignments: [
      {
        expertId: '1',
        expertName: '李教授',
        expertOrg: '清华大学',
        expertAvatar: '',
        totalWorks: 15,
        completedWorks: 10,
        status: 'ongoing',
      },
      {
        expertId: '2',
        expertName: '王专家',
        expertOrg: '北京大学',
        expertAvatar: '',
        totalWorks: 12,
        completedWorks: 12,
        status: 'completed',
      },
    ],
    conflicts: [
      {
        id: 'c1',
        type: '利益冲突',
        description: '专家与参赛者存在师生关系',
        expertName: '李教授',
        workTitle: '智能交通系统',
      },
      {
        id: 'c2',
        type: '专业不匹配',
        description: '专家领域与作品类别不符',
        expertName: '张工程师',
        workTitle: '生物医疗设备',
      },
    ],
  },
  {
    id: '2',
    name: '优秀项目评审-复审',
    activityName: '优秀项目评审活动',
    round: 'semifinal',
    assignStrategy: 'auto',
    expertCount: 8,
    workCount: 30,
    totalCount: 30,
    completedCount: 0,
    progress: 0,
    startTime: '2025-02-01 09:00',
    endTime: '2025-02-10 18:00',
    remainingDays: 15,
    status: 'pending',
    conflictCount: 0,
    description: '复审阶段评审任务',
    reviewersPerWork: 5,
    assignments: [],
    conflicts: [],
  },
  {
    id: '3',
    name: '创新设计大赛终审',
    activityName: '2025年度创新设计大赛',
    round: 'final',
    assignStrategy: 'manual',
    expertCount: 5,
    workCount: 10,
    totalCount: 10,
    completedCount: 10,
    progress: 100,
    startTime: '2025-01-01 09:00',
    endTime: '2025-01-10 18:00',
    remainingDays: undefined,
    status: 'completed',
    conflictCount: 0,
    description: '终审阶段评审',
    reviewersPerWork: 5,
    assignments: [],
    conflicts: [],
  },
])

// 表格列
const columns = [
  { title: '任务信息', key: 'task', width: 250 },
  { title: '分配信息', key: 'assignment', width: 150, align: 'center' as const },
  { title: '评审进度', key: 'progress', width: 150, align: 'center' as const },
  { title: '时间信息', key: 'time', width: 200 },
  { title: '状态', key: 'status', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]

// 分配情况表格列
const assignmentColumns = [
  { title: '专家', key: 'expert', width: 200 },
  { title: '分配作品数', dataIndex: 'totalWorks', key: 'totalWorks', width: 100, align: 'center' as const },
  { title: '完成进度', key: 'workload', width: 150 },
  { title: '状态', key: 'status', width: 100, align: 'center' as const },
]

// 专家选择表格列
const expertColumns = [
  { title: '专家信息', key: 'expert', width: 220 },
  { title: '专业领域', key: 'expertise', width: 200 },
  { title: '当前工作量', key: 'workload', width: 120, align: 'center' as const },
]

// 预览表格列
const previewColumns = [
  { title: '专家', key: 'expert', width: 150 },
  { title: '分配作品', key: 'works', width: 100 },
  { title: '冲突检查', key: 'conflicts', width: 120 },
]

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 详情抽屉
const detailDrawerVisible = ref(false)
const detailTab = ref('basic')
const currentTask = ref<typeof dataSource.value[0] | null>(null)

// 任务弹窗
const taskModalVisible = ref(false)
const isEdit = ref(false)
const taskFormRef = ref<FormInstance>()
const taskForm = reactive({
  id: '',
  name: '',
  activityId: '',
  round: '',
  timeRange: [] as unknown[],
  reviewersPerWork: 3,
  description: '',
})

const taskFormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  activityId: [{ required: true, message: '请选择活动', trigger: 'change' }],
  round: [{ required: true, message: '请选择评审轮次', trigger: 'change' }],
  timeRange: [{ required: true, message: '请选择评审时间', trigger: 'change' }],
  reviewersPerWork: [{ required: true, message: '请设置评审人数', trigger: 'blur' }],
}

// 分配专家弹窗
const assignModalVisible = ref(false)
const assignTab = ref('strategy')
const assignForm = reactive({
  strategy: 'balanced',
  reviewersPerWork: 3,
  avoidConflict: true,
  matchExpertise: true,
  maxWorkload: 20,
  selectedExperts: [] as string[],
})

// 专家搜索
const expertSearchKeyword = ref('')
const expertList = ref([
  {
    id: '1',
    name: '李教授',
    level: 'senior',
    organization: '清华大学计算机学院',
    avatar: '',
    expertiseFields: ['人工智能', '大数据'],
    currentWorkload: 15,
  },
  {
    id: '2',
    name: '王专家',
    level: 'intermediate',
    organization: '北京大学信息学院',
    avatar: '',
    expertiseFields: ['云计算', '物联网'],
    currentWorkload: 8,
  },
  {
    id: '3',
    name: '张工程师',
    level: 'junior',
    organization: '阿里巴巴集团',
    avatar: '',
    expertiseFields: ['大数据', '人工智能'],
    currentWorkload: 5,
  },
])

const filteredExperts = computed(() => {
  if (!expertSearchKeyword.value) return expertList.value

  const keyword = expertSearchKeyword.value.toLowerCase()
  return expertList.value.filter(
    (expert) =>
      expert.name.toLowerCase().includes(keyword) ||
      expert.organization.toLowerCase().includes(keyword) ||
      expert.expertiseFields.some((field) => field.toLowerCase().includes(keyword))
  )
})

// 分配预览
const assignmentPreview = ref([
  { expertName: '李教授', workCount: 7, conflictCount: 1 },
  { expertName: '王专家', workCount: 6, conflictCount: 0 },
  { expertName: '张工程师', workCount: 7, conflictCount: 0 },
])

// 冲突处理弹窗
const conflictModalVisible = ref(false)
const currentConflict = ref<{
  id: string
  type: string
  description: string
  expertName: string
  workTitle: string
} | null>(null)
const conflictResolution = reactive({
  action: 'reassign',
  remark: '',
})

// 辅助函数
const getRoundColor = (round?: string) => {
  const colors = {
    preliminary: 'blue',
    semifinal: 'orange',
    final: 'red',
  }
  return colors[round as keyof typeof colors] || 'default'
}

const getRoundLabel = (round?: string) => {
  const labels = {
    preliminary: '初审',
    semifinal: '复审',
    final: '终审',
  }
  return labels[round as keyof typeof labels] || round
}

const getStrategyColor = (strategy?: string) => {
  const colors = {
    manual: 'default',
    auto: 'blue',
    balanced: 'green',
  }
  return colors[strategy as keyof typeof colors] || 'default'
}

const getStrategyLabel = (strategy?: string) => {
  const labels = {
    manual: '手动分配',
    auto: '自动分配',
    balanced: '负载均衡',
  }
  return labels[strategy as keyof typeof labels] || strategy
}

const getStatusColor = (status?: string) => {
  const colors = {
    pending: 'orange',
    assigned: 'blue',
    ongoing: 'cyan',
    completed: 'green',
  }
  return colors[status as keyof typeof colors] || 'default'
}

const getStatusLabel = (status?: string) => {
  const labels = {
    pending: '待分配',
    assigned: '已分配',
    ongoing: '进行中',
    completed: '已完成',
  }
  return labels[status as keyof typeof labels] || status
}

const getLevelColor = (level?: string) => {
  const colors = {
    senior: 'red',
    intermediate: 'blue',
    junior: 'green',
  }
  return colors[level as keyof typeof colors] || 'default'
}

const getLevelLabel = (level?: string) => {
  const labels = {
    senior: '高级',
    intermediate: '中级',
    junior: '初级',
  }
  return labels[level as keyof typeof labels] || level
}

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  message.info('搜索功能待实现')
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.activityId = undefined
  queryParams.round = undefined
  queryParams.status = undefined
  handleSearch()
}

const handleTableChange = (pag: typeof pagination) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const handleCreate = () => {
  isEdit.value = false
  Object.assign(taskForm, {
    id: '',
    name: '',
    activityId: '',
    round: '',
    timeRange: [],
    reviewersPerWork: 3,
    description: '',
  })
  taskModalVisible.value = true
}

const handleEdit = (record: typeof dataSource.value[0] | null) => {
  if (!record) return

  isEdit.value = true
  Object.assign(taskForm, {
    id: record.id,
    name: record.name,
    activityId: '1',
    round: record.round,
    timeRange: [],
    reviewersPerWork: record.reviewersPerWork,
    description: record.description,
  })
  taskModalVisible.value = true
}

const handleSubmitTask = async () => {
  try {
    await taskFormRef.value?.validate()

    if (isEdit.value) {
      const index = dataSource.value.findIndex((item) => item.id === taskForm.id)
      if (index > -1 && dataSource.value[index]) {
        Object.assign(dataSource.value[index], {
          name: taskForm.name,
          round: taskForm.round,
          reviewersPerWork: taskForm.reviewersPerWork,
          description: taskForm.description,
        })
      }
      message.success('编辑成功')
    } else {
      const newTask = {
        id: String(Date.now()),
        name: taskForm.name,
        activityName: '2025年度创新设计大赛',
        round: taskForm.round,
        assignStrategy: 'balanced',
        expertCount: 0,
        workCount: 0,
        totalCount: 0,
        completedCount: 0,
        progress: 0,
        startTime: '2025-01-20 09:00',
        endTime: '2025-01-30 18:00',
        remainingDays: 10,
        status: 'pending',
        conflictCount: 0,
        description: taskForm.description,
        reviewersPerWork: taskForm.reviewersPerWork,
        assignments: [],
        conflicts: [],
      }
      dataSource.value.push(newTask)
      pagination.total++
      taskStats.total++
      taskStats.pending++
      message.success('创建成功')
    }

    taskModalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancelTask = () => {
  taskModalVisible.value = false
  taskFormRef.value?.resetFields()
}

const handleView = (record: typeof dataSource.value[0]) => {
  currentTask.value = record
  detailTab.value = 'basic'
  detailDrawerVisible.value = true
}

const handleMenuClick = (key: string, record: typeof dataSource.value[0]) => {
  currentTask.value = record

  switch (key) {
    case 'assign':
    case 'reassign':
      handleAssignExperts(record)
      break
    case 'edit':
      handleEdit(record)
      break
    case 'conflict':
      detailTab.value = 'conflict'
      detailDrawerVisible.value = true
      break
    case 'export':
      message.info('导出功能待实现')
      break
    case 'delete':
      handleDelete(record)
      break
  }
}

const handleAssignExperts = (record: typeof dataSource.value[0] | null) => {
  if (!record) return

  currentTask.value = record
  assignTab.value = 'strategy'
  assignForm.reviewersPerWork = record.reviewersPerWork
  assignForm.selectedExperts = []
  assignModalVisible.value = true
}

const handleSubmitAssignment = () => {
  if (assignForm.selectedExperts.length === 0) {
    message.warning('请至少选择一位专家')
    return
  }

  if (!currentTask.value) return

  currentTask.value.status = 'assigned'
  currentTask.value.expertCount = assignForm.selectedExperts.length
  currentTask.value.assignStrategy = assignForm.strategy

  // 更新统计
  taskStats.pending--
  taskStats.ongoing++

  message.success('分配成功')
  assignModalVisible.value = false
}

const handleBatchAssign = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要批量分配的任务')
    return
  }

  message.info('批量分配功能待实现')
}

const handleCheckConflict = () => {
  message.info('冲突检查功能待实现')
}

const handleGeneratePreview = () => {
  message.success('已生成分配预览')
}

const handleResolveConflict = (conflict: {
  id: string
  type: string
  description: string
  expertName: string
  workTitle: string
}) => {
  currentConflict.value = conflict
  conflictResolution.action = 'reassign'
  conflictResolution.remark = ''
  conflictModalVisible.value = true
}

const handleSubmitConflictResolution = () => {
  if (!currentTask.value || !currentConflict.value) return

  // 移除冲突
  const index = currentTask.value.conflicts.findIndex((c) => c.id === currentConflict.value?.id)
  if (index > -1) {
    currentTask.value.conflicts.splice(index, 1)
    currentTask.value.conflictCount--
  }

  message.success('冲突已处理')
  conflictModalVisible.value = false
}

const handleDelete = (record: typeof dataSource.value[0]) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除任务「${record.name}」吗？此操作不可恢复！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const index = dataSource.value.findIndex((item) => item.id === record.id)
      if (index > -1) {
        dataSource.value.splice(index, 1)
        pagination.total--
        taskStats.total--

        // 更新统计
        if (record.status === 'pending') taskStats.pending--
        else if (record.status === 'ongoing') taskStats.ongoing--
        else if (record.status === 'completed') taskStats.completed--

        message.success('删除成功')
      }
    },
  })
}
</script>

<style scoped>
.review-task-page {
  padding: 0;
}
</style>
