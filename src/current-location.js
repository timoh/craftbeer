export default class CurrentLocation {

  getLocation(callback) {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(callback);
      } else {
          return;
      }
  }

}
