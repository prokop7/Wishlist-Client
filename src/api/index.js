import {request} from './ajax'
let apiToken = "";
const serverUri = 'http://10.241.1.87:8080';

function setToken(token) {
	apiToken = token;
}

function getWishlists(userId, successCallback, errorCallback) {
	request("GET", `${serverUri}/user/${userId}/wishlist`, {}, successCallback, errorCallback, apiToken)
}

function addWishlist(userId, data, successCallback, errorCallback) {
	request("POST", `${serverUri}/user/${userId}/wishlist`, data, successCallback, errorCallback, apiToken)
}

function registerWithCode(code, successCallback, errorCallback) {
	request("GET", `${serverUri}/registration?code=${code}`, {}, successCallback, errorCallback)
}

function getUser(userId, successCallback, errorCallback){
	request("GET", `${serverUri}/user/${userId}`, {}, successCallback, errorCallback, apiToken);
}

function getUserFriends(userId, successCallback, errorCallback) {
	request("GET", `${serverUri}/user/${userId}/all_friends`, {}, successCallback, errorCallback, apiToken);
}

function addItem(userId, wishlistId, item, successCallback, errorCallback) {
	request("POST", `${serverUri}/user/${userId}/wishlist/${wishlistId}/item`, item, successCallback, errorCallback, apiToken)
}

export default {
	setToken,
	getWishlists,
	addWishlist,
	registerWithCode,
	getUser,
	getUserFriends,
	addItem
}