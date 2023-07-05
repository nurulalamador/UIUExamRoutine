function checkConnection() {
    if (!(navigator.onLine)) {
        document.getElementById("welcomeMenu").classList.add("hidden");
        document.getElementById("mainMenu").classList.add("hidden");
        document.getElementById("noConnection").classList.remove("hidden");
    }
}
    
checkConnection();

document.getElementById("welcomeTitle").innerHTML = welcomeTitle;
document.getElementById("welcomeSemiTitle").innerHTML = welcomeSemiTitle;
document.getElementById("welcomeTitleAlt").innerHTML = welcomeTitle;
document.getElementById("welcomeSemiTitleAlt").innerHTML = welcomeSemiTitle;

schoolDepartments.forEach(function(el) {
    document.getElementById("schoolList").innerHTML += 
        `<div class="addDepartment" onclick="showMainMenu(${el.code})" data-animation="ripple">
            <div class="semiTitle">${el.school}</div>
            <div class="title">${el.dept}</div>
        </div>`;
})
        

var selectedCourse = [];
var mainRoutine = [];
var deptRoutine = [];
var courseList = [];
var sectionList = [];

var finalId;

function int4(x) {
    if(x<10) {
        return "000"+x;
    }
    else if(x<100) {
        return "00"+x;
    }
    else {
        return "0"+x;   
    }
} 

function showMainMenu(deptSchoolName) {
    document.getElementById("welcomeMenu").classList.add("hidden");
    document.getElementById("mainMenu").classList.remove("hidden");
    fetch(deptSchoolName)
    .then(res => res.blob())
    .then(blob => {
        readXlsxFile(blob).then(function(rows) {
            var a=0;
            rows.forEach((row) => {
                if(a!=0) {
                    var element = {};
                    element.dept = row[0];    
                    element.code = row[1].replace(/\//g, " / ");    
                    element.title = row[2].replace(/\//g, " / ");  
                    element.short = row[2].match(/\b([A-Z])/g).join('');    
                    element.section = row[3]; 
                    element.teacher = row[4]; 
                    element.date = row[5];   
                    element.time = row[6];    
                    element.room = row[7].replace(/                                                                                                                                                                                                                       /g, "<br/>");    
                    element.id = "exam"+int4(a);    
                    mainRoutine.push(element);
                }
                a++;
            });

            const filteredDept = {};  
            var deptList = mainRoutine.filter(obj => {
                if (!filteredDept[obj.dept]) {
                    filteredDept[obj.dept] = true;
                    return true;
                }
                return false;
            });

            var deptOptionList = document.getElementById("deptOptionList");

            deptList.forEach((course) => {
                deptOptionList.innerHTML += `<div class="option" onclick="deptChange('${course.dept}')">${course.dept}</div>`;
            });

            document.getElementById("addCourse").onclick = function() { 
                document.getElementById("dialogBox").classList.remove("hidden");
            }
        });
        
    });
}

function deptSelect() {
    var deptOptions = document.getElementById("deptOptions");
    if (deptOptions.classList.contains("hidden")) {
        deptOptions.classList.remove("hidden");
    }
    else {
        deptOptions.classList.add("hidden");
    }
    document.getElementById("courseOptions").classList.add("hidden");
    document.getElementById("sectionOptions").classList.add("hidden");
}

function deptChange(selectedDept) {
    document.getElementById("activeDept").innerHTML = selectedDept;
    deptRoutine = mainRoutine.filter(function (el) {
        return el.dept == selectedDept;
    });
    const filteredObject = {};  
    courseList = deptRoutine.filter(obj => {
        if (!filteredObject[obj.title]) {
            filteredObject[obj.title] = true;
            return true;
        }
        return false;
    });
    var courseOptionList = document.getElementById("courseOptionList");
    courseOptionList.innerHTML = "";
    courseList.forEach((course) => {
        courseOptionList.innerHTML += `<div class="option" onclick="changeCourse('${course.id}')">${course.title}<div class="semiTitle">${course.code}</div></div>`;
    });
    document.getElementById("searchInput").value = "";
    document.getElementById("disabledCourse").classList.add("hidden");
    document.getElementById("activeCourse").innerHTML = "Select Course";
    document.getElementById("disabledSection").classList.remove("hidden");
    document.getElementById("disabledButton").classList.remove("hidden");
    document.getElementById("activeSection").innerHTML = "Select Section";
}

function courseSelect() {
    var courseOptions = document.getElementById("courseOptions");
    if (courseOptions.classList.contains("hidden")) {
        courseOptions.classList.remove("hidden");
    }
    else {
        courseOptions.classList.add("hidden");
    }
    document.getElementById("deptOptions").classList.add("hidden");
    document.getElementById("sectionOptions").classList.add("hidden");
}

document.getElementById("searchBox").onclick = function(e) {
    e.stopPropagation();
}

document.getElementById("searchInput").oninput = function() {
    var inputValue = this.value;
    var searchCourseList = courseList.filter(function(el) {
        return el.title.toLowerCase().includes(inputValue.toLowerCase()) || el.code.toLowerCase().includes(inputValue.toLowerCase()) || el.short.toLowerCase().includes(inputValue.toLowerCase());
    });
    var courseOptionList = document.getElementById("courseOptionList");
    courseOptionList.innerHTML = "";
    searchCourseList.forEach((course) => {
        courseOptionList.innerHTML += `<div class="option" onclick="changeCourse('${course.id}')">${course.title}<div class="semiTitle">${course.code}</div></div>`;
    });
}

function changeCourse(courseId) {
    var currentCourse = mainRoutine.filter(function(el) {
        return el.id == courseId;
    });

    sectionList = deptRoutine.filter(function(el) {
        return el.title == currentCourse[0].title;
    });

    var sectionOptionList = document.getElementById("sectionOptionList");
    sectionOptionList.innerHTML = "";
    sectionList.forEach((course) => {
        sectionOptionList.innerHTML += `<div class="option" onclick="changeSection('${course.section}','${course.id}')">Section ${course.section}</div>`;
    });

    document.getElementById("activeCourse").innerHTML = currentCourse[0].title;
    document.getElementById("disabledSection").classList.add("hidden");
    document.getElementById("activeSection").innerHTML = "Select Section";
    document.getElementById("disabledButton").classList.remove("hidden");
}

function sectionSelect() {
    var sectionOptions = document.getElementById("sectionOptions");
    if (sectionOptions.classList.contains("hidden")) {
        sectionOptions.classList.remove("hidden");
    }
    else {
        sectionOptions.classList.add("hidden");
    }
    document.getElementById("deptOptions").classList.add("hidden");
    document.getElementById("courseOptions").classList.add("hidden");
}

function changeSection(section, id) {
    document.getElementById("activeSection").innerHTML = "Section "+section;
    finalId = id;
    document.getElementById("disabledButton").classList.add("hidden");
}

function addCourse() {
    selectedCourse.push(finalId);
    selectedCourse.sort();
    document.getElementById("dialogBox").classList.add("hidden");

    var courseOptionList = document.getElementById("courseOptionList");
    courseOptionList.innerHTML = "";
    courseList.forEach((course) => {
        courseOptionList.innerHTML += `<div class="option" onclick="changeCourse('${course.id}')">${course.title}<div class="semiTitle">${course.code}</div></div>`;
    });
    document.getElementById("searchInput").value = "";
    document.getElementById("disabledCourse").classList.add("hidden");
    document.getElementById("activeCourse").innerHTML = "Select Course";
    document.getElementById("disabledSection").classList.remove("hidden");
    document.getElementById("disabledButton").classList.remove("hidden");
    document.getElementById("activeSection").innerHTML = "Select Section";

    generateCourseList();
}

function generateCourseList() {
    document.getElementById("addedCourseList").innerHTML = "";
    document.getElementById("routineTableBody").innerHTML = "";
    document.getElementById("noCourseAdded").classList.add("hidden");
    document.getElementById("downloadButton").classList.remove("disabled");

    selectedCourse.forEach(function(el) {
        var currentCourse = mainRoutine.filter(function(elem) {
            return elem.id == el;
        });

        document.getElementById("addedCourseList").innerHTML += 
        `
            <div class="courseBox" id="${currentCourse[0].id}">
                <div class="header">
                    <div class="title">
                        ${currentCourse[0].title}
                    </div>
                    <div class="semiTitle">
                        ${currentCourse[0].code}
                    </div>
                </div>
                <div class="detailBox">
                    <table>
                        <tr>
                            <td>
                                <div class="icon">
                                    <i class="fa fa-users"></i>
                                </div>
                                <div class="title">Section ${currentCourse[0].section}</div>
                            </td>
                            <td>
                                <div class="icon">
                                    <i class="fa fa-chalkboard-teacher"></i>
                                </div>
                                <div class="title">${currentCourse[0].teacher}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="icon">
                                    <i class="fa fa-calendar-alt"></i>
                                </div>
                                <div class="title">${currentCourse[0].date}</div>
                            </td>
                            <td>
                                <div class="icon">
                                    <i class="fa fa-clock"></i>
                                </div>
                                <div class="title">${currentCourse[0].time}</div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="removeCourse" onclick="removeCourse('${currentCourse[0].id}')">
                                    <div class="icon">
                                        <i class="fa fa-trash-alt"></i>
                                    </div>
                                </div>
                                <div class="icon" style="height: 30px; line-height: 30px;">
                                    <i class="fa fa-door-open"></i>
                                </div>
                                <div class="title">${currentCourse[0].room}</div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        `;

        document.getElementById("routineTableBody").innerHTML += 
        `
        <tr id="${currentCourse[0].id}tr">
            <td>${currentCourse[0].dept}</td>
            <td>${currentCourse[0].code}</td>
            <td>${currentCourse[0].title}</td>
            <td>${currentCourse[0].section}</td>
            <td>${currentCourse[0].teacher}</td>
            <td>${currentCourse[0].date}</td>
            <td>${currentCourse[0].time}</td>
            <td>${currentCourse[0].room}</td>
        </tr>
        `;
    });


}

document.getElementById("closeDialogBox").onclick = function() {
    document.getElementById("dialogBox").classList.add("hidden");
    document.getElementById("deptOptions").classList.add("hidden");
    document.getElementById("courseOptions").classList.add("hidden");
    document.getElementById("sectionOptions").classList.add("hidden");

}

function removeCourse(courseID) {
    document.getElementById(courseID).remove();
    document.getElementById(courseID+"tr").remove();

    var courseIndex = selectedCourse.indexOf(courseID);
    selectedCourse.splice(courseIndex, 1);

    if(selectedCourse.length == 0) {
        document.getElementById("noCourseAdded").classList.remove("hidden");
        document.getElementById("downloadButton").classList.add("disabled");
    }
}


function downloadPDF() {
    if(selectedCourse.length == 0) {
        showToast("Please add at least one course!")
    }
    else {
        var jsPDF = jspdf.jsPDF;

        var pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [612, 612]
        });
        pdf.html(document.getElementById("pdfContainer"), {
            callback: function (pdf) {
                var base64 = pdf.output('datauristring', 'Summer2023MidRoutine.pdf');
                var link = document.createElement("a"); // Or maybe get it from the current document
                link.href = base64;
                link.download = "Summer2023MidRoutine.pdf";
                link.click();
            }
        });
    }
}


const buttons = document.querySelectorAll('[data-animation="ripple"]');
const buttonsb = document.querySelectorAll('[data-animation="rippleb"]');

buttons.forEach(button => {
    button.onpointerdown = function(e) {

        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        const w = this.offsetWidth;

        const ripple = document.createElement('span');

        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top  = y + 'px';
        ripple.style.setProperty('--scale', w);

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.parentNode.removeChild(ripple);
        }, 500);
    }
});

buttonsb.forEach(button => {
    button.onpointerdown = function(e) {

        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        const w = this.offsetWidth;

        const ripple = document.createElement('span');

        ripple.className = 'rippleb';
        ripple.style.left = x + 'px';
        ripple.style.top  = y + 'px';
        ripple.style.setProperty('--scale', w);

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.parentNode.removeChild(ripple);
        }, 500);
    }
});


function openMenu() {
    document.getElementById("sideBarMenuBackground").style.display = "block";
    document.getElementById("sideBarMenu").style.left = "0";
}

function clossMenu() {
    document.getElementById("sideBarMenuBackground").style.display = "none";
    document.getElementById("sideBarMenu").style.left = "-300px";
}

function openAboutBox() {
    document.getElementById("sideBarMenuBackground").style.display = "none";
    document.getElementById("sideBarMenu").style.left = "-300px";
    document.getElementById("aboutBox").classList.remove("hidden");
}

function clossAboutBox() {
    document.getElementById("aboutBox").classList.add("hidden");
}

function openExitBox() {
    document.getElementById("sideBarMenuBackground").style.display = "none";
    document.getElementById("sideBarMenu").style.left = "-300px";
    document.getElementById("aboutBox").classList.add("hidden");
    document.getElementById("exitBox").classList.remove("hidden");
}

function clossAboutBox() {
    document.getElementById("aboutBox").classList.add("hidden");
}

function clossExitBox() {
    document.getElementById("exitBox").classList.add("hidden");
}

function changeDepartment() {
    selectedCourse = [];
    mainRoutine = [];
    document.getElementById("noCourseAdded").classList.remove("hidden");
    document.getElementById("downloadButton").classList.add("disabled");
    document.getElementById("sideBarMenuBackground").style.display = "none";
    document.getElementById("sideBarMenu").style.left = "-300px";
    document.getElementById("addedCourseList").innerHTML = "";
    document.getElementById("deptOptionList").innerHTML = "";

    document.getElementById("deptOptions").classList.add("hidden");
    document.getElementById("courseOptions").classList.add("hidden");
    document.getElementById("sectionOptions").classList.add("hidden");



    document.getElementById("activeDept").innerHTML = "Select Department";
    document.getElementById("activeCourse").innerHTML = "Select Course";
    document.getElementById("activeSection").innerHTML = "Select Section";

    document.getElementById("disabledCourse").classList.remove("hidden");
    document.getElementById("disabledSection").classList.remove("hidden");
    document.getElementById("disabledButton").classList.remove("hidden");

    document.getElementById("welcomeMenu").classList.remove("hidden");
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("noConnection").classList.add("hidden");
    checkConnection();
}

document.getElementById("disabledCourse").onclick = function () {
    showToast("Please select department first!")
}

document.getElementById("disabledSection").onclick = function () {
    showToast("Please select course first!")
}
document.getElementById("disabledButton").onclick = function () {
    showToast("Please select all inforamtion first!")
}


function isFacebookApp() {
    var isTrue = /FB_IAB/.test(navigator.userAgent) || /FBAN/.test(navigator.userAgent) || /FBAV/.test(navigator.userAgent);
    return isTrue;
}

if (isFacebookApp()) {
       document.getElementById("popupFacebookError").style.display = "block";
}

function showToast(string) {
    var x = document.getElementById("snackbar");
    if(x.className != "show") {
        x.className = "show";
        x.innerHTML = string;
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}
