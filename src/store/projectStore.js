import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

// Pre-seeded projects data for localStorage fallback
const DEFAULT_PROJECTS = [
    {
        id: "proj-1",
        name: "Humify Core System",
        key: "HUM",
        description: "Hệ thống cốt lõi quản lý nhân sự, chấm công và công việc tích hợp.",
        leadId: 1,
        leadName: "Nguyễn Văn A",
        status: "Active",
        createdAt: "2026-06-01T08:00:00.000Z",
        columns: [
            { id: "todo", name: "Cần Làm", color: "border-t-4 border-t-slate-400" },
            { id: "inprogress", name: "Đang Làm", color: "border-t-4 border-t-blue-500" },
            { id: "inreview", name: "Đang Đánh Giá", color: "border-t-4 border-t-amber-500" },
            { id: "done", name: "Hoàn Thành", color: "border-t-4 border-t-green-500" }
        ],
        tasks: [
            {
                id: "task-101",
                projectId: "proj-1",
                title: "Thiết kế giao diện Kanban Board",
                key: "HUM-101",
                description: "Vẽ và viết code giao diện bảng kéo thả dạng Jira cho dự án Humify, sử dụng Tailwind CSS và các micro-animations mượt mà, trực quan.",
                status: "todo",
                priority: "high", // high, medium, low
                assigneeId: 2,
                assigneeName: "Trần Thị B",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=B",
                dueDate: "2026-07-10",
                comments: [
                    { id: "c1", author: "Nguyễn Văn A", content: "Hãy đảm bảo giao diện responsive tốt trên mobile.", time: "1 ngày trước" },
                    { id: "c2", author: "Trần Thị B", content: "Tôi sẽ dùng native drag-and-drop để hiệu năng mượt nhất.", time: "12 giờ trước" }
                ],
                subtasks: [
                    { id: "sub-1", title: "Phác thảo layout các cột", done: true },
                    { id: "sub-2", title: "Xử lý kéo thả HTML5", done: false },
                    { id: "sub-3", title: "Tạo modal xem chi tiết task", done: false }
                ]
            },
            {
                id: "task-102",
                projectId: "proj-1",
                title: "Tích hợp API Đăng nhập Google OAuth",
                key: "HUM-102",
                description: "Tạo link callback, xử lý login code gửi lên server để nhận JWT token, tự động lưu thông tin user vào store.",
                status: "inprogress",
                priority: "high",
                assigneeId: 3,
                assigneeName: "Lê Văn C",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=C",
                dueDate: "2026-07-05",
                comments: [],
                subtasks: []
            },
            {
                id: "task-103",
                projectId: "proj-1",
                title: "Viết Unit Test cho Employee Service",
                key: "HUM-103",
                description: "Viết test coverage tối thiểu 80% cho các api liên quan đến nhân sự, lương và chấm công.",
                status: "done",
                priority: "low",
                assigneeId: 1,
                assigneeName: "Nguyễn Văn A",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=A",
                dueDate: "2026-06-25",
                comments: [],
                subtasks: []
            },
            {
                id: "task-104",
                projectId: "proj-1",
                title: "Sửa lỗi đúp hồ sơ nhân sự khi Import Excel",
                key: "HUM-104",
                description: "Kiểm tra cơ chế check trùng email và mã số nhân viên khi đọc file excel tải lên hệ thống.",
                status: "inreview",
                priority: "medium",
                assigneeId: 4,
                assigneeName: "Phạm Minh D",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=D",
                dueDate: "2026-06-30",
                comments: [],
                subtasks: []
            }
        ]
    },
    {
        id: "proj-2",
        name: "Marketing Campaign Q3",
        key: "MKT",
        description: "Chiến dịch quảng bá thương hiệu Humify, mở rộng tệp khách hàng doanh nghiệp vừa và nhỏ.",
        leadId: 2,
        leadName: "Trần Thị B",
        status: "Active",
        createdAt: "2026-06-15T09:30:00.000Z",
        columns: [
            { id: "todo", name: "Cần Làm", color: "border-t-4 border-t-slate-400" },
            { id: "inprogress", name: "Đang Làm", color: "border-t-4 border-t-blue-500" },
            { id: "done", name: "Hoàn Thành", color: "border-t-4 border-t-green-500" }
        ],
        tasks: [
            {
                id: "task-201",
                projectId: "proj-2",
                title: "Lập kế hoạch nội dung Fanpage Social Media",
                key: "MKT-201",
                description: "Lên lịch post bài, viết content giới thiệu tính năng chấm công định vị GPS và quản lý ca làm linh hoạt.",
                status: "inprogress",
                priority: "medium",
                assigneeId: 2,
                assigneeName: "Trần Thị B",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=B",
                dueDate: "2026-07-01",
                comments: [],
                subtasks: []
            },
            {
                id: "task-202",
                projectId: "proj-2",
                title: "Tạo video animation giới thiệu sản phẩm",
                key: "MKT-202",
                description: "Sản xuất video độ dài 1m30s giải thích các vấn đề quản lý nhân sự thủ công gặp phải và cách Humify giải quyết.",
                status: "todo",
                priority: "high",
                assigneeId: 5,
                assigneeName: "Hoàng Văn E",
                assigneeAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=E",
                dueDate: "2026-07-20",
                comments: [],
                subtasks: []
            }
        ]
    }
];

export const useProjectStore = defineStore("project", () => {
    const projects = ref([]);
    const currentProject = ref(null);

    // Initial load helper
    const loadFromLocalStorage = () => {
        const stored = localStorage.getItem("humify_projects");
        if (stored) {
            projects.value = JSON.parse(stored);
        } else {
            projects.value = DEFAULT_PROJECTS;
            localStorage.setItem("humify_projects", JSON.stringify(DEFAULT_PROJECTS));
        }
    };

    const saveToLocalStorage = () => {
        localStorage.setItem("humify_projects", JSON.stringify(projects.value));
    };

    const fetchProjects = async () => {
        try {
            // Attempt API call
            const res = await axiosInstance.get("/projects");
            if (res.data && res.data.data) {
                projects.value = res.data.data;
                return res.data.data;
            }
        } catch (error) {
            console.warn("Backend API not available. Using local storage fallback.", error);
        }
        
        loadFromLocalStorage();
        return projects.value;
    };

    const fetchProjectById = async (id) => {
        try {
            const res = await axiosInstance.get(`/projects/${id}`);
            if (res.data && res.data.data) {
                currentProject.value = res.data.data;
                return res.data.data;
            }
        } catch (error) {
            console.warn(`Backend API failed to get project ${id}. Fallback to local.`, error);
        }

        loadFromLocalStorage();
        const found = projects.value.find(p => p.id === id);
        currentProject.value = found || null;
        return currentProject.value;
    };

    const createProject = async (projectData) => {
        try {
            const res = await axiosInstance.post("/projects", projectData);
            if (res.data && res.data.data) {
                await fetchProjects();
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating project creation locally.", error);
        }

        loadFromLocalStorage();
        const newProj = {
            id: `proj-${Date.now()}`,
            name: projectData.name,
            key: projectData.key || projectData.name.substring(0, 3).toUpperCase(),
            description: projectData.description || "",
            leadId: projectData.leadId || null,
            leadName: projectData.leadName || "Chưa giao",
            status: "Active",
            createdAt: new Date().toISOString(),
            columns: [
                { id: "todo", name: "Cần Làm", color: "border-t-4 border-t-slate-400" },
                { id: "inprogress", name: "Đang Làm", color: "border-t-4 border-t-blue-500" },
                { id: "inreview", name: "Đang Đánh Giá", color: "border-t-4 border-t-amber-500" },
                { id: "done", name: "Hoàn Thành", color: "border-t-4 border-t-green-500" }
            ],
            tasks: []
        };
        projects.value.push(newProj);
        saveToLocalStorage();
        return { success: true, data: newProj };
    };

    const updateProject = async (id, projectData) => {
        try {
            const res = await axiosInstance.put(`/projects/${id}`, projectData);
            if (res.data && res.data.data) {
                await fetchProjects();
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating update locally.", error);
        }

        loadFromLocalStorage();
        const index = projects.value.findIndex(p => p.id === id);
        if (index !== -1) {
            projects.value[index] = {
                ...projects.value[index],
                ...projectData
            };
            saveToLocalStorage();
            if (currentProject.value && currentProject.value.id === id) {
                currentProject.value = projects.value[index];
            }
            return { success: true, data: projects.value[index] };
        }
        return { success: false, message: "Project not found" };
    };

    const deleteProject = async (id) => {
        try {
            const res = await axiosInstance.delete(`/projects/${id}`);
            if (res.data && res.data.success) {
                await fetchProjects();
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating delete locally.", error);
        }

        loadFromLocalStorage();
        projects.value = projects.value.filter(p => p.id !== id);
        saveToLocalStorage();
        if (currentProject.value && currentProject.value.id === id) {
            currentProject.value = null;
        }
        return { success: true };
    };

    // Task Management Methods
    const createTask = async (projectId, taskData) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/tasks`, taskData);
            if (res.data && res.data.data) {
                await fetchProjectById(projectId);
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating task creation locally.", error);
        }

        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            const nextTaskNum = project.tasks.length + 101;
            const newTask = {
                id: `task-${Date.now()}`,
                projectId,
                key: `${project.key}-${nextTaskNum}`,
                title: taskData.title,
                description: taskData.description || "",
                status: taskData.status || "todo",
                priority: taskData.priority || "medium",
                assigneeId: taskData.assigneeId || null,
                assigneeName: taskData.assigneeName || "Chưa giao",
                assigneeAvatar: taskData.assigneeAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${taskData.assigneeName || 'default'}`,
                dueDate: taskData.dueDate || null,
                comments: [],
                subtasks: taskData.subtasks || []
            };

            project.tasks.push(newTask);
            saveToLocalStorage();
            if (currentProject.value && currentProject.value.id === projectId) {
                currentProject.value = project;
            }
            return { success: true, data: newTask };
        }
        return { success: false, message: "Project not found" };
    };

    const updateTask = async (projectId, taskId, taskData) => {
        try {
            const res = await axiosInstance.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
            if (res.data && res.data.data) {
                await fetchProjectById(projectId);
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating task update locally.", error);
        }

        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            const tIndex = project.tasks.findIndex(t => t.id === taskId);
            if (tIndex !== -1) {
                project.tasks[tIndex] = {
                    ...project.tasks[tIndex],
                    ...taskData
                };
                saveToLocalStorage();
                if (currentProject.value && currentProject.value.id === projectId) {
                    currentProject.value = project;
                }
                return { success: true, data: project.tasks[tIndex] };
            }
        }
        return { success: false, message: "Task or project not found" };
    };

    const deleteTask = async (projectId, taskId) => {
        try {
            const res = await axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);
            if (res.data && res.data.success) {
                await fetchProjectById(projectId);
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating task deletion locally.", error);
        }

        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            project.tasks = project.tasks.filter(t => t.id !== taskId);
            saveToLocalStorage();
            if (currentProject.value && currentProject.value.id === projectId) {
                currentProject.value = project;
            }
            return { success: true };
        }
        return { success: false, message: "Project not found" };
    };

    const moveTask = async (projectId, taskId, newStatus) => {
        try {
            const res = await axiosInstance.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status: newStatus });
            if (res.data && res.data.success) {
                await fetchProjectById(projectId);
                return res.data;
            }
        } catch (error) {
            console.warn("Backend API fail. Simulating task move locally.", error);
        }

        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                saveToLocalStorage();
                if (currentProject.value && currentProject.value.id === projectId) {
                    currentProject.value = project;
                }
                return { success: true, data: task };
            }
        }
        return { success: false, message: "Task not found" };
    };

    const addColumn = async (projectId, columnData) => {
        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            const newCol = {
                id: columnData.id || `col-${Date.now()}`,
                name: columnData.name,
                color: columnData.color || "border-t-4 border-t-slate-400"
            };
            project.columns.push(newCol);
            saveToLocalStorage();
            if (currentProject.value && currentProject.value.id === projectId) {
                currentProject.value = project;
            }
            return { success: true, data: newCol };
        }
        return { success: false };
    };

    const deleteColumn = async (projectId, columnId) => {
        loadFromLocalStorage();
        const pIndex = projects.value.findIndex(p => p.id === projectId);
        if (pIndex !== -1) {
            const project = projects.value[pIndex];
            // Move tasks in deleted column to first column or delete them? Usually we move them to the first column.
            const targetCol = project.columns.find(c => c.id !== columnId);
            if (!targetCol) return { success: false, message: "Cannot delete the last remaining column." };

            project.tasks.forEach(t => {
                if (t.status === columnId) {
                    t.status = targetCol.id;
                }
            });

            project.columns = project.columns.filter(c => c.id !== columnId);
            saveToLocalStorage();
            if (currentProject.value && currentProject.value.id === projectId) {
                currentProject.value = project;
            }
            return { success: true };
        }
        return { success: false };
    };

    return {
        projects,
        currentProject,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        addColumn,
        deleteColumn
    };
});
