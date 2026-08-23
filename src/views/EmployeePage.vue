<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto text-slate-900 relative" @click="handleDocumentClick">

            <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show"></ToastMessage>

            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-lg font-semibold text-slate-900">Employees</h1>
                    <nav class="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>/</span>
                        <span class="text-slate-600">Employees</span>
                    </nav>
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                    <SecondaryButton :content="'Download Template'" @click="downloadTemplate">
                        <template #icon>
                            <Download class="w-3.5 h-3.5"></Download>
                        </template>
                    </SecondaryButton>
                    <SecondaryButton :content="'Import Excel'" @click="showImportModal = true">
                        <template #icon>
                            <Upload class="w-3.5 h-3.5"></Upload>
                        </template>
                    </SecondaryButton>
                    <PrimaryButton :content="'Add Employee'" @click="addEmployee">
                        <template #icon>
                            <Plus class="w-3.5 h-3.5"></Plus>
                        </template>
                    </PrimaryButton>
                </div>
            </div>

            <!-- SEARCH & FILTER BAR -->
            <div class="bg-white border border-slate-200/90 rounded-xl p-4 mb-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <!-- Search Input -->
                    <div class="relative flex-1">
                        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            v-model="searchQuery"
                            @input="handleSearchInput"
                            @keydown.enter="handleSearchInput"
                            type="text"
                            placeholder="Search by name, employee code, email..."
                            class="w-full h-10 bg-slate-50/80 border border-slate-200 rounded-lg pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-light"
                        />
                        <button
                            v-if="searchQuery"
                            @click="clearSearch"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Clear search"
                        >
                            <X class="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <!-- Status Filter & Quick Reset -->
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-10">
                            <span class="text-[11px] text-slate-400 font-medium">Status:</span>
                            <select
                                v-model="statusFilter"
                                @change="handleStatusFilterChange"
                                class="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="PROBATION">PROBATION</option>
                                <option value="ON_LEAVE">ON_LEAVE</option>
                                <option value="RESIGNED">RESIGNED</option>
                                <option value="TERMINATED">TERMINATED</option>
                            </select>
                        </div>

                        <button
                            v-if="isFiltered"
                            @click="resetFilters"
                            class="inline-flex items-center gap-1.5 px-3 h-10 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                            title="Reset all filters"
                        >
                            <RotateCcw class="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                <!-- Active Filter Indicator -->
                <div v-if="isFiltered" class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-medium text-slate-700">Active filters:</span>
                        <span v-if="searchQuery" class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-md font-mono text-[10px]">
                            Query: "{{ searchQuery }}"
                            <button @click="clearSearch" class="hover:text-blue-900 cursor-pointer"><X class="w-3 h-3" /></button>
                        </span>
                        <span v-if="statusFilter !== 'ALL'" class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px]">
                            Status: {{ statusFilter }}
                            <button @click="statusFilter = 'ALL'; handleStatusFilterChange()" class="hover:text-slate-900 cursor-pointer"><X class="w-3 h-3" /></button>
                        </span>
                    </div>
                    <span class="text-slate-400">Found {{ pagination.totalItems }} results</span>
                </div>
            </div>

            <!-- Skeleton Loading on First Load -->
            <TableEmployeeSkeleton v-if="isFirstLoading"></TableEmployeeSkeleton>

            <!-- Main Table Content -->
            <div v-if="!isFirstLoading" class="relative">
                <div v-if="isPageLoading"
                    class="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                    <LoaderCircle class="animate-spin w-10 h-10 text-slate-800"></LoaderCircle>
                </div>
                <div
                    class="bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[420px]">
                    <div class="overflow-x-auto min-h-[420px]">
                        <table class="w-full text-left border-collapse min-w-[800px] table-fixed">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-200/80">
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[14%]">
                                        Employee Code
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[24%]">
                                        Full name
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[22%]">
                                        Email
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[12%]">
                                        Start Date
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                                        Gender
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                                        Status
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[8%] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <template v-if="employees && employees.length > 0">
                                    <tr v-for="(employee, empIdx) in employees" :key="employee.id || employee.email"
                                        class="hover:bg-slate-50/50 transition-colors group">
                                        
                                        <!-- Employee Code -->
                                        <td class="py-4 px-6">
                                            <span
                                                class="font-bold text-slate-900 text-xs tracking-tight group-hover:text-black transition-colors font-mono">
                                                {{ employee.employeeCode }}
                                            </span>
                                        </td>

                                        <!-- Full name + Card Indicator -->
                                        <td class="py-4 px-6">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                                    <img v-if="employee.avatarUrl" :src="employee.avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
                                                    <span v-else>{{ getInitials(employee.fullName) }}</span>
                                                </div>
                                                <div class="min-w-0">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="text-xs font-semibold text-slate-800 group-hover:text-slate-950 truncate">{{ employee.fullName }}</span>
                                                        <!-- NFC Card Badge/Icon -->
                                                        <span v-if="employee.nfcCardUid"
                                                            :title="'NFC Card: ' + employee.nfcCardUid"
                                                            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 shrink-0">
                                                            <CreditCard class="w-2.5 h-2.5" />
                                                            <span>Card</span>
                                                        </span>
                                                    </div>
                                                    <p class="text-[11px] text-slate-400 font-light truncate">
                                                        {{ employee.departmentName || employee.positionName || 'Staff' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Email -->
                                        <td class="py-4 px-6 text-xs text-slate-500 font-light max-w-xs truncate">
                                            {{ employee.email }}
                                        </td>

                                        <!-- Start Date -->
                                        <td class="py-4 px-6 text-xs text-slate-500 font-light whitespace-nowrap">
                                            {{ employee.startDate || '—' }}
                                        </td>

                                        <!-- Gender -->
                                        <td class="py-4 px-6 text-xs text-slate-500 font-light">
                                            {{ employee.gender }}
                                        </td>

                                        <!-- Status Badge -->
                                        <td class="py-4 px-6 text-xs whitespace-nowrap">
                                            <button @click="openStatusModal(employee)" title="Click to change status" class="cursor-pointer hover:opacity-80 transition-opacity">
                                                <StatusBadge :content="employee.status" :type="employee.status"></StatusBadge>
                                            </button>
                                        </td>

                                        <!-- Actions: 3-Dots Dropdown Menu -->
                                        <td class="py-4 px-6 text-right relative">
                                            <div class="inline-block text-left">
                                                <button
                                                    @click.stop="toggleDropdown(employee.id)"
                                                    class="dropdown-trigger p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
                                                    :class="{ 'bg-slate-100 border-slate-300 text-slate-900': activeDropdownId === employee.id }"
                                                    title="Actions"
                                                >
                                                    <MoreVertical class="w-4 h-4" />
                                                </button>

                                                <!-- Dropdown Menu Content -->
                                                <div
                                                    v-if="activeDropdownId === employee.id"
                                                    class="dropdown-menu-container absolute right-6 w-52 bg-white rounded-xl border border-slate-200/90 py-1.5 z-50 animate-fade text-left"
                                                    :class="shouldOpenUpward(empIdx, employees.length) ? 'bottom-full mb-1.5 origin-bottom-right shadow-2xl' : 'top-full mt-1.5 origin-top-right shadow-xl'"
                                                >
                                                    <!-- View Details -->
                                                    <button
                                                        @click="openDetailModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                    >
                                                        <Eye class="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                                                        <span>View Details</span>
                                                    </button>

                                                    <!-- Edit Info -->
                                                    <button
                                                        @click="openEditModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil class="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Edit Information</span>
                                                    </button>

                                                    <!-- Manage NFC Card -->
                                                    <button
                                                        @click="openNfcModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-600 flex items-center justify-between transition-colors cursor-pointer"
                                                    >
                                                        <div class="flex items-center gap-2.5">
                                                            <CreditCard class="w-3.5 h-3.5 text-indigo-500" />
                                                            <span>Manage NFC Card</span>
                                                        </div>
                                                        <span v-if="employee.nfcCardUid" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    </button>

                                                    <!-- Transfer Employee -->
                                                    <button
                                                        @click="openTransferModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                    >
                                                        <ArrowLeftRight class="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Transfer / Position</span>
                                                    </button>

                                                    <!-- Update Status -->
                                                    <button
                                                        @click="openStatusModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                    >
                                                        <SlidersHorizontal class="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Change Status</span>
                                                    </button>

                                                    <div class="my-1 border-t border-slate-100"></div>

                                                    <!-- Delete Employee -->
                                                    <button
                                                        @click="openDeleteModal(employee)"
                                                        class="w-full px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 class="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Delete Employee</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <!-- Empty State -->
                                <tr v-else>
                                    <td colspan="7" class="py-16 text-center">
                                        <div class="py-4 flex flex-col items-center justify-center text-center">
                                            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400 mx-auto">
                                                <Users class="w-6 h-6" />
                                            </div>
                                            <p class="text-sm font-semibold text-slate-800 mb-1 whitespace-nowrap">No employees found</p>
                                            <p class="text-xs text-slate-400 font-light mb-4 w-[380px] max-w-[90vw] mx-auto leading-relaxed">
                                                {{ isFiltered ? 'Try clearing your search or status filters to see more results.' : 'No employee records are currently available in the organization.' }}
                                            </p>
                                            <button v-if="isFiltered" @click="resetFilters" class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap mx-auto">
                                                <RotateCcw class="w-3.5 h-3.5" />
                                                <span>Reset Filters</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <PaginationSection v-if="employees.length > 0" :page-size="pagination.pageSize"
                :current-page="pagination.pageNo" :item-label="'Employees'" :total-items="pagination.totalItems"
                :total-page="pagination.totalPages" @changePage="handlePageChange">
            </PaginationSection>
        </div>

        <!-- 1. Modal View Details -->
        <ModalGeneric v-model="showDetailModal" :title="'Employee Details'" width="640px">
            <div v-if="selectedEmployee" class="space-y-6">

                <!-- Block Avatar & Name -->
                <div class="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-100">
                    <div
                        class="w-16 h-16 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-xl font-semibold border border-slate-200 shadow-md">
                        <img v-if="selectedEmployee.avatarUrl" :src="selectedEmployee.avatarUrl"
                            class="w-full h-full object-cover" alt="Avatar" />
                        <span v-else>{{ getInitials(selectedEmployee.fullName) }}</span>
                    </div>
                    <div class="text-center sm:text-left space-y-1.5">
                        <div class="flex flex-col sm:flex-row sm:items-center items-center gap-2">
                            <h4 class="text-lg font-semibold text-slate-950">{{ selectedEmployee.fullName }}</h4>
                            <StatusBadge :content="selectedEmployee.status" :type="selectedEmployee.status"></StatusBadge>
                        </div>
                        <p class="text-xs text-slate-400 font-light">
                            Code: <span class="font-medium text-slate-600">
                                {{ selectedEmployee.employeeCode }}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <!-- Column 1: Personal Info -->
                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Information</h5>

                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Email Address</span>
                                <span class="text-xs font-medium text-slate-800 break-all">
                                    {{ selectedEmployee.email || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Phone Number</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.phone || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Date of Birth</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.dateOfBirth || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Gender</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.gender || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Address</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.address || 'N/A' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Employment Details & Card -->
                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employment Details</h5>

                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Start Date</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.startDate || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Branch</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.branchName || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Department</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.departmentName || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Position</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.positionName || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">NFC / RFID Card UID</span>
                                <div class="mt-0.5">
                                    <span v-if="selectedEmployee.nfcCardUid" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CreditCard class="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{{ selectedEmployee.nfcCardUid }}</span>
                                    </span>
                                    <span v-else class="text-xs text-slate-400 italic">Not Assigned</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <button @click="showDetailModal = false"
                    class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer">
                    Close
                </button>
            </template>
        </ModalGeneric>

        <!-- 2. Modal Manage / Assign NFC Card -->
        <ModalGeneric v-model="showNfcModal" title="Manage NFC / RFID Card" width="520px">
            <div v-if="selectedEmployeeForCard" class="space-y-5 text-xs text-slate-700">
                <!-- Employee Summary Header -->
                <div class="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                            <img v-if="selectedEmployeeForCard.avatarUrl" :src="selectedEmployeeForCard.avatarUrl" class="w-full h-full object-cover" />
                            <span v-else>{{ getInitials(selectedEmployeeForCard.fullName) }}</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-900 text-sm leading-tight">{{ selectedEmployeeForCard.fullName }}</h4>
                            <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ selectedEmployeeForCard.employeeCode }} • {{ selectedEmployeeForCard.departmentName || 'Staff' }}</p>
                        </div>
                    </div>
                    <StatusBadge :content="selectedEmployeeForCard.status" :type="selectedEmployeeForCard.status" />
                </div>

                <!-- Current Linked Card Status -->
                <div v-if="selectedEmployeeForCard.nfcCardUid" class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                            <CreditCard class="w-4 h-4 text-emerald-600" />
                            <span>Currently Linked Card</span>
                        </div>
                        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                    </div>

                    <div class="flex items-center justify-between bg-white border border-emerald-200 rounded-lg p-2.5 font-mono text-xs text-slate-800">
                        <span class="font-bold text-emerald-950">{{ selectedEmployeeForCard.nfcCardUid }}</span>
                        <div class="flex items-center gap-1.5">
                            <button
                                type="button"
                                @click="copyNfcUid"
                                class="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600 transition-colors cursor-pointer"
                                title="Copy UID"
                            >
                                <Check v-if="isCopied" class="w-3 h-3 text-emerald-600" />
                                <Copy v-else class="w-3 h-3" />
                                <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
                            </button>
                            <button
                                type="button"
                                @click="handleUnlinkNfcCard"
                                :disabled="isUnlinkingCard"
                                class="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-[11px] text-rose-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
                                title="Unlink this card"
                            >
                                <LoaderCircle v-if="isUnlinkingCard" class="w-3 h-3 animate-spin" />
                                <span>Unlink Card</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-slate-600">
                    <div class="w-9 h-9 rounded-lg bg-slate-200/60 flex items-center justify-center shrink-0">
                        <CreditCard class="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p class="font-semibold text-slate-800">No NFC/RFID card assigned</p>
                        <p class="text-[11px] text-slate-400 font-light">Assign a card UID below to allow this employee to check in via NFC terminals.</p>
                    </div>
                </div>

                <!-- Input Field For Card UID -->
                <form @submit.prevent="handleSaveNfcCard" class="space-y-4 pt-1">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1.5">
                            {{ selectedEmployeeForCard.nfcCardUid ? 'Assign New / Replacement Card UID' : 'Card UID (NFC / RFID)' }} <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <CreditCard class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                v-model="nfcCardInput"
                                type="text"
                                required
                                autofocus
                                placeholder="e.g. 04A1B2C3D4E5F6 (or swipe card on reader)..."
                                class="w-full h-10 pl-9 pr-3 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 bg-white"
                            />
                        </div>
                        <p class="text-[11px] text-slate-400 font-light mt-1.5 flex items-center gap-1">
                            <Radio class="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>Tap card on your USB reader or enter the alphanumeric Card UID manually.</span>
                        </p>
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                        <button type="button" @click="showNfcModal = false"
                            class="px-4 h-9 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" :disabled="isSavingCard || !nfcCardInput.trim()"
                            class="px-4 h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs transition-all">
                            <LoaderCircle v-if="isSavingCard" class="animate-spin w-4 h-4" />
                            <span>{{ isSavingCard ? 'Saving...' : 'Link & Save Card' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalGeneric>

        <!-- 3. Modal Import Excel -->
        <ModalGeneric v-model="showImportModal" :title="'Import Employees from Excel'" width="560px">
            <div class="space-y-5">
                <!-- Template Banner Callout -->
                <div class="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                            <FileSpreadsheet class="w-5 h-5" />
                        </div>
                        <div>
                            <h5 class="text-xs font-semibold text-slate-800">Need the Excel template?</h5>
                            <p class="text-[11px] text-slate-500 font-light">Download the sample file to fill in employee details correctly.</p>
                        </div>
                    </div>
                    <button @click="downloadTemplate" type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs shrink-0 cursor-pointer">
                        <Download class="w-3.5 h-3.5 text-slate-500" />
                        <span>Download</span>
                    </button>
                </div>

                <!-- Dropzone Area -->
                <div @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" :class="[
                    isDragging ? 'border-black bg-slate-50/80 scale-[1.01]' : 'border-slate-200 hover:border-slate-300 bg-white',
                    'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative group'
                ]" @click="triggerFileInput">
                    <input type="file" ref="fileInputRef" @change="handleFileChange" accept=".xlsx, .xls"
                        class="hidden" />

                    <div
                        class="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <FileSpreadsheet class="w-6 h-6 text-emerald-500" />
                    </div>

                    <h4 class="text-sm font-semibold text-slate-800 mb-1">Click to upload or drag & drop</h4>
                    <p class="text-xs text-slate-400 font-light">Supported formats: .xlsx, .xls (Max 10MB)</p>
                </div>

                <!-- Selected File Display -->
                <div v-if="importFile"
                    class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl animate-fade">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <FileSpreadsheet class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-800 truncate max-w-70">{{ importFile.name }}</p>
                            <p class="text-[10px] text-slate-400 font-light">{{ (importFile.size / 1024).toFixed(1) }} KB</p>
                        </div>
                    </div>
                    <button @click.stop="removeFile"
                        class="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <!-- Error Messages Box -->
                <div v-if="importErrors.length > 0"
                    class="border border-red-100 bg-red-50/40 rounded-xl overflow-hidden animate-slide-up">
                    <div class="p-3.5 bg-red-50 border-b border-red-100/50 flex items-center gap-2 text-red-700">
                        <AlertCircle class="w-4.5 h-4.5 shrink-0" />
                        <span class="text-xs font-semibold">Import failed with {{ importErrors.length }} validation errors:</span>
                    </div>
                    <div class="max-h-48 overflow-y-auto text-xs divide-y divide-red-100/40 font-light">
                        <div v-for="(err, idx) in importErrors" :key="idx" class="p-3 flex items-start gap-3">
                            <span class="px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                                Row {{ err.row }}
                            </span>
                            <div>
                                <span class="font-semibold text-slate-800 block mb-0.5">Field: {{ err.field }}</span>
                                <p class="text-slate-600 text-[11px] leading-relaxed">{{ err.error }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex items-center justify-end gap-3 w-full">
                    <button @click="showImportModal = false" :disabled="isImporting"
                        class="px-4 py-2 text-xs font-medium text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-all cursor-pointer disabled:opacity-50">
                        Cancel
                    </button>
                    <button @click="executeImport" :disabled="isImporting || !importFile"
                        class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2 px-5 rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                        <LoaderCircle v-if="isImporting" class="animate-spin w-4 h-4" />
                        <span>{{ isImporting ? 'Importing...' : 'Upload & Import' }}</span>
                    </button>
                </div>
            </template>
        </ModalGeneric>

        <!-- 4. Modal Edit Employee -->
        <ModalGeneric v-model="showEditModal" title="Edit Employee Information" width="560px">
            <form @submit.prevent="handleUpdateEmployee" class="space-y-4 text-xs text-slate-700">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Full Name <span class="text-red-500">*</span></label>
                        <input v-model="editForm.fullName" type="text" required
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Email <span class="text-red-500">*</span></label>
                        <input v-model="editForm.email" type="email" required
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Gender <span class="text-red-500">*</span></label>
                        <select v-model="editForm.gender" required
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs">
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Phone Number</label>
                        <input v-model="editForm.phone" type="text" placeholder="e.g. 0987654321"
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Date of Birth</label>
                        <input v-model="editForm.dateOfBirth" type="date"
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Start Date</label>
                        <input v-model="editForm.startDate" type="date"
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">Address</label>
                        <input v-model="editForm.address" type="text" placeholder="e.g. Hanoi, Vietnam"
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">NFC / RFID Card UID</label>
                        <input v-model="editForm.nfcCardUid" type="text" placeholder="e.g. 04A1B2C3D4E5F6"
                            class="w-full h-9 px-3 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                    <button type="button" @click="showEditModal = false"
                        class="px-4 h-9 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isUpdating"
                        class="px-4 h-9 bg-black text-white font-bold rounded-lg hover:bg-slate-900 cursor-pointer disabled:opacity-50 flex items-center gap-2">
                        <LoaderCircle v-if="isUpdating" class="animate-spin w-4 h-4" />
                        <span>{{ isUpdating ? 'Saving...' : 'Save Changes' }}</span>
                    </button>
                </div>
            </form>
        </ModalGeneric>

        <!-- 5. Modal Delete Confirmation -->
        <ModalGeneric v-model="showDeleteModal" title="Delete Employee" width="440px">
            <div class="space-y-4 text-xs text-slate-700">
                <p>Are you sure you want to delete employee <strong class="text-slate-900">{{ employeeToDelete?.fullName }}</strong> (Code: {{ employeeToDelete?.employeeCode }})?</p>
                <p class="text-rose-600 font-medium bg-rose-50 border border-rose-200 p-3 rounded-lg">
                    Warning: This action cannot be undone. All data related to this employee will be permanently removed.
                </p>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button type="button" @click="showDeleteModal = false"
                        class="px-4 h-9 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
                        Cancel
                    </button>
                    <button type="button" @click="confirmDeleteEmployee" :disabled="isDeleting"
                        class="px-4 h-9 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 cursor-pointer disabled:opacity-50 flex items-center gap-2">
                        <LoaderCircle v-if="isDeleting" class="animate-spin w-4 h-4" />
                        <span>{{ isDeleting ? 'Deleting...' : 'Delete Employee' }}</span>
                    </button>
                </div>
            </div>
        </ModalGeneric>

        <!-- 6. Modal Transfer Employee -->
        <ModalGeneric v-model="showTransferModal" title="Transfer Employee & Change Position" width="560px">
            <form @submit.prevent="handleTransferEmployee" class="space-y-4 text-xs text-slate-700">
                <!-- Current Employee Summary -->
                <div v-if="transferEmployeeItem" class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-slate-900 text-sm">{{ transferEmployeeItem.fullName }}</span>
                        <span class="text-[11px] font-mono text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">{{ transferEmployeeItem.employeeCode }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <div><span class="text-slate-400">Branch:</span> <strong class="text-slate-700 font-medium">{{ transferEmployeeItem.branchName || 'N/A' }}</strong></div>
                        <div><span class="text-slate-400">Dept:</span> <strong class="text-slate-700 font-medium">{{ transferEmployeeItem.departmentName || 'N/A' }}</strong></div>
                        <div><span class="text-slate-400">Position:</span> <strong class="text-slate-700 font-medium">{{ transferEmployeeItem.positionName || 'N/A' }}</strong></div>
                    </div>
                </div>

                <!-- Branch & Department -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">New Branch <span class="text-red-500">*</span></label>
                        <select v-model="transferForm.branchId" @change="handleBranchChange" required
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs bg-white">
                            <option value="" disabled>Select Branch</option>
                            <option v-for="b in availableBranches" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 mb-1">New Department <span class="text-red-500">*</span></label>
                        <select v-model="transferForm.departmentId" :disabled="!transferForm.branchId || isTransferDeptLoading" required
                            class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs bg-white disabled:bg-slate-100 disabled:cursor-not-allowed">
                            <option value="" disabled>{{ isTransferDeptLoading ? 'Loading departments...' : 'Select Department' }}</option>
                            <option v-for="d in transferDepartments" :key="d.id" :value="d.id">{{ d.name }}</option>
                        </select>
                    </div>
                </div>

                <!-- New Position -->
                <div>
                    <label class="block font-bold text-slate-800 mb-1">New Position (Job Title)</label>
                    <select v-model="transferForm.positionId"
                        class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-xs bg-white">
                        <option value="">Keep current position ({{ transferEmployeeItem?.positionName || 'N/A' }})</option>
                        <option v-for="p in availablePositions" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                    <button type="button" @click="showTransferModal = false"
                        class="px-4 h-9 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isTransferring"
                        class="px-4 h-9 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs">
                        <LoaderCircle v-if="isTransferring" class="animate-spin w-4 h-4" />
                        <span>{{ isTransferring ? 'Transferring...' : 'Transfer Employee' }}</span>
                    </button>
                </div>
            </form>
        </ModalGeneric>

        <!-- 7. Modal Change Status -->
        <ModalGeneric v-model="showStatusModal" title="Update Employee Status" width="460px">
            <form @submit.prevent="handleUpdateStatus" class="space-y-4 text-xs text-slate-700">
                <div v-if="statusEmployeeItem" class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-slate-900 text-sm">{{ statusEmployeeItem.fullName }}</h4>
                        <p class="text-[11px] text-slate-500 font-mono">Code: {{ statusEmployeeItem.employeeCode }}</p>
                    </div>
                    <StatusBadge :content="statusEmployeeItem.status" :type="statusEmployeeItem.status" />
                </div>

                <div>
                    <label class="block font-bold text-slate-800 mb-1.5">New Status <span class="text-red-500">*</span></label>
                    <select v-model="selectedStatus" required
                        class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 text-xs bg-white">
                        <option value="PROBATION">PROBATION (Probation)</option>
                        <option value="ACTIVE">ACTIVE (Active)</option>
                        <option value="ON_LEAVE">ON_LEAVE (On Leave)</option>
                        <option value="RESIGNED">RESIGNED (Resigned)</option>
                        <option value="TERMINATED">TERMINATED (Terminated)</option>
                    </select>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button type="button" @click="showStatusModal = false"
                        class="px-4 h-9 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isUpdatingStatus"
                        class="px-4 h-9 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs">
                        <LoaderCircle v-if="isUpdatingStatus" class="animate-spin w-4 h-4" />
                        <span>{{ isUpdatingStatus ? 'Updating...' : 'Update Status' }}</span>
                    </button>
                </div>
            </form>
        </ModalGeneric>
    </MainContent>
</template>

<script setup>
import {
    ChevronLeft, Circle, Eye, Pencil, Trash2, LoaderCircle, Plus, X, Upload,
    FileSpreadsheet, AlertCircle, ArrowLeftRight, Download, Search, MoreVertical,
    CreditCard, Check, Copy, RotateCcw, SlidersHorizontal, Radio, Users
} from "@lucide/vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import StatusBadge from "../components/StatusBadge.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ToastMessage from "../components/ToastMessage.vue";
import ModalGeneric from "../components/ModalGeneric.vue";
import TableEmployeeSkeleton from "../components/TableEmployeeSkeleton.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useEmployeeStore } from "../store/employeeStore.js";
import { useBranchStore } from "../store/branchStore.js";
import { useDepartmentStore } from "../store/departmentStore.js";
import { usePositionStore } from "../store/positionStore.js";

const router = useRouter();

const employeeStore = useEmployeeStore();
const branchStore = useBranchStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();

const employees = computed(() => employeeStore.employees);

const isFirstLoading = ref(false);
const isPageLoading = ref(false);

// --- Search & Filters State ---
const searchQuery = ref('');
const statusFilter = ref('ALL');
let searchDebounceTimer = null;

const isFiltered = computed(() => {
    return searchQuery.value.trim() !== '' || statusFilter.value !== 'ALL';
});

const handleSearchInput = () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        pagination.pageNo = 1;
        loadEmployees(1);
    }, 300);
};

const clearSearch = () => {
    searchQuery.value = '';
    pagination.pageNo = 1;
    loadEmployees(1);
};

const handleStatusFilterChange = () => {
    pagination.pageNo = 1;
    loadEmployees(1);
};

const resetFilters = () => {
    searchQuery.value = '';
    statusFilter.value = 'ALL';
    pagination.pageNo = 1;
    loadEmployees(1);
};

// --- Dropdown Actions Menu State ---
const activeDropdownId = ref(null);

const shouldOpenUpward = (index, total) => {
    if (total <= 1) return false;
    // Menu is ~250px tall (requiring ~5 rows below). If fewer than 5 rows below, open upward.
    return (total - 1 - index) < 5 && index > 0;
};

const toggleDropdown = (id) => {
    activeDropdownId.value = activeDropdownId.value === id ? null : id;
};

const closeDropdown = () => {
    activeDropdownId.value = null;
};

const handleDocumentClick = (e) => {
    if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.dropdown-menu-container')) {
        activeDropdownId.value = null;
    }
};

// --- Modals State ---
const showDetailModal = ref(false);
const selectedEmployee = ref(null);

const showImportModal = ref(false);
const isImporting = ref(false);
const isDragging = ref(false);
const importFile = ref(null);
const importErrors = ref([]);
const fileInputRef = ref(null);

const toast = reactive({
    show: false,
    message: '',
    type: 'success'
});

const showToast = (message, type = 'success') => {
    toast.message = message;
    toast.type = type;
    toast.show = true;
    setTimeout(() => {
        toast.show = false;
    }, 4000);
};

const pagination = reactive({
    pageNo: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    itemLabel: 'Employees'
});

const addEmployee = () => {
    router.push({ name: 'EmployeeForm' });
};

const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const openDetailModal = (employee) => {
    closeDropdown();
    selectedEmployee.value = employee;
    showDetailModal.value = true;
};

// --- NFC Card Management Modal State & Handlers ---
const showNfcModal = ref(false);
const selectedEmployeeForCard = ref(null);
const nfcCardInput = ref('');
const isSavingCard = ref(false);
const isUnlinkingCard = ref(false);
const isCopied = ref(false);

const openNfcModal = (emp) => {
    closeDropdown();
    selectedEmployeeForCard.value = emp;
    nfcCardInput.value = emp.nfcCardUid || '';
    isCopied.value = false;
    showNfcModal.value = true;
};

const copyNfcUid = () => {
    if (!selectedEmployeeForCard.value?.nfcCardUid) return;
    navigator.clipboard.writeText(selectedEmployeeForCard.value.nfcCardUid);
    isCopied.value = true;
    setTimeout(() => {
        isCopied.value = false;
    }, 2000);
};

const handleSaveNfcCard = async () => {
    if (!selectedEmployeeForCard.value) return;
    const cleanUid = nfcCardInput.value.trim();
    if (!cleanUid) {
        showToast('Please enter or scan a Card UID', 'error');
        return;
    }
    isSavingCard.value = true;
    try {
        await employeeStore.assignNfcCard(selectedEmployeeForCard.value.id, selectedEmployeeForCard.value, cleanUid);
        showToast('NFC Card linked successfully!', 'success');
        showNfcModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        console.error("Assign card error:", e);
        const errMsg = e.response?.data?.message || 'Failed to assign NFC Card. Please check if the card is already in use.';
        showToast(errMsg, 'error');
    } finally {
        isSavingCard.value = false;
    }
};

const handleUnlinkNfcCard = async () => {
    if (!selectedEmployeeForCard.value) return;
    isUnlinkingCard.value = true;
    try {
        await employeeStore.assignNfcCard(selectedEmployeeForCard.value.id, selectedEmployeeForCard.value, '');
        showToast('NFC Card unlinked successfully', 'success');
        nfcCardInput.value = '';
        if (selectedEmployeeForCard.value) {
            selectedEmployeeForCard.value.nfcCardUid = null;
        }
        showNfcModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        console.error("Unlink card error:", e);
        showToast(e.response?.data?.message || 'Failed to unlink NFC Card', 'error');
    } finally {
        isUnlinkingCard.value = false;
    }
};

// --- Edit & Delete Handlers ---
const showEditModal = ref(false);
const isUpdating = ref(false);
const editingEmployeeId = ref(null);
const editForm = reactive({
    fullName: '',
    email: '',
    gender: 'MALE',
    phone: '',
    dateOfBirth: '',
    startDate: '',
    address: '',
    nfcCardUid: ''
});

const openEditModal = (emp) => {
    closeDropdown();
    editingEmployeeId.value = emp.id;
    editForm.fullName = emp.fullName || '';
    editForm.email = emp.email || '';
    editForm.gender = emp.gender || 'MALE';
    editForm.phone = emp.phone || '';
    editForm.dateOfBirth = emp.dateOfBirth || '';
    editForm.startDate = emp.startDate || '';
    editForm.address = emp.address || '';
    editForm.nfcCardUid = emp.nfcCardUid || '';
    showEditModal.value = true;
};

const handleUpdateEmployee = async () => {
    if (!editingEmployeeId.value) return;
    isUpdating.value = true;
    try {
        await employeeStore.updateEmployee(editingEmployeeId.value, editForm);
        showToast('Employee updated successfully', 'success');
        showEditModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        showToast(e.response?.data?.message || 'Failed to update employee', 'error');
    } finally {
        isUpdating.value = false;
    }
};

const showDeleteModal = ref(false);
const isDeleting = ref(false);
const employeeToDelete = ref(null);

const openDeleteModal = (emp) => {
    closeDropdown();
    employeeToDelete.value = emp;
    showDeleteModal.value = true;
};

const confirmDeleteEmployee = async () => {
    if (!employeeToDelete.value) return;
    isDeleting.value = true;
    try {
        await employeeStore.deleteEmployee(employeeToDelete.value.id);
        showToast('Employee deleted successfully', 'success');
        showDeleteModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        showToast(e.response?.data?.message || 'Failed to delete employee', 'error');
    } finally {
        isDeleting.value = false;
    }
};

// --- Change Employee Status Handlers ---
const showStatusModal = ref(false);
const isUpdatingStatus = ref(false);
const statusEmployeeItem = ref(null);
const selectedStatus = ref('ACTIVE');

const openStatusModal = (emp) => {
    closeDropdown();
    statusEmployeeItem.value = emp;
    selectedStatus.value = emp.status || 'ACTIVE';
    showStatusModal.value = true;
};

const handleUpdateStatus = async () => {
    if (!statusEmployeeItem.value) return;
    isUpdatingStatus.value = true;
    try {
        await employeeStore.updateEmployeeStatus(statusEmployeeItem.value.id, selectedStatus.value);
        showToast('Employee status updated successfully!', 'success');
        showStatusModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        console.error("Status update error:", e);
        showToast(e.response?.data?.message || 'Failed to update employee status', 'error');
    } finally {
        isUpdatingStatus.value = false;
    }
};

// --- Transfer Employee Handlers ---
const showTransferModal = ref(false);
const isTransferring = ref(false);
const transferEmployeeItem = ref(null);

const availableBranches = computed(() => branchStore.branches);
const availablePositions = computed(() => positionStore.positions);
const transferDepartments = ref([]);
const isTransferDeptLoading = ref(false);

const transferForm = reactive({
    branchId: '',
    departmentId: '',
    positionId: ''
});

const openTransferModal = async (emp) => {
    closeDropdown();
    transferEmployeeItem.value = emp;
    transferForm.branchId = emp.branchId || '';
    transferForm.departmentId = emp.departmentId || '';
    transferForm.positionId = emp.positionId || '';

    showTransferModal.value = true;

    try {
        if (branchStore.branches.length === 0) {
            await branchStore.fetchBranches(0, 100);
        }
        if (positionStore.positions.length === 0) {
            await positionStore.fetchPositions(1, 100);
        }
        if (transferForm.branchId) {
            await loadDepartmentsForTransfer(transferForm.branchId);
        }
    } catch (err) {
        console.error("Error loading transfer options:", err);
    }
};

const handleBranchChange = async () => {
    transferForm.departmentId = '';
    if (transferForm.branchId) {
        await loadDepartmentsForTransfer(transferForm.branchId);
    } else {
        transferDepartments.value = [];
    }
};

const loadDepartmentsForTransfer = async (branchId) => {
    isTransferDeptLoading.value = true;
    try {
        const res = await departmentStore.getDepartmentsByBranch(branchId, 0, 100);
        transferDepartments.value = res.data?.data?.items || res.data?.items || [];
    } catch (err) {
        console.error("Error loading departments for branch:", err);
        transferDepartments.value = [];
    } finally {
        isTransferDeptLoading.value = false;
    }
};

const handleTransferEmployee = async () => {
    if (!transferEmployeeItem.value) return;
    if (!transferForm.branchId) {
        showToast('Please select a new branch', 'error');
        return;
    }
    if (!transferForm.departmentId) {
        showToast('Please select a new department', 'error');
        return;
    }

    isTransferring.value = true;
    try {
        const payload = {
            branchId: Number(transferForm.branchId),
            departmentId: Number(transferForm.departmentId),
            positionId: transferForm.positionId ? Number(transferForm.positionId) : null
        };
        await employeeStore.transferEmployee(transferEmployeeItem.value.id, payload);
        showToast('Employee transferred successfully!', 'success');
        showTransferModal.value = false;
        await loadEmployees(pagination.pageNo);
    } catch (e) {
        console.error("Transfer error:", e);
        showToast(e.response?.data?.message || 'Failed to transfer employee', 'error');
    } finally {
        isTransferring.value = false;
    }
};

// --- Excel Import State & Handlers ---
const resetImportState = () => {
    importFile.value = null;
    importErrors.value = [];
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/humify_template_import_employee.xlsx';
    link.download = 'humify_template_import_employee.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

watch(showImportModal, (newVal) => {
    if (!newVal) {
        resetImportState();
    }
});

const handleDragOver = (e) => {
    e.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = (e) => {
    e.preventDefault();
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    if (file) {
        selectFile(file);
    }
};

const triggerFileInput = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        selectFile(file);
    }
};

const selectFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
        showToast('Invalid file format. Please upload an Excel file (.xlsx or .xls)', 'error');
        resetImportState();
        return;
    }
    importFile.value = file;
    importErrors.value = [];
};

const removeFile = () => {
    resetImportState();
};

const executeImport = async () => {
    if (!importFile.value) {
        showToast('Please select a file to import', 'error');
        return;
    }
    isImporting.value = true;
    importErrors.value = [];
    try {
        const res = await employeeStore.importEmployees(importFile.value);
        if (res && res.length > 0) {
            importErrors.value = res;
            showToast('Import completed with validation errors.', 'error');
        } else {
            showToast('Employees imported successfully!', 'success');
            showImportModal.value = false;
            importFile.value = null;
            await loadEmployees(1);
        }
    } catch (error) {
        console.error("Excel import error:", error);
        const errorMsg = error.response?.data?.message || 'Failed to import employees. Please verify your file format.';
        showToast(errorMsg, 'error');
    } finally {
        isImporting.value = false;
    }
};

// --- Data Loading & Pagination ---
const loadEmployees = async (page = 1) => {
    isPageLoading.value = true;
    activeDropdownId.value = null;
    try {
        const kw = searchQuery.value.trim();
        const hasFilters = kw !== '' || statusFilter.value !== 'ALL';

        if (hasFilters) {
            const res = await employeeStore.searchEmployees(kw, page - 1, pagination.pageSize, statusFilter.value);
            pagination.pageNo = page;
            pagination.pageSize = res.data.pageSize;
            pagination.totalItems = res.data.totalElements;
            pagination.totalPages = res.data.totalPages;
        } else {
            const res = await employeeStore.fetchEmployees(page, pagination.pageSize);
            pagination.pageNo = res.data.pageNo;
            pagination.pageSize = res.data.pageSize;
            pagination.totalItems = res.data.totalElements;
            pagination.totalPages = res.data.totalPages;
        }
    } catch (err) {
        console.error("Load employees error:", err);
    } finally {
        isPageLoading.value = false;
    }
};

const handlePageChange = async (page) => {
    await loadEmployees(page);
};

onMounted(async () => {
    isFirstLoading.value = true;
    try {
        await loadEmployees(1);
    } finally {
        isFirstLoading.value = false;
    }
    window.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
    window.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes slideUp {
    from {
        transform: translateY(16px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slide-up {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>