const TokenManager = {
  token: "",

  setToken(newToken: any) {
    this.token = newToken;
  },

  getToken() {
    return this.token;
  },
};
export default TokenManager;
