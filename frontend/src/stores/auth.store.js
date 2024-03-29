import { defineStore } from 'pinia';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({    
    token: null,
    refreshToken: Cookies.get('refreshToken') || null,
    isAuthenticated: false
  }),
 
  actions: {
    setAuthentication(payload) {
      this.token = payload.access;
      this.refreshToken = payload.refresh;
      this.isAuthenticated = true;

      Cookies.set('refreshToken', this.refreshToken, { secure: true, sameSite: 'strict' });
      
      // Set jwt in axios headers
      axios.defaults.headers.common['Authorization'] = `JWT ${this.token}`;

      // start timer to refresh jwt
      this.startRefreshTokenTimer();
    },  
    async refreshAuthentication(payload) {
      this.token = payload.access;
      this.isAuthenticated = true;

      // Set jwt in axios headers
      axios.defaults.headers.common['Authorization'] = `JWT ${this.token}`;

      // start timer to refresh jwt
      this.startRefreshTokenTimer();
    },
    async handleRefreshToken() {
      this.refreshToken = Cookies.get('refreshToken');
      if (this.refreshToken) {                            
        await axios
          .post('/auth/jwt/refresh/', {
            refresh: this.refreshToken,
          })
          .then((response) => {                     
            this.refreshAuthentication(response.data);                                  
          })       
          .catch((error) => {                       
            console.error('Failed to refresh token:', error);
            // on error clear state
            this.clearAuthentication();
            // throw error;                     
          });             
      }     
    },
    startRefreshTokenTimer() {
      // parse json object from base64 encoded jwt token
      const jwtBase64 = this.token.split('.')[1];
      const jwtToken = JSON.parse(atob(jwtBase64));

      // set a timeout to refresh the jwt a minute before it expires
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);

      this.refreshTokenTimeout = setTimeout(() => {
        this.handleRefreshToken();
      }, timeout);
    },    
    stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout);
    },
    clearAuthentication () {
      // stop timer to refresh jwt
      this.stopRefreshTokenTimer();

      // Remove token from axios headers
      delete axios.defaults.headers.common['Authorization'];

      // remove from cookies
      Cookies.remove('refreshToken');
      
      this.$reset();
    }      
  }
});