// Selecting DOM elements
var newMemberAddBtn = document.querySelector('.addMemberBtn'),
    darkBg = document.querySelector('.dark_bg'),
    popupForm = document.querySelector('.popup'),
    crossBtn = document.querySelector('.closeBtn'),
    submitBtn = document.querySelector('.submitBtn'),
    modalTitle = document.querySelector('.modalTitle'),
    popupFooter = document.querySelector('.popupFooter'),
    imgInput = document.querySelector('.img'),
    imgHolder = document.querySelector('.imgholder'),
    form = document.querySelector('form'),
    formInputFields = document.querySelectorAll('form input'),
    uploadimg = document.querySelector("#uploadimg"),
    fName = document.getElementById("fName"),
    lName = document.getElementById("lName"),
    age = document.getElementById("age"),
    city = document.getElementById("city"),
    position = document.getElementById("position"),
    salary = document.getElementById("salary"),
    sDate = document.getElementById("sDate"),
    email = document.getElementById("email"),
    phone = document.getElementById("phone"),
    entries = document.querySelector(".showEntries"),
    tabSize = document.getElementById("table_size"),
    userInfo = document.querySelector(".userInfo"),
    table = document.querySelector("table"),
    filterData = document.getElementById("search"),
    deleteAllBtn = document.getElementById('deleteAllBtn'); // New button added

// Initialize variables
let originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : [];
let getData = [...originalData];

let isEdit = false, editId;
let arrayLength = 0;
let tableSize = 10;
let startIndex = 1;
let endIndex = 0;
let currentIndex = 1;
let maxIndex = 0;

// Show initial data
showInfo();
displayIndexBtn();

// Event listener for adding a new member
newMemberAddBtn.addEventListener('click', () => {
    isEdit = false;
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";
    popupFooter.style.display = "block";
    imgInput.src = "./img/pic1.png";
    darkBg.classList.add('active');
    popupForm.classList.add('active');
});

// Event listener for closing the popup form
crossBtn.addEventListener('click', () => {
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();
});

// Event listener for uploading an image
uploadimg.onchange = function () {
    if (uploadimg.files[0].size < 5000000) { // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            var imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };

        fileReader.readAsDataURL(uploadimg.files[0]);
    } else {
        alert("This file is too large!");
    }
};

// Perform pre-load calculations for pagination
function preLoadCalculations() {
    arrayLength = getData.length;
    maxIndex = Math.ceil(arrayLength / tableSize);

    if ((arrayLength % tableSize) > 0) {
        maxIndex++;
    }
}

// Display pagination buttons
function displayIndexBtn() {
    preLoadCalculations();

    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>';

    for (let i = 1; i <= maxIndex; i++) {
        pagination.innerHTML += `<button onclick="paginationBtn(${i})" index="${i}">${i}</button>`;
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';

    highlightIndexBtn();
}

// Highlight active pagination button
function highlightIndexBtn() {
    startIndex = ((currentIndex - 1) * tableSize) + 1;
    endIndex = Math.min(startIndex + tableSize - 1, arrayLength);

    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;

    const paginationBtns = document.querySelectorAll('.pagination button');
    paginationBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('index') == currentIndex) {
            btn.classList.add('active');
        }
    });

    showInfo();
}

// Display table data
function showInfo() {
    userInfo.innerHTML = '';

    for (let i = startIndex - 1; i < endIndex; i++) {
        const staff = getData[i];

        if (staff) {
            const createElement = `<tr class="employeeDetails">
                <td>${i + 1}</td>
                <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                <td>${staff.fName} ${staff.lName}</td>
                <td>${staff.ageVal}</td>
                <td>${staff.cityVal}</td>
                <td>${staff.positionVal}</td>
                <td>${staff.salaryVal}</td>
                <td>${staff.sDateVal}</td>
                <td>${staff.emailVal}</td>
                <td>${staff.phoneVal}</td>
                <td>
                    <button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-eye"></i></button>
                    <button onclick="editInfo(${i}, '${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button onclick="deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`;

            userInfo.innerHTML += createElement;
        }
    }
}

// Read details of an employee
function readInfo(pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone) {
    imgInput.src = pic;
    fName.value = fname;
    lName.value = lname;
    age.value = Age;
    city.value = City;
    position.value = Position;
    salary.value = Salary;
    sDate.value = SDate;
    email.value = Email;
    phone.value = Phone;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "none";
    modalTitle.innerHTML = "Profile";

    formInputFields.forEach(input => {
        input.disabled = true;
    });

    imgHolder.style.pointerEvents = "none";
}

// Edit details of an employee
function editInfo(id, pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone) {
    isEdit = true;
    editId = id;

    imgInput.src = pic;
    fName.value = fname;
    lName.value = lname;
    age.value = Age;
    city.value = City;
    position.value = Position;
    salary.value = Salary;
    sDate.value = SDate;
    email.value = Email;
    phone.value = Phone;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "block";
    modalTitle.innerHTML = "Update the Form";
    submitBtn.innerHTML = "Update";

    formInputFields.forEach(input => {
        input.disabled = false;
    });

    imgHolder.style.pointerEvents = "auto";
}

// Delete an employee
function deleteInfo(index) {
    if (confirm("Are you sure you want to delete?")) {
        originalData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(originalData));

        getData = [...originalData];

        preLoadCalculations();

        if (getData.length === 0) {
            currentIndex = 1;
            startIndex = 1;
            endIndex = 0;
        } else if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        displayIndexBtn();

        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');

        if (Math.floor(maxIndex) > currentIndex) {
            nextBtn.classList.add("act");
        } else {
            nextBtn.classList.remove("act");
        }

        if (currentIndex > 1) {
            prevBtn.classList.add('act');
        }
    }
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        id: Date.now(),
        picture: imgInput.src || "./img/pic1.png",
        fName: fName.value,
        lName: lName.value,
        ageVal: age.value,
        cityVal: city.value,
        positionVal: position.value,
        salaryVal: salary.value,
        sDateVal: sDate.value,
        emailVal: email.value,
        phoneVal: phone.value
    };

    if (!isEdit) {
        originalData.unshift(information);
    } else {
        originalData[editId] = information;
    }

    getData = [...originalData];
    localStorage.setItem('userProfile', JSON.stringify(originalData));

    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";

    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    displayIndexBtn();
});

// Pagination navigation functions
function next() {
    const nextBtn = document.querySelector('.next');

    if (currentIndex < maxIndex) {
        currentIndex++;
        highlightIndexBtn();
    }

    if (currentIndex >= maxIndex) {
        nextBtn.classList.remove("act");
    }
}

function prev() {
    const prevBtn = document.querySelector('.prev');

    if (currentIndex > 1) {
        currentIndex--;
        highlightIndexBtn();
    }

    if (currentIndex <= 1) {
        prevBtn.classList.remove("act");
    }
}

function paginationBtn(i) {
    currentIndex = i;
    highlightIndexBtn();
}

// Table size change event listener
tabSize.addEventListener('change', () => {
    tableSize = parseInt(tabSize.value);
    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});

// Search/filter functionality
filterData.addEventListener("input", () => {
    const searchTerm = filterData.value.toLowerCase().trim();

    if (searchTerm !== "") {
        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.lName).toLowerCase();
            const city = item.cityVal.toLowerCase();
            const position = item.positionVal.toLowerCase();

            return (
                fullName.includes(searchTerm) ||
                city.includes(searchTerm) ||
                position.includes(searchTerm)
            );
        });

        getData = filteredData;
    } else {
        getData = [...originalData];
    }

    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});

// Event listener for deleting all entries
deleteAllBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all entries?")) {
        originalData = [];
        getData = [...originalData];
        localStorage.setItem("userProfile", JSON.stringify(originalData));
        currentIndex = 1;
        startIndex = 1;
        endIndex = 0;
        displayIndexBtn();
    }
});
