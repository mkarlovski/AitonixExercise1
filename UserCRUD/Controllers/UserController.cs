using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UserCRUD.Models;

namespace UserCRUD.Controllers
{
    public class UserController : Controller
    {
        public ActionResult Index()
        {
            return View("Index");
        }

        public ActionResult GetUserList()
        {
            List<Models.User> UserList = new List<Models.User>();
            if (Session["UserList"] != null) UserList = (List<Models.User>)Session["UserList"];
            else
            {
                UserList = new List<Models.User>();
                Models.User User = new Models.User();
                User.Id = 1001;
                User.FullName = "User 1aaaa";
                User.UserName = "user1001";
                User.Password = "P@$$w0rd1001";
                User.Email = "user1001@crud.mk";
                User.RegisteredAt = DateTime.Now.AddDays(4);
                User.Comment = "...";
                UserList.Add(User);

                User = new Models.User();
                User.Id = 1002;
                User.FullName = "User 2aaaa";
                User.UserName = "user1002";
                User.Password = "P@$$w0rd1002";
                User.Email = "user1002@crud.mk";
                User.RegisteredAt = DateTime.Now.AddDays(2);
                User.Comment = "...";
                UserList.Add(User);

                User = new Models.User();
                User.Id = 1003;
                User.FullName = "User 3aaaa";
                User.UserName = "user1003";
                User.Password = "P@$$w0rd1003";
                User.Email = "user1003@crud.mk";
                User.RegisteredAt = DateTime.Now;
                User.Comment = "...";
                UserList.Add(User);

                User = new Models.User();
                User.Id = 1004;
                User.FullName = "User 4aaaa";
                User.UserName = "user1004";
                User.Password = "P@$$w0rd1004";
                User.Email = "user1004@crud.mk";
                User.RegisteredAt = DateTime.Now;
                User.Comment = "...";
                UserList.Add(User);

                Session["UserList"] = UserList;
            }

            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();
            jResponse.status = true;
            jResponse.message = "";
            jResponse.data = UserList;

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetUser(long Id)
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();

            List<Models.User> UserList = new List<Models.User>();
            if (Session["UserList"] != null) UserList = (List<Models.User>)Session["UserList"];

            Models.User User = UserList.FirstOrDefault(x => x.Id == Id);

            if (User == null)
            {
                User = new Models.User();
                jResponse.status = false;
                jResponse.message = "User not found";
            }
            else
            {
                jResponse.status = true;
                jResponse.message = "OK";
            }

            jResponse.data = User;

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult InsertUser(Models.User User)
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();

            //if (ModelState.IsValid) 
            //{
                List<Models.User> UserList = new List<Models.User>();
                if (Session["UserList"] != null) UserList = (List<Models.User>)Session["UserList"];

                Models.User _User = UserList.FirstOrDefault(x => x.Id == User.Id);

                if (_User == null)
                {
                    _User = new Models.User();

                    if (UserList.Any())
                    {
                        _User.Id = UserList.LastOrDefault().Id + 1;
                    }
                    else
                    {
                        _User.Id = 1001;
                    }
                    
                    _User.FullName = User.FullName;
                    _User.UserName = User.UserName;
                    _User.Password = User.Password;
                    _User.Email = User.Email;
                    _User.RegisteredAt = DateTime.Now;
                    _User.Comment = User.Comment;

                    UserList.Add(_User);
                    Session["UserList"] = UserList;

                    jResponse.status = true;
                    jResponse.message = "OK";
                }
                else
                {
                    _User = new Models.User();
                    jResponse.status = false;
                    jResponse.message = "Error on insert";
                }

                jResponse.data = _User;

                
            
            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateUser(Models.User User)
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();

            List<Models.User> UserList = new List<Models.User>();
            if (Session["UserList"] != null) UserList = (List<Models.User>)Session["UserList"];

            Models.User _User = UserList.FirstOrDefault(x => x.Id == User.Id);

            if (_User != null)
            {
                _User.FullName = User.FullName;
                _User.UserName = User.UserName;
                _User.Password = User.Password;
                _User.Email = User.Email;
                _User.Comment = User.Comment;

                Session["UserList"] = UserList;

                jResponse.status = true;
                jResponse.message = "OK";
            }
            else
            {
                _User = new Models.User();
                jResponse.status = false;
                jResponse.message = "Error on update";
            }

            jResponse.data = _User;

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DeleteUser(long Id)
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();

            List<Models.User> UserList = new List<Models.User>();
            if (Session["UserList"] != null) UserList = (List<Models.User>)Session["UserList"];

            Models.User User = UserList.FirstOrDefault(x => x.Id == Id);

            if (User == null)
            {
                User = new Models.User();
                jResponse.status = false;
                jResponse.message = "Error on delete";
            }
            else
            {
                UserList.Remove(User);
                Session["UserList"] = UserList;

                jResponse.status = true;
                jResponse.message = "OK";
            }

            jResponse.data = User;

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public ActionResult GetLast10Users()
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();
            List<Models.User> UserList = new List<Models.User>();
            List<Models.User> last10Users = new List<Models.User>();
            if (Session["UserList"] != null)
            {
                UserList = (List<Models.User>)Session["UserList"];

                 last10Users = UserList.OrderByDescending(x => x.RegisteredAt).Take(10).ToList();
                jResponse.status = true;
                jResponse.message = "OK";
                jResponse.data = last10Users;
            }
            else
            {
                jResponse.status = false;
                jResponse.message = "no users to display";
                jResponse.data ="";

            }

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult GetUsersByTime(TimeModel timespan)
        {
            App_Helpers.JsonResponse jResponse = new App_Helpers.JsonResponse();
            List<Models.User> UserList = new List<Models.User>();
            List<Models.User> UsersTimeSpan = new List<Models.User>();
            if (Session["UserList"] != null)
            {
                UserList = (List<Models.User>)Session["UserList"];

                UsersTimeSpan = UserList.Where(x => (x.RegisteredAt >= timespan.DateFrom) && (x.RegisteredAt < timespan.DateTo)).ToList();
                if (UsersTimeSpan.Count != 0)
                {
                    jResponse.status = true;
                    jResponse.message = "OK";
                    jResponse.data = UsersTimeSpan;
                }
                else
                {
                    jResponse.status = false;
                    jResponse.message = "no users to display";
                    jResponse.data = "";

                }

            }
            else
            {
                jResponse.status = false;
                jResponse.message = "no users to display";
                jResponse.data = "";

            }

            return Json(jResponse, JsonRequestBehavior.AllowGet);
        }

    }
}
