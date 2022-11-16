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

   get isAdmin() { return this.admin; }
   
   set isAdmin(isAdminUser: boolean) { this.admin = isAdminUser; }
}

