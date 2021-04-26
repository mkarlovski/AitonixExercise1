using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserCRUD.Models
{
    public class User
    {
        public long Id;
        public string FullName;
        public string UserName;
        public string Password;
        public string Email;
        public DateTime RegisteredAt;
        public string Comment;
    }
}