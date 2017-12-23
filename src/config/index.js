// export const redirectUri = 'http://95.163.250.250/registration';
// export const redirectUri = 'http://10.241.1.87:8081/registration';
export const redirectUri = 'http://localhost:8081/registration';
// export const serverUri = 'http://95.163.250.250:8080';
// export const serverUri = 'http://10.241.1.87:8080';
export const serverUri = 'http://localhost:8080';

export const messages = {
	en: {
		accept: 'Accept',
		cancel: 'Cancel',
		take: 'Take',
		save: 'Save',
		edit: 'Edit',
		view: 'View',
		select: 'Select',
		friends: 'Friends',
		login: 'Login',
		logout: 'Logout',
		public: 'Public',
		private: 'Private',
		registered: 'Registered',
		notRegistered: 'Not registered',
		noRegisteredFriends: 'No registered friends',
		notFound: 'Not found',
		input: {
			name: 'Please input a name',
			length: 'Length should be at least 3 character',
			visibility: 'Please select visibility option'
		},
		messages: {
			itemSaved: 'The item was saved',
			itemCreated: 'The item was created',
			wishlistCreated: 'The wishlist was created',
			wishlistEdit: 'The wishlist was edited',
			orderUpdated: 'The wishlists order was updated'
		},
		itemName: 'Item: ',
		item: {
			name: 'Item name',
			description: 'Item description',
			link: 'Item link',
			price: 'Item price',
			notItems: 'There is no items',
			add: 'Add item'
		},
		createWishlist: 'Create wishlist',
		wishlistName: 'Wishlist: ',
		wishlist: {
			name: 'Wishlist name',
			visibility: 'Visibility',
			exclusions: 'Friend exclusions'
		},
	},
	ru: {
		accept: 'Принять',
		cancel: 'Отменить',
		take: 'Взять',
		save: 'Сохраить',
		edit: 'Редикатировать',
		view: 'Просмотри',
		select: 'Выбрать',
		friends: 'Друзья',
		registered: 'Зарегестрированы',
		notRegistered: 'Не зарегестрированы',
		noRegisteredFriends: 'Нет зарегестрированных друзей',
		notFound: 'Не найдено',
		input: {
			name: 'Пожалуйста, введите имя',
			length: 'Длина должна быть не менее 3 символов',
			visibility: 'Выберити облатсь видимости'
		},
		messages: {
			itemSaved: 'Сохранено',
			itemCreated: 'Создано',
			wishlistCreated: 'Создано',
			wishlistEdit: 'Отредактировано',
			orderUpdated: 'Отредактировано'
		},
		itemName: 'Подарок: ',
		item: {
			name: 'Название ',
			description: 'Описание подарка ',
			link: 'Ссылка',
			price: 'Стоимость',
			notItems: 'Тут пусто',
			add: 'Добавить подарок'
		},
		createWishlist: 'Новый список',
		wishlistName: 'Список подарков: ',
		wishlist: {
			name: 'Название списка',
			visibility: 'Область видимости',
			exclusions: 'Исключения'
		},
	}
};

export const locales = [{name: 'English', value: 'en'}, {name: 'Russian', value: 'ru'}]
export default {}