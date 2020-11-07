
$(document).ready(function () {
    // $('#students').DataTable({
    //     "pagingType": "full_numbers"
    // });
    function myFunction() {
        alert("Marks Submit succesfully");
    }
    let students = [];

    $('#students').html('');

    fetch('https://gist.githubusercontent.com/eallenOP/b40fa9bba517ff258da395c79edd2477/raw')
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                console.log('A');
                let studentData = [];
                let attendance = [];
                student.attendance.forEach(element => {
                    attendance.push(element);
                });
                studentData.push(student.name.first);
                studentData.push(student.id);
                studentData.push(student.ethnicity);
                studentData.push('sample');
                studentData.push(attendance);
                studentData.push('sample');
                students.push(studentData);
            });

            $('#students').DataTable( {
                data: students,
                columns: [
                    { title: "Student Name" },
                    { title: "Student ID" },
                    { title: "Ethnicities" },
                    { title: "Attendance %" },
                    { title: "Mark" },
                    { title: "Action" }
                ]
            } );
// var html='';
// html +='<tr>';
// html += '<td> <input type="text" class="from-control"/><option>Absent</option><option>Present</option></td>';
// console.log("html");

console.log(students);
        });

    console.log('Running Before fetching ');
});

