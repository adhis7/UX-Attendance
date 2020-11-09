$(document).ready(function () {
	// $('#students').DataTable({
	//     "pagingType": "full_numbers"
	// });
	function myFunction() {
		alert('Marks Submit succesfully');
	}

	let absent = [];
	let present = [];
	let letter = [];
	// Submit student attendance
	$('#submit-marks').click(function () {
		$('#c_absent').text(absent.length);
		$('#c_present').text(present.length);
		$('#c_letter').text(letter.length);

		$('.popup').css('display','block').fadeIn();
		setTimeout(() => {
			$('.popup').fadeOut();
		}, 4000);
	});
        
	$('#students').html('');

	// get default Stream
	let stream = $('#stream :selected').val();

	// get students of selected stream
	$('#stream').change(function () {
		stream = $('#stream :selected').val();

		fetchStudents(stream);
	});

	// initialize student data table
	fetchStudents(stream);

	// attendance actions
	$('#students').on('click', '#absent', function (e) {
		var parent = '';
		if (e.target.id == '') parent = e.target.parentElement.parentElement;
		else parent = e.target.parentElement;
		var s_id = parent.id.split('_').pop();

		present = removeId(present, s_id);
		letter = removeId(letter, s_id);
		// add student to absent group
		absent.push(s_id);

		$('#' + parent.id + ' #absent').css('opacity', '1');
		$('#' + parent.id + ' #present').css('opacity', '.5');
		$('#' + parent.id + ' #letter').css('opacity', '.5');
		$('#' + parent.id + ' #attendance').val('absent');
	});
	$('#students').on('click', '#present', function (e) {
		var parent = '';
		if (e.target.id == '') parent = e.target.parentElement.parentElement;
		else parent = e.target.parentElement;
		var s_id = parent.id.split('_').pop();

		absent = removeId(absent, s_id);
		letter = removeId(letter, s_id);
		// add student to present group
		present.push(s_id);

		$('#' + parent.id + ' #present').css('opacity', '1');
		$('#' + parent.id + ' #absent').css('opacity', '.5');
		$('#' + parent.id + ' #letter').css('opacity', '.5');
		$('#' + parent.id + ' #attendance').val('present');
	});
	$('#students').on('click', '#letter', function (e) {
		var parent = '';
		if (e.target.id == '') parent = e.target.parentElement.parentElement;
		else parent = e.target.parentElement;
		var s_id = parent.id.split('_').pop();

		present = removeId(present, s_id);
		absent = removeId(absent, s_id);
		// add student to letter group
		letter.push(s_id);

		$('#' + parent.id + ' #letter').css('opacity', '1');
		$('#' + parent.id + ' #present').css('opacity', '.5');
		$('#' + parent.id + ' #absent').css('opacity', '.5');
		$('#' + parent.id + ' #attendance').val('letter');
	});

	// select student of specific id
	$('#students').on('click', 'tbody > tr', function (e) {
		if (e.target.tagName == 'BUTTON' || e.target.tagName == 'I') return;

		id = e.target.parentElement.children[1].innerText;
		getStudentWithId(id);
	});
});

// fetch students
function fetchStudents(stream) {
	fetch('https://gist.githubusercontent.com/eallenOP/b40fa9bba517ff258da395c79edd2477/raw')
		.then((response) => response.json())
		.then((data) => {
			let students = [];
			let _students = [];

			if (stream === 'a') {
				_students = data.filter((student) => student.id % 2 === 0);
			} else if (stream === 'b') {
				_students = data.filter((student) => student.id % 2 !== 0);
			} else {
				_students = data;
			}

			_students.forEach((student) => {
				let studentData = [];
				let attendance = [];

				student.attendance.forEach((element) => {
					attendance.push(element);
				});

				let presentScore = 0;
				for (var i = 0; i < student.attendance.length; i++) {
					if (student.attendance[i] == 'p') presentScore++;
				}

				// attendance percentage
				attendancePer = (presentScore / student.attendance.length) * 100;

				studentData.push(student.name.first + ' ' + student.name.last);
				studentData.push(student.id);
				studentData.push(student.ethnicity);
				studentData.push(attendancePer + '%');
				studentData.push(attendance);
				students.push(studentData);
			});

			$('#students').DataTable({
				data: students,
				destroy: true,
				columns: [
					{ title: 'Student Name' },
					{ title: 'Student ID' },
					{ title: 'Ethnicity' },
					{ title: 'Attendance %' },
					{
						title: 'Attendance',
						render: function (d, t, r) {
							var $select = $(
								'<div id="std_action_' +
									r[1] +
									'">' +
									'<input type="input" id="attendance" value="" hidden />' +
									'<button id="absent" class="btn btn-danger"><i class="glyphicon glyphicon-remove"></i></button>' +
									'<button id="present" class="btn btn-success ml-2 mr-2"><i class="glyphicon glyphicon-ok"></i></button>' +
									'<button id="letter" class="btn btn-primary"><i class="glyphicon glyphicon-envelope"></i></button></div>'
							);
							return $select.prop('outerHTML');
						},
					},
				],
			});
		});
}

// get a student with id
function getStudentWithId(id) {
	fetch('https://gist.githubusercontent.com/eallenOP/b40fa9bba517ff258da395c79edd2477/raw')
		.then((response) => response.json())
		.then((data) => {
			student = data.filter((student) => student.id == id)[0];

			$('#s_name').text(student.name.first + ' ' + student.name.last);
			$('#s_email').text(student.email);
			$('#s_address').text(student.address);
			$('#s_phone').text(student.phone);
			$('#s_ethnicity').text(student.ethnicity);
			$('#s_date').text(student.enrolled);
		});
}

function removeId(arr, id) {
	var attendance = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] != id) attendance.push(arr[i]);
	}
	return attendance;
}
