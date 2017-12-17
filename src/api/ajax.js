// Default implementation of AJAX request
export function request(type, url, data, successCallback, errorCallback, token) {
	var xhr = new XMLHttpRequest();
	xhr.open(type, url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.setRequestHeader('Content-Type', 'application/json');
	if (token) {
		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
	}
	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 400) {
			console.log({type: type, url: xhr.responseURL, response:xhr.response})
			if (xhr.response) {
				// console.log(xhr.status);
				var result;
				try {
					result = xhr.response;
				}
				catch (e) {
					result = xhr.response.result;
				}
				if (successCallback) {
					successCallback(result);
				}
			} else {
				if (successCallback) {
					successCallback({});
				}
			}
		}
		else {
			console.error(xhr.response);
			if (errorCallback)
				errorCallback(xhr.status, xhr.response);
		}
	}
	xhr.onerror = function () {
		console.error(xhr.status);
		if (errorCallback)
			errorCallback(xhr.status);
	}
	xhr.responseType = 'json';
	xhr.send(JSON.stringify(data));
}


export function getRequest(url, successCallback, errorCallback) {
	request("GET", url, '', successCallback, errorCallback);
}

export default {
	request
}