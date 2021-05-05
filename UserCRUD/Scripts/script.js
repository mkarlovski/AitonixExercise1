
var clickedUserId = '';

const app = {
    
    sendToServer(dataTable) {

        var userId = '';
        var userData = dataTable.row('.selected').data();
        var that = this;
        if (userData) {
            userId = parseFloat(userData[0]);
            console.log(userId)
        }
       

        var name = document.getElementById("fullname").value;
        var username = document.getElementById("userName").value;
        var password = document.getElementById("password").value;
        var email = document.getElementById("email").value;
        var comment = document.getElementById("comment").value;

        var data =
        {
            Id:userId,
            FullName: name,
            UserName: username,
            Password: password,
            Email: email,
            Comment: comment
        }

        var data2 = ["0",name, username, password, email, comment];

        if (userData) {
           
            axios.post('https://localhost:44327/User/UpdateUser', data)
                .then(function (response) {
                    console.log(response.data);

                    var data2 = [userId, name, username, password, email, comment];
                    that.addRow(dataTable, data2);
                    that.clearForm();
                })
                .catch(function (error) {
                });
        }

        else {

            axios.post('https://localhost:44327/User/InsertUser', data)
                .then(function (response) {
                    console.log(response.data);
                    var newId = response.data.data.Id;
                    var data2 = [newId, name, username, password, email, comment];
                    that.addRow(dataTable, data2);
                })
                .catch(function (error) {
                });
        }    
    },

    addRow(dataTable, data) {
        const addedRow = dataTable.row.add(data).draw();
        addedRow.show().draw(false);
     
    },

    selectRow(dataTable) {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#remove').attr("disabled", true);
            $('#update').attr("disabled", true);
        } else {
            dataTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#remove').removeAttr("disabled");
            $('#update').removeAttr("disabled");
        }
    },

    removeRow(dataTable) {
        
        var userData = dataTable.row('.selected').data();
     
        var userId = parseFloat(userData[0]);
      
        axios.post('https://localhost:44327/User/DeleteUser/' + userId)
            .then(function (response) {
               console.log(response.data)
                
                if (response.data.status) {
                    dataTable.row('.selected').remove().draw(false);
                }

                clickedUserId = '';
            })
            .catch(function (error) {
            });
        
    },
    updateUser(dataTable) {
        var that = this;

        var userData = dataTable.row('.selected').data();
        var userId = parseFloat(userData[0]);
    
        var route = "https://localhost:44327/User/GetUser/" + userId;
        axios.get(route)
   
            .then(function (response) {
                console.log(response.data);
                that.fillUserForm(response.data.data)
            })
            .catch(function (error) {
            });

    },

    fillUserForm(data) {
        var fullName = document.getElementById("fullname");
        fullName.value = data.FullName;

        var userName = document.getElementById("userName")
        userName.value = data.UserName;

        var password = document.getElementById("password");
        password.value = data.Password;

        var email = document.getElementById("email");
        email.value = data.Email;

        var comment = document.getElementById("comment");
        comment.value = data.Comment;
    },
    clearForm() {
        var fullName = document.getElementById("fullname");
        fullName.value = null;

        var userName = document.getElementById("userName")
        userName.value = null;

        var password = document.getElementById("password");
        password.value =null;

        var email = document.getElementById("email");
        email.value = null;

        var comment = document.getElementById("comment");
        comment.value = null;
    },
    getLast10Users()
    {
        console.log("I am Here")
        var datasetArray = []
        var that = this;
        axios.get('https://localhost:44327/User/GetLast10Users')
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

    },
    searchByDate(dateFrom,dateTo) {
        var that = this;
        var datasetArray = [] 
        var dateFrom = document.getElementById("dateFrom").value;
        //dateFrom=Date.parse
        var dateTo = document.getElementById("dateTo").value;

        console.log(dateFrom, dateTo);
        data = {

            DateFrom: dateFrom,
            DateTo: dateTo
        }

        var route = "https://localhost:44327/User/GetUsersByTime";
        axios.post(route,data)

            .then(function (response) {
                console.log(response.data);
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
        
    }, 
    initDataTable(dataSet) {
        const dataTable = $('#realtime').DataTable({    
            destroy: true,
            //searching:false,
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
        

        $('#add').on('click', this.sendToServer.bind(this, dataTable));
        const self = this;
        
        $('#realtime tbody').on('click', 'tr', function () {         
            self.selectRow.bind(this, dataTable)();           
            clickedUser = $(this).find('td').first().text();
        });

        $('#remove').on('click', this.removeRow.bind(this, dataTable)); 

        $('#update').on('click', this.updateUser.bind(this, dataTable));

        //$('#searchByDate').on('click', function (e) {
        //    e.preventDefault();
        //    var dateFrom = document.getElementById("dateFrom").value;
        //    var dateTo = document.getElementById("dateTo").value;
        //    self.searchByDate(dateFrom, dateTo);
        //}
        //)
        
    }
    

};

$('#last10user').on('click', function (e) {
    e.preventDefault();   
    app.getLast10Users();
      }
)

//$('#searchByDate').on('click', function (e) {
//    //e.preventDefault();
//    app.searchByDate();
//}
//)


$('#showAll').on('click', function (e) {
    e.preventDefault();    
    app.start();
}
)

    


$(document).ready(() => app.start());