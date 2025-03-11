document.addEventListener("DOMContentLoaded", function () {
    const darkModeButton = document.getElementById("toggleDarkMode");
    const viewToggle = document.getElementById("viewToggle");
    const tableSection = document.getElementById("tableSection");
    const chartSection = document.getElementById("chartSection");
    const userTable = document.getElementById("userTable");
    const userChartCanvas = document.getElementById("userChart");
    let isDarkMode = localStorage.getItem("darkMode") === "true";

    setDarkMode(isDarkMode);

    if (darkModeButton) {
        darkModeButton.addEventListener("click", function () {
            isDarkMode = !isDarkMode;
            localStorage.setItem("darkMode", isDarkMode);
            setDarkMode(isDarkMode);
        });
    }

    function setDarkMode(enable) {
        document.body.classList.toggle("dark", enable);
        if (darkModeButton) {
            darkModeButton.textContent = enable ? "☀ Mode Light" : "🌙 Mode Dark";
        }
    }

    // Data Dummy Pengguna
    let users = [
        { id: 1, nama: "Budi Santoso", email: "budi@email.com" },
        { id: 2, nama: "Siti Aminah", email: "siti@email.com" },
        { id: 3, nama: "Joko Widodo", email: "joko@email.com" }
    ];
    
    let currentPage = 1;
    const itemsPerPage = 2;

    function renderUsers() {
        if (!userTable) return;

        userTable.innerHTML = "";
        let start = (currentPage - 1) * itemsPerPage;
        let paginatedUsers = users.slice(start, start + itemsPerPage);

        paginatedUsers.forEach(user => {
            let row = `<tr>
                <td class="p-3">${user.id}</td>
                <td class="p-3">${user.nama}</td>
                <td class="p-3">${user.email}</td>
                <td class="p-3">
                    <button onclick="deleteUser(${user.id})" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                </td>
            </tr>`;
            userTable.innerHTML += row;
        });

        document.getElementById("pageInfo").textContent = `Halaman ${currentPage}`;
    }

    window.deleteUser = function (id) {
        users = users.filter(u => u.id !== id);
        renderUsers();
        renderChart();
    };

    renderUsers();

    function renderChart() {
        if (!userChartCanvas) return;

        const ctx = userChartCanvas.getContext("2d");
        if (window.userChart) {
            window.userChart.destroy();
        }

        window.userChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: users.map(u => u.nama),
                datasets: [{
                    label: "Jumlah Pengguna",
                    data: users.map(() => Math.floor(Math.random() * 10) + 1),
                    backgroundColor: "#FFA725"
                }]
            }
        });
    }

    renderChart();

    if (viewToggle) {
        viewToggle.addEventListener("change", function () {
            tableSection.classList.toggle("hidden", this.value === "chart");
            chartSection.classList.toggle("hidden", this.value !== "chart");
        });
    }

    // Fetch API untuk Data Dummy
    async function fetchTasks() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
            const data = await response.json();
            populateTable(data);
            renderTaskChart(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    function populateTable(tasks) {
        const tableBody = document.querySelector("#taskTable tbody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        tasks.forEach(task => {
            const row = `<tr class="border-b">
                            <td class="p-3">${task.id}</td>
                            <td class="p-3">${task.title}</td>
                            <td class="p-3">
                                <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                            </td>
                        </tr>`;
            tableBody.innerHTML += row;
        });
    }

    window.deleteTask = function (id) {
        const tableBody = document.querySelector("#taskTable tbody");
        if (!tableBody) return;

        let rows = Array.from(tableBody.children);
        let rowToRemove = rows.find(row => row.children[0].textContent == id);
        if (rowToRemove) {
            rowToRemove.remove();
        }
    };

    function renderTaskChart(tasks) {
        const ctx = document.getElementById("taskChart");
        if (!ctx) return;

        if (window.taskChart) {
            window.taskChart.destroy();
        }

        window.taskChart = new Chart(ctx.getContext("2d"), {
            type: "bar",
            data: {
                labels: tasks.map(task => `Tugas ${task.id}`),
                datasets: [{
                    label: "Progress",
                    data: tasks.map(task => task.completed ? 100 : 50),
                    backgroundColor: "#FFA725",
                }]
            }
        });
    }

    fetchTasks();
});
