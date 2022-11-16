/**
 * @file Model class for User
 */

import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";

export default class User {
   private username: string = '';
   private password: string = '';
   private firstName: string | null = null;
   private lastName: string | null = null;
   private email: string = '';
   private profilePhoto: string | null = null;
   private headerImage: string | null = null;
   private accountType: AccountType = AccountType.Personal;
   private maritalStatus: MaritalStatus = MaritalStatus.Single;
   private biography: string | null = null;
   private dateOfBirth: Date | null = null;
   private joined: Date = new Date();
   private location: Location | null = null;
   private admin: boolean = false;

   /**
    * Creates a new User object.
    * @param {string} id A unique ID for this object
    * @param {string} username The text-based public name chosen by the User
    * @param {string} password The User chosen account password
    * @param {string} email The User's email
    * @param {boolean} isAdmin Flag indicating if the user is an administrator
    */
   constructor(username: string, password: string, email: string = '', isAdmin: boolean = false) {
      this.username = username;
      this.password = password;
      this.email = email;
      this.admin = isAdmin;
   }

   /**
    * Gets the admin status of the User
    * @return {boolean} True if the user is an administrator, false otherwise
    */
   get isAdmin() { return this.admin; }

   /**
    * Sets the admin flag of the User to the given value
    * @param {boolean} isAdminUser The flag indicating if this user should be an admin or not
    */
   set isAdmin(isAdminUser: boolean) { this.admin = isAdminUser; }
}

