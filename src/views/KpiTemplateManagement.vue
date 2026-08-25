<template>
  <MainContent>
    <div class="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div class="mx-auto max-w-7xl space-y-6">

        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->

        <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div
              class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                  class="flex h-11 w-11 items-center justify-center
                         rounded-xl bg-violet-50 text-violet-600"
              >
                <LayoutTemplate class="h-6 w-6" />
              </div>

              <div>
                <h1 class="text-2xl font-bold text-slate-900">
                  KPI Template Management
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                  Create and manage KPI templates used for performance reviews
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                  @click="loadTemplates"
                  :disabled="loading"
                  class="inline-flex h-11 items-center justify-center gap-2
                         rounded-xl border border-slate-200 bg-white px-4
                         text-sm font-semibold text-slate-700
                         transition hover:bg-slate-50
                         disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                    class="h-4 w-4"
                    :class="{ 'animate-spin': loading }"
                />

                Refresh
              </button>

              <button
                  @click="openCreateTemplate"
                  class="inline-flex h-11 items-center justify-center gap-2
                         rounded-xl bg-blue-600 px-5
                         text-sm font-semibold text-white
                         shadow-sm transition hover:bg-blue-700"
              >
                <Plus class="h-4 w-4" />

                Create Template
              </button>
            </div>
          </div>
        </section>


        <!-- ===================================================== -->
        <!-- SUMMARY -->
        <!-- ===================================================== -->

        <section
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm font-medium text-slate-500">
              Total Templates
            </p>

            <p class="mt-2 text-3xl font-bold text-slate-900">
              {{ templates.length }}
            </p>
          </div>

          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm font-medium text-slate-500">
              Active Templates
            </p>

            <p class="mt-2 text-3xl font-bold text-green-600">
              {{ activeTemplates }}
            </p>
          </div>

          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p class="text-sm font-medium text-slate-500">
              Total KPI Items
            </p>

            <p class="mt-2 text-3xl font-bold text-blue-600">
              {{ totalKpiItems }}
            </p>
          </div>
        </section>


        <!-- ===================================================== -->
        <!-- TEMPLATE LIST -->
        <!-- ===================================================== -->

        <section
            class="overflow-hidden rounded-2xl
                   border border-slate-200 bg-white shadow-sm"
        >

          <div
              class="flex items-center justify-between
                     border-b border-slate-200 px-6 py-5"
          >
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                KPI Templates
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Templates define KPI targets, measurement types and weights.
              </p>
            </div>
          </div>


          <!-- Loading -->
          <div
              v-if="loading"
              class="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2"
          >
            <div
                v-for="n in 4"
                :key="n"
                class="animate-pulse rounded-2xl border
                       border-slate-200 p-5"
            >
              <div class="h-5 w-1/3 rounded bg-slate-200"></div>

              <div class="mt-3 h-4 w-2/3 rounded bg-slate-100"></div>

              <div class="mt-5 space-y-3">
                <div class="h-20 rounded-xl bg-slate-100"></div>
                <div class="h-20 rounded-xl bg-slate-100"></div>
              </div>
            </div>
          </div>


          <!-- Empty -->
          <div
              v-else-if="templates.length === 0"
              class="px-6 py-16 text-center"
          >
            <div
                class="mx-auto flex h-16 w-16 items-center
                       justify-center rounded-2xl
                       bg-slate-100 text-slate-400"
            >
              <LayoutTemplate class="h-8 w-8" />
            </div>

            <h3 class="mt-5 text-lg font-bold text-slate-900">
              No KPI templates
            </h3>

            <p class="mt-2 text-sm text-slate-500">
              Create your first KPI template to start performance evaluations.
            </p>

            <button
                @click="openCreateTemplate"
                class="mt-5 rounded-xl bg-blue-600
                       px-5 py-2.5 text-sm font-semibold
                       text-white transition hover:bg-blue-700"
            >
              Create Template
            </button>
          </div>


          <!-- Cards -->
          <div
              v-else
              class="grid grid-cols-1 gap-5 p-6 xl:grid-cols-2"
          >
            <article
                v-for="template in templates"
                :key="template.id"
                class="rounded-2xl border border-slate-200
                       bg-white p-5 transition
                       hover:border-blue-200 hover:shadow-md"
            >

              <!-- Header -->
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3
                        class="truncate text-lg font-bold text-slate-900"
                    >
                      {{ template.name }}
                    </h3>

                    <span
                        class="rounded-full px-2.5 py-1
                               text-[11px] font-semibold"
                        :class="
                          template.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        "
                    >
                      {{ template.isActive ? "Active" : "Inactive" }}
                    </span>
                  </div>

                  <p
                      v-if="template.description"
                      class="mt-2 line-clamp-2 text-sm text-slate-500"
                  >
                    {{ template.description }}
                  </p>
                </div>

                <div class="flex shrink-0 gap-2">
                  <button
                      @click="openEditTemplate(template)"
                      class="flex h-9 w-9 items-center justify-center
                             rounded-lg border border-slate-200
                             text-slate-500 transition
                             hover:border-blue-200
                             hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>

                  <button
                      @click="askDeleteTemplate(template)"
                      class="flex h-9 w-9 items-center justify-center
                             rounded-lg border border-slate-200
                             text-slate-500 transition
                             hover:border-red-200
                             hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>


              <!-- Summary -->
              <div
                  class="mt-5 grid grid-cols-2 gap-3"
              >
                <div class="rounded-xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    KPI Items
                  </p>

                  <p class="mt-1 text-xl font-bold text-slate-900">
                    {{ template.items?.length ?? 0 }}
                  </p>
                </div>

                <div class="rounded-xl bg-blue-50 p-4">
                  <p class="text-xs text-blue-500">
                    Total Weight
                  </p>

                  <p class="mt-1 text-xl font-bold text-blue-600">
                    {{ getTotalWeight(template.items) }}%
                  </p>
                </div>
              </div>


              <!-- KPI Items -->
              <div
                  v-if="template.items?.length"
                  class="mt-5 space-y-3"
              >
                <div
                    v-for="item in template.items"
                    :key="item.id"
                    class="rounded-xl border border-slate-100
                           bg-slate-50 p-4"
                >
                  <div
                      class="flex items-start justify-between gap-4"
                  >
                    <div class="min-w-0">
                      <p
                          class="truncate text-sm font-semibold text-slate-800"
                      >
                        {{ item.title }}
                      </p>

                      <p class="mt-1 text-xs text-slate-400">
                        {{ metricTypeLabel(item.metricType) }}
                      </p>
                    </div>

                    <span
                        class="shrink-0 rounded-lg bg-white
                               px-2.5 py-1 text-xs font-bold
                               text-slate-600 shadow-sm"
                    >
                      {{ item.weight }}%
                    </span>
                  </div>

                  <div
                      class="mt-3 flex flex-wrap items-center
                             justify-between gap-2 text-xs"
                  >
                    <span class="text-slate-500">
                      Target:
                      <strong class="text-slate-700">
                        {{ item.targetValue }}{{ item.unit }}
                      </strong>
                    </span>

                    <span class="text-slate-400">
                      {{ item.metricType }}
                    </span>
                  </div>
                </div>
              </div>


              <!-- Footer -->
              <div
                  class="mt-5 flex items-center justify-between
                         border-t border-slate-100 pt-4
                         text-xs text-slate-400"
              >
                <span>
                  Created {{ formatDateTime(template.createdAt) }}
                </span>

                <button
                    @click="openEditTemplate(template)"
                    class="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit template →
                </button>
              </div>

            </article>
          </div>

        </section>


        <!-- ===================================================== -->
        <!-- CREATE / EDIT MODAL -->
        <!-- ===================================================== -->

        <Teleport to="body">
          <div
              v-if="showFormModal"
              @click.self="closeFormModal"
              class="fixed inset-0 z-[9999]
                     flex items-center justify-center
                     bg-slate-950/60 p-4 backdrop-blur-md"
          >
            <div
                class="flex max-h-[94vh] flex-col overflow-hidden
                       rounded-3xl bg-white
                       shadow-[0_25px_80px_rgba(15,23,42,0.3)]"
                style="width: min(960px, calc(100vw - 32px));"
            >

              <!-- Header -->
              <div
                  class="flex shrink-0 items-start justify-between
                         border-b border-slate-200 px-7 py-6"
              >
                <div class="flex items-center gap-4">
                  <div
                      class="flex h-11 w-11 items-center justify-center
                             rounded-xl bg-violet-50 text-violet-600"
                  >
                    <LayoutTemplate class="h-5 w-5" />
                  </div>

                  <div>
                    <h2 class="text-xl font-bold text-slate-900">
                      {{
                        editingTemplate
                            ? "Edit KPI Template"
                            : "Create KPI Template"
                      }}
                    </h2>

                    <p class="mt-1 text-sm text-slate-500">
                      Define KPI metrics, targets and contribution weights.
                    </p>
                  </div>
                </div>

                <button
                    @click="closeFormModal"
                    :disabled="saving"
                    class="flex h-9 w-9 items-center justify-center
                           rounded-xl text-xl text-slate-400
                           transition hover:bg-slate-100
                           hover:text-slate-700"
                >
                  ×
                </button>
              </div>


              <!-- Form -->
              <form
                  @submit.prevent="saveTemplate"
                  class="min-h-0 flex-1 overflow-y-auto"
              >
                <div class="space-y-6 p-7">

                  <!-- ================================================= -->
                  <!-- BASIC INFO -->
                  <!-- ================================================= -->

                  <section
                      class="rounded-2xl border border-slate-200
                             bg-slate-50/60 p-5"
                  >
                    <div class="mb-5">
                      <h3 class="font-bold text-slate-900">
                        Template Information
                      </h3>

                      <p class="mt-1 text-sm text-slate-500">
                        Basic information about this KPI template.
                      </p>
                    </div>


                    <div class="space-y-5">

                      <div>
                        <label
                            class="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Template Name
                          <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="templateForm.name"
                            type="text"
                            required
                            placeholder="e.g. Developer KPI"
                            class="h-12 w-full rounded-xl
                                   border border-slate-300 bg-white
                                   px-4 text-sm text-slate-700
                                   outline-none transition
                                   focus:border-blue-500
                                   focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>


                      <div>
                        <label
                            class="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Description
                        </label>

                        <textarea
                            v-model="templateForm.description"
                            rows="3"
                            placeholder="Describe this KPI template..."
                            class="w-full resize-none rounded-xl
                                   border border-slate-300 bg-white
                                   px-4 py-3 text-sm text-slate-700
                                   outline-none transition
                                   focus:border-blue-500
                                   focus:ring-4 focus:ring-blue-500/10"
                        ></textarea>
                      </div>


                      <div
                          v-if="editingTemplate"
                          class="flex items-center justify-between
                                 rounded-xl border border-slate-200
                                 bg-white p-4"
                      >
                        <div>
                          <p class="text-sm font-semibold text-slate-800">
                            Active Template
                          </p>

                          <p class="mt-1 text-xs text-slate-400">
                            Inactive templates should not be used for new reviews.
                          </p>
                        </div>

                        <button
                            type="button"
                            @click="templateForm.isActive = !templateForm.isActive"
                            class="relative h-7 w-12 rounded-full transition"
                            :class="
                              templateForm.isActive
                                ? 'bg-green-500'
                                : 'bg-slate-300'
                            "
                        >
                          <span
                              class="absolute top-1 h-5 w-5
                                     rounded-full bg-white shadow-sm
                                     transition-all"
                              :class="
                                templateForm.isActive
                                  ? 'left-6'
                                  : 'left-1'
                              "
                          ></span>
                        </button>
                      </div>

                    </div>
                  </section>


                  <!-- ================================================= -->
                  <!-- KPI ITEMS -->
                  <!-- ================================================= -->

                  <section
                      class="rounded-2xl border border-slate-200
                             bg-white p-5"
                  >

                    <!-- Header -->
                    <div
                        class="flex flex-col gap-4
                               sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 class="font-bold text-slate-900">
                          KPI Items
                        </h3>

                        <p class="mt-1 text-sm text-slate-500">
                          Add measurable criteria to this template.
                        </p>
                      </div>

                      <button
                          type="button"
                          @click="addKpiItem"
                          class="inline-flex items-center justify-center gap-2
                                 rounded-xl border border-blue-200
                                 bg-blue-50 px-4 py-2.5
                                 text-sm font-semibold text-blue-600
                                 transition hover:bg-blue-100"
                      >
                        <Plus class="h-4 w-4" />

                        Add KPI
                      </button>
                    </div>


                    <!-- Weight summary -->
                    <div
                        class="mt-5 rounded-xl border p-4"
                        :class="
                          totalFormWeight === 100
                            ? 'border-green-200 bg-green-50'
                            : 'border-orange-200 bg-orange-50'
                        "
                    >
                      <div
                          class="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p
                              class="text-sm font-semibold"
                              :class="
                                totalFormWeight === 100
                                  ? 'text-green-700'
                                  : 'text-orange-700'
                              "
                          >
                            Total KPI Weight
                          </p>

                          <p
                              class="mt-1 text-xs"
                              :class="
                                totalFormWeight === 100
                                  ? 'text-green-600'
                                  : 'text-orange-600'
                              "
                          >
                            Total weight must equal exactly 100%.
                          </p>
                        </div>

                        <span
                            class="text-2xl font-bold"
                            :class="
                              totalFormWeight === 100
                                ? 'text-green-600'
                                : 'text-orange-600'
                            "
                        >
                          {{ totalFormWeight }}%
                        </span>
                      </div>

                      <div
                          class="mt-3 h-2 overflow-hidden
                                 rounded-full bg-white/70"
                      >
                        <div
                            class="h-full rounded-full transition-all"
                            :class="
                              totalFormWeight === 100
                                ? 'bg-green-500'
                                : 'bg-orange-500'
                            "
                            :style="{
                              width: `${Math.min(totalFormWeight, 100)}%`
                            }"
                        ></div>
                      </div>
                    </div>


                    <!-- Items -->
                    <div class="mt-5 space-y-5">

                      <article
                          v-for="(item, index) in templateForm.items"
                          :key="index"
                          class="rounded-2xl border border-slate-200 p-5"
                      >

                        <div
                            class="mb-5 flex items-center justify-between"
                        >
                          <div class="flex items-center gap-3">
                            <div
                                class="flex h-9 w-9 items-center justify-center
                                       rounded-xl bg-blue-50
                                       text-sm font-bold text-blue-600"
                            >
                              {{ index + 1 }}
                            </div>

                            <div>
                              <p class="font-bold text-slate-900">
                                KPI Item {{ index + 1 }}
                              </p>

                              <p class="text-xs text-slate-400">
                                Configure KPI measurement and contribution.
                              </p>
                            </div>
                          </div>

                          <button
                              type="button"
                              @click="removeKpiItem(index)"
                              class="flex h-9 w-9 items-center justify-center
                                     rounded-lg text-slate-400 transition
                                     hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 class="h-4 w-4" />
                          </button>
                        </div>


                        <div
                            class="grid grid-cols-1 gap-5 lg:grid-cols-2"
                        >

                          <!-- Title -->
                          <div class="lg:col-span-2">
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              KPI Title
                              <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="item.title"
                                type="text"
                                required
                                placeholder="e.g. Task Completion Rate"
                                class="h-12 w-full rounded-xl
                                       border border-slate-300
                                       bg-white px-4 text-sm
                                       text-slate-700 outline-none
                                       transition focus:border-blue-500
                                       focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>


                          <!-- Description -->
                          <div class="lg:col-span-2">
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Description
                            </label>

                            <textarea
                                v-model="item.description"
                                rows="2"
                                placeholder="Describe what this KPI measures..."
                                class="w-full resize-none rounded-xl
                                       border border-slate-300
                                       bg-white px-4 py-3 text-sm
                                       text-slate-700 outline-none
                                       transition focus:border-blue-500
                                       focus:ring-4 focus:ring-blue-500/10"
                            ></textarea>
                          </div>


                          <!-- Metric Type -->
                          <div>
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Metric Type
                              <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="item.metricType"
                                @change="handleMetricTypeChange(item)"
                                required
                                class="h-12 w-full rounded-xl
                                       border border-slate-300
                                       bg-white px-4 text-sm
                                       text-slate-700 outline-none
                                       transition focus:border-blue-500
                                       focus:ring-4 focus:ring-blue-500/10"
                            >
                              <option
                                  v-for="metric in metricTypes"
                                  :key="metric.value"
                                  :value="metric.value"
                              >
                                {{ metric.label }}
                              </option>
                            </select>
                          </div>


                          <!-- Target -->
                          <div>
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Target Value
                              <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model.number="item.targetValue"
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                placeholder="80"
                                class="h-12 w-full rounded-xl
                                       border border-slate-300
                                       bg-white px-4 text-sm
                                       text-slate-700 outline-none
                                       transition focus:border-blue-500
                                       focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>


                          <!-- Unit -->
                          <div>
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Unit
                              <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="item.unit"
                                type="text"
                                required
                                :disabled="isAutoPercentageMetric(item.metricType)"
                                placeholder="%, tasks, hours..."
                                class="h-12 w-full rounded-xl
                                       border border-slate-300
                                       bg-white px-4 text-sm
                                       text-slate-700 outline-none
                                       transition focus:border-blue-500
                                       focus:ring-4 focus:ring-blue-500/10
                                       disabled:cursor-not-allowed
                                       disabled:bg-slate-100"
                            />
                          </div>


                          <!-- Weight -->
                          <div>
                            <label
                                class="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Weight
                              <span class="text-red-500">*</span>
                            </label>

                            <div class="relative">
                              <input
                                  v-model.number="item.weight"
                                  type="number"
                                  min="0.01"
                                  max="100"
                                  step="0.01"
                                  required
                                  placeholder="50"
                                  class="h-12 w-full rounded-xl
                                         border border-slate-300
                                         bg-white px-4 pr-10
                                         text-sm text-slate-700
                                         outline-none transition
                                         focus:border-blue-500
                                         focus:ring-4 focus:ring-blue-500/10"
                              />

                              <span
                                  class="absolute right-4 top-1/2
                                         -translate-y-1/2
                                         text-sm font-semibold
                                         text-slate-400"
                              >
                                %
                              </span>
                            </div>
                          </div>

                        </div>

                      </article>
                    </div>

                  </section>

                </div>


                <!-- Footer -->
                <div
                    class="sticky bottom-0 flex flex-col-reverse gap-3
                           border-t border-slate-200 bg-white
                           px-7 py-5 sm:flex-row sm:items-center
                           sm:justify-between"
                >
                  <p class="text-xs text-slate-400">
                    Total weight:
                    <strong
                        :class="
                          totalFormWeight === 100
                            ? 'text-green-600'
                            : 'text-orange-600'
                        "
                    >
                      {{ totalFormWeight }}%
                    </strong>
                  </p>

                  <div
                      class="flex flex-col-reverse gap-3 sm:flex-row"
                  >
                    <button
                        type="button"
                        @click="closeFormModal"
                        :disabled="saving"
                        class="rounded-xl border border-slate-300
                               bg-white px-5 py-2.5
                               text-sm font-semibold text-slate-700
                               transition hover:bg-slate-50
                               disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                        type="submit"
                        :disabled="saving"
                        class="inline-flex items-center justify-center
                               gap-2 rounded-xl bg-blue-600
                               px-6 py-2.5 text-sm font-semibold
                               text-white transition hover:bg-blue-700
                               disabled:cursor-not-allowed
                               disabled:opacity-50"
                    >
                      <RefreshCw
                          v-if="saving"
                          class="h-4 w-4 animate-spin"
                      />

                      {{
                        saving
                            ? "Saving..."
                            : editingTemplate
                                ? "Save Changes"
                                : "Create Template"
                      }}
                    </button>
                  </div>
                </div>

              </form>

            </div>
          </div>
        </Teleport>


        <!-- ===================================================== -->
        <!-- DELETE CONFIRM -->
        <!-- ===================================================== -->

        <Teleport to="body">
          <div
              v-if="showDeleteConfirm"
              class="fixed inset-0 z-[10000]
                     flex items-center justify-center
                     bg-slate-950/50 p-4 backdrop-blur-sm"
              @click.self="closeDeleteConfirm"
          >
            <div
                class="rounded-2xl bg-white p-6
                       shadow-[0_25px_80px_rgba(15,23,42,0.3)]"
                style="width: min(460px, calc(100vw - 32px));"
            >
              <div
                  class="flex h-12 w-12 items-center justify-center
                         rounded-full bg-red-100 text-red-600"
              >
                <Trash2 class="h-5 w-5" />
              </div>

              <h3 class="mt-5 text-xl font-bold text-slate-900">
                Delete KPI Template?
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete
                <strong class="text-slate-700">
                  {{ deletingTemplate?.name }}
                </strong>?
              </p>

              <div class="mt-6 flex justify-end gap-3">
                <button
                    @click="closeDeleteConfirm"
                    :disabled="saving"
                    class="h-11 rounded-xl border border-slate-200
                           px-5 text-sm font-semibold text-slate-600
                           transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                    @click="deleteTemplate"
                    :disabled="saving"
                    class="inline-flex h-11 items-center justify-center
                           gap-2 rounded-xl bg-red-600
                           px-5 text-sm font-semibold text-white
                           transition hover:bg-red-700
                           disabled:opacity-50"
                >
                  <RefreshCw
                      v-if="saving"
                      class="h-4 w-4 animate-spin"
                  />

                  {{ saving ? "Deleting..." : "Delete Template" }}
                </button>
              </div>
            </div>
          </div>
        </Teleport>

      </div>
    </div>
  </MainContent>


  <ToastMessage
      :message="toast.message"
      :type="toast.type"
      :show="toast.show"
  />
</template>


<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from "vue";

import {
  LayoutTemplate,
  Pencil,
  Plus,
  RefreshCw,
  Trash2
} from "@lucide/vue";

import MainContent from "../components/MainContent.vue";
import ToastMessage from "../components/ToastMessage.vue";

import { usePerformanceStore } from "../store/performanceStore.js";


const performanceStore =
    usePerformanceStore();


// =====================================================
// STATE
// =====================================================

const templates = ref([]);

const loading = ref(false);
const saving = ref(false);

const showFormModal = ref(false);
const showDeleteConfirm = ref(false);

const editingTemplate = ref(null);
const deletingTemplate = ref(null);


// =====================================================
// METRIC TYPES
// =====================================================

const metricTypes = [
  {
    value: "TASK_COMPLETION_RATE",
    label: "Task Completion Rate"
  },
  {
    value: "TASK_ON_TIME_RATE",
    label: "On-time Delivery Rate"
  },
  {
    value: "MANUAL",
    label: "Manual"
  }
];


// =====================================================
// FORM
// =====================================================

const templateForm = reactive({
  name: "",
  description: "",
  isActive: true,
  items: []
});


const createEmptyKpiItem = () => ({
  title: "",
  description: "",
  metricType: "TASK_COMPLETION_RATE",
  targetValue: null,
  unit: "%",
  weight: null
});


// =====================================================
// COMPUTED
// =====================================================

const activeTemplates = computed(() =>
    templates.value.filter(
        template =>
            template.isActive === true
    ).length
);


const totalKpiItems = computed(() =>
    templates.value.reduce(
        (sum, template) =>
            sum + (template.items?.length ?? 0),
        0
    )
);


const totalFormWeight = computed(() => {
  const total =
      templateForm.items.reduce(
          (sum, item) =>
              sum + Number(item.weight || 0),
          0
      );

  return Math.round(total * 100) / 100;
});


// =====================================================
// TOAST
// =====================================================

const toast = reactive({
  show: false,
  message: "",
  type: "success"
});

let toastTimer = null;

const triggerToast = (
    message,
    type = "success"
) => {
  toast.message = message;
  toast.type = type;
  toast.show = true;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.show = false;
  }, 3000);
};


// =====================================================
// LOAD
// =====================================================

const loadTemplates = async () => {
  try {
    loading.value = true;

    const response =
        await performanceStore.getKpiTemplates();

    templates.value =
        response?.data?.data ?? [];

  } catch (error) {
    console.error(
        "Load KPI templates error:",
        error.response?.data || error
    );

    templates.value = [];

    triggerToast(
        error.response?.data?.message ||
        "Failed to load KPI templates.",
        "error"
    );

  } finally {
    loading.value = false;
  }
};


// =====================================================
// FORM ACTION
// =====================================================

const resetTemplateForm = () => {
  Object.assign(templateForm, {
    name: "",
    description: "",
    isActive: true,
    items: [
      createEmptyKpiItem()
    ]
  });
};


const openCreateTemplate = () => {
  editingTemplate.value = null;

  resetTemplateForm();

  showFormModal.value = true;
};


const openEditTemplate = (template) => {
  editingTemplate.value = template;

  Object.assign(templateForm, {
    name:
        template.name ?? "",

    description:
        template.description ?? "",

    isActive:
        template.isActive ?? true,

    items:
        (template.items ?? []).map(
            item => ({
              title:
                  item.title ?? "",

              description:
                  item.description ?? "",

              metricType:
                  item.metricType ?? "MANUAL",

              targetValue:
                  item.targetValue ?? null,

              unit:
                  item.unit ?? "",

              weight:
                  item.weight ?? null
            })
        )
  });

  if (!templateForm.items.length) {
    templateForm.items.push(
        createEmptyKpiItem()
    );
  }

  showFormModal.value = true;
};


const closeFormModal = () => {
  if (saving.value) {
    return;
  }

  showFormModal.value = false;
  editingTemplate.value = null;

  resetTemplateForm();
};


// =====================================================
// KPI ITEM
// =====================================================

const addKpiItem = () => {
  templateForm.items.push(
      createEmptyKpiItem()
  );
};


const removeKpiItem = (index) => {
  if (templateForm.items.length <= 1) {
    triggerToast(
        "Template must contain at least one KPI item.",
        "error"
    );

    return;
  }

  templateForm.items.splice(
      index,
      1
  );
};


const isAutoPercentageMetric = (
    metricType
) => {
  return (
      metricType === "TASK_COMPLETION_RATE" ||
      metricType === "TASK_ON_TIME_RATE"
  );
};


const handleMetricTypeChange = (item) => {
  if (
      isAutoPercentageMetric(
          item.metricType
      )
  ) {
    item.unit = "%";

    return;
  }

  if (
      item.metricType === "MANUAL" &&
      item.unit === "%"
  ) {
    item.unit = "";
  }
};


// =====================================================
// VALIDATE
// =====================================================

const validateTemplateForm = () => {
  if (!templateForm.name.trim()) {
    triggerToast(
        "Template name is required.",
        "error"
    );

    return false;
  }

  if (!templateForm.items.length) {
    triggerToast(
        "At least one KPI item is required.",
        "error"
    );

    return false;
  }

  for (
      let index = 0;
      index < templateForm.items.length;
      index++
  ) {
    const item =
        templateForm.items[index];

    const number =
        index + 1;

    if (!item.title?.trim()) {
      triggerToast(
          `KPI item ${number}: title is required.`,
          "error"
      );

      return false;
    }

    if (!item.metricType) {
      triggerToast(
          `KPI item ${number}: metric type is required.`,
          "error"
      );

      return false;
    }

    if (
        item.targetValue === null ||
        item.targetValue === undefined ||
        Number(item.targetValue) <= 0
    ) {
      triggerToast(
          `KPI item ${number}: target value must be greater than 0.`,
          "error"
      );

      return false;
    }

    if (!item.unit?.trim()) {
      triggerToast(
          `KPI item ${number}: unit is required.`,
          "error"
      );

      return false;
    }

    if (
        item.weight === null ||
        item.weight === undefined ||
        Number(item.weight) <= 0
    ) {
      triggerToast(
          `KPI item ${number}: weight must be greater than 0.`,
          "error"
      );

      return false;
    }
  }

  if (
      Math.abs(
          totalFormWeight.value - 100
      ) > 0.001
  ) {
    triggerToast(
        `Total KPI weight must equal 100%. Current total: ${totalFormWeight.value}%.`,
        "error"
    );

    return false;
  }

  return true;
};


// =====================================================
// PAYLOAD
// =====================================================

const buildItemsPayload = () => {
  return templateForm.items.map(
      item => ({
        title:
            item.title.trim(),

        description:
            item.description?.trim() || null,

        metricType:
        item.metricType,

        targetValue:
            Number(item.targetValue),

        unit:
            item.unit.trim(),

        weight:
            Number(item.weight)
      })
  );
};


const buildCreatePayload = () => ({
  name:
      templateForm.name.trim(),

  description:
      templateForm.description?.trim() || null,

  items:
      buildItemsPayload()
});


const buildUpdatePayload = () => ({
  name:
      templateForm.name.trim(),

  description:
      templateForm.description?.trim() || null,

  items:
      buildItemsPayload(),

  isActive:
      Boolean(templateForm.isActive)
});


// =====================================================
// SAVE
// =====================================================

const saveTemplate = async () => {
  if (!validateTemplateForm()) {
    return;
  }

  try {
    saving.value = true;

    if (editingTemplate.value) {

      await performanceStore.updateKpiTemplate(
          editingTemplate.value.id,
          buildUpdatePayload()
      );

      triggerToast(
          "KPI template updated successfully."
      );

    } else {

      await performanceStore.createKpiTemplate(
          buildCreatePayload()
      );

      triggerToast(
          "KPI template created successfully."
      );
    }

    showFormModal.value = false;
    editingTemplate.value = null;

    resetTemplateForm();

    await loadTemplates();

  } catch (error) {
    console.error(
        "Save KPI template error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to save KPI template.",
        "error"
    );

  } finally {
    saving.value = false;
  }
};


// =====================================================
// DELETE
// =====================================================

const askDeleteTemplate = (
    template
) => {
  deletingTemplate.value =
      template;

  showDeleteConfirm.value =
      true;
};


const closeDeleteConfirm = () => {
  if (saving.value) {
    return;
  }

  showDeleteConfirm.value =
      false;

  deletingTemplate.value =
      null;
};


const deleteTemplate = async () => {
  if (!deletingTemplate.value?.id) {
    return;
  }

  try {
    saving.value = true;

    await performanceStore.deleteKpiTemplate(
        deletingTemplate.value.id
    );

    triggerToast(
        "KPI template deleted successfully."
    );

    showDeleteConfirm.value =
        false;

    deletingTemplate.value =
        null;

    await loadTemplates();

  } catch (error) {
    console.error(
        "Delete KPI template error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to delete KPI template.",
        "error"
    );

  } finally {
    saving.value = false;
  }
};


// =====================================================
// DISPLAY
// =====================================================

const metricTypeLabel = (
    metricType
) => {
  return {
        TASK_COMPLETION_RATE:
            "Task Completion Rate",

        TASK_ON_TIME_RATE:
            "On-time Delivery Rate",

        MANUAL:
            "Manual"
      }[metricType] ||
      metricType ||
      "Unknown";
};


const getTotalWeight = (
    items
) => {
  const total =
      (items ?? []).reduce(
          (sum, item) =>
              sum +
              Number(
                  item.weight ?? 0
              ),
          0
      );

  return Math.round(
      total * 100
  ) / 100;
};


const formatDateTime = (
    value
) => {
  if (!value) {
    return "—";
  }

  const date =
      new Date(value);

  if (
      Number.isNaN(
          date.getTime()
      )
  ) {
    return value;
  }

  return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
  );
};


// =====================================================
// INIT
// =====================================================

onMounted(() => {
  loadTemplates();
});
</script>