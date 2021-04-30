


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

        //const options = {
        //    headers: { "Content-Type": "multipart/form-data" },
        //};
        var that = this;
        var data = {
            //Id: 0,
            FullName: name,
            UserName: username,
            Password: password,
            Email: email,
            Comment: comment
        }

        //const formData = new FormData();
        //formData.append('Id', 0);
        //formData.append('FullName', name);
        //formData.append('UserName', username);
        //formData.append('Password', password);
        //formData.append('Email', email);
        //formData.append('Comment', comment);

        axios.post('https://localhost:44327/User/InsertUser', data)
        .then(function (response) {
            console.log(response.data);           
            //alert(`User Added`)
            var insert = prompt("would you like to add user");  ///ova treba da odi pred axios post
        })
        .catch(function (error) {
        });

        
        //app.start();
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
            $('#remove').attr("disabled", true);
        } else {
            dataTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#remove').removeAttr("disabled");
        }
    },
    removeRow(dataTable,userId) {
        //dataTable.row('.selected').remove().draw(false);


        var userId = parseFloat(userId);
       
        
        axios.post('https://localhost:44327/User/DeleteUser/' + userId
        //    , {
        //    params: {
        //        Id: userId
        //    }
        //}
            
        )
            .then(function (response) {
                console.log(response.data);
                //alert(`User Added`)
                dataTable.row('.selected').remove().draw(false);
            })
            .catch(function (error) {
            });
       
        
    },
    start() {
        var datasetArray = []              
        var that = this;
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

                that.initDataTable(datasetArray)
            })
            .catch(function (error) {
                console.log(error);
            });
        //that.initDataTable(datasetArray)
    }, 
    initDataTable(dataSet) {
        const dataTable = $('#realtime').DataTable({    
            
            data: dataSet,
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
        $('#realtime tbody').on('click', 'tr', function (e) {
            e.preventDefault();
            self.selectRow.bind(this, dataTable)();
            var rowIndex = $(this).find('td:eq(0)').text();
            alert(rowIndex);
            $('#remove').on('click', self.removeRow.bind(this, dataTable,rowIndex)); 

        });
        //$('#remove').on('click', this.removeRow.bind(this, dataTable));    //ova e funkcionalno  NE BRISI
    ////$('#remove').on('click', 'tr', function (e) {
    ////    var userId = $(this).find('td:eq(0)').text();
    ////    alert(rowIndex);
    ////    this.removeRow.bind(this, dataTable, userId)
    ////    alert(rowIndex);
    //}
    //    );

    }
    
};


//function GetAllUsers() {

//}

$(document).ready(() => app.start());