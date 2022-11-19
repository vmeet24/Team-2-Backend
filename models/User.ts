/**
 * @file Model class for User
 */

import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";

export default interface User {
   username: string;
   password: string;
   firstName: string | null;
   lastName: string | null;
   email: string;
   profilePhoto: string | null;
   headerImage: string | null;
   accountType: AccountType;
   maritalStatus: MaritalStatus;
   biography: string | null;
   dateOfBirth: Date | null;
   joined: Date;
   location: Location | null;
}

