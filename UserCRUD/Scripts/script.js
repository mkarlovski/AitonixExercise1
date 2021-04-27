


const app = {
    //buildForm() {
    //    return [
    //        $('#fullName').val(),
    //        $('#userName').val(),
    //        $('#password').val(),
    //        $('#email').val(),
    //        $('#comment').val()
    //    ];
    //},
    //sendToServer() {
    //    const formData = this.buildForm();
    //    axios.post('https://localhost:44327/User/InsertUser', formData)
    //        .then(response => console.log(response));
    //},
    sendToServer() {
        var name = document.getElementById("fullname").value;
        var username = document.getElementById("userName").value;
        var password = document.getElementById("password").value;
        var email = document.getElementById("email").value;
        var comment = document.getElementById("comment").value;

        axios.post('https://localhost:44327/User/InsertUser', {
            
            fullname: name,
            username: username,
            password: password,
            email: email,
            comment: comment
        })
            .then(function (response) {
                console.log(response.data);
                alert(`User Added`)


            })
            .catch(function (error) {

            });
    },
    addRow(dataTable, data) {
        const addedRow = dataTable.row.add(data).draw();
        addedRow.show().draw(false);

        const addedRowNode = addedRow.node();
        console.log(addedRowNode);
        $(addedRowNode).addClass('highlight');
    },
    selectRow(dataTable) {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            dataTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    },
    removeRow(dataTable) {
        dataTable.row('.selected').remove().draw(false);
    },
    start() {
        var datasetArray = [];              //zosto koga povrzuvam array ne raboti a vaka raboti
        
            axios.get('https://localhost:44327/User/GetUserList')
                .then(function (response) {

                    response.data.data.forEach(user => {
                        var userData = [];
                        var userID = user.Id.toString();
                        userData.push(userID);
                        userData.push(user.FullName);
                        userData.push(user.UserName);
                        userData.push(user.Password);
                        userData.push(user.Email);
                        userData.push(user.Comment);
                        datasetArray.push(userData);

                    });
                    console.log(datasetArray);

                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log(datasetArray);
        
        const dataTable = $('#realtime').DataTable({
            
            data: datasetArray,
            columns: [
                { title: 'Id' },
                { title: 'FullName' },
                { title: 'UserName' },
                { title: 'Password' },
                { title: 'Email' },
                { title: 'Comment' }
            ]
        });

        $('#add').on('click', this.sendToServer.bind(this));
        const self = this;
        $('#realtime tbody').on('click', 'tr', function () {
            self.selectRow.bind(this, dataTable)();
        });
        $('#remove').on('click', this.removeRow.bind(this, dataTable));

        
    }
};

$(document).ready(() => app.start());