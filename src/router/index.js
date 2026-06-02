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
        path: '/dashboard',
        component: DashboardPage,
        name: 'Dashboard'
    },
    {
        path: '/attendance',
        component: AttendancePage,
        name: 'Attendance'
    },
    {
        path: '/branches',
        component: BranchPage,
        name: 'Branches'
    },
    {
        path: '/departments',
        component: DepartmentPage,
        name: 'Departments'
    },
    {
        path: '/positions',
        component: PositionPage,
        name: 'Positions'
    },
    {
        path: '/employees',
        component: EmployeePage,
        name: 'Employees'
    },
    {
        path: '/roles',
        component: RolePage,
        name: 'Roles'
    },
    {
        path: '/permissions',
        component: PermissionPage,
        name: 'Permissions'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;