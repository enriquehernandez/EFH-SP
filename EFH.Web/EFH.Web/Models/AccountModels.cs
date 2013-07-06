using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Web.Security;

namespace EFH.Web.Models
{
    public class UsersContext : DbContext
    {
        public UsersContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
    }

    [Table("UserProfile")]
    public class UserProfile
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string UserName { get; set; }
    }

    public class RegisterExternalLoginModel
    {
        [Required(ErrorMessage="Debe ingresar el Nombre de Usuario")]
        [Display(Name = "Nombre de Usuario")]
        public string UserName { get; set; }

        public string ExternalLoginData { get; set; }
    }

    public class LocalPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Clave actual")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} caracteres de largo.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Clave nueva")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmar clave nueva")]
        [Compare("NewPassword", ErrorMessage = "La nueva Clave y su confirmación no coinciden.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required(ErrorMessage = "Debe ingresar el Nombre de Usuario")]
        [Display(Name = "Nombre de Usuario")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Debe ingresar la Clave")]
        [DataType(DataType.Password)]
        [Display(Name = "Clave")]
        public string Password { get; set; }

        [Display(Name = "Recordarme?")]
        public bool RememberMe { get; set; }
    }

    public class LoginModelEFH
    {
        [Required(ErrorMessage = "Debe ingresar su Email")]
        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Debe ingresar la Clave")]
        [DataType(DataType.Password)]
        [Display(Name = "Clave")]
        public string Password { get; set; }

        [Display(Name = "Recordarme?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterModel
    {
        [Required(ErrorMessage = "Debe ingresar el Nombre de Usuario")]
        [Display(Name = "Nombre de Usuario")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Debe ingresar la Clave")]
        [StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} caracteres de largo.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Clave")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmar clave")]
        [Compare("Password", ErrorMessage = "La nueva Clave y su confirmación no coinciden.")]
        public string ConfirmPassword { get; set; }
    }

    public class RegisterModelEFH
    {
        [Required(ErrorMessage = "Debe ingresar su Email")]
        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage="Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Debe ingresar su Nombre")]
        [Display(Name = "Nombre")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "Debe ingresar su Apellido Paterno")]
        [Display(Name = "Apellido Paterno")]
        public string ApellidoPaterno { get; set; }

        [Display(Name = "Apellido Materno")]
        public string ApellidoMaterno { get; set; }

        [Required(ErrorMessage = "Debe ingresar la Clave")]
        [StringLength(100, ErrorMessage = "La {0} debe tener al menos {2} caracteres de largo.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Clave")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirmar clave")]
        [Compare("Password", ErrorMessage = "La nueva Clave y su confirmación no coinciden.")]
        public string ConfirmPassword { get; set; }
    }

    public class ForgotPasswordModelEFH
    {
        [Required(ErrorMessage = "Debe ingresar su Email")]
        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
    }

    public class ExternalLogin
    {
        public string Provider { get; set; }
        public string ProviderDisplayName { get; set; }
        public string ProviderUserId { get; set; }
    }
}
