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
import { useAuthStore } from "../store/authStore.js";
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
            requiresAuth: true
        }
    },
    {
        path: '/departments',
        component: DepartmentPage,
        name: 'Departments',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/positions',
        component: PositionPage,
        name: 'Positions',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/employees',
        component: EmployeePage,
        name: 'Employees',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/roles',
        component: RolePage,
        name: 'Roles',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/permissions',
        component: PermissionPage,
        name: 'Permissions',
        meta: {
            requiresAuth: true
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
            requiresAuth: true
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
    next()
})

export default router;