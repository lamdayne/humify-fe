<template>
  <MainContent>
    <div class="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div class="mx-auto max-w-7xl space-y-6">

        <!-- ================================================= -->
        <!-- HEADER -->
        <!-- ================================================= -->

        <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div
              class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex items-center gap-3">

              <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
              >
                <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4h-4m4 0l3-3m-3 3l3 3M5 21h10a2 2 0 002-2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <h1 class="text-2xl font-bold text-slate-900">
                  My Performance
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                  Track your KPI results and performance review history
                </p>
              </div>
            </div>

            <button
                @click="fetchReviews"
                :disabled="loading"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                  v-if="loading"
                  class="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                />

                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>

              {{ loading ? "Refreshing..." : "Refresh" }}
            </button>
          </div>
        </section>


        <!-- ================================================= -->
        <!-- FILTER -->
        <!-- ================================================= -->

        <section
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="mb-5">
            <h2 class="text-base font-bold text-slate-900">
              Filter Reviews
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Filter performance reviews by status and review period.
            </p>
          </div>

          <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >

            <!-- Status -->
            <div>
              <label
                  class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                  v-model="filters.status"
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>


            <!-- Actions -->
            <div class="flex items-end gap-2">

              <button
                  @click="handleSearch"
                  class="h-12 flex-1 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Search
              </button>

              <button
                  @click="handleReset"
                  class="h-12 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>

            </div>

          </div>
        </section>


        <!-- ================================================= -->
        <!-- SUMMARY -->
        <!-- ================================================= -->

        <section
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >

          <!-- Total -->
          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex items-start justify-between">

              <div>
                <p class="text-sm font-medium text-slate-500">
                  Total Reviews
                </p>

                <p class="mt-2 text-3xl font-bold text-slate-900">
                  {{ totalElements }}
                </p>
              </div>

              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
              >
                ★
              </div>

            </div>
          </div>


          <!-- Completed -->
          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex items-start justify-between">

              <div>
                <p class="text-sm font-medium text-slate-500">
                  Completed
                </p>

                <p class="mt-2 text-3xl font-bold text-green-600">
                  {{ completedCount }}
                </p>
              </div>

              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600"
              >
                ✓
              </div>

            </div>
          </div>


          <!-- In Progress -->
          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex items-start justify-between">

              <div>
                <p class="text-sm font-medium text-slate-500">
                  In Progress
                </p>

                <p class="mt-2 text-3xl font-bold text-orange-500">
                  {{ inProgressCount }}
                </p>
              </div>

              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500"
              >
                ↗
              </div>

            </div>
          </div>


          <!-- Average -->
          <div
              class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex items-start justify-between">

              <div>
                <p class="text-sm font-medium text-slate-500">
                  Avg. KPI Score
                </p>

                <p class="mt-2 text-3xl font-bold text-purple-600">
                  {{ averageScore }}
                </p>
              </div>

              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600"
              >
                %
              </div>

            </div>
          </div>

        </section>


        <!-- ================================================= -->
        <!-- REVIEW LIST -->
        <!-- ================================================= -->

        <section
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          <div
              class="border-b border-slate-200 px-6 py-5"
          >
            <h2 class="text-lg font-bold text-slate-900">
              Performance Reviews
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Your performance review history and KPI results
            </p>
          </div>


          <!-- Loading -->
          <div
              v-if="loading"
              class="space-y-4 p-6"
          >
            <div
                v-for="n in 3"
                :key="n"
                class="animate-pulse rounded-2xl border border-slate-200 p-5"
            >
              <div
                  class="h-5 w-1/3 rounded bg-slate-200"
              ></div>

              <div
                  class="mt-4 grid grid-cols-3 gap-4"
              >
                <div class="h-16 rounded bg-slate-100"></div>
                <div class="h-16 rounded bg-slate-100"></div>
                <div class="h-16 rounded bg-slate-100"></div>
              </div>

              <div
                  class="mt-4 h-20 rounded bg-slate-100"
              ></div>
            </div>
          </div>


          <!-- Empty -->
          <!-- Empty -->
          <!-- Empty -->
          <div
              v-else-if="reviews.length === 0"
              class="flex w-full flex-col items-center justify-center px-6 py-16 text-center"
          >
            <div
                class="flex h-16 w-16 shrink-0 items-center justify-center
             rounded-2xl bg-slate-100 text-2xl text-slate-400"
            >
              ★
            </div>

            <h3
                class="mt-5 w-full text-lg font-bold text-slate-900"
            >
              No performance reviews
            </h3>
            <p
                class="mt-2 w-full whitespace-nowrap text-center
           text-sm text-slate-500"
            >
              You do not have any performance reviews matching the selected filters.
            </p>
          </div>


          <!-- Cards -->
          <div
              v-else
              class="space-y-4 p-6"
          >
            <article
                v-for="review in reviews"
                :key="review.id"
                class="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
            >

              <!-- Header -->
              <div
                  class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
              >

                <div>
                  <div
                      class="flex flex-wrap items-center gap-3"
                  >
                    <h3
                        class="text-lg font-bold text-slate-900"
                    >
                      {{ review.templateName }}
                    </h3>

                    <span
                        class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        :class="reviewStatusClass(review.status)"
                    >
                      {{ reviewStatusLabel(review.status) }}
                    </span>
                  </div>

                  <p
                      class="mt-2 text-sm text-slate-500"
                  >
                    {{ formatDate(review.periodStart) }}
                    →
                    {{ formatDate(review.periodEnd) }}
                  </p>

                  <p
                      class="mt-1 text-xs text-slate-400"
                  >
                    Reviewer ID:
                    #{{ review.reviewerId }}
                  </p>
                </div>


                <button
                    @click="openReviewDetail(review)"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  View Details
                </button>

              </div>


              <!-- Scores -->
              <div
                  class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >

                <div
                    class="rounded-xl bg-slate-50 p-4"
                >
                  <p class="text-xs text-slate-400">
                    Self Score
                  </p>

                  <p
                      class="mt-2 text-xl font-bold text-slate-900"
                  >
                    {{ formatScore(review.selfScore) }}
                  </p>
                </div>


                <div
                    class="rounded-xl bg-slate-50 p-4"
                >
                  <p class="text-xs text-slate-400">
                    Manager Score
                  </p>

                  <p
                      class="mt-2 text-xl font-bold text-slate-900"
                  >
                    {{ formatScore(review.reviewerScore) }}
                  </p>
                </div>


                <div
                    class="rounded-xl bg-blue-50 p-4"
                >
                  <p class="text-xs text-blue-500">
                    KPI Final Score
                  </p>

                  <p
                      class="mt-2 text-xl font-bold text-blue-600"
                  >
                    {{ formatScore(review.finalScore) }}
                  </p>
                </div>

              </div>


              <!-- KPI preview -->
              <div
                  v-if="review.kpis?.length"
                  class="mt-5"
              >

                <div
                    class="mb-3 flex items-center justify-between"
                >
                  <h4
                      class="text-sm font-bold text-slate-900"
                  >
                    KPI Results
                  </h4>

                  <span
                      class="text-xs font-medium text-slate-400"
                  >
                    {{ review.kpis.length }} KPIs
                  </span>
                </div>


                <div
                    class="grid grid-cols-1 gap-3 xl:grid-cols-2"
                >
                  <div
                      v-for="kpi in review.kpis"
                      :key="kpi.id"
                      class="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >

                    <div
                        class="flex items-start justify-between gap-3"
                    >

                      <div>
                        <p
                            class="font-semibold text-slate-800"
                        >
                          {{ kpi.title }}
                        </p>

                        <p
                            class="mt-1 text-xs text-slate-400"
                        >
                          {{ metricLabel(kpi.metricType) }}
                        </p>
                      </div>

                      <span
                          class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          :class="kpiStatusClass(kpi.status)"
                      >
                        {{ kpiStatusLabel(kpi.status) }}
                      </span>

                    </div>


                    <div
                        class="mt-4 grid grid-cols-3 gap-3"
                    >

                      <div>
                        <p class="text-xs text-slate-400">
                          Target
                        </p>

                        <p
                            class="mt-1 font-bold text-slate-800"
                        >
                          {{ kpi.targetValue }}
                          {{ kpi.unit }}
                        </p>
                      </div>


                      <div>
                        <p class="text-xs text-slate-400">
                          Actual
                        </p>

                        <p
                            class="mt-1 font-bold text-blue-600"
                        >
                          {{ kpi.currentValue }}
                          {{ kpi.unit }}
                        </p>
                      </div>


                      <div>
                        <p class="text-xs text-slate-400">
                          Score
                        </p>

                        <p
                            class="mt-1 font-bold text-slate-800"
                        >
                          {{ formatScore(kpi.score) }}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>

              </div>


              <!-- Next step -->
              <div
                  class="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                <span
                    class="font-semibold text-slate-800"
                >
                  Next step:
                </span>

                {{ reviewNextStep(review.status) }}
              </div>

            </article>
          </div>


          <!-- ================================================= -->
          <!-- PAGINATION -->
          <!-- ================================================= -->

          <div
              v-if="totalElements > 0"
              class="border-t border-slate-200 px-6 pb-5"
          >
            <PaginationSection
                :current-page="page + 1"
                :total-items="totalElements"
                :total-page="totalPages"
                :page-size="size"
                item-label="reviews"
                @changePage="handlePageChange"
            />
          </div>

        </section>


        <!-- ================================================= -->
        <!-- REVIEW DETAIL MODAL -->
        <!-- ================================================= -->

        <div
            v-if="showReviewDetail"
            @click.self="closeReviewDetail"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
        >

          <div
              class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]"
          >

            <!-- Header -->
            <div
                class="flex shrink-0 items-start justify-between border-b border-slate-200 px-7 py-6"
            >

              <div v-if="selectedReview">

                <div
                    class="flex flex-wrap items-center gap-3"
                >
                  <h2
                      class="text-2xl font-bold tracking-tight text-slate-900"
                  >
                    Performance Review
                  </h2>

                  <span
                      class="rounded-full px-3 py-1 text-xs font-semibold"
                      :class="reviewStatusClass(selectedReview.status)"
                  >
                    {{ reviewStatusLabel(selectedReview.status) }}
                  </span>
                </div>

                <p
                    class="mt-1.5 text-sm font-medium text-slate-500"
                >
                  {{ selectedReview.templateName }}
                </p>

                <p
                    class="mt-1 text-xs text-slate-400"
                >
                  {{ formatDate(selectedReview.periodStart) }}
                  →
                  {{ formatDate(selectedReview.periodEnd) }}
                </p>
              </div>


              <button
                  @click="closeReviewDetail"
                  class="flex h-9 w-9 items-center justify-center rounded-xl text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>


            <!-- Content -->
            <div
                v-if="selectedReview"
                class="min-h-0 flex-1 overflow-y-auto px-7 py-7"
            >

              <div class="space-y-7">

                <!-- Score overview -->
                <div
                    class="grid grid-cols-1 gap-4 md:grid-cols-3"
                >

                  <div
                      class="rounded-2xl bg-slate-50 px-6 py-5"
                  >
                    <p
                        class="text-sm font-medium text-slate-500"
                    >
                      Self Score
                    </p>

                    <p
                        class="mt-3 text-4xl font-bold text-slate-900"
                    >
                      {{ formatScore(selectedReview.selfScore) }}
                    </p>
                  </div>


                  <div
                      class="rounded-2xl bg-slate-50 px-6 py-5"
                  >
                    <p
                        class="text-sm font-medium text-slate-500"
                    >
                      Manager Score
                    </p>

                    <p
                        class="mt-3 text-4xl font-bold text-slate-900"
                    >
                      {{ formatScore(selectedReview.reviewerScore) }}
                    </p>
                  </div>


                  <div
                      class="rounded-2xl bg-blue-50 px-6 py-5"
                  >
                    <p
                        class="text-sm font-medium text-blue-600"
                    >
                      KPI Final Score
                    </p>

                    <p
                        class="mt-3 text-4xl font-bold text-blue-600"
                    >
                      {{ formatScore(selectedReview.finalScore) }}
                    </p>
                  </div>

                </div>


                <!-- KPI detail -->
                <section>

                  <div class="mb-4">
                    <h3
                        class="text-base font-bold text-slate-900"
                    >
                      KPI Details
                    </h3>

                    <p
                        class="mt-1 text-sm text-slate-500"
                    >
                      KPI values calculated from your work data.
                    </p>
                  </div>


                  <div class="space-y-3">

                    <div
                        v-for="kpi in selectedReview.kpis || []"
                        :key="kpi.id"
                        class="rounded-2xl border border-slate-200 bg-white p-5"
                    >

                      <div
                          class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                      >

                        <div>
                          <h4
                              class="font-bold text-slate-900"
                          >
                            {{ kpi.title }}
                          </h4>

                          <p
                              v-if="kpi.description"
                              class="mt-1 text-sm text-slate-500"
                          >
                            {{ kpi.description }}
                          </p>

                          <p
                              class="mt-2 text-xs font-medium text-slate-400"
                          >
                            {{ metricLabel(kpi.metricType) }}
                          </p>
                        </div>


                        <span
                            class="rounded-full px-3 py-1.5 text-xs font-semibold"
                            :class="kpiStatusClass(kpi.status)"
                        >
                          {{ kpiStatusLabel(kpi.status) }}
                        </span>

                      </div>


                      <div
                          class="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"
                      >

                        <div
                            class="rounded-xl bg-slate-50 p-4"
                        >
                          <p class="text-xs text-slate-400">
                            Target
                          </p>

                          <p
                              class="mt-1 text-lg font-bold text-slate-900"
                          >
                            {{ kpi.targetValue }}
                            {{ kpi.unit }}
                          </p>
                        </div>


                        <div
                            class="rounded-xl bg-blue-50 p-4"
                        >
                          <p class="text-xs text-blue-400">
                            Actual
                          </p>

                          <p
                              class="mt-1 text-lg font-bold text-blue-600"
                          >
                            {{ kpi.currentValue }}
                            {{ kpi.unit }}
                          </p>
                        </div>


                        <div
                            class="rounded-xl bg-slate-50 p-4"
                        >
                          <p class="text-xs text-slate-400">
                            Weight
                          </p>

                          <p
                              class="mt-1 text-lg font-bold text-slate-900"
                          >
                            {{ kpi.weight }}%
                          </p>
                        </div>


                        <div
                            class="rounded-xl bg-slate-50 p-4"
                        >
                          <p class="text-xs text-slate-400">
                            Score
                          </p>

                          <p
                              class="mt-1 text-lg font-bold text-slate-900"
                          >
                            {{ formatScore(kpi.score) }}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>
                </section>


                <!-- Feedback -->
                <div
                    v-if="selectedReview.feedback"
                    class="rounded-2xl border border-slate-200 bg-white p-6"
                >

                  <div
                      class="flex items-center gap-2"
                  >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100"
                    >
                      💬
                    </div>

                    <h3
                        class="font-bold text-slate-900"
                    >
                      Manager Feedback
                    </h3>
                  </div>

                  <div
                      class="mt-4 rounded-xl bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-700"
                  >
                    {{ selectedReview.feedback }}
                  </div>
                </div>


                <!-- Self Review -->
                <div
                    v-if="selectedReview.status === 'DRAFT'"
                    class="rounded-2xl border border-blue-100 bg-blue-50/50 p-6"
                >

                  <h3
                      class="text-base font-bold text-slate-900"
                  >
                    Self Evaluation
                  </h3>

                  <p
                      class="mt-1 text-sm text-slate-500"
                  >
                    Enter your self-evaluation score.
                  </p>


                  <div class="mt-5">

                    <label
                        class="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Self Score
                    </label>

                    <input
                        v-model.number="selfScore"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0 - 100"
                        class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>


                  <button
                      @click="saveSelfReview"
                      :disabled="saving || selfScore === null"
                      class="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {{ saving ? "Submitting..." : "Submit Self Review" }}
                  </button>

                </div>


                <!-- Waiting manager -->
                <div
                    v-if="selectedReview.status === 'SELF_REVIEW'"
                    class="rounded-2xl border border-orange-100 bg-orange-50/50 p-6"
                >

                  <div
                      class="flex items-start gap-4"
                  >
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600"
                    >
                      ⏳
                    </div>

                    <div>
                      <h3
                          class="font-bold text-slate-900"
                      >
                        Waiting for Manager Review
                      </h3>

                      <p
                          class="mt-1 text-sm leading-6 text-slate-500"
                      >
                        Your self evaluation has been submitted. The assigned
                        manager will review your performance next.
                      </p>
                    </div>
                  </div>

                </div>


                <!-- Manager review finished -->
                <div
                    v-if="selectedReview.status === 'MANAGER_REVIEW'"
                    class="rounded-2xl border border-purple-100 bg-purple-50/50 p-6"
                >

                  <div
                      class="flex items-start gap-4"
                  >
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600"
                    >
                      ★
                    </div>

                    <div>
                      <h3
                          class="font-bold text-slate-900"
                      >
                        Manager Review Submitted
                      </h3>

                      <p
                          class="mt-1 text-sm leading-6 text-slate-500"
                      >
                        The manager review has been submitted and is waiting
                        to be completed.
                      </p>
                    </div>
                  </div>

                </div>


                <!-- Completed -->
                <div
                    v-if="selectedReview.status === 'COMPLETED'"
                    class="rounded-2xl border border-green-100 bg-green-50/60 p-6"
                >

                  <div
                      class="flex items-start gap-4"
                  >

                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
                    >
                      ✓
                    </div>

                    <div>
                      <h3
                          class="font-bold text-slate-900"
                      >
                        Review Completed
                      </h3>

                      <p
                          class="mt-1 text-sm leading-6 text-slate-500"
                      >
                        This performance review has been completed and locked.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
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
  computed,
  onMounted,
  reactive,
  ref
} from "vue";

import PaginationSection from "../components/PaginationSection.vue";
import MainContent from "../components/MainContent.vue";
import ToastMessage from "../components/ToastMessage.vue";
import { usePerformanceStore } from "../store/performanceStore.js";

const performanceStore =
    usePerformanceStore();


// =====================================================
// STATE
// =====================================================

const reviews = ref([]);

const loading = ref(false);
const saving = ref(false);

const page = ref(0);
const size = ref(10);

const totalPages = ref(0);
const totalElements = ref(0);


// =====================================================
// FILTER
// =====================================================

const filters = reactive({
  status: "",
  periodStart: "",
  periodEnd: ""
});


// =====================================================
// DETAIL
// =====================================================

const showReviewDetail = ref(false);
const selectedReview = ref(null);

const selfScore = ref(null);


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
// COMPUTED
// =====================================================

const completedCount = computed(() =>
    reviews.value.filter(
        review =>
            review.status === "COMPLETED"
    ).length
);


const inProgressCount = computed(() =>
    reviews.value.filter(
        review =>
            review.status !== "COMPLETED"
    ).length
);


const averageScore = computed(() => {

  const scores =
      reviews.value
          .map(review =>
              Number(review.finalScore)
          )
          .filter(score =>
              !Number.isNaN(score)
          );

  if (!scores.length) {
    return "0";
  }

  const total =
      scores.reduce(
          (sum, score) =>
              sum + score,
          0
      );

  return (
      total / scores.length
  ).toFixed(2);
});


// =====================================================
// LOAD
// =====================================================

const fetchReviews = async () => {

  try {

    loading.value = true;

    const response =
        await performanceStore.getMyReviews({
          status: filters.status,
          periodStart: filters.periodStart,
          periodEnd: filters.periodEnd,
          page: page.value,
          size: size.value,
          sorts: "id,desc"
        });

    const data =
        response?.data?.data;

    reviews.value =
        data?.items ?? [];

    totalPages.value =
        data?.totalPages ?? 0;

    totalElements.value =
        data?.totalElements ?? 0;

  } catch (error) {

    console.error(
        "Load performance reviews error:",
        error.response?.data || error
    );

    reviews.value = [];

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

const handleSearch = () => {

  page.value = 0;

  fetchReviews();
};


const handleReset = () => {

  filters.status = "";
  filters.periodStart = "";
  filters.periodEnd = "";

  page.value = 0;

  fetchReviews();
};


// =====================================================
// PAGINATION
// =====================================================

const handlePageChange = (newPage) => {
  page.value = newPage - 1;
  fetchReviews();
};


// =====================================================
// DETAIL
// =====================================================

const openReviewDetail = async (review) => {

  if (!review?.id) {
    return;
  }

  try {

    loading.value = true;

    const response =
        await performanceStore.getReviewById(
            review.id
        );

    selectedReview.value =
        response?.data?.data ??
        null;

    selfScore.value =
        selectedReview.value?.selfScore ??
        null;

    showReviewDetail.value = true;

  } catch (error) {

    console.error(
        "Get review detail error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to load review details.",
        "error"
    );

  } finally {

    loading.value = false;
  }
};


const closeReviewDetail = () => {

  showReviewDetail.value = false;

  selectedReview.value = null;

  selfScore.value = null;
};


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
      selectedReview.value;

  selfScore.value =
      selectedReview.value?.selfScore ??
      null;
};


// =====================================================
// SELF REVIEW
// =====================================================

const saveSelfReview = async () => {

  if (!selectedReview.value) {
    return;
  }

  if (
      selfScore.value === null ||
      selfScore.value < 0 ||
      selfScore.value > 100
  ) {

    triggerToast(
        "Self score must be between 0 and 100.",
        "error"
    );

    return;
  }

  try {

    saving.value = true;

    await performanceStore.selfReview(
        selectedReview.value.id,
        Number(selfScore.value)
    );

    triggerToast(
        "Self review submitted successfully."
    );

    await refreshSelectedReview();

    await fetchReviews();

  } catch (error) {

    console.error(
        "Submit self review error:",
        error.response?.data || error
    );

    triggerToast(
        error.response?.data?.message ||
        "Failed to submit self review.",
        "error"
    );

  } finally {

    saving.value = false;
  }
};


// =====================================================
// STATUS
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


const reviewNextStep = (status) => {

  return {
        DRAFT:
            "Complete your self evaluation.",

        SELF_REVIEW:
            "Waiting for manager evaluation.",

        MANAGER_REVIEW:
            "Waiting for the review to be completed.",

        COMPLETED:
            "This review has been completed."

      }[status] ||
      "Review status is unavailable.";
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
// METRIC
// =====================================================

const metricLabel = (metricType) => {

  return {
        TASK_COMPLETION_RATE:
            "Task Completion Rate",

        TASK_ON_TIME_RATE:
            "On-time Completion Rate",

        MANUAL:
            "Manual"
      }[metricType] ||
      metricType ||
      "";
};


// =====================================================
// FORMAT
// =====================================================

const formatScore = (value) => {

  if (
      value === null ||
      value === undefined
  ) {
    return "—";
  }

  const number =
      Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number
      .toFixed(2)
      .replace(/\.00$/, "");
};


const formatDate = (value) => {

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
  fetchReviews();
});
</script>