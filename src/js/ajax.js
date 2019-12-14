module.exports = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function() {
    var response = xhr.responseText;
    if (url.match(/json$/)) {
      try {
        response = JSON.parse(xhr.responseText);
      } catch (err) {
        return callback(err);
      }
    }
    callback(null, response);
  };
  xhr.onerror = () => callback(xhr.statusMessage);
  xhr.send();
};