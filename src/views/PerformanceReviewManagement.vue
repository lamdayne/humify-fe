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
                         rounded-xl bg-blue-50 text-blue-600"
              >
                <ClipboardCheck class="h-6 w-6" />
              </div>

              <div>
                <h1 class="text-2xl font-bold text-slate-900">
                  Performance Review Management
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                  Create and manage employee performance reviews
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                  @click="loadReviews"
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
                  @click="openCreateReview"
                  class="inline-flex h-11 items-center justify-center gap-2
                         rounded-xl bg-blue-600 px-5
                         text-sm font-semibold text-white
                         shadow-sm transition hover:bg-blue-700"
              >
                <Plus class="h-4 w-4" />

                Create Review
              </button>
            </div>
          </div>
        </section>


        <!-- ===================================================== -->
        <!-- FILTER -->
        <!-- ===================================================== -->

        <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="mb-5">
            <h2 class="text-base font-bold text-slate-900">
              Filters
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Search performance reviews by employee, status and period.
            </p>
          </div>

          <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
          >

            <!-- Employee -->
            <!-- Employee -->
            <div
                ref="filterEmployeeRef"
                class="relative"
            >
              <label
                  class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Employee
              </label>

              <div class="relative">
                <input
                    v-model="filterEmployeeSearch"
                    @input="handleFilterEmployeeSearch"
                    @focus="handleFilterEmployeeFocus"
                    type="text"
                    autocomplete="off"
                    placeholder="Search employee..."
                    class="h-11 w-full rounded-xl border border-slate-300
               bg-white px-4 pr-10 text-sm text-slate-700
               outline-none transition
               placeholder:text-slate-400
               focus:border-blue-500
               focus:ring-4 focus:ring-blue-500/10"
                />

                <RefreshCw
                    v-if="filterEmployeeLoading"
                    class="absolute right-3 top-1/2 h-4 w-4
               -translate-y-1/2 animate-spin text-slate-400"
                />

                <button
                    v-else-if="filters.employeeId"
                    type="button"
                    @click="clearFilterEmployee"
                    class="absolute right-3 top-1/2 flex h-6 w-6
               -translate-y-1/2 items-center justify-center
               rounded-md text-slate-400 transition
               hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>

              <!-- Dropdown -->
              <div
                  v-if="showFilterEmployeeDropdown"
                  class="absolute left-0 right-0 z-50 mt-2
             max-h-64 overflow-y-auto rounded-xl
             border border-slate-200 bg-white
             py-1 shadow-xl"
              >
                <div
                    v-if="filterEmployeeLoading"
                    class="px-4 py-4 text-center text-sm text-slate-400"
                >
                  Searching employees...
                </div>

                <div
                    v-else-if="filterEmployeeOptions.length === 0"
                    class="px-4 py-4 text-center text-sm text-slate-400"
                >
                  No employees found.
                </div>

                <button
                    v-for="employee in filterEmployeeOptions"
                    v-else
                    :key="employee.id"
                    type="button"
                    @click="selectFilterEmployee(employee)"
                    class="flex w-full items-center gap-3
               px-4 py-3 text-left transition
               hover:bg-blue-50"
                >
                  <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center
                 rounded-full bg-blue-100
                 font-bold text-blue-600"
                  >
                    {{ employee.fullName?.charAt(0)?.toUpperCase() }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-800">
                      {{ employee.fullName }}
                    </p>

                    <p class="mt-0.5 truncate text-xs text-slate-400">
                      {{ employee.employeeCode }}

                      <span v-if="employee.email">
            · {{ employee.email }}
          </span>
                    </p>
                  </div>
                </button>
              </div>
            </div>


            <!-- Status -->
            <div>
              <label
                  class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                  v-model="filters.status"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  All statuses
                </option>

                <option value="DRAFT">
                  Draft
                </option>

                <option value="SELF_REVIEW">
                  Self Review
                </option>

                <option value="MANAGER_REVIEW">
                  Manager Review
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>


            <!-- Start -->
            <div>
              <label
                  class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Period Start
              </label>

              <input
                  v-model="filters.periodStart"
                  type="date"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10"
              />
            </div>


            <!-- End -->
            <div>
              <label
                  class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Period End
              </label>

              <input
                  v-model="filters.periodEnd"
                  type="date"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10"
              />
            </div>


            <!-- Actions -->
            <div class="flex items-end gap-2">
              <button
                  @click="applyFilters"
                  :disabled="loading"
                  class="h-11 flex-1 rounded-xl bg-blue-600 px-4
                         text-sm font-semibold text-white
                         transition hover:bg-blue-700
                         disabled:opacity-50"
              >
                Search
              </button>

              <button
                  @click="resetFilters"
                  class="h-11 rounded-xl border border-slate-300
                         bg-white px-4 text-sm font-semibold
                         text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

          </div>
        </section>


        <!-- ===================================================== -->
        <!-- TOTAL -->
        <!-- ===================================================== -->

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <SummaryCard
              title="Total Reviews"
              :value="pagination.totalElements"
              icon="all"
          />

        </section>


        <!-- ===================================================== -->
        <!-- REVIEW LIST -->
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
                All Performance Reviews
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Performance reviews in your company.
              </p>
            </div>
          </div>


          <!-- Loading -->
          <div
              v-if="loading"
              class="space-y-4 p-6"
          >
            <div
                v-for="n in 3"
                :key="n"
                class="animate-pulse rounded-2xl
                       border border-slate-200 p-5"
            >
              <div class="h-5 w-1/4 rounded bg-slate-200"></div>

              <div
                  class="mt-4 grid grid-cols-3 gap-4"
              >
                <div class="h-16 rounded bg-slate-100"></div>
                <div class="h-16 rounded bg-slate-100"></div>
                <div class="h-16 rounded bg-slate-100"></div>
              </div>
            </div>
          </div>


          <!-- Empty -->
          <div
              v-else-if="reviews.length === 0"
              class="px-6 py-16 text-center"
          >
            <div
                class="mx-auto flex h-16 w-16 items-center
                       justify-center rounded-2xl
                       bg-slate-100 text-slate-400"
            >
              <ClipboardCheck class="h-8 w-8" />
            </div>

            <h3 class="mt-5 text-lg font-bold text-slate-900">
              No performance reviews
            </h3>

            <p class="mt-2 text-sm text-slate-500">
              No reviews match the current filters.
            </p>

            <button
                @click="openCreateReview"
                class="mt-5 rounded-xl bg-blue-600
                       px-5 py-2.5 text-sm font-semibold
                       text-white transition hover:bg-blue-700"
            >
              Create Review
            </button>
          </div>


          <!-- List -->
          <div
              v-else
              class="space-y-4 p-6"
          >

            <article
                v-for="review in reviews"
                :key="review.id"
                class="rounded-2xl border border-slate-200
                       bg-white p-5 transition
                       hover:border-blue-200 hover:shadow-md"
            >

              <div
                  class="flex flex-col gap-5
                         lg:flex-row lg:items-start lg:justify-between"
              >

                <div class="min-w-0">

                  <div class="flex flex-wrap items-center gap-3">

                    <div
                        class="flex h-10 w-10 items-center justify-center
                               rounded-full bg-blue-100
                               font-bold text-blue-600"
                    >
                      {{ employeeInitial(review) }}
                    </div>

                    <div>
                      <h3 class="font-bold text-slate-900">
                        {{
                          review.employeeName ||
                          `Employee #${review.employeeId}`
                        }}
                      </h3>

                      <p class="mt-0.5 text-xs text-slate-400">
                        Employee ID: {{ review.employeeId }}
                      </p>
                    </div>

                    <span
                        class="rounded-full px-2.5 py-1
                               text-[11px] font-semibold"
                        :class="reviewStatusClass(review.status)"
                    >
                      {{ reviewStatusLabel(review.status) }}
                    </span>

                  </div>


                  <div
                      class="mt-4 flex flex-wrap gap-x-5
                             gap-y-2 text-sm text-slate-500"
                  >
                    <span>
                      {{ formatDate(review.periodStart) }}
                      →
                      {{ formatDate(review.periodEnd) }}
                    </span>

                    <span>
                      Reviewer:
                      <strong class="text-slate-700">
                        #{{ review.reviewerId }}
                      </strong>
                    </span>

                    <span v-if="review.templateName">
                      Template:
                      <strong class="text-slate-700">
                        {{ review.templateName }}
                      </strong>
                    </span>
                  </div>

                </div>


                <button
                    @click="openDetail(review)"
                    class="inline-flex items-center justify-center gap-2
                           rounded-xl border border-slate-200
                           px-4 py-2.5 text-sm font-semibold
                           text-slate-700 transition
                           hover:border-blue-200
                           hover:bg-blue-50 hover:text-blue-600"
                >
                  View Details

                  <ChevronRight class="h-4 w-4" />
                </button>

              </div>


              <!-- Score -->
              <div
                  class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >

                <div class="rounded-xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Self Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-slate-900">
                    {{ formatScore(review.selfScore) }}
                  </p>
                </div>


                <div class="rounded-xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Manager Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-slate-900">
                    {{ formatScore(review.reviewerScore) }}
                  </p>
                </div>


                <div class="rounded-xl bg-blue-50 p-4">
                  <p class="text-xs text-blue-500">
                    KPI Final Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-blue-600">
                    {{ formatScore(review.finalScore) }}
                  </p>
                </div>

              </div>

            </article>

          </div>


          <!-- Pagination -->
          <div
              v-if="pagination.totalElements > 0"
              class="border-t border-slate-200 px-6 pb-6"
          >
            <PaginationSection
                v-model:currentPage="pagination.currentPage"
                :total-items="pagination.totalElements"
                :total-page="pagination.totalPages"
                :page-size="pagination.pageSize"
                item-label="reviews"
                @changePage="handlePageChange"
            />
          </div>

        </section>


        <!-- ===================================================== -->
        <!-- CREATE REVIEW MODAL -->
        <!-- ===================================================== -->

        <Teleport to="body">
          <div
              v-if="showCreateModal"
              @click.self="closeCreateReview"
              class="fixed inset-0 z-[9999] flex items-center justify-center
             bg-slate-950/60 p-4 backdrop-blur-md"
          >
            <div
                class="flex max-h-[92vh] flex-col overflow-hidden
               rounded-3xl bg-white
               shadow-[0_25px_80px_rgba(15,23,42,0.3)]"
                style="width: 100%; max-width: 720px;"
            >


              <!-- Form -->
              <form
                  @submit.prevent="createReview"
                  class="min-h-0 flex-1 overflow-y-auto"
              >
                <div class="space-y-6 px-7 py-6">

                  <!-- Employee -->
                  <div class="relative">
                    <label
                        class="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Employee
                      <span class="text-red-500">*</span>
                    </label>

                    <div class="relative">
                      <input
                          v-model="employeeSearch"
                          @input="handleEmployeeSearch"
                          @focus="handleEmployeeFocus"
                          type="text"
                          autocomplete="off"
                          placeholder="Search by name or employee code"
                          class="h-12 w-full rounded-xl border border-slate-300
               bg-white px-4 pr-10 text-sm text-slate-700
               outline-none transition
               focus:border-blue-500
               focus:ring-4 focus:ring-blue-500/10"
                      />

                      <RefreshCw
                          v-if="employeeSearchLoading"
                          class="absolute right-4 top-1/2 h-4 w-4
               -translate-y-1/2 animate-spin text-slate-400"
                      />
                    </div>

                    <!-- Dropdown -->
                    <div
                        v-if="showEmployeeDropdown"
                        class="absolute left-0 right-0 z-50 mt-2
             max-h-64 overflow-y-auto rounded-xl
             border border-slate-200 bg-white
             py-1 shadow-xl"
                    >
                      <div
                          v-if="employeeSearchLoading"
                          class="px-4 py-4 text-center text-sm text-slate-400"
                      >
                        Searching employees...
                      </div>

                      <div
                          v-else-if="employeeOptions.length === 0"
                          class="px-4 py-4 text-center text-sm text-slate-400"
                      >
                        No employees found.
                      </div>

                      <button
                          v-for="employee in employeeOptions"
                          v-else
                          :key="employee.id"
                          type="button"
                          @click="selectEmployee(employee)"
                          class="flex w-full items-center gap-3 px-4 py-3
               text-left transition hover:bg-blue-50"
                      >
                        <!-- Avatar -->
                        <div
                            class="flex h-9 w-9 shrink-0 items-center
                 justify-center rounded-full
                 bg-blue-100 font-bold text-blue-600"
                        >
                          {{ employee.fullName?.charAt(0)?.toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-semibold text-slate-800">
                            {{ employee.fullName }}
                          </p>

                          <p class="mt-0.5 truncate text-xs text-slate-400">
                            {{ employee.employeeCode }}
                            <span v-if="employee.email">
            · {{ employee.email }}
          </span>
                          </p>
                        </div>
                      </button>
                    </div>

                    <p
                        v-if="createForm.employeeId"
                        class="mt-2 text-xs font-medium text-green-600"
                    >
                      Selected employee ID: #{{ createForm.employeeId }}
                    </p>
                  </div>


                  <!-- Reviewer -->
                  <div>
                    <label
                        class="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Reviewer
                      <span class="text-red-500">*</span>
                    </label>

                    <select
                        v-model.number="createForm.reviewerId"
                        :disabled="formLoading"
                        required
                        class="h-12 w-full rounded-xl border border-slate-300
             bg-white px-4 text-sm text-slate-700
             outline-none transition
             focus:border-blue-500
             focus:ring-4 focus:ring-blue-500/10
             disabled:cursor-not-allowed
             disabled:bg-slate-100"
                    >
                      <option
                          :value="null"
                          disabled
                      >
                        {{
                          formLoading
                              ? "Loading reviewers..."
                              : "Select reviewer"
                        }}
                      </option>

                      <option
                          v-for="reviewer in reviewers"
                          :key="reviewer.id"
                          :value="reviewer.id"
                      >
                        {{ reviewer.email }} - #{{ reviewer.id }}
                      </option>
                    </select>
                    <p class="mt-2 text-xs text-slate-400">
                      Select the user responsible for reviewing this employee.
                    </p>
                  </div>


                  <!-- Template -->
                  <div>
                    <label
                        class="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      KPI Template
                      <span class="text-red-500">*</span>
                    </label>

                    <select
                        v-model.number="createForm.templateId"
                        :disabled="formLoading"
                        required
                        class="h-12 w-full rounded-xl border border-slate-300
             bg-white px-4 text-sm text-slate-700
             outline-none transition
             focus:border-blue-500
             focus:ring-4 focus:ring-blue-500/10
             disabled:cursor-not-allowed
             disabled:bg-slate-100"
                    >
                      <option
                          :value="null"
                          disabled
                      >
                        {{
                          formLoading
                              ? "Loading templates..."
                              : "Select KPI template"
                        }}
                      </option>

                      <option
                          v-for="template in templates"
                          :key="template.id"
                          :value="template.id"
                      >
                        {{ template.name }}
                      </option>
                    </select>
                    <p class="mt-2 text-xs text-slate-400">
                      KPI targets will be copied from the selected template.
                    </p>
                  </div>


                  <!-- Period -->
                  <div>
                    <div class="mb-4">
                      <h3 class="text-sm font-bold text-slate-900">
                        Review Period
                      </h3>

                      <p class="mt-1 text-xs text-slate-500">
                        Select the period used to calculate KPI performance.
                      </p>
                    </div>

                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >

                      <div>
                        <label
                            class="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Start Date
                          <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="createForm.periodStart"
                            type="date"
                            required
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
                          End Date
                          <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="createForm.periodEnd"
                            type="date"
                            required
                            class="h-12 w-full rounded-xl
                                   border border-slate-300 bg-white
                                   px-4 text-sm text-slate-700
                                   outline-none transition
                                   focus:border-blue-500
                                   focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                    </div>
                  </div>

                </div>


                <!-- Footer -->
                <div
                    class="flex shrink-0 justify-end gap-3
                           border-t border-slate-200 bg-white
                           px-7 py-5"
                >
                  <button
                      type="button"
                      @click="closeCreateReview"
                      :disabled="saving"
                      class="rounded-xl border border-slate-300
                             bg-white px-5 py-2.5
                             text-sm font-semibold text-slate-700
                             transition hover:bg-slate-50"
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

                    {{ saving ? "Creating..." : "Create Review" }}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </Teleport>


        <!-- ===================================================== -->
        <!-- DETAIL MODAL -->
        <!-- ===================================================== -->

        <Teleport to="body">
          <div
              v-if="showDetailModal"
              @click.self="closeDetail"
              class="fixed inset-0 z-[9999]
                     flex items-center justify-center
                     bg-slate-950/60 p-4 backdrop-blur-md"
          >

            <div
                class="flex max-h-[92vh] w-[calc(100vw-2rem)]
                       max-w-4xl flex-col overflow-hidden
                       rounded-3xl bg-white shadow-2xl"
            >

              <div
                  class="flex shrink-0 items-start justify-between
                         border-b border-slate-200 px-7 py-6"
              >
                <div v-if="selectedReview">
                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="text-xl font-bold text-slate-900">
                      Performance Review
                    </h2>

                    <span
                        class="rounded-full px-3 py-1
                               text-xs font-semibold"
                        :class="reviewStatusClass(selectedReview.status)"
                    >
                      {{ reviewStatusLabel(selectedReview.status) }}
                    </span>
                  </div>

                  <p class="mt-2 text-sm text-slate-500">
                    {{ selectedReview.employeeName }}
                  </p>
                </div>

                <button
                    @click="closeDetail"
                    class="flex h-9 w-9 items-center justify-center
                           rounded-xl text-xl text-slate-400
                           hover:bg-slate-100"
                >
                  ×
                </button>
              </div>


              <div
                  v-if="detailLoading"
                  class="flex min-h-[400px] items-center justify-center"
              >
                <RefreshCw
                    class="h-7 w-7 animate-spin text-blue-600"
                />
              </div>


              <div
                  v-else-if="selectedReview"
                  class="min-h-0 flex-1 overflow-y-auto p-7"
              >

                <div class="space-y-6">

                  <!-- Info -->
                  <section
                      class="grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <div class="rounded-xl bg-slate-50 p-4">
                      <p class="text-xs text-slate-400">
                        Template
                      </p>

                      <p class="mt-2 font-bold text-slate-900">
                        {{ selectedReview.templateName }}
                      </p>
                    </div>

                    <div class="rounded-xl bg-slate-50 p-4">
                      <p class="text-xs text-slate-400">
                        Reviewer
                      </p>

                      <p class="mt-2 font-bold text-slate-900">
                        #{{ selectedReview.reviewerId }}
                      </p>
                    </div>

                    <div class="rounded-xl bg-blue-50 p-4">
                      <p class="text-xs text-blue-500">
                        Final Score
                      </p>

                      <p class="mt-2 font-bold text-blue-600">
                        {{ formatScore(selectedReview.finalScore) }}
                      </p>
                    </div>
                  </section>


                  <!-- Period -->
                  <section
                      class="rounded-2xl border border-slate-200 p-5"
                  >
                    <h3 class="font-bold text-slate-900">
                      Review Period
                    </h3>

                    <p class="mt-2 text-sm text-slate-500">
                      {{ formatDate(selectedReview.periodStart) }}
                      →
                      {{ formatDate(selectedReview.periodEnd) }}
                    </p>
                  </section>


                  <!-- KPI -->
                  <section
                      class="rounded-2xl border border-slate-200 p-5"
                  >
                    <h3 class="font-bold text-slate-900">
                      KPI Results
                    </h3>

                    <div class="mt-4 space-y-3">
                      <div
                          v-for="kpi in selectedReview.kpis || []"
                          :key="kpi.id"
                          class="rounded-xl bg-slate-50 p-4"
                      >
                        <div
                            class="flex items-start justify-between gap-4"
                        >
                          <div>
                            <p class="font-semibold text-slate-800">
                              {{ kpi.title }}
                            </p>

                            <p
                                v-if="kpi.description"
                                class="mt-1 text-xs text-slate-500"
                            >
                              {{ kpi.description }}
                            </p>
                          </div>

                          <span
                              class="rounded-full px-2.5 py-1
                                     text-[11px] font-semibold"
                              :class="kpiStatusClass(kpi.status)"
                          >
                            {{ kpiStatusLabel(kpi.status) }}
                          </span>
                        </div>

                        <div
                            class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
                        >
                          <div>
                            <p class="text-xs text-slate-400">
                              Target
                            </p>

                            <p class="font-bold text-slate-700">
                              {{ kpi.targetValue }}{{ kpi.unit }}
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-slate-400">
                              Actual
                            </p>

                            <p class="font-bold text-blue-600">
                              {{ kpi.currentValue }}{{ kpi.unit }}
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-slate-400">
                              Weight
                            </p>

                            <p class="font-bold text-slate-700">
                              {{ kpi.weight }}%
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-slate-400">
                              Score
                            </p>

                            <p class="font-bold text-slate-700">
                              {{ formatScore(kpi.score) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>


                  <!-- Feedback -->
                  <section
                      v-if="selectedReview.feedback"
                      class="rounded-2xl border border-slate-200 p-5"
                  >
                    <h3 class="font-bold text-slate-900">
                      Manager Feedback
                    </h3>

                    <p
                        class="mt-3 rounded-xl bg-slate-50
                               p-4 text-sm leading-6 text-slate-600"
                    >
                      {{ selectedReview.feedback }}
                    </p>
                  </section>

                </div>
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
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from "vue";

import {
  ChevronRight,
  ClipboardCheck,
  Plus,
  RefreshCw
} from "@lucide/vue";

import MainContent from "../components/MainContent.vue";
import ToastMessage from "../components/ToastMessage.vue";
import PaginationSection from "../components/PaginationSection.vue";
import SummaryCard from "../components/SummaryCard.vue";
import { useEmployeeStore } from "../store/employeeStore.js";
import { useUserStore } from "../store/userStore.js";


import { usePerformanceStore } from "../store/performanceStore.js";

const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const performanceStore =
    usePerformanceStore();


// =====================================================
// STATE
// =====================================================

const reviewers = ref([]);
const templates = ref([]);

const formLoading = ref(false);

const reviews = ref([]);

const loading = ref(false);
const saving = ref(false);
const detailLoading = ref(false);

const showCreateModal = ref(false);
const showDetailModal = ref(false);

const selectedReview = ref(null);
// CREATE REVIEW EMPLOYEE SEARCH
const employeeSearch = ref("");
const employeeOptions = ref([]);
const employeeSearchLoading = ref(false);
const showEmployeeDropdown = ref(false);
let employeeSearchTimer = null;

// FILTER EMPLOYEE SEARCH
const filterEmployeeSearch = ref("");
const filterEmployeeOptions = ref([]);
const filterEmployeeLoading = ref(false);
const showFilterEmployeeDropdown = ref(false);

const filterEmployeeRef = ref(null);

let filterEmployeeSearchTimer = null;


// =====================================================
// FILTER
// =====================================================

const filters = reactive({
  employeeId: null,
  status: "",
  periodStart: "",
  periodEnd: ""
});




// =====================================================
// PAGINATION
// =====================================================

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0
});


// =====================================================
// CREATE FORM
// =====================================================

const createForm = reactive({
  employeeId: null,
  reviewerId: null,
  templateId: null,
  periodStart: "",
  periodEnd: ""
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

// search
const loadEmployeeOptions = async () => {
  try {
    employeeSearchLoading.value = true;

    const response =
        await employeeStore.searchEmployees(
            employeeSearch.value,
            0,
            20
        );

    employeeOptions.value =
        response?.data?.items ?? [];

  } catch (error) {
    console.error(
        "Search employee error:",
        error.response?.data || error
    );

    employeeOptions.value = [];

  } finally {
    employeeSearchLoading.value = false;
  }
};
const handleEmployeeSearch = () => {
  createForm.employeeId = null;

  if (employeeSearchTimer) {
    clearTimeout(employeeSearchTimer);
  }

  employeeSearchTimer = setTimeout(() => {
    loadEmployeeOptions();
  }, 300);
};

const handleEmployeeFocus = async () => {
  showEmployeeDropdown.value = true;

  if (!employeeOptions.value.length) {
    await loadEmployeeOptions();
  }
};
const selectEmployee = (employee) => {
  createForm.employeeId = employee.id;

  employeeSearch.value =
      `${employee.fullName} - ${employee.employeeCode}`;

  showEmployeeDropdown.value = false;
};

// =====================================================
// FILTER EMPLOYEE SEARCH
// =====================================================

const loadFilterEmployeeOptions = async () => {
  try {
    filterEmployeeLoading.value = true;

    const response =
        await employeeStore.searchEmployees(
            filterEmployeeSearch.value,
            0,
            20
        );

    filterEmployeeOptions.value =
        response?.data?.items ?? [];

  } catch (error) {
    console.error(
        "Search filter employee error:",
        error.response?.data || error
    );

    filterEmployeeOptions.value = [];

  } finally {
    filterEmployeeLoading.value = false;
  }
};


const handleFilterEmployeeSearch = () => {
  /*
   * Khi user bắt đầu sửa text,
   * employee đã chọn trước đó không còn hợp lệ nữa.
   */
  filters.employeeId = null;

  if (filterEmployeeSearchTimer) {
    clearTimeout(filterEmployeeSearchTimer);
  }

  filterEmployeeSearchTimer = setTimeout(() => {
    loadFilterEmployeeOptions();
  }, 300);
};


const handleFilterEmployeeFocus = async () => {
  showFilterEmployeeDropdown.value = true;

  if (!filterEmployeeOptions.value.length) {
    await loadFilterEmployeeOptions();
  }
};


const selectFilterEmployee = (employee) => {
  filters.employeeId = employee.id;

  filterEmployeeSearch.value =
      `${employee.fullName} - ${employee.employeeCode}`;

  showFilterEmployeeDropdown.value = false;
};


const clearFilterEmployee = () => {
  filters.employeeId = null;

  filterEmployeeSearch.value = "";

  filterEmployeeOptions.value = [];

  showFilterEmployeeDropdown.value = false;
};

//đóng dropdown
const handleDocumentClick = (event) => {
  if (
      filterEmployeeRef.value &&
      !filterEmployeeRef.value.contains(event.target)
  ) {
    showFilterEmployeeDropdown.value = false;
  }
};
// =====================================================
// LOAD
// =====================================================
const loadCreateFormData = async () => {
  try {
    formLoading.value = true;

    const [
      userResponse,
      templateResponse
    ] = await Promise.all([
      userStore.getUsers({
        page: 0,
        size: 100,
        sorts: "id,asc"
      }),

      performanceStore.getKpiTemplates()
    ]);

    reviewers.value =
        (userResponse?.data?.data?.items ?? [])
            .filter(user =>
                user.active === true
            );

    templates.value =
        (templateResponse?.data?.data ?? [])
            .filter(template =>
                template.isActive === true
            );

  } catch (error) {
    console.error(
        "Load create review form data error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to load create review data.",
        "error"
    );

  } finally {
    formLoading.value = false;
  }
};


const loadReviews = async () => {

  try {
    loading.value = true;

    const response =
        await performanceStore.getReviews({
          employeeId:
          filters.employeeId,

          status:
              filters.status || null,

          periodStart:
              filters.periodStart || null,

          periodEnd:
              filters.periodEnd || null,

          page:
              pagination.currentPage - 1,

          size:
          pagination.pageSize,

          sorts:
              "id,desc"
        });

    const data =
        response?.data?.data ?? {};

    reviews.value =
        data.items ?? [];

    pagination.totalPages =
        data.totalPages ?? 0;

    pagination.totalElements =
        data.totalElements ?? 0;

  } catch (error) {

    console.error(
        "Load performance reviews error:",
        error.response?.data || error
    );

    reviews.value = [];

    pagination.totalPages = 0;
    pagination.totalElements = 0;

    triggerToast(
        error.response?.data?.message ||
        "Failed to load performance reviews.",
        "error"
    );

  } finally {
    loading.value = false;
  }
};


// =====================================================
// FILTER
// =====================================================

const applyFilters = async () => {

  if (
      filters.periodStart &&
      filters.periodEnd &&
      filters.periodEnd < filters.periodStart
  ) {
    triggerToast(
        "Period end must be after period start.",
        "error"
    );

    return;
  }

  pagination.currentPage = 1;

  await loadReviews();
};


const resetFilters = async () => {

  Object.assign(filters, {
    employeeId: null,
    status: "",
    periodStart: "",
    periodEnd: ""
  });

  filterEmployeeSearch.value = "";
  filterEmployeeOptions.value = [];
  showFilterEmployeeDropdown.value = false;

  pagination.currentPage = 1;

  await loadReviews();
};


// =====================================================
// PAGINATION
// =====================================================

const handlePageChange = async (page) => {

  pagination.currentPage = page;

  await loadReviews();
};


// =====================================================
// CREATE
// =====================================================

const resetCreateForm = () => {
  Object.assign(createForm, {
    employeeId: null,
    reviewerId: null,
    templateId: null,
    periodStart: "",
    periodEnd: ""
  });

  employeeSearch.value = "";
  employeeOptions.value = [];
  showEmployeeDropdown.value = false;
};


const openCreateReview = async () => {
  resetCreateForm();

  showCreateModal.value = true;

  await loadCreateFormData();
};


const closeCreateReview = () => {

  if (saving.value) {
    return;
  }

  showCreateModal.value = false;

  resetCreateForm();
};


const createReview = async () => {

  if (!createForm.employeeId) {
    triggerToast(
        "Please enter employee ID.",
        "error"
    );

    return;
  }

  if (!createForm.reviewerId) {
    triggerToast(
        "Please enter reviewer ID.",
        "error"
    );

    return;
  }

  if (!createForm.templateId) {
    triggerToast(
        "Please enter KPI template ID.",
        "error"
    );

    return;
  }

  if (
      !createForm.periodStart ||
      !createForm.periodEnd
  ) {
    triggerToast(
        "Please select review period.",
        "error"
    );

    return;
  }

  if (
      createForm.periodEnd <
      createForm.periodStart
  ) {
    triggerToast(
        "Period end must be after period start.",
        "error"
    );

    return;
  }

  const payload = {
    employeeId:
        Number(createForm.employeeId),

    reviewerId:
        Number(createForm.reviewerId),

    templateId:
        Number(createForm.templateId),

    periodStart:
    createForm.periodStart,

    periodEnd:
    createForm.periodEnd
  };

  try {

    saving.value = true;

    await performanceStore.createReview(
        payload
    );

    showCreateModal.value = false;

    resetCreateForm();

    triggerToast(
        "Performance review created successfully."
    );

    pagination.currentPage = 1;

    await loadReviews();

  } catch (error) {

    console.error(
        "Create performance review error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to create performance review.",
        "error"
    );

  } finally {
    saving.value = false;
  }
};


// =====================================================
// DETAIL
// =====================================================

const openDetail = async (review) => {

  if (!review?.id) {
    return;
  }

  try {

    showDetailModal.value = true;
    detailLoading.value = true;

    const response =
        await performanceStore.getReviewById(
            review.id
        );

    selectedReview.value =
        response?.data?.data ?? null;

  } catch (error) {

    console.error(
        "Load review detail error:",
        error.response?.data || error
    );

    showDetailModal.value = false;

    triggerToast(
        error.response?.data?.message ||
        "Failed to load review detail.",
        "error"
    );

  } finally {

    detailLoading.value = false;
  }
};


const closeDetail = () => {

  showDetailModal.value = false;

  selectedReview.value = null;
};


// =====================================================
// REVIEW STATUS
// =====================================================

const reviewStatusLabel = (status) => {

  return {
    DRAFT: "Draft",
    SELF_REVIEW: "Self Review",
    MANAGER_REVIEW: "Manager Review",
    COMPLETED: "Completed"
  }[status] || status || "Unknown";
};


const reviewStatusClass = (status) => {

  return {
        DRAFT:
            "bg-slate-100 text-slate-700",

        SELF_REVIEW:
            "bg-blue-100 text-blue-700",

        MANAGER_REVIEW:
            "bg-orange-100 text-orange-700",

        COMPLETED:
            "bg-green-100 text-green-700"

      }[status] ||
      "bg-slate-100 text-slate-700";
};


// =====================================================
// KPI STATUS
// =====================================================

const kpiStatusLabel = (status) => {

  return {
    IN_PROGRESS: "In Progress",
    ACHIEVED: "Achieved",
    FAILED: "Failed"
  }[status] || status || "Unknown";
};


const kpiStatusClass = (status) => {

  return {
        IN_PROGRESS:
            "bg-blue-100 text-blue-700",

        ACHIEVED:
            "bg-green-100 text-green-700",

        FAILED:
            "bg-red-100 text-red-700"

      }[status] ||
      "bg-slate-100 text-slate-700";
};


// =====================================================
// FORMAT
// =====================================================

const employeeInitial = (review) => {

  if (review?.employeeName) {
    return review.employeeName
        .trim()
        .charAt(0)
        .toUpperCase();
  }

  return review?.employeeId ?? "?";
};


const formatScore = (value) => {

  if (
      value === null ||
      value === undefined
  ) {
    return "—";
  }

  return Number(value)
      .toFixed(2)
      .replace(/\.00$/, "");
};


const formatDate = (value) => {

  if (!value) {
    return "—";
  }

  const parts =
      String(value).split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] =
      parts;

  return `${day}/${month}/${year}`;
};


// =====================================================
// INIT
// =====================================================

onMounted(() => {
  loadReviews();

  document.addEventListener(
      "click",
      handleDocumentClick
  );
});


onBeforeUnmount(() => {
  document.removeEventListener(
      "click",
      handleDocumentClick
  );

  if (employeeSearchTimer) {
    clearTimeout(employeeSearchTimer);
  }

  if (filterEmployeeSearchTimer) {
    clearTimeout(filterEmployeeSearchTimer);
  }

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
});
</script>