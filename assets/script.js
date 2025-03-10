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
                    <button onclick="editUser(${user.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                </td>
            </tr>`;
            userTable.innerHTML += row;
        });

        document.getElementById("pageInfo").textContent = `Halaman ${currentPage}`;
    }

    window.editUser = function (id) {
        let user = users.find(u => u.id === id);
        let newName = prompt("Edit Nama:", user.nama);
        if (newName) {
            user.nama = newName;
            renderUsers();
        }
    };

    window.deleteUser = function (id) {
        users = users.filter(u => u.id !== id);
        renderUsers();
    };

    document.getElementById("addUser").addEventListener("click", function () {
        let newName = prompt("Nama pengguna baru:");
        let newEmail = prompt("Email pengguna:");
        if (newName && newEmail) {
            users.push({ id: users.length + 1, nama: newName, email: newEmail });
            renderUsers();
        }
    });

    document.getElementById("searchUser").addEventListener("keyup", function (e) {
        let keyword = e.target.value.toLowerCase();
        users = users.filter(user => user.nama.toLowerCase().includes(keyword));
        renderUsers();
    });

    document.getElementById("prevPage").addEventListener("click", function () {
        if (currentPage > 1) currentPage--;
        renderUsers();
    });

    document.getElementById("nextPage").addEventListener("click", function () {
        if (currentPage < Math.ceil(users.length / itemsPerPage)) currentPage++;
        renderUsers();
    });

    renderUsers();
});
