document.addEventListener("DOMContentLoaded", function () {
    const viewToggle = document.getElementById("viewToggle");
    const statusFilter = document.getElementById("statusFilter");
    const searchInput = document.getElementById("searchInput");
    const addTaskForm = document.getElementById("addTaskForm");
    const taskTable = document.getElementById("taskTable");
    const taskChartCanvas = document.getElementById("taskChart");
    const completedCountElement = document.getElementById("completedCount");
    const incompleteCountElement = document.getElementById("incompleteCount");
    const completionPercentageElement = document.getElementById("completionPercentage");
    let tasks = []; // Menyimpan data tugas
    let comments = {}; // Menyimpan komentar untuk setiap tugas

    // Mengatur mode gelap otomatis berdasarkan waktu
    function setAutoDarkMode() {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }

    // Fetch API untuk Data Tugas
    async function fetchTasks() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
            tasks = await response.json();
            populateTable(tasks);
            renderTaskChart(tasks);
            updateStatistics(tasks);
            checkDueDates(); // Periksa tenggat waktu setelah mengambil tugas
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    function populateTable(tasksToDisplay) {
        const tableBody = document.querySelector("#taskTable tbody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        tasksToDisplay.forEach(task => {
            const status = task.completed ? "Selesai" : "Belum Selesai";
            const row = `<tr class="border-b">
                            <td class="p-3">${task.id}</td>
                            <td class="p-3">${task.title}</td>
                            <td class="p-3">${task.category || 'N/A'}</td>
                            <td class="p-3">${status}</td>
                            <td class="p-3">
                                <button onclick="editTask(${task.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                                <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                                <button onclick="toggleTaskStatus(${task.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">${task.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai'}</button>
                            </td>
                        </tr>`;
            tableBody.innerHTML += row;

            // Tampilkan komentar untuk tugas ini
            displayComments(task.id);
        });
    }

    function displayComments(taskId) {
        const commentsContainer = document.getElementById("commentsSection");
        const taskComments = comments[taskId] || [];
        let commentsHtml = `<h3 class="font-bold">Komentar untuk Tugas ${taskId}</h3>`;
        commentsHtml += `<div class="mb-2"><input type="text" id="commentInput${taskId}" placeholder="Tambahkan komentar..." class="border p-2 rounded" />
                         <button onclick="addComment(${taskId})" class="bg-blue-500 text-white px-2 py-1 rounded">Kirim</button></div>`;
        taskComments.forEach(comment => {
            commentsHtml += `<p>${comment}</p>`;
        });
        commentsContainer.innerHTML += `<div class="mt-5">${commentsHtml}</div>`;
    }

    window.addComment = function (taskId) {
        const commentInput = document.getElementById(`commentInput${taskId}`);
        const comment = commentInput.value;
        if (comment) {
            if (!comments[taskId]) {
                comments[taskId] = [];
            }
            comments[taskId].push(comment);
            commentInput.value = ""; // Reset input
            displayComments(taskId); // Tampilkan komentar terbaru
        }
    };

    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        populateTable(tasks);
        renderTaskChart(tasks);
        updateStatistics(tasks);
        Swal.fire('Tugas berhasil dihapus!'); // Notifikasi dengan SweetAlert2
    };

    window.editTask = function (id) {
        const taskToEdit = tasks.find(task => task.id === id);
        if (taskToEdit) {
            Swal.fire({
                title: 'Edit Judul Tugas',
                input: 'text',
                inputValue: taskToEdit.title,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',
                preConfirm: (newTitle) => {
                    if (!newTitle) {
                        Swal.showValidationMessage('Judul tidak boleh kosong!');
                    }
                    return newTitle;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    taskToEdit.title = result.value;
                    populateTable(tasks);
                    renderTaskChart(tasks);
                    updateStatistics(tasks);
                    Swal.fire('Tugas berhasil diperbarui!'); // Notifikasi
                }
            });
        }
    };

    window.toggleTaskStatus = function (id) {
        const taskToToggle = tasks.find(task => task.id === id);        
        if (taskToToggle) {
            taskToToggle.completed = !taskToToggle.completed;
            populateTable(tasks);
            renderTaskChart(tasks);
            updateStatistics(tasks);
            if (taskToToggle.completed) {
                Swal.fire('Tugas berhasil diselesaikan!'); // Notifikasi
            } else {
                Swal.fire('Tugas berhasil dibatalkan!'); // Notifikasi
            }
        }
    };

    function renderTaskChart(tasks) {
        const completedCount = tasks.filter(task => task.completed).length;
        const incompleteCount = tasks.filter(task => !task.completed).length;        
        const completionPercentage = (completedCount / tasks.length) * 100;
        const taskChart = new Chart(taskChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Selesai', 'Belum Selesai'],    
                datasets: [{
                    data: [completedCount, incompleteCount],
                    backgroundColor: ['green', 'red'],
                    borderColor: ['green', 'red'],
                    borderWidth: 1
                }]
            },        
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Persentase Tugas',
                    }
                }
            }
        });        
        completedCountElement.textContent = completedCount;
        incompleteCountElement.textContent = incompleteCount;
        completionPercentageElement.textContent = completionPercentage.toFixed(2) + '%';
    }

    function updateStatistics(tasks) {
        const completedCount = tasks.filter(task => task.completed).length;
        const incompleteCount = tasks.filter(task => !task.completed).length;
        const completionPercentage = (completedCount / tasks.length) * 100;
        completedCountElement.textContent = completedCount;
        incompleteCountElement.textContent = incompleteCount;
        completionPercentageElement.textContent = completionPercentage.toFixed(2) + '%';
    }
        }    
)

    function checkDueDates() {
        const today = new Date().toISOString().split('T')[0];
        tasks.forEach(task => {
            if (task.dueDate && task.dueDate < today) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Peringatan!',
                    text: `Tugas ${task.title} telah melewati tenggat waktu. Tenggat waktu: ${task.dueDate}`,
                    showConfirmButton: true,
                });
            }
        })};

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    window.addEventListener('load', () => {
        fetchTasks();
        checkDueDates();
        setAutoDarkMode();
    });