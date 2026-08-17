<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 relative">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER & PROFILE BANNER -->
      <div class="flex items-center justify-between gap-6 mb-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 uppercase shadow-md overflow-hidden">
            <img v-if="employeeForm.avatarUrl" :src="employeeForm.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ getInitials(employeeForm.fullName) }}</span>
          </div>

          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ employeeForm.fullName || 'My Profile' }}</h1>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 tracking-wider uppercase border border-slate-200">
                {{ employeeForm.status || 'ACTIVE' }}
              </span>
              <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 tracking-wider uppercase border border-blue-100">
                {{ employeeForm.branchName || 'HUMIFY HQ' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-normal mt-1">
              {{ employeeForm.positionName || 'Employee' }} • {{ employeeForm.departmentName || 'General Department' }}
            </p>
          </div>
        </div>
      </div>

      <!-- TAB NAVIGATION -->
      <div class="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto">
        <button
            @click="activeTab = 'personal'"
            class="pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap"
            :class="activeTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Account Settings
        </button>

        <button
            @click="activeTab = 'education'"
            class="pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap"
            :class="activeTab === 'education' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Education
        </button>

        <button
            @click="activeTab = 'certificates'"
            class="pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap"
            :class="activeTab === 'certificates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Certificates
        </button>

        <button
            @click="activeTab = 'experience'"
            class="pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap"
            :class="activeTab === 'experience' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          Work Experience
        </button>
      </div>

      <!-- TAB 1: ACCOUNT SETTINGS / PERSONAL INFO -->
      <div v-if="activeTab === 'personal'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input type="text" v-model="employeeForm.fullName" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium" />
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Employee Code</label>
                <input type="text" :value="employeeForm.employeeCode" readonly class="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2.5 text-xs outline-none font-mono cursor-not-allowed" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input type="email" v-model="employeeForm.email" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium" />
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input type="text" v-model="employeeForm.phone" placeholder="+1 (555) 000-8842" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Address</label>
              <input type="text" v-model="employeeForm.address" placeholder="Residential Address..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium" />
            </div>
          </div>

          <!-- Security Section -->
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Security</h3>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-slate-800">Password</div>
                <div class="text-[11px] text-slate-400">Change your login password securely.</div>
              </div>
              <button @click="openPasswordModal" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer">
                Change
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <SecondaryButton content="Discard Changes" @click="loadProfileData" />
            <PrimaryButton content="Save Changes" @click="handleSaveProfile" :disabled="isSubmitting" />
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center space-y-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Profile Photo</span>

            <div class="w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 mx-auto bg-slate-50 flex items-center justify-center relative group">
              <img v-if="employeeForm.avatarUrl" :src="employeeForm.avatarUrl" alt="Profile Avatar" class="w-full h-full object-cover" />
              <User class="w-16 h-16 text-slate-300" v-else />

              <input type="file" ref="avatarInputRef" class="hidden" accept="image/*" @change="onAvatarFileSelected" />
              <div @click="avatarInputRef.click()" class="absolute inset-0 bg-black/40 text-white text-xs font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                Change Photo
              </div>
            </div>

            <p class="text-[11px] text-slate-400 font-light">JPG, GIF or PNG. Max size of 2MB</p>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Status</span>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-bold text-slate-800">Verified Employee</span>
            </div>
            <p class="text-[11px] text-slate-400 font-light">
              Joined Humify on {{ formatDate(employeeForm.startDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- TAB 2: EDUCATION -->
      <div v-else-if="activeTab === 'education'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Education Entries</h2>
            <p class="text-xs text-slate-400">Manage academic degrees and background qualifications.</p>
          </div>
          <button @click="openAddEduModal" class="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer">
            <Plus class="w-4 h-4" /> Add Education
          </button>
        </div>

        <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
          <div v-if="educations.length === 0" class="p-12 text-center text-slate-400 text-xs">
            No education entries recorded yet.
          </div>

          <div v-else v-for="edu in educations" :key="edu.id" class="p-6 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                <GraduationCap class="w-5 h-5" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-slate-900">{{ edu.degreeLevel }} - {{ edu.major }}</h4>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">Verified</span>
                </div>
                <div class="text-xs font-semibold text-slate-700">{{ edu.schoolName }}</div>
                <div class="text-[11px] font-mono text-slate-400">{{ edu.startYear }} — {{ edu.endYear || 'Present' }} • GPA: {{ edu.gpa || 'N/A' }}</div>
                <p v-if="edu.note" class="text-xs text-slate-500 pt-2 font-light">{{ edu.note }}</p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button @click="openEditEduModal(edu)" class="text-slate-400 hover:text-blue-600 p-1.5 cursor-pointer transition-colors" title="Edit">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="handleDeleteEducation(edu.id)" class="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer transition-colors" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: CERTIFICATES -->
      <div v-else-if="activeTab === 'certificates'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Certificates & Licenses</h2>
            <p class="text-xs text-slate-400">Manage professional credentials and qualifications.</p>
          </div>
          <button @click="openAddCertModal" class="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer">
            <Plus class="w-4 h-4" /> Add Certificate
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="cert in certificates" :key="cert.id" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Award class="w-5 h-5" />
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">VERIFIED</span>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-900 leading-snug">{{ cert.name }}</h4>
                <p class="text-xs text-slate-500 font-medium">{{ cert.issuedBy || 'Issuer Unknown' }}</p>
              </div>

              <div class="text-[11px] text-slate-400 space-y-1 font-mono pt-2 border-t border-slate-100">
                <div class="flex justify-between"><span>Issue Date:</span> <span class="text-slate-700 font-semibold">{{ cert.issuedDate ? formatDate(cert.issuedDate) : 'N/A' }}</span></div>
                <div class="flex justify-between"><span>Expiry Date:</span> <span class="text-slate-700 font-semibold">{{ cert.expiredDate ? formatDate(cert.expiredDate) : 'No Expiry' }}</span></div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <a v-if="cert.certificationFileUrl" :href="cert.certificationFileUrl" target="_blank" class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View Document <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <span v-else class="text-xs text-slate-400 italic">No File</span>

              <div class="flex items-center gap-1">
                <button @click="openEditCertModal(cert)" class="text-slate-400 hover:text-blue-600 p-1.5 cursor-pointer">
                  <Pencil class="w-4 h-4" />
                </button>
                <button @click="handleDeleteCert(cert.id)" class="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="certificates.length === 0" class="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No professional certificates added yet.
          </div>
        </div>
      </div>

      <!-- TAB 4: WORK EXPERIENCE (LinkedIn Style Timeline) -->
      <div v-else-if="activeTab === 'experience'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Work Experience</h2>
            <p class="text-xs text-slate-400">Career progression and professional history.</p>
          </div>
          <button @click="openAddExpModal" class="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer">
            <Plus class="w-4 h-4" /> Add Experience
          </button>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
          <div v-if="experiences.length === 0" class="py-12 text-center text-slate-400 text-xs">
            No work experience entries recorded yet.
          </div>

          <div v-else class="relative space-y-8 before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-slate-200/80">
            <div
              v-for="exp in experiences"
              :key="exp.id"
              class="relative pl-14 flex items-start justify-between gap-4 group"
            >
              <!-- Timeline node logo/icon -->
              <div class="absolute left-0 top-0.5 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs border-2 border-white group-hover:bg-blue-600 transition-all duration-200">
                <Building2 class="w-5 h-5" />
              </div>

              <!-- Content details -->
              <div class="space-y-1.5 flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {{ exp.position }}
                    </h3>
                    <div class="text-xs font-semibold text-slate-700 mt-0.5">
                      {{ exp.companyName }}
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="openEditExpModal(exp)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Experience"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button
                      @click="handleDeleteExp(exp.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Experience"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Dates & Calculated Duration -->
                <div class="text-xs text-slate-500 font-normal flex items-center gap-2 flex-wrap">
                  <span>{{ formatDate(exp.startDate) }} — {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}</span>
                  <span v-if="calculateDuration(exp.startDate, exp.endDate)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60">
                    <Clock class="w-3 h-3 text-slate-400" />
                    {{ calculateDuration(exp.startDate, exp.endDate) }}
                  </span>
                </div>

                <!-- Description -->
                <div v-if="exp.description" class="text-xs text-slate-600 font-normal leading-relaxed pt-1.5 whitespace-pre-line">
                  {{ exp.description }}
                </div>

                <!-- Reason for leaving -->
                <div v-if="exp.reasonForLeaving" class="text-[11px] text-slate-400 italic pt-1 flex items-center gap-1 border-t border-slate-100/80 mt-2">
                  <span>Reason for leaving:</span>
                  <span class="text-slate-500 font-medium">{{ exp.reasonForLeaving }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODALS -->
      <!-- Add / Edit Education Modal -->
      <ModalGeneric v-model="eduModal.show" :title="isEditingEdu ? 'Edit Education Entry' : 'Add Education Entry'" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Degree Level <span class="text-red-500">*</span></label>
            <input type="text" v-model="eduForm.degreeLevel" placeholder="Bachelor of Science" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">School / University <span class="text-red-500">*</span></label>
            <input type="text" v-model="eduForm.schoolName" placeholder="Harvard University" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Major</label>
              <input type="text" v-model="eduForm.major" placeholder="Computer Science" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">GPA</label>
              <input type="number" step="0.1" v-model.number="eduForm.gpa" placeholder="3.8" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Year <span class="text-red-500">*</span></label>
              <input type="number" v-model.number="eduForm.startYear" placeholder="2018" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">End Year</label>
              <input type="number" v-model.number="eduForm.endYear" placeholder="2022" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="eduModal.show = false" />
            <PrimaryButton :content="isEditingEdu ? 'Update' : 'Save'" @click="submitEducation" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

      <!-- Add / Edit Certificate Modal -->
      <ModalGeneric v-model="certModal.show" :title="isEditingCert ? 'Edit Professional Certificate' : 'Add Professional Certificate'" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Certificate Name <span class="text-red-500">*</span></label>
            <input type="text" v-model="certForm.name" placeholder="AWS Certified Solutions Architect" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Issued By</label>
            <input type="text" v-model="certForm.issuedBy" placeholder="Amazon Web Services" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Issue Date</label>
              <DateTimePicker v-model="certForm.issuedDate" dateOnly placeholder="Select Issue Date" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expiry Date</label>
              <DateTimePicker v-model="certForm.expiredDate" dateOnly placeholder="Select Expiry Date" />
            </div>
          </div>

          <!-- Upload file đính kèm -->
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Certificate Document (PDF/Image)</label>
            <input type="file" accept="image/*,.pdf" @change="onCertFileSelected" class="text-xs text-slate-500 border border-slate-200 rounded-lg p-2 w-full" />
            <p v-if="certForm.certificationFileUrl" class="text-[11px] text-emerald-600 mt-1 truncate">
              Attached URL: {{ certForm.certificationFileUrl }}
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="certModal.show = false" />
            <PrimaryButton :content="isEditingCert ? 'Update' : 'Save'" @click="submitCertificate" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

      <!-- Add / Edit Work Experience Modal -->
      <ModalGeneric v-model="expModal.show" :title="isEditingExp ? 'Edit Work Experience' : 'Add Work Experience'" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company Name <span class="text-red-500">*</span></label>
            <input type="text" v-model="expForm.companyName" placeholder="Aura Systems" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Position <span class="text-red-500">*</span></label>
            <input type="text" v-model="expForm.position" placeholder="Senior Product Designer" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date <span class="text-red-500">*</span></label>
              <DateTimePicker v-model="expForm.startDate" dateOnly placeholder="Select Start Date" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">End Date</label>
              <DateTimePicker v-model="expForm.endDate" dateOnly placeholder="Select End Date" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
            <textarea v-model="expForm.description" rows="3" placeholder="Key responsibilities and achievements..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"></textarea>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="expModal.show = false" />
            <PrimaryButton :content="isEditingExp ? 'Update' : 'Save'" @click="submitExperience" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

      <!-- Change Password Modal -->
      <ModalGeneric v-model="passwordModal.show" title="Change" width="450px">
        <form @submit.prevent="handleSavePassword" class="space-y-4" autocomplete="off">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Old Password <span class="text-red-500">*</span></label>
            <input type="password" v-model="passwordForm.oldPassword" autocomplete="current-password" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password <span class="text-red-500">*</span></label>
            <input type="password" v-model="passwordForm.newPassword" autocomplete="new-password" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
          </div>
        </form>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="passwordModal.show = false" />
            <PrimaryButton content="Update" @click="handleSavePassword" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import DateTimePicker from '../components/DateTimePicker.vue';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useUploadStore } from '../store/uploadStore';
import { User, GraduationCap, Award, Plus, Trash2, ExternalLink, Pencil, Briefcase, Building2, Calendar, Clock } from '@lucide/vue';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const uploadStore = useUploadStore();

const activeTab = ref('personal');
const isSubmitting = ref(false);
const avatarInputRef = ref(null);

const employeeForm = reactive({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  address: '',
  avatarUrl: '',
  gender: 'MALE',
  dateOfBirth: '',
  employeeCode: '',
  branchId: null,
  branchName: '',
  departmentId: null,
  departmentName: '',
  positionId: null,
  positionName: '',
  startDate: '',
  status: ''
});

const educations = computed(() => profileStore.educations);
const certificates = computed(() => profileStore.certificates);
const experiences = computed(() => profileStore.experiences);

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

// Education State
const eduModal = reactive({ show: false });
const eduForm = reactive({ id: null, degreeLevel: '', schoolName: '', major: '', startYear: 2020, endYear: 2024, gpa: null });
const isEditingEdu = ref(false);

// Certificates State
const certModal = reactive({ show: false });
const certForm = reactive({ id: null, name: '', issuedBy: '', issuedDate: '', expiredDate: '', certificationFileUrl: '' });
const isEditingCert = ref(false);

// Experience State
const expModal = reactive({ show: false });
const expForm = reactive({ id: null, companyName: '', position: '', startDate: '', endDate: '', description: '' });
const isEditingExp = ref(false);

// Security State
const passwordModal = reactive({ show: false });
const passwordForm = reactive({ oldPassword: '', newPassword: '' });

const currentEmployeeId = computed(() => employeeForm.id || null);

const loadProfileData = async () => {
  if (!authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (e) {
      console.error("Fetch user me error:", e);
    }
  }

  try {
    const empData = await profileStore.fetchMyProfile();
    if (empData) {
      Object.assign(employeeForm, empData);
    }

    const empId = employeeForm.id;
    if (empId) {
      await Promise.all([
        profileStore.fetchEducations(empId),
        profileStore.fetchCertificates(empId),
        profileStore.fetchExperiences(empId)
      ]);
    }
  } catch (e) {
    console.error("Load profile data error:", e);
    employeeForm.email = authStore.user?.email || '';
    employeeForm.fullName = authStore.user?.email?.split('@')[0] || 'User Profile';
  }
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A';
  const cleanStr = typeof isoStr === 'string' && isoStr.includes('T') ? isoStr.split('T')[0] : isoStr;
  const d = new Date(cleanStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr) return '';
  const start = new Date(startDateStr.includes('T') ? startDateStr.split('T')[0] : startDateStr);
  const end = endDateStr ? new Date(endDateStr.includes('T') ? endDateStr.split('T')[0] : endDateStr) : new Date();
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) months = 1;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`);

  return parts.join(' ');
};

// --- PERSONAL PROFILE & AVATAR ---
const handleSaveProfile = async () => {
  const empId = employeeForm.id || currentEmployeeId.value;
  if (!empId) {
    triggerToast('Your account is not linked to any Employee record to update.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      fullName: employeeForm.fullName || '',
      email: employeeForm.email || '',
      phone: employeeForm.phone || '',
      address: employeeForm.address || '',
      avatarUrl: employeeForm.avatarUrl || '',
      gender: employeeForm.gender || 'MALE',
      dateOfBirth: employeeForm.dateOfBirth || null,
      startDate: employeeForm.startDate || null
    };

    await profileStore.updateEmployeeInfo(empId, payload);
    triggerToast('Profile updated successfully!', 'success');
  } catch (err) {
    console.error("Update profile error response:", err.response);
    const serverMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile.';
    triggerToast(serverMessage, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const onAvatarFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const presignRes = await uploadStore.getPresignedUrl('avatars');
    const presignData = presignRes.data?.data;
    const cloudinaryRes = await uploadStore.uploadToCloudinary(file, presignData);

    employeeForm.avatarUrl = cloudinaryRes.secure_url;
    triggerToast('Image uploaded. Click "Save Changes" to apply.', 'success');
  } catch (err) {
    triggerToast('Failed to upload avatar.', 'error');
  }
};

// --- EDUCATION HANDLERS ---
const openAddEduModal = () => {
  if (!currentEmployeeId.value) {
    triggerToast('Your account is not linked to an Employee record.', 'error');
    return;
  }
  isEditingEdu.value = false;
  eduForm.id = null; eduForm.degreeLevel = ''; eduForm.schoolName = ''; eduForm.major = ''; eduForm.startYear = 2020; eduForm.endYear = 2024; eduForm.gpa = null;
  eduModal.show = true;
};

const openEditEduModal = (edu) => {
  isEditingEdu.value = true;
  eduForm.id = edu.id;
  eduForm.degreeLevel = edu.degreeLevel;
  eduForm.schoolName = edu.schoolName;
  eduForm.major = edu.major;
  eduForm.startYear = edu.startYear;
  eduForm.endYear = edu.endYear;
  eduForm.gpa = edu.gpa;
  eduModal.show = true;
};

const submitEducation = async () => {
  if (!eduForm.degreeLevel || !eduForm.schoolName) {
    triggerToast('Please enter required fields.', 'error');
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditingEdu.value && eduForm.id) {
      await profileStore.updateEducation(currentEmployeeId.value, eduForm.id, { ...eduForm });
      triggerToast('Education entry updated!', 'success');
    } else {
      await profileStore.createEducation(currentEmployeeId.value, { ...eduForm });
      triggerToast('Education entry added!', 'success');
    }
    eduModal.show = false;
  } catch (err) {
    triggerToast('Failed to save education.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteEducation = async (id) => {
  try {
    await profileStore.deleteEducation(currentEmployeeId.value, id);
    triggerToast('Education entry deleted.', 'success');
  } catch (err) {
    triggerToast('Failed to delete education.', 'error');
  }
};

// --- CERTIFICATES HANDLERS ---
const openAddCertModal = () => {
  if (!currentEmployeeId.value) {
    triggerToast('Your account is not linked to an Employee record.', 'error');
    return;
  }
  isEditingCert.value = false;
  certForm.id = null; certForm.name = ''; certForm.issuedBy = ''; certForm.issuedDate = ''; certForm.expiredDate = ''; certForm.certificationFileUrl = '';
  certModal.show = true;
};

const openEditCertModal = (cert) => {
  isEditingCert.value = true;
  certForm.id = cert.id;
  certForm.name = cert.name;
  certForm.issuedBy = cert.issuedBy;
  certForm.issuedDate = cert.issuedDate;
  certForm.expiredDate = cert.expiredDate;
  certForm.certificationFileUrl = cert.certificationFileUrl;
  certModal.show = true;
};

const onCertFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const presignRes = await uploadStore.getPresignedUrl('certificates');
    const presignData = presignRes.data?.data;
    const cloudinaryRes = await uploadStore.uploadToCloudinary(file, presignData);

    certForm.certificationFileUrl = cloudinaryRes.secure_url;
    triggerToast('Certificate file attached!', 'success');
  } catch (err) {
    triggerToast('Failed to upload document.', 'error');
  }
};

const submitCertificate = async () => {
  if (!certForm.name) {
    triggerToast('Certificate name is required.', 'error');
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditingCert.value && certForm.id) {
      await profileStore.updateCertificate(currentEmployeeId.value, certForm.id, { ...certForm });
      triggerToast('Certificate updated successfully!', 'success');
    } else {
      await profileStore.createCertificate(currentEmployeeId.value, { ...certForm });
      triggerToast('Certificate added successfully!', 'success');
    }
    certModal.show = false;
  } catch (err) {
    triggerToast('Failed to save certificate.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteCert = async (id) => {
  try {
    await profileStore.deleteCertificate(currentEmployeeId.value, id);
    triggerToast('Certificate deleted.', 'success');
  } catch (err) {
    triggerToast('Failed to delete certificate.', 'error');
  }
};

// --- WORK EXPERIENCE HANDLERS ---
const openAddExpModal = () => {
  if (!currentEmployeeId.value) {
    triggerToast('Your account is not linked to an Employee record.', 'error');
    return;
  }
  isEditingExp.value = false;
  expForm.id = null; expForm.companyName = ''; expForm.position = ''; expForm.startDate = ''; expForm.endDate = ''; expForm.description = '';
  expModal.show = true;
};

const openEditExpModal = (exp) => {
  isEditingExp.value = true;
  expForm.id = exp.id;
  expForm.companyName = exp.companyName;
  expForm.position = exp.position;
  expForm.startDate = exp.startDate;
  expForm.endDate = exp.endDate;
  expForm.description = exp.description;
  expModal.show = true;
};

const submitExperience = async () => {
  if (!expForm.companyName || !expForm.position || !expForm.startDate) {
    triggerToast('Please fill all required fields.', 'error');
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditingExp.value && expForm.id) {
      await profileStore.updateExperience(currentEmployeeId.value, expForm.id, { ...expForm });
      triggerToast('Work experience updated!', 'success');
    } else {
      await profileStore.createExperience(currentEmployeeId.value, { ...expForm });
      triggerToast('Work experience entry added!', 'success');
    }
    expModal.show = false;
  } catch (err) {
    triggerToast('Failed to save experience.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteExp = async (id) => {
  try {
    await profileStore.deleteExperience(currentEmployeeId.value, id);
    triggerToast('Experience deleted.', 'success');
  } catch (err) {
    triggerToast('Failed to delete experience.', 'error');
  }
};

// --- PASSWORD HANDLER ---
const openPasswordModal = () => {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordModal.show = true;
};

const handleSavePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    triggerToast('Please enter both old and new password.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const userId = authStore.user?.id;
    await userStore.changePassword(userId, { ...passwordForm });
    triggerToast('Password changed successfully!', 'success');
    passwordModal.show = false;
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to change password.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadProfileData();
});
</script>