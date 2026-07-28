<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">

            <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show"></ToastMessage>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Employee</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Employee</span>
                    </nav>
                </div>

                <div class="flex items-center gap-3 w-auto">
                    <div class="min-w-32">
                        <SecondaryButton :content="'Import Excel'" @click="showImportModal = true">
                            <template #icon>
                                <Upload class="w-4 h-4"></Upload>
                            </template>
                        </SecondaryButton>
                    </div>
                    <div class="min-w-32">
                        <PrimaryButton :content="'Add Employee'" @click="addEmployee">
                            <template #icon>
                                <Plus class="w-5"></Plus>
                            </template>
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <TableEmployeeSkeleton v-if="isFirstLoading"></TableEmployeeSkeleton>
            <div v-if="!isFirstLoading" class="relative">
                <div v-if="isPageLoading"
                    class="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                    <LoaderCircle class="animate-spin w-16 h-16"></LoaderCircle>
                </div>
                <div
                    class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-200/80">
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                        Employee Code
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                                        Full name
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                                        Email
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
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
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="employees.length > 0" v-for="employee in employees" :key="employee.email"
                                    class="hover:bg-slate-50/40 transition-colors group">
                                    <td class="py-5 px-6">
                                        <span
                                            class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">
                                            {{ employee.employeeCode }}
                                        </span>
                                    </td>

                                    <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                                        {{ employee.fullName }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.email }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.startDate }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.gender }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                                        <button @click="openStatusModal(employee)" title="Click to change status" class="cursor-pointer hover:opacity-80 transition-opacity">
                                            <StatusBadge :content="employee.status" :type="employee.status"></StatusBadge>
                                        </button>
                                    </td>

                                    <td class="py-5 px-6 text-right">
                                        <div class="flex items-center justify-end gap-1.5 w-full">
                                            <!-- View Details Button (Eye Icon) -->
                                            <button @click="openDetailModal(employee)"
                                                title="View Details"
                                                class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-2xs cursor-pointer">
                                                <Eye class="w-4 h-4" />
                                            </button>

                                             <!-- Transfer Employee Button (ArrowLeftRight Icon) -->
                                            <button @click="openTransferModal(employee)"
                                                title="Transfer Employee & Position"
                                                class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-2xs cursor-pointer">
                                                <ArrowLeftRight class="w-4 h-4" />
                                            </button>

                                            <!-- Edit Employee Button (Pencil Icon) -->
                                            <button @click="openEditModal(employee)"
                                                title="Edit Employee"
                                                class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-all shadow-2xs cursor-pointer">
                                                <Pencil class="w-4 h-4" />
                                            </button>

                                            <!-- Delete Employee Button (Trash2 Icon) -->
                                            <button @click="openDeleteModal(employee)"
                                                title="Delete Employee"
                                                class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-2xs cursor-pointer">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td colspan="7" class="text-center py-6 text-slate-400">
                                        No data of employee
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <PaginationSection v-if="employees.length > 0" :page-size="pagination.pageSize"
                :current-page="pagination.pageNo" :item-label="'Employees'" :total-items="pagination.totalItems"
                :total-page="pagination.totalPages" @changePage="handlePageChange">
            </PaginationSection>
        </div>

        <ModalGeneric v-model="showDetailModal" :title="'Employee Details'" width="640px">
            <div v-if="selectedEmployee" class="space-y-6">

                <!-- Block Avatar & Tên -->
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
                            </span></p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Information
                        </h5>

                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Email
                                    Address</span>
                                <span class="text-xs font-medium text-slate-800 break-all">
                                    {{ selectedEmployee.email || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">
                                    Phone Number
                                </span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.phone || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">
                                    Date of Birth
                                </span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.dateOfBirth || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span
                                    class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Gender</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.gender || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span
                                    class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Address</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.address || 'N/A' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Cột phải: Thông tin công việc -->
                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employment Details
                        </h5>

                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Start
                                    Date</span>
                                <span class="text-xs font-medium text-slate-800">
                                    {{ selectedEmployee.startDate || 'N/A' }}
                                </span>
                            </div>
                            <div>
                                <span
                                    class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Branch</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.branchName
                                    }}</span>
                            </div>
                            <div>
                                <span
                                    class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Department</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.departmentName
                                    }}</span>
                            </div>
                            <div>
                                <span
                                    class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Position</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.positionName
                                    }}</span>
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

        <!-- Modal Import Excel -->
        <ModalGeneric v-model="showImportModal" :title="'Import Employees from Excel'" width="560px">
            <div class="space-y-6">
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
                            <p class="text-[10px] text-slate-400 font-light">{{ (importFile.size / 1024).toFixed(1) }}
                                KB</p>
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
                        <span class="text-xs font-semibold">Import failed with {{ importErrors.length }} validation
                            errors:</span>
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

        <!-- Edit Employee Modal -->
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

                <div>
                    <label class="block font-bold text-slate-800 mb-1">Address</label>
                    <input v-model="editForm.address" type="text" placeholder="e.g. Hanoi, Vietnam"
                        class="w-full h-9 px-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs" />
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

        <!-- Delete Employee Confirmation Modal -->
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

        <!-- Transfer Employee Modal -->
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

        <!-- Change Status Modal -->
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
import { ChevronLeft, Circle, Eye, Pencil, Trash2, LoaderCircle, Plus, X, Upload, FileSpreadsheet, AlertCircle, ArrowLeftRight } from "@lucide/vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import StatusBadge from "../components/StatusBadge.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ToastMessage from "../components/ToastMessage.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { useEmployeeStore } from "../store/employeeStore.js";
import { useBranchStore } from "../store/branchStore.js";
import { useDepartmentStore } from "../store/departmentStore.js";
import { usePositionStore } from "../store/positionStore.js";
import TableEmployeeSkeleton from "../components/TableEmployeeSkeleton.vue";
import ModalGeneric from "../components/ModalGeneric.vue";


const router = useRouter()

const employeeStore = useEmployeeStore()
const branchStore = useBranchStore()
const departmentStore = useDepartmentStore()
const positionStore = usePositionStore()

const employees = computed(() => employeeStore.employees)

const isFirstLoading = ref(false)
const isPageLoading = ref(false)

const showDetailModal = ref(false)
const selectedEmployee = ref(null)

const showImportModal = ref(false)
const isImporting = ref(false)
const isDragging = ref(false)
const importFile = ref(null)
const importErrors = ref([])
const fileInputRef = ref(null)

const toast = reactive({
    show: false,
    message: '',
    type: 'success'
})

const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.show = true
    setTimeout(() => {
        toast.show = false
    }, 4000)
}

const handleDragOver = (e) => {
    e.preventDefault()
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}

const handleDrop = (e) => {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file) {
        selectFile(file)
    }
}

const triggerFileInput = () => {
    fileInputRef.value.click()
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        selectFile(file)
    }
}

const selectFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext !== 'xlsx' && ext !== 'xls') {
        showToast('Invalid file format. Please upload an Excel file (.xlsx or .xls)', 'error')
        return
    }
    importFile.value = file
    importErrors.value = []
}

const removeFile = () => {
    importFile.value = null
    importErrors.value = []
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const executeImport = async () => {
    if (!importFile.value) {
        showToast('Please select a file to import', 'error')
        return
    }
    isImporting.value = true
    importErrors.value = []
    try {
        const res = await employeeStore.importEmployees(importFile.value)
        if (res && res.length > 0) {
            importErrors.value = res
            showToast('Import completed with validation errors.', 'error')
        } else {
            showToast('Employees imported successfully!', 'success')
            showImportModal.value = false
            importFile.value = null
            // Reload page 1
            await handlePageChange(1)
        }
    } catch (error) {
        console.error("Excel import error:", error)
        const errorMsg = error.response?.data?.message || 'Failed to import employees. Please verify your file format.'
        showToast(errorMsg, 'error')
    } finally {
        isImporting.value = false
    }
}

const pagination = reactive({
    pageNo: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    itemLabel: ''
})

const addEmployee = () => {
    router.push({ name: 'EmployeeForm' })
}

// Hàm lấy chữ cái đầu của tên (initials) cho avatar placeholder
const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const openDetailModal = async (employee) => {
    selectedEmployee.value = employee
    showDetailModal.value = true
}

// --- Edit & Delete Employee Handlers ---
const showEditModal = ref(false)
const isUpdating = ref(false)
const editingEmployeeId = ref(null)
const editForm = reactive({
    fullName: '',
    email: '',
    gender: 'MALE',
    phone: '',
    dateOfBirth: '',
    startDate: '',
    address: ''
})

const openEditModal = (emp) => {
    editingEmployeeId.value = emp.id
    editForm.fullName = emp.fullName || ''
    editForm.email = emp.email || ''
    editForm.gender = emp.gender || 'MALE'
    editForm.phone = emp.phone || ''
    editForm.dateOfBirth = emp.dateOfBirth || ''
    editForm.startDate = emp.startDate || ''
    editForm.address = emp.address || ''
    showEditModal.value = true
}

const handleUpdateEmployee = async () => {
    if (!editingEmployeeId.value) return
    isUpdating.value = true
    try {
        await employeeStore.updateEmployee(editingEmployeeId.value, editForm)
        showToast('Employee updated successfully', 'success')
        showEditModal.value = false
        await handlePageChange(pagination.pageNo)
    } catch (e) {
        showToast(e.response?.data?.message || 'Failed to update employee', 'error')
    } finally {
        isUpdating.value = false
    }
}

const showDeleteModal = ref(false)
const isDeleting = ref(false)
const employeeToDelete = ref(null)

const openDeleteModal = (emp) => {
    employeeToDelete.value = emp
    showDeleteModal.value = true
}

const confirmDeleteEmployee = async () => {
    if (!employeeToDelete.value) return
    isDeleting.value = true
    try {
        await employeeStore.deleteEmployee(employeeToDelete.value.id)
        showToast('Employee deleted successfully', 'success')
        showDeleteModal.value = false
        await handlePageChange(pagination.pageNo)
    } catch (e) {
        showToast(e.response?.data?.message || 'Failed to delete employee', 'error')
    } finally {
        isDeleting.value = false
    }
}

// --- Change Employee Status State & Handlers ---
const showStatusModal = ref(false)
const isUpdatingStatus = ref(false)
const statusEmployeeItem = ref(null)
const selectedStatus = ref('ACTIVE')

const openStatusModal = (emp) => {
    statusEmployeeItem.value = emp
    selectedStatus.value = emp.status || 'ACTIVE'
    showStatusModal.value = true
}

const handleUpdateStatus = async () => {
    if (!statusEmployeeItem.value) return
    isUpdatingStatus.value = true
    try {
        await employeeStore.updateEmployeeStatus(statusEmployeeItem.value.id, selectedStatus.value)
        showToast('Employee status updated successfully!', 'success')
        showStatusModal.value = false
        await handlePageChange(pagination.pageNo)
    } catch (e) {
        console.error("Status update error:", e)
        showToast(e.response?.data?.message || 'Failed to update employee status', 'error')
    } finally {
        isUpdatingStatus.value = false
    }
}

// --- Transfer Employee State & Handlers ---
const showTransferModal = ref(false)
const isTransferring = ref(false)
const transferEmployeeItem = ref(null)

const availableBranches = computed(() => branchStore.branches)
const availablePositions = computed(() => positionStore.positions)
const transferDepartments = ref([])
const isTransferDeptLoading = ref(false)

const transferForm = reactive({
    branchId: '',
    departmentId: '',
    positionId: ''
})

const openTransferModal = async (emp) => {
    transferEmployeeItem.value = emp
    transferForm.branchId = emp.branchId || ''
    transferForm.departmentId = emp.departmentId || ''
    transferForm.positionId = emp.positionId || ''

    showTransferModal.value = true

    try {
        if (branchStore.branches.length === 0) {
            await branchStore.fetchBranches(0, 100)
        }
        if (positionStore.positions.length === 0) {
            await positionStore.fetchPositions(1, 100)
        }
        if (transferForm.branchId) {
            await loadDepartmentsForTransfer(transferForm.branchId)
        }
    } catch (err) {
        console.error("Error loading transfer options:", err)
    }
}

const handleBranchChange = async () => {
    transferForm.departmentId = ''
    if (transferForm.branchId) {
        await loadDepartmentsForTransfer(transferForm.branchId)
    } else {
        transferDepartments.value = []
    }
}

const loadDepartmentsForTransfer = async (branchId) => {
    isTransferDeptLoading.value = true
    try {
        const res = await departmentStore.getDepartmentsByBranch(branchId, 0, 100)
        transferDepartments.value = res.data?.data?.items || res.data?.items || []
    } catch (err) {
        console.error("Error loading departments for branch:", err)
        transferDepartments.value = []
    } finally {
        isTransferDeptLoading.value = false
    }
}

const handleTransferEmployee = async () => {
    if (!transferEmployeeItem.value) return
    if (!transferForm.branchId) {
        showToast('Please select a new branch', 'error')
        return
    }
    if (!transferForm.departmentId) {
        showToast('Please select a new department', 'error')
        return
    }

    isTransferring.value = true
    try {
        const payload = {
            branchId: Number(transferForm.branchId),
            departmentId: Number(transferForm.departmentId),
            positionId: transferForm.positionId ? Number(transferForm.positionId) : null
        }
        await employeeStore.transferEmployee(transferEmployeeItem.value.id, payload)
        showToast('Employee transferred successfully!', 'success')
        showTransferModal.value = false
        await handlePageChange(pagination.pageNo)
    } catch (e) {
        console.error("Transfer error:", e)
        showToast(e.response?.data?.message || 'Failed to transfer employee', 'error')
    } finally {
        isTransferring.value = false
    }
}

onMounted(async () => {
    isFirstLoading.value = true
    try {
        const res = await employeeStore.fetchEmployees(1, pagination.pageSize)
        pagination.pageNo = res.data.pageNo
        pagination.pageSize = res.data.pageSize
        pagination.totalItems = res.data.totalElements
        pagination.totalPages = res.data.totalPages
    } finally {
        isFirstLoading.value = false
    }
})

const handlePageChange = async (page) => {
    isPageLoading.value = true
    pagination.pageNo = page
    try {
        const res = await employeeStore.fetchEmployees(page, pagination.pageSize)
        pagination.pageNo = res.data.pageNo
        pagination.pageSize = res.data.pageSize
        pagination.totalItems = res.data.totalElements
        pagination.totalPages = res.data.totalPages
    } finally {
        isPageLoading.value = false
    }
}
</script>

<style scoped>
/* Hiệu ứng mờ và trượt lên cho Modal */
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