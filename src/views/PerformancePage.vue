<template>
  <MainContent>
    <div class="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div class="mx-auto max-w-7xl space-y-6">

        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div class="flex items-center gap-3">
              <div
                  class="flex h-11 w-11 items-center justify-center
                         rounded-xl bg-blue-50 text-blue-600"
              >
                <ClipboardCheck class="h-6 w-6" />
              </div>

              <div>
                <h1 class="text-2xl font-bold text-slate-900">
                  Performance Reviews
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                  Review and evaluate employee performance
                </p>
              </div>
            </div>

            <button
                @click="refreshPage"
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

          </div>
        </section>


        <!-- ===================================================== -->
        <!-- FILTER -->
        <!-- ===================================================== -->

        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div class="mb-5">
            <h2 class="text-base font-bold text-slate-900">
              Filters
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Filter performance reviews assigned to you.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

            <!-- Employee -->
            <!-- Employee Search -->
            <div
                ref="filterEmployeeRef"
                class="relative"
            >
              <label class="mb-2 block text-sm font-semibold text-slate-700">
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
               px-4 py-3 text-left
               transition hover:bg-blue-50"
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
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                  v-model="filters.status"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SELF_REVIEW">Self Review</option>
                <option value="MANAGER_REVIEW">Manager Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>


            <!-- Start -->
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Period Start
              </label>

              <input
                  v-model="filters.periodStart"
                  type="date"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>


            <!-- End -->
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Period End
              </label>

              <input
                  v-model="filters.periodEnd"
                  type="date"
                  class="h-11 w-full rounded-xl border border-slate-300
                         bg-white px-4 text-sm text-slate-700
                         outline-none transition
                         focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>


            <!-- Buttons -->
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
                         bg-white px-4 text-sm font-semibold text-slate-600
                         transition hover:bg-slate-50"
              >
                Reset
              </button>

            </div>

          </div>
        </section>


        <!-- ===================================================== -->
        <!-- SUMMARY -->
        <!-- ===================================================== -->
        <section
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >

          <SummaryCard
              title="Total Reviews"
              :value="summary.totalReviews"
              icon="all"
          />

          <SummaryCard
              title="Awaiting Self Review"
              :value="summary.awaitingSelfReview"
              icon="self"
          />

          <SummaryCard
              title="Awaiting Manager Review"
              :value="summary.awaitingManagerReview"
              icon="manager"
          />

          <SummaryCard
              title="Awaiting Completion"
              :value="summary.awaitingCompletion"
              icon="pending"
          />

          <SummaryCard
              title="Completed"
              :value="summary.completed"
              icon="completed"
          />

        </section>


        <!-- ===================================================== -->
        <!-- LIST -->
        <!-- ===================================================== -->

        <section
            class="overflow-hidden rounded-2xl
                   border border-slate-200 bg-white shadow-sm"
        >

          <!-- Header -->
          <div
              class="flex items-center justify-between
                     border-b border-slate-200 px-6 py-5"
          >
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Assigned Reviews
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Performance reviews where you are the reviewer.
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
                class="animate-pulse rounded-2xl border
                       border-slate-200 p-5"
            >
              <div class="h-5 w-1/4 rounded bg-slate-200"></div>

              <div class="mt-3 h-4 w-1/2 rounded bg-slate-100"></div>

              <div class="mt-5 grid grid-cols-3 gap-4">
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
                       justify-center rounded-2xl bg-slate-100
                       text-slate-400"
            >
              <ClipboardCheck class="h-8 w-8" />
            </div>

            <h3 class="mt-5 text-lg font-bold text-slate-900">
              No performance reviews
            </h3>

            <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No performance reviews match the current filters.
            </p>
          </div>


          <!-- Review Cards -->
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

              <!-- Top -->
              <div
                  class="flex flex-col gap-4
                         lg:flex-row lg:items-start lg:justify-between"
              >

                <div class="min-w-0">

                  <div class="flex flex-wrap items-center gap-3">

                    <div
                        class="flex h-10 w-10 items-center
                               justify-center rounded-full
                               bg-blue-100 font-bold text-blue-600"
                    >
                      {{ employeeInitial(review) }}
                    </div>

                    <div>
                      <h3 class="font-bold text-slate-900">
                        {{ review.employeeName || `Employee #${review.employeeId}` }}
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
                      class="mt-4 flex flex-wrap items-center
                             gap-x-5 gap-y-2 text-sm text-slate-500"
                  >
                    <span>
                      {{ formatDate(review.periodStart) }}
                      →
                      {{ formatDate(review.periodEnd) }}
                    </span>

                    <span v-if="review.templateName">
                      Template:
                      <strong class="font-semibold text-slate-700">
                        {{ review.templateName }}
                      </strong>
                    </span>
                  </div>

                </div>


                <button
                    @click="openReview(review)"
                    class="inline-flex items-center justify-center gap-2
                           rounded-xl border border-slate-200 px-4 py-2.5
                           text-sm font-semibold text-slate-700
                           transition
                           hover:border-blue-200 hover:bg-blue-50
                           hover:text-blue-600"
                >
                  View Details

                  <ChevronRight class="h-4 w-4" />
                </button>

              </div>


              <!-- Scores -->
              <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div class="rounded-xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Self Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-slate-900">
                    {{ score(review.selfScore) }}
                  </p>
                </div>


                <div class="rounded-xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Manager Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-slate-900">
                    {{ score(review.reviewerScore) }}
                  </p>
                </div>


                <div class="rounded-xl bg-blue-50 p-4">
                  <p class="text-xs text-blue-500">
                    KPI Final Score
                  </p>

                  <p class="mt-2 text-xl font-bold text-blue-600">
                    {{ score(review.finalScore) }}
                  </p>
                </div>

              </div>


              <!-- KPI preview -->
              <div
                  v-if="review.kpis?.length"
                  class="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2"
              >

                <div
                    v-for="kpi in review.kpis"
                    :key="kpi.id"
                    class="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >

                  <div class="flex items-center justify-between gap-3">

                    <p class="truncate text-sm font-semibold text-slate-700">
                      {{ kpi.title }}
                    </p>

                    <span
                        class="rounded-full px-2 py-1 text-[10px] font-bold"
                        :class="kpiStatusClass(kpi.status)"
                    >
                      {{ kpiStatusLabel(kpi.status) }}
                    </span>

                  </div>

                  <div class="mt-3 flex items-center justify-between text-xs">
                    <span class="text-slate-500">
                      {{ kpi.currentValue ?? 0 }}{{ kpi.unit }}
                      / {{ kpi.targetValue }}{{ kpi.unit }}
                    </span>

                    <span class="font-bold text-slate-700">
                      {{ kpi.score ?? 0 }} pts
                    </span>
                  </div>

                  <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                        class="h-full rounded-full transition-all"
                        :class="kpiProgressColor(kpi)"
                        :style="{
                          width: `${Math.min(kpiProgress(kpi), 100)}%`
                        }"
                    ></div>
                  </div>

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
        <!-- DETAIL MODAL -->
        <!-- ===================================================== -->

        <div
            v-if="showDetail"
            @click.self="closeDetail"
            class="fixed inset-0 z-[100]
                   flex items-center justify-center
                   bg-slate-950/60 p-4 backdrop-blur-md"
        >

          <div
              class="flex max-h-[92vh] w-full max-w-5xl
                     flex-col overflow-hidden rounded-3xl bg-white
                     shadow-[0_25px_80px_rgba(15,23,42,0.25)]"
          >

            <!-- Modal Header -->
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
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="reviewStatusClass(selectedReview.status)"
                  >
                    {{ reviewStatusLabel(selectedReview.status) }}
                  </span>

                </div>

                <p class="mt-2 text-sm text-slate-500">
                  {{ selectedReview.employeeName }}
                  ·
                  {{ formatDate(selectedReview.periodStart) }}
                  →
                  {{ formatDate(selectedReview.periodEnd) }}
                </p>

              </div>

              <button
                  @click="closeDetail"
                  class="flex h-10 w-10 items-center
                         justify-center rounded-xl text-xl
                         text-slate-400 transition
                         hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>


            <!-- Loading Detail -->
            <div
                v-if="detailLoading"
                class="flex min-h-[400px] items-center justify-center"
            >
              <RefreshCw class="h-7 w-7 animate-spin text-blue-600" />
            </div>


            <!-- Modal Body -->
            <div
                v-else-if="selectedReview"
                class="min-h-0 flex-1 overflow-y-auto px-7 py-7"
            >

              <div class="space-y-7">

                <!-- Scores -->
                <section class="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div class="rounded-2xl bg-slate-50 p-5">
                    <p class="text-sm text-slate-500">
                      Self Score
                    </p>

                    <p class="mt-2 text-3xl font-bold text-slate-900">
                      {{ score(selectedReview.selfScore) }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-5">
                    <p class="text-sm text-slate-500">
                      Manager Score
                    </p>

                    <p class="mt-2 text-3xl font-bold text-slate-900">
                      {{ score(selectedReview.reviewerScore) }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-blue-50 p-5">
                    <p class="text-sm text-blue-500">
                      KPI Final Score
                    </p>

                    <p class="mt-2 text-3xl font-bold text-blue-600">
                      {{ score(selectedReview.finalScore) }}
                    </p>
                  </div>

                </section>


                <!-- ================================================= -->
                <!-- KPI -->
                <!-- ================================================= -->

                <section class="rounded-2xl border border-slate-200 p-6">

                  <div
                      class="flex flex-col gap-3
                             sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <h3 class="font-bold text-slate-900">
                        KPI Performance
                      </h3>

                      <p class="mt-1 text-sm text-slate-500">
                        Calculated automatically from employee tasks.
                      </p>
                    </div>

                    <button
                        v-if="selectedReview.status !== 'COMPLETED'"
                        @click="refreshKpis"
                        :disabled="saving"
                        class="inline-flex items-center justify-center gap-2
                               rounded-xl border border-blue-200
                               bg-blue-50 px-4 py-2.5
                               text-sm font-semibold text-blue-600
                               transition hover:bg-blue-100
                               disabled:opacity-50"
                    >
                      <RefreshCw
                          class="h-4 w-4"
                          :class="{ 'animate-spin': refreshingKpi }"
                      />

                      Refresh KPIs
                    </button>

                  </div>


                  <div
                      v-if="!selectedReview.kpis?.length"
                      class="py-10 text-center text-sm text-slate-400"
                  >
                    No KPI data.
                  </div>


                  <div
                      v-else
                      class="mt-5 space-y-4"
                  >

                    <div
                        v-for="kpi in selectedReview.kpis"
                        :key="kpi.id"
                        class="rounded-2xl border border-slate-200 p-5"
                    >

                      <div
                          class="flex flex-col gap-3
                                 sm:flex-row sm:items-start sm:justify-between"
                      >

                        <div>
                          <div class="flex flex-wrap items-center gap-2">

                            <h4 class="font-bold text-slate-900">
                              {{ kpi.title }}
                            </h4>

                            <span
                                class="rounded-full px-2.5 py-1
                                       text-[11px] font-semibold"
                                :class="kpiStatusClass(kpi.status)"
                            >
                              {{ kpiStatusLabel(kpi.status) }}
                            </span>

                          </div>

                          <p
                              v-if="kpi.description"
                              class="mt-1 text-sm text-slate-500"
                          >
                            {{ kpi.description }}
                          </p>
                        </div>


                        <div class="text-left sm:text-right">
                          <p class="text-xs text-slate-400">
                            KPI Score
                          </p>

                          <p class="mt-1 text-lg font-bold text-blue-600">
                            {{ kpi.score ?? 0 }}
                          </p>
                        </div>

                      </div>


                      <div class="mt-5 grid grid-cols-3 gap-3">

                        <div class="rounded-xl bg-slate-50 p-3">
                          <p class="text-xs text-slate-400">
                            Current
                          </p>

                          <p class="mt-1 font-bold text-slate-800">
                            {{ kpi.currentValue ?? 0 }}{{ kpi.unit }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-slate-50 p-3">
                          <p class="text-xs text-slate-400">
                            Target
                          </p>

                          <p class="mt-1 font-bold text-slate-800">
                            {{ kpi.targetValue }}{{ kpi.unit }}
                          </p>
                        </div>

                        <div class="rounded-xl bg-slate-50 p-3">
                          <p class="text-xs text-slate-400">
                            Weight
                          </p>

                          <p class="mt-1 font-bold text-slate-800">
                            {{ kpi.weight }}%
                          </p>
                        </div>

                      </div>


                      <div class="mt-4">

                        <div class="mb-2 flex justify-between text-xs">
                          <span class="text-slate-400">
                            Progress
                          </span>

                          <span class="font-semibold text-slate-600">
                            {{ kpiProgress(kpi) }}%
                          </span>
                        </div>

                        <div class="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                              class="h-full rounded-full transition-all"
                              :class="kpiProgressColor(kpi)"
                              :style="{
                                width: `${Math.min(kpiProgress(kpi), 100)}%`
                              }"
                          ></div>
                        </div>

                      </div>

                    </div>

                  </div>

                </section>


                <!-- ================================================= -->
                <!-- SELF REVIEW RESULT -->
                <!-- ================================================= -->

                <section
                    v-if="selectedReview.selfScore !== null"
                    class="rounded-2xl border border-slate-200 p-6"
                >
                  <h3 class="font-bold text-slate-900">
                    Employee Self Review
                  </h3>

                  <p class="mt-3 text-sm text-slate-500">
                    Employee submitted score
                    <strong class="text-slate-800">
                      {{ selectedReview.selfScore }}
                    </strong>
                  </p>
                </section>


                <!-- ================================================= -->
                <!-- MANAGER REVIEW -->
                <!-- ================================================= -->

                <section
                    v-if="selectedReview.status === 'SELF_REVIEW'"
                    class="rounded-2xl border border-orange-100
                           bg-orange-50/50 p-6"
                >

                  <div>
                    <h3 class="font-bold text-slate-900">
                      Manager Evaluation
                    </h3>

                    <p class="mt-1 text-sm text-slate-500">
                      Evaluate this employee's performance.
                    </p>
                  </div>


                  <!-- Score -->
                  <!-- Manager Score -->
                  <div class="mt-5">
                    <label class="text-sm font-semibold text-slate-700">
                      Manager Score
                    </label>

                    <input
                        v-model.number="managerForm.reviewerScore"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter score from 0 to 100"
                        class="mt-2 h-12 w-full rounded-xl
           border border-slate-300 bg-white px-4
           text-sm font-semibold text-slate-700
           outline-none transition
           focus:border-orange-400
           focus:ring-4 focus:ring-orange-100"
                    />

                    <p class="mt-2 text-xs text-slate-400">
                      Enter a score between 0 and 100.
                    </p>
                  </div>

                  <!-- Feedback -->
                  <div class="mt-5">

                    <label class="text-sm font-semibold text-slate-700">
                      Feedback
                    </label>

                    <textarea
                        v-model="managerForm.feedback"
                        rows="5"
                        placeholder="Write feedback for the employee..."
                        class="mt-2 w-full resize-none rounded-xl
                               border border-slate-300 bg-white
                               px-4 py-3 text-sm text-slate-700
                               outline-none transition
                               focus:border-orange-400
                               focus:ring-4 focus:ring-orange-100"
                    ></textarea>

                  </div>


                  <button
                      @click="submitManagerReview"
                      :disabled="saving || managerForm.reviewerScore === null"
                      class="mt-5 inline-flex items-center justify-center
                             rounded-xl bg-slate-900 px-6 py-3
                             text-sm font-semibold text-white
                             transition hover:bg-slate-800
                             disabled:cursor-not-allowed
                             disabled:opacity-50"
                  >
                    {{ saving ? "Submitting..." : "Submit Manager Review" }}
                  </button>

                </section>


                <!-- ================================================= -->
                <!-- WAITING -->
                <!-- ================================================= -->

                <section
                    v-if="selectedReview.status === 'DRAFT'"
                    class="rounded-2xl border border-blue-100
                           bg-blue-50/60 p-6"
                >
                  <div class="flex items-start gap-3">

                    <Clock class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                      <h3 class="font-bold text-slate-900">
                        Waiting for employee
                      </h3>

                      <p class="mt-1 text-sm text-slate-500">
                        The employee needs to submit their self review
                        before you can perform the manager evaluation.
                      </p>
                    </div>

                  </div>
                </section>


                <!-- ================================================= -->
                <!-- COMPLETE -->
                <!-- ================================================= -->

                <section
                    v-if="selectedReview.status === 'MANAGER_REVIEW'"
                    class="rounded-2xl border border-green-100
                           bg-green-50/60 p-6"
                >

                  <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 class="font-bold text-slate-900">
                        Ready to Complete
                      </h3>

                      <p class="mt-1 text-sm text-slate-500">
                        KPI values will be recalculated one final time
                        before this review is locked.
                      </p>
                    </div>

                    <button
                        @click="showCompleteConfirm = true"
                        :disabled="saving"
                        class="shrink-0 rounded-xl bg-green-600
           px-6 py-3 text-sm font-semibold
           text-white transition hover:bg-green-700
           disabled:opacity-50"
                    >
                      Complete Review
                    </button>

                  </div>

                </section>


                <!-- Completed -->
                <section
                    v-if="selectedReview.status === 'COMPLETED'"
                    class="rounded-2xl border border-green-100
                           bg-green-50/60 p-6"
                >

                  <div class="flex items-start gap-3">

                    <div
                        class="flex h-10 w-10 shrink-0
                               items-center justify-center
                               rounded-full bg-green-100 text-green-600"
                    >
                      <Check class="h-5 w-5" />
                    </div>

                    <div>
                      <h3 class="font-bold text-slate-900">
                        Review Completed
                      </h3>

                      <p class="mt-1 text-sm text-slate-500">
                        This review has been completed and the KPI
                        results are locked.
                      </p>
                    </div>

                  </div>

                </section>


                <!-- Feedback -->
                <section
                    v-if="selectedReview.feedback"
                    class="rounded-2xl border border-slate-200 p-6"
                >
                  <h3 class="font-bold text-slate-900">
                    Manager Feedback
                  </h3>

                  <div
                      class="mt-4 rounded-xl bg-slate-50
                             px-5 py-4 text-sm leading-6 text-slate-700"
                  >
                    {{ selectedReview.feedback }}
                  </div>
                </section>

              </div>
            </div>

          </div>

        </div>
        <!-- ===================================================== -->
        <!-- COMPLETE CONFIRM MODAL -->
        <!-- ===================================================== -->

        <!-- ===================================================== -->
        <!-- COMPLETE CONFIRM MODAL -->
        <!-- ===================================================== -->

        <div
            v-if="showCompleteConfirm"
            class="fixed inset-0 z-[200] flex items-center justify-center
           bg-slate-950/50 p-4 backdrop-blur-sm"
            @click.self="showCompleteConfirm = false"
        >
          <div
              class="w-[calc(100vw-2rem)] max-w-[480px]
             rounded-2xl bg-white p-6
             shadow-[0_25px_80px_rgba(15,23,42,0.3)]"
          >

            <!-- Icon -->
            <div
                class="flex h-12 w-12 items-center justify-center
               rounded-full bg-green-100 text-green-600"
            >
              <Check class="h-6 w-6" />
            </div>

            <!-- Content -->
            <div class="mt-5">
              <h3 class="text-xl font-bold text-slate-900">
                Complete Performance Review?
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                KPI values will be recalculated one final time.
                After completion, this performance review will be locked
                and can no longer be edited.
              </p>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-end gap-3">

              <button
                  type="button"
                  @click="showCompleteConfirm = false"
                  :disabled="saving"
                  class="h-11 rounded-xl border border-slate-200
                 bg-white px-5 text-sm font-semibold text-slate-600
                 transition hover:bg-slate-50
                 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                  type="button"
                  @click="confirmCompleteReview"
                  :disabled="saving"
                  class="inline-flex h-11 items-center justify-center gap-2
                 whitespace-nowrap rounded-xl bg-green-600
                 px-5 text-sm font-semibold text-white
                 transition hover:bg-green-700
                 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                    v-if="saving"
                    class="h-4 w-4 animate-spin"
                />

                {{ saving ? "Completing..." : "Complete Review" }}
              </button>

            </div>

          </div>
        </div>

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
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  RefreshCw
} from "@lucide/vue";

import { useEmployeeStore } from "../store/employeeStore.js";
import MainContent from "../components/MainContent.vue";
import ToastMessage from "../components/ToastMessage.vue";
import PaginationSection from "../components/PaginationSection.vue";
import SummaryCard from "../components/SummaryCard.vue";
import { usePerformanceStore } from "../store/performanceStore.js";


const performanceStore = usePerformanceStore();

const employeeStore = useEmployeeStore();

// =====================================================
// STATE
// =====================================================

const reviews = ref([]);

const loading = ref(false);
const detailLoading = ref(false);
const saving = ref(false);
const refreshingKpi = ref(false);

const showDetail = ref(false);
const selectedReview = ref(null);

const showCompleteConfirm = ref(false);

// =====================================================
// FILTER EMPLOYEE SEARCH
// =====================================================

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
// Backend page bắt đầu từ 0
// Component pagination bắt đầu từ 1
// =====================================================

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0
});


// =====================================================
// MANAGER FORM
// =====================================================

const managerForm = reactive({
  reviewerScore: null,
  feedback: ""
});

/*
 * Backend trước đó bạn test với reviewerScore = 90.
 * Vì vậy UI manager score dùng thang 0 -> 100,
 * KHÔNG dùng thang 1 -> 5 của UI cũ.
 */



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
   * User đang thay đổi nội dung search,
   * employee cũ không còn được chọn nữa.
   */
  filters.employeeId = null;

  showFilterEmployeeDropdown.value = true;

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

//close dropdown
const handleDocumentClick = (event) => {
  if (
      filterEmployeeRef.value &&
      !filterEmployeeRef.value.contains(event.target)
  ) {
    showFilterEmployeeDropdown.value = false;
  }
};


// =====================================================
// LOAD REVIEWS
// =====================================================

const loadReviews = async () => {

  try {

    loading.value = true;

    const response =
        await performanceStore.getMyAssignedReviews({
          employeeId: filters.employeeId,
          status: filters.status || null,
          periodStart: filters.periodStart || null,
          periodEnd: filters.periodEnd || null,

          // Vue pagination = 1
          // Spring pagination = 0
          page: pagination.currentPage - 1,

          size: pagination.pageSize
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
        "Load reviewer reviews error:",
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
// FILTER ACTION
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
// OPEN DETAIL
// =====================================================

const openReview = async (review) => {

  if (!review?.id) {
    return;
  }

  try {

    detailLoading.value = true;

    /*
     * Mở modal trước để user thấy loading.
     */
    showDetail.value = true;

    const response =
        await performanceStore.getReviewById(
            review.id
        );

    selectedReview.value =
        response?.data?.data ??
        response?.data ??
        null;

    resetManagerForm();

  } catch (error) {

    console.error(
        "Load review detail error:",
        error.response?.data || error
    );

    showDetail.value = false;

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
  showDetail.value = false;

  showCompleteConfirm.value = false;

  selectedReview.value = null;

  resetManagerForm();
};

const resetManagerForm = () => {

  managerForm.reviewerScore =
      selectedReview.value?.reviewerScore ?? null;

  managerForm.feedback =
      selectedReview.value?.feedback ?? "";
};


// =====================================================
// REFRESH SELECTED REVIEW
// =====================================================

const refreshSelectedReview = async () => {

  if (!selectedReview.value?.id) {
    return;
  }

  const response =
      await performanceStore.getReviewById(
          selectedReview.value.id
      );

  selectedReview.value =
      response?.data?.data ??
      response?.data ??
      selectedReview.value;

  resetManagerForm();
};


// =====================================================
// REFRESH KPI
// =====================================================

const refreshKpis = async () => {

  if (!selectedReview.value?.id) {
    return;
  }

  try {

    saving.value = true;
    refreshingKpi.value = true;

    const response =
        await performanceStore.refreshReviewKpis(
            selectedReview.value.id
        );

    selectedReview.value =
        response?.data?.data ??
        selectedReview.value;

    triggerToast(
        "KPI data refreshed successfully."
    );

    await loadReviews();

  } catch (error) {

    console.error(
        "Refresh KPI error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to refresh KPI data.",
        "error"
    );

  } finally {

    saving.value = false;
    refreshingKpi.value = false;
  }
};


// =====================================================
// MANAGER REVIEW
// =====================================================
const submitManagerReview = async () => {
  if (!selectedReview.value?.id) {
    return;
  }

  const reviewerScore = Number(
      managerForm.reviewerScore
  );

  if (
      managerForm.reviewerScore === null ||
      managerForm.reviewerScore === "" ||
      Number.isNaN(reviewerScore) ||
      reviewerScore < 0 ||
      reviewerScore > 100
  ) {
    triggerToast(
        "Manager score must be between 0 and 100.",
        "error"
    );

    return;
  }

  try {
    saving.value = true;

    await performanceStore.managerReview(
        selectedReview.value.id,
        reviewerScore,
        managerForm.feedback?.trim() || null
    );

    triggerToast(
        "Manager review submitted successfully."
    );

    await refreshSelectedReview();
    await loadReviews();
    await loadSummary();

  } catch (error) {
    console.error(
        "Submit manager review error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to submit manager review.",
        "error"
    );

  } finally {
    saving.value = false;
  }
};


// =====================================================
// COMPLETE REVIEW
// =====================================================
const completeSelectedReview = async () => {
  if (!selectedReview.value?.id) {
    return;
  }

  try {
    saving.value = true;

    const response =
        await performanceStore.completeReview(
            selectedReview.value.id
        );

    selectedReview.value =
        response?.data?.data ??
        selectedReview.value;

    triggerToast(
        "Performance review completed successfully."
    );

    await loadReviews();
    await loadSummary();

  } catch (error) {

    console.error(
        "Complete review error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to complete performance review.",
        "error"
    );

  } finally {
    saving.value = false;
  }
};

const confirmCompleteReview = async () => {
  await completeSelectedReview();

  if (selectedReview.value?.status === "COMPLETED") {
    showCompleteConfirm.value = false;
  }
};


// =====================================================
// SUMMARY
// =====================================================

/*
 * Các số này chỉ tính trên PAGE hiện tại.
 * totalReviews dùng totalElements từ backend.
 *
 * Nếu sau này muốn thống kê toàn bộ review theo status,
 * backend nên có endpoint statistics riêng.
 */
const summary = reactive({
  totalReviews: 0,
  awaitingSelfReview: 0,
  awaitingManagerReview: 0,
  awaitingCompletion: 0,
  completed: 0
});
const loadSummary = async () => {
  try {
    const response =
        await performanceStore
            .getMyAssignedReviewSummary();

    const data =
        response?.data?.data ?? {};

    Object.assign(summary, {
      totalReviews:
          data.totalReviews ?? 0,

      awaitingSelfReview:
          data.awaitingSelfReview ?? 0,

      awaitingManagerReview:
          data.awaitingManagerReview ?? 0,

      awaitingCompletion:
          data.awaitingCompletion ?? 0,

      completed:
          data.completed ?? 0
    });

  } catch (error) {
    console.error(
        "Load review summary error:",
        error
    );
  }
};



// =====================================================
// KPI
// =====================================================

const kpiProgress = (kpi) => {

  const target =
      Number(kpi?.targetValue ?? 0);

  const current =
      Number(kpi?.currentValue ?? 0);

  if (target <= 0) {
    return 0;
  }

  return Math.round(
      (current / target) * 100
  );
};


const kpiProgressColor = (kpi) => {

  const value =
      kpiProgress(kpi);

  if (value >= 100) {
    return "bg-green-500";
  }

  if (value >= 70) {
    return "bg-blue-500";
  }

  if (value >= 40) {
    return "bg-orange-500";
  }

  return "bg-red-500";
};


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
// FORMAT
// =====================================================

const score = (value) => {

  if (
      value === null ||
      value === undefined
  ) {
    return "—";
  }

  return value;
};


const employeeInitial = (review) => {

  if (review?.employeeName) {
    return review.employeeName
        .trim()
        .charAt(0)
        .toUpperCase();
  }

  return review?.employeeId ?? "?";
};


const formatDate = (value) => {

  if (!value) {
    return "—";
  }

  /*
   * LocalDate backend có dạng YYYY-MM-DD.
   * Không dùng new Date("YYYY-MM-DD")
   * để tránh lệch ngày do timezone.
   */

  const parts =
      String(value).split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};

// refesh
const refreshPage = async () => {
  await Promise.all([
    loadReviews(),
    loadSummary()
  ]);
};
// =====================================================
// INIT
// =====================================================

onMounted(() => {
  refreshPage();

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

  if (filterEmployeeSearchTimer) {
    clearTimeout(filterEmployeeSearchTimer);
  }

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
});
</script>