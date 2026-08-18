import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import AttendancePage from "../views/AttendancePage.vue";
import BranchPage from "../views/BranchPage.vue";
import DepartmentPage from "../views/DepartmentPage.vue";
import PositionPage from "../views/PositionPage.vue";
import EmployeePage from "../views/EmployeePage.vue";
import RolePage from "../views/RolePage.vue";
import PermissionPage from "../views/PermissionPage.vue";
import ForgotPasswordPage from "../views/ForgotPasswordPage.vue";
import EmployeeFormPage from "../views/EmployeeFormPage.vue";
import ResetPasswordPage from "../views/ResetPasswordPage.vue";
import VerifyCompanyPage from "../views/VerifyCompanyPage.vue";
import SetPasswordPage from "../views/SetPasswordPage.vue";
import InvitePage from "../views/InvitePage.vue";
import GoogleCallbackPage from "../views/GoogleCallbackPage.vue";
import { useAuthStore } from "../store/authStore.js";
import ProjectPage from "../views/ProjectPage.vue";
import BoardColumnPage from "../views/BoardColumnPage.vue";
import LeaveType from "../views/LeaveType.vue";
import ProjectDetailPage from "../views/ProjectDetailPage.vue";
import PayrollPage from "../views/PayrollPage.vue";
import PayslipPage from "../views/PayslipPage.vue";
import PayrollAdminPage from "../views/PayrollAdminPage.vue";
import AccountPage from "../views/AccountPage.vue";
import ContractPage from "../views/ContractPage.vue";
import ContractFormPage from "../views/ContractFormPage.vue";
import ContractDetailPage from "../views/ContractDetailPage.vue";
import WorkShiftPage from "../views/WorkShiftPage.vue";

const routes = [
    {
        path: '/',
        component: HomePage,
        name: 'Home'
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/register',
        component: RegisterPage
    },
    {
        path: '/verify-company',
        component: VerifyCompanyPage,
        name: 'VerifyCompany'
    },
    {
        path: '/dashboard',
        component: DashboardPage,
        name: 'Dashboard',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/attendance',
        component: AttendancePage,
        name: 'Attendance',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/branches',
        component: BranchPage,
        name: 'Branches',
        meta: {
            requiresAuth: true,
            permission: 'BRANCH'
        }
    },
    {
        path: '/departments',
        component: DepartmentPage,
        name: 'Departments',
        meta: {
            requiresAuth: true,
            permission: 'DEPARTMENT'
        }
    },
    {
        path: '/positions',
        component: PositionPage,
        name: 'Positions',
        meta: {
            requiresAuth: true,
            permission: 'POSITION'
        }
    },
    {
        path: '/employees',
        component: EmployeePage,
        name: 'Employees',
        meta: {
            requiresAuth: true,
            permission: 'EMPLOYEE'
        }
    },
    {
        path: '/roles',
        component: RolePage,
        name: 'Roles',
        meta: {
            requiresAuth: true,
            permission: 'ROLE'
        }
    },
    {
        path: '/permissions',
        component: PermissionPage,
        name: 'Permissions',
        meta: {
            requiresAuth: true,
            isSystemAdmin: true
        }
    },
    {
        path: '/forgot-password',
        component: ForgotPasswordPage,
        name: 'ForgotPassword'
    },
    {
        path: '/employee/form',
        component: EmployeeFormPage,
        name: 'EmployeeForm',
        meta: {
            requiresAuth: true,
            permission: 'EMPLOYEE'
        }
    }
    ,
    {
        path: '/reset-password',
        component: ResetPasswordPage,
        name: 'ResetPassword'
    },
    {
        path: '/set-password',
        component: SetPasswordPage,
        name: 'SetPassword'
    },
    {
        path: '/invite',
        component: InvitePage,
        name: 'Invite'
    },
    {
        path: '/auth/google/callback',
        component: GoogleCallbackPage,
        name: 'GoogleCallback'
    },
    {
        path: '/project',
        component: ProjectPage,
        name: 'Project',
        meta: {
            requiresAuth: true,
            permission: 'PROJECT'
        }
    },
    {
        path: '/project/:id',
        component: ProjectDetailPage,
        name: 'ProjectDetail',
        meta: {
            requiresAuth: true,
            permission: 'PROJECT'
        }
    },
    {
        path: '/leave-types',
        component: LeaveType,
        name: 'LeaveTypes',
        meta: {
            requiresAuth: true,
            permission: 'LEAVE'
        }
    },
    {
        path: '/pay-roll',
        component: PayrollPage,
        name: 'Payroll',
        meta: {
            requiresAuth: true,
            permission: 'PAYSLIP'
        }
    },
    {
        path: '/payslip',
        component: PayslipPage,
        name: 'Payslip',
        meta: {
            requiresAuth: true,
            permission: 'PAYSLIP'
        }
    },
    {
        path: '/payroll-admin',
        component: PayrollAdminPage,
        name: 'PayrollAdmin',
        meta: {
            requiresAuth: true,
            permission: 'PAYROLL'
        }
    },
    {
        path: '/account',
        component: AccountPage,
        name: 'AccountManager',
        meta: {
            requiresAuth: true,
            permission: 'USER'
        }
    }
    ,
    {
        path: '/work-shifts',
        component: WorkShiftPage,
        name: 'WorkShifts',
        meta: {
            requiresAuth: true,
            permission: 'WORK_SHIFT'
        }
    },
    {
        path: '/contracts',
        component: ContractPage,
        name: 'Contracts',
        meta: {
            requiresAuth: true,
            permission: 'CONTRACT'
        }
    },
    {
        path: '/contracts/create',
        component: ContractFormPage,
        name: 'ContractCreate',
        meta: {
            requiresAuth: true,
            permission: 'CONTRACT'
        }
    },
    {
        path: '/contracts/:id',
        component: ContractDetailPage,
        name: 'ContractDetail',
        meta: {
            requiresAuth: true,
            permission: 'CONTRACT'
        }
    },
    {
        path: '/profile',
        component: () => import('../views/ProfilePage.vue'),
        name: 'Profile',
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFoundPage.vue'),
        name: 'NotFound'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (authStore.isAuthenticated && authStore.permissions.length === 0) {
        try {
            await authStore.fetchMe()
        } catch (e) {
            await authStore.logout()
            return next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }

    if (to.meta.requiresAuth) {
        if (to.meta.isSystemAdmin && !authStore.isSystemAdmin) {
            return next({ name: 'NotFound' })
        }

        if (to.meta.permission && !authStore.isSystemAdmin && !authStore.canView(to.meta.permission)) {
            return next({ name: 'NotFound' })
        }
    }

    next()
})

export default router;