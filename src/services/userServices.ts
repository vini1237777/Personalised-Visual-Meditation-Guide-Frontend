import makeRequest from "../api/makeRequest";
import url from "../api/urls";
import { IUser } from "../helpers/interface";

export class UserService {
  static async getByEmail(email: string) {
    return makeRequest(url.getUser, "GET", { email });
  }
  static async register(payload: IUser) {
    // console.log(payload, "payload in register");
    return makeRequest(url.register, "POST", payload);
  }

  static async login(payload: any) {
    return makeRequest(url.login, "POST", payload);
  }

  static async updateUser(id: any, payload: IUser) {
    return makeRequest(url.updateUser + "/" + id, "PUT", payload);
  }
  static async deleteUser(id: any) {
    return makeRequest(url.deleteUser + "/" + id, "DELETE");
  }

  static async getScript({
    selectedFeelings,
    selectedEmojis,
    userState,
  }: {
    selectedFeelings: string[];
    selectedEmojis: any;
    userState: any;
  }) {
    // console.log(selectedFeelings, selectedEmojis, userState.email);
    const payload = {
      selectedFeelings,
      selectedEmojis,
      userState,
    };
    return makeRequest(url.getScript, "POST", payload);
  }
}
