import {request} from './ajax'
import {serverUri} from '@/config'
let apiToken = "";

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
function editItem(userId, wishlistId, itemId, item, successCallback, errorCallback) {
	request("PUT", `${serverUri}/user/${userId}/wishlist/${wishlistId}/item/${itemId}`, item, successCallback, errorCallback, apiToken)
}

function changeItemState(userId, wishlistId, itemId, state, successCallback, errorCallback) {
	request("POST", `${serverUri}/user/${userId}/wishlist/${wishlistId}/item/${itemId}/state`, state, successCallback, errorCallback, apiToken)
}

function editWishlist(userId, wishlistId, wishlist, successCallback, errorCallback) {
	request("PUT", `${serverUri}/user/${userId}/wishlist/${wishlistId}`, wishlist, successCallback, errorCallback, apiToken)
}

function sendWishlistsOrder(userId, order, successCallback, errorCallback) {
	request('PUT', `${serverUri}/user/${userId}/wishlist/order`, order, successCallback, errorCallback, apiToken)
}

function sendItemsOrder(userId, wishlistId, order, successCallback, errorCallback) {
	request('PUT', `${serverUri}/user/${userId}/wishlist/${wishlistId}/item/order`, order, successCallback, errorCallback, apiToken)
}

function deleteWishlist(userId, wishlistId, successCallback, errorCallback) {
	request('DELETE', `${serverUri}/user/${userId}/wishlist/${wishlistId}`, {}, successCallback, errorCallback, apiToken)
}

function deleteItem(userId, wishlistId, itemId, successCallback, errorCallback) {
	request('DELETE', `${serverUri}/user/${userId}/wishlist/${wishlistId}/item/${itemId}`, {}, successCallback, errorCallback, apiToken)
}

export default {
	setToken,
	getWishlists,
	addWishlist,
	registerWithCode,
	getUser,
	getUserFriends,
	addItem,
	editItem,
	changeItemState,
	editWishlist,
	sendWishlistsOrder,
	sendItemsOrder,
	deleteWishlist,
	deleteItem
}