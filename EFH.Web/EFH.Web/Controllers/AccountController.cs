using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
//using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using EFH.Web.Filters;
using EFH.Web.Models;
using EFH.Web.Models.BD;
using System.Net.Mail;

namespace EFH.Web.Controllers
{
    [Authorize]
    [InitializeSimpleMembership]
    public class AccountController : BaseController
    {
        private EFHEntities db = new EFHEntities();

        //
        // GET: /Account/Login

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            return View();
        }

        //
        // POST: /Account/Login

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModelEFH model, string returnUrl)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            if (ModelState.IsValid && WebSecurity.Login(model.Email, model.Password, persistCookie: model.RememberMe))
            {
                //ViewBag.UsuarioConectado = "varNombreUsuarioConectado";
                returnUrl = FormsAuthentication.DefaultUrl;
                return RedirectToLocal(returnUrl);
            }

            // If we got this far, something failed, redisplay form
            //ModelState.AddModelError("", "The user name or password provided is incorrect.");
            ModelState.AddModelError("", "El usuario o clave están incorrectos.");
            return View(model);
        }

        //
        // POST: /Account/LogOff

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            WebSecurity.Logout();
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            //return RedirectToAction("Index", "Home");
            return RedirectToLocal(FormsAuthentication.DefaultUrl);
        }

        //
        // GET: /Account/Register

        [AllowAnonymous]
        public ActionResult Register()
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            return View();
        }

        //
        // POST: /Account/Register

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterModelEFH model)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                    #region agregar usuario a la BD

                    if (ModelState.IsValid)
                    {
                        WebSecurity.CreateUserAndAccount(model.Email, model.Password);

                        tb_usuario user = new tb_usuario();
                        user.email_usuario = model.Email;
                        user.nombre_usuario = model.Nombre;
                        user.ap_paterno_usuario = model.ApellidoPaterno;
                        user.ap_materno_usuario = model.ApellidoMaterno;
                        user.clave = model.Password;
                        user.inactivo = false;
                        user.por_confirmar = false;
                        user.id_empresa = ((tb_empresa)varEmpresa).id_empresa;
                        user.fecha_creacion = DateTime.Now;
                        db.tb_usuario.Add(user);
                        db.SaveChanges();
                    }
                    #endregion

                    //WebSecurity.CreateUserAndAccount(model.Email, model.Password);
                    WebSecurity.Login(model.Email, model.Password);

                    return RedirectToLocal(FormsAuthentication.DefaultUrl);
                    //return RedirectToAction("Index", "Home");
                }
                catch (MembershipCreateUserException e)
                {
                    ModelState.AddModelError("", ErrorCodeToString(e.StatusCode));
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Register

        [AllowAnonymous]
        public ActionResult ForgotPassword(ForgotPasswordMessageId? message)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            ViewBag.StatusMessage =
                message == ForgotPasswordMessageId.SetPasswordSuccess ? "Tu clave ha sido enviada."
                : message == ForgotPasswordMessageId.SendEmailError ? "Ha ocurrido un error al enviar el email."
                : "";
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword(ForgotPasswordModelEFH model)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            //http://www.itorian.com/2013/03/PasswordResetting.html

            if (ModelState.IsValid && Membership.GetUser(model.Email) != null)
            {
                //generate password token
                var token = WebSecurity.GeneratePasswordResetToken(model.Email);
                //create url with above token
                var resetLink = "<a href='" + Url.Action("ResetPassword", "Account", new { email = model.Email, token = token }, "http") + "'>Reiniciar Clave</a>";
                ////////get user emailid
                //////UsersContext db = new UsersContext();
                //////var emailid = (from i in db.UserProfiles
                //////               where i.UserName == model.Email
                //////               select i.EmailId).FirstOrDefault();
                //send mail
                string subject = "Token para reiniciar clave - EFH";
                string body = "<b>Para reiniciar su clave debe dirigirse al siguiente link:</b><br/>" + resetLink; //edit it
                try
                {
                    SendEMail(model.Email, subject, body);
                    //TempData["Message"] = "Mail Sent.";
                    return RedirectToAction("ForgotPassword", new { Message = ForgotPasswordMessageId.SetPasswordSuccess });
                    //ModelState.AddModelError("", "Tu clave ha sido enviada con Token: " + token);
                    //return View(model);
                }
                catch // (Exception ex)
                {
                    //TempData["Message"] = "Ha ocurrido un error al enviar el email." + ex.Message;
                    return RedirectToAction("ForgotPassword", new { Message = ForgotPasswordMessageId.SendEmailError });
                }
                //only for testing
                //TempData["Message"] = resetLink;
            }
            else
            {
                // If we got this far, something failed, redisplay form
                //ModelState.AddModelError("", "The user name or password provided is incorrect.");
                ModelState.AddModelError("", "El usuario no existe.");
                return View(model);
            }
            //return View();
        }


        [AllowAnonymous]
        public ActionResult ResetPassword(string email, string token)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            //UsersContext db = new UsersContext();
            //TODO: Check the un and rt matching and then perform following
            //get userid of received username
            //var userid = (from i in db.UserProfiles
            //              where i.UserName == un
            //              select i.UserId).FirstOrDefault();

            //var userid = WebSecurity.GetUserId(un);

            //check userid and token matches
            //bool any = (from j in db.webpages_Memberships
            //            where (j.UserId == userid)
            //            && (j.PasswordVerificationToken == rt)
            //            //&& (j.PasswordVerificationTokenExpirationDate < DateTime.Now)
            //            select j).Any();
            int userid = 0;
            try
            {
                userid = WebSecurity.GetUserIdFromPasswordResetToken(token);
            }
            catch
            {
                //ModelState.AddModelError("", "El usuario no existe.");
                ViewBag.StatusMessage = "El usuario no existe.";
                return View();
            }
            if (userid > 0)
            {
                //generate random password
                string newpassword = Guid.NewGuid().ToString(); //GenerateRandomPassword(6);
                //reset password
                bool response = WebSecurity.ResetPassword(token, newpassword);
                if (response == true)
                {
                    ////get user emailid to send password
                    //var emailid = (from i in db.UserProfiles
                    //               where i.UserName == un
                    //               select i.EmailId).FirstOrDefault();

                    //send email
                    string subject = "Clave nueva para tu EFH";
                    //string body = "<b>Nueva Clave:</b><br/>" + newpassword; //edit it

                    var resetLink = "<a href='" + Url.Action("Manage", "Account", "http") + "'>Cambiar Clave</a>";
                    string body = "<b>Nueva Clave Provisoria:</b><br/>" + newpassword +
                        "<br/><br/><b>Para cambiar su clave debe dirigirse al siguiente link:</b><br/>" + resetLink; //edit it

                    try
                    {
                        SendEMail(email, subject, body);
                        //TempData["Message"] = "Mail Sent.";
                        ViewBag.StatusMessage = "Email enviado.";
                    }
                    catch (Exception ex)
                    {
                        //TempData["Message"] = "Error occured while sending email." + ex.Message;
                        ViewBag.StatusMessage = "Ha ocurrido un error al enviar el email: " + ex.Message;
                    }

                    //display message
                    //TempData["Message"] = "Success! Check email we sent. Your New Password Is " + newpassword;
                    ViewBag.StatusMessage = "Tu nueva clave ha sido enviada a tu correo, esta es: " + newpassword;
                }
                else
                {
                    //TempData["Message"] = "Hey, avoid random request on this page.";
                    ViewBag.StatusMessage = "Error en la solicitud.";
                }
            }
            else
            {
                //TempData["Message"] = "Username and token not maching.";
                ViewBag.StatusMessage = "El email y el token no concuerdan.";
            }

            return View();
        }

        //
        // POST: /Account/Disassociate

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Disassociate(string provider, string providerUserId)
        {
            string ownerAccount = OAuthWebSecurity.GetUserName(provider, providerUserId);
            ManageMessageId? message = null;

            // Only disassociate the account if the currently logged in user is the owner
            if (ownerAccount == User.Identity.Name)
            {
                // Use a transaction to prevent the user from deleting their last login credential
                using (var scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
                {
                    bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
                    if (hasLocalAccount || OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name).Count > 1)
                    {
                        OAuthWebSecurity.DeleteAccount(provider, providerUserId);
                        scope.Complete();
                        message = ManageMessageId.RemoveLoginSuccess;
                    }
                }
            }

            return RedirectToAction("Manage", new { Message = message });
        }

        //
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Tu clave ha sido cambiada."
                : message == ManageMessageId.SetPasswordSuccess ? "Tu clave ha sido registrada."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : "";
            ViewBag.HasLocalPassword = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }

        //
        // POST: /Account/Manage

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Manage(LocalPasswordModel model)
        {
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.HasLocalPassword = hasLocalAccount;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasLocalAccount)
            {
                if (ModelState.IsValid)
                {
                    // ChangePassword will throw an exception rather than return false in certain failure scenarios.
                    bool changePasswordSucceeded;
                    try
                    {
                        changePasswordSucceeded = WebSecurity.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword);

                        var _tb_usuario = db.tb_usuario.Where(u => u.email_usuario.Equals(User.Identity.Name)).Single();
                        _tb_usuario.clave = model.NewPassword;
                        db.Entry(_tb_usuario).State = System.Data.EntityState.Modified;
                        try
                        {
                            db.SaveChanges();
                        }
                        catch { }
                    }
                    catch (Exception)
                    {
                        changePasswordSucceeded = false;
                    }

                    if (changePasswordSucceeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        //ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                        ModelState.AddModelError("", "La actual clave es incorrecta o la nueva clave es inválida.");
                    }
                }
            }
            else
            {
                // User does not have a local password so remove any validation errors caused by a missing
                // OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        WebSecurity.CreateAccount(User.Identity.Name, model.NewPassword);
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    catch (Exception e)
                    {
                        ModelState.AddModelError("", e);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // POST: /Account/ExternalLogin

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            return new ExternalLoginResult(provider, Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback

        //[AllowAnonymous]
        //public ActionResult ExternalLoginCallback(string returnUrl)
        //{
        //    AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication(Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
        //    if (!result.IsSuccessful)
        //    {
        //        return RedirectToAction("ExternalLoginFailure");
        //    }

        //    if (OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, createPersistentCookie: false))
        //    {
        //        return RedirectToLocal(returnUrl);
        //    }

        //    if (User.Identity.IsAuthenticated)
        //    {
        //        // If the current user is logged in add the new account
        //        OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, User.Identity.Name);
        //        return RedirectToLocal(returnUrl);
        //    }
        //    else
        //    {
        //        // User is new, ask for their desired membership name
        //        string loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId);
        //        ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName;
        //        ViewBag.ReturnUrl = returnUrl;
        //        return View("ExternalLoginConfirmation", new RegisterExternalLoginModel { UserName = result.UserName, ExternalLoginData = loginData });
        //    }
        //}

        //
        // POST: /Account/ExternalLoginConfirmation

        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public ActionResult ExternalLoginConfirmation(RegisterExternalLoginModel model, string returnUrl)
        //{
        //    string provider = null;
        //    string providerUserId = null;

        //    if (User.Identity.IsAuthenticated || !OAuthWebSecurity.TryDeserializeProviderUserId(model.ExternalLoginData, out provider, out providerUserId))
        //    {
        //        return RedirectToAction("Manage");
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        // Insert a new user into the database
        //        using (UsersContext db = new UsersContext())
        //        {
        //            UserProfile user = db.UserProfiles.FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
        //            // Check if user already exists
        //            if (user == null)
        //            {
        //                // Insert name into the profile table
        //                db.UserProfiles.Add(new UserProfile { UserName = model.UserName });
        //                db.SaveChanges();

        //                OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, model.UserName);
        //                OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie: false);

        //                return RedirectToLocal(returnUrl);
        //            }
        //            else
        //            {
        //                //ModelState.AddModelError("UserName", "User name already exists. Please enter a different user name.");
        //                ModelState.AddModelError("UserName", "El usuario yua existe. Por favir, escoge otro Usuario.");
        //            }
        //        }
        //    }

        //    ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName;
        //    ViewBag.ReturnUrl = returnUrl;
        //    return View(model);
        //}

        ////
        //// GET: /Account/ExternalLoginFailure

        //[AllowAnonymous]
        //public ActionResult ExternalLoginFailure()
        //{
        //    return View();
        //}

        //[AllowAnonymous]
        //[ChildActionOnly]
        //public ActionResult ExternalLoginsList(string returnUrl)
        //{
        //    ViewBag.ReturnUrl = returnUrl;
        //    return PartialView("_ExternalLoginsListPartial", OAuthWebSecurity.RegisteredClientData);
        //}

        //[ChildActionOnly]
        //public ActionResult RemoveExternalLogins()
        //{
        //    ICollection<OAuthAccount> accounts = OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name);
        //    List<ExternalLogin> externalLogins = new List<ExternalLogin>();
        //    foreach (OAuthAccount account in accounts)
        //    {
        //        AuthenticationClientData clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider);

        //        externalLogins.Add(new ExternalLogin
        //        {
        //            Provider = account.Provider,
        //            ProviderDisplayName = clientData.DisplayName,
        //            ProviderUserId = account.ProviderUserId,
        //        });
        //    }

        //    ViewBag.ShowRemoveButton = externalLogins.Count > 1 || OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
        //    return PartialView("_RemoveExternalLoginsPartial", externalLogins);
        //}

        #region Helpers
        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
        }

        public enum ForgotPasswordMessageId
        {
            SetPasswordSuccess,
            SendEmailError,
        }

        internal class ExternalLoginResult : ActionResult
        {
            public ExternalLoginResult(string provider, string returnUrl)
            {
                Provider = provider;
                ReturnUrl = returnUrl;
            }

            public string Provider { get; private set; }
            public string ReturnUrl { get; private set; }

            public override void ExecuteResult(ControllerContext context)
            {
                OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
            }
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "Nombre de usuario ya existe. Por favor, introduzca un nombre de usuario diferente.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "Ya existe un nombre de usuario para este correo electrónico. Introduzca una dirección de correo electrónico diferente.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }

        private void SendEMail(string email, string subject, string body)
        {
            SmtpClient client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.Host = "smtp.gmail.com";
            client.Port = 587;

            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("ehl.net@gmail.com", "schcupda5791");
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("efh.admin@gmail.com");
            msg.To.Add(new MailAddress(email));
            msg.Bcc.Add(new MailAddress("ehl.net@gmail.com"));
            msg.Subject = subject;
            msg.IsBodyHtml = true;
            msg.Body = body;

            client.Send(msg);
        }
        #endregion
    }
}
