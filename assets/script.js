document.addEventListener("DOMContentLoaded", function () {
    const darkModeButton = document.getElementById("toggleDarkMode");
    const body = document.body;
    let isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);

    darkModeButton.addEventListener("click", function () {
        isDarkMode = !isDarkMode;
        localStorage.setItem("darkMode", isDarkMode);
        setDarkMode(isDarkMode);
    });

    function setDarkMode(enable) {
        if (enable) {
            body.classList.add("dark");
            darkModeButton.textContent = "☀ Mode Light";
        } else {
            body.classList.remove("dark");
            darkModeButton.textContent = "🌙 Mode Dark";
        }
    }

    // Dummy Data Pengguna
    let users = [
        { id: 1, nama: "Budi Santoso", email: "budi@email.com" },
        { id: 2, nama: "Siti Aminah", email: "siti@email.com" },
        { id: 3, nama: "Joko Widodo", email: "joko@email.com" }
    ];
    let currentPage = 1;
    const itemsPerPage = 2;

    function renderUsers() {
        const userTable = document.getElementById("userTable");
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
    };

    renderUsers();

    // Grafik Statistik
    const ctx = document.getElementById("userChart").getContext("2d");
    new Chart(ctx, {
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

    // Pilihan Tampilan
    document.getElementById("viewToggle").addEventListener("change", function () {
        if (this.value === "chart") {
            document.getElementById("chartContainer").classList.remove("hidden");
            document.getElementById("tableContainer").classList.add("hidden");
        } else {
            document.getElementById("chartContainer").classList.add("hidden");
            document.getElementById("tableContainer").classList.remove("hidden");
        }
    });
});
