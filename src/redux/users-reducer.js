import {usersAPI} from "../API/api"
const FOLLOW = "FOLLOW";
const UNFOLLOW  = "UNFOLLOW";
const SET_USERS  = "SET_USERS";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_USERS_COUNT = "SET_TOTAL_USERS_COUNT";
const TOGGLE_IS_FETCHING = "TOGGLE_IS _FETCHING";
const TOGGLE_IS_FOLLOWING_PROGRESS = "TOGGLE_IS_FOLLOWING_PROGRESS";

const initialState = {
	users: [
		// {id: 1, following: false, photoUser: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87Gr4eFO7Pt2pE8oym4dxXnxGZYL2Pl_N5A&usqp=CAU", fullName: "Andrey", status: "I'm boss", location: {city: "Charlotte", country: "USA"}},
		// {id: 2, following: true, photoUser: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-C6XlLDyom3ZA-YU98RZsMIx50qwU8xzlmtiK261de3VveBy0QBgOsFNac3Yb69WsBU&usqp=CAU", fullName: "Mark", status: "Bring the best of your authentic self to every opportunity.", location: {city: "Ekaterinburg", country: "Russia"}},
		// {id: 3, following: false, photoUser: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwsUeMCO-OWwtei37A6FYy6QFCb1m_2XD5EiACkcJaBjk7_Du5owYUs7nwDI2KOpGAEw4&usqp=CAU", fullName: "Anna", status: "Stay hungry, stay foolish.", location: {city: "Tokyo", country: "Japan"}},
		// {id: 4, following: true, photoUser: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa8Luglga9J2R3Bxt_PsWZISUHQWODD6_ZTAJ5mIQgxYCAE-YbkY81faTqp-hSA_jVPTs&usqp=CAU", fullName: "Helen", status: "Clarity trumps persuasion", location: {city: "Deli", country: "India"}},
	],
	pageSize: 5,
	totalUsersCount: 24,
	currentPage: 1,
	isFetching: true,
	followingInProgress: [],
};

const usersReducer = (state = initialState, action) => {

	switch (action.type) {
		case FOLLOW: 
			return { 
				...state, 
				users: state.users.map(user => {
					if (user.id === action.userId) {
						return {...user, followed: true}
					}
					return user
				}),
			}
		case UNFOLLOW:
			return { 
				...state, 
				users: state.users.map(user => {
					if (user.id === action.userId) {
						return {...user, followed: false}
					}
					return user
				}),
			}
		case SET_USERS: {
			return {...state, users: action.users}
		}
		case SET_CURRENT_PAGE: {
			return {...state, currentPage: action.currentPage}
		}
		case SET_TOTAL_USERS_COUNT: {
			return {...state, totalUsersCount: action.totalUsersCount}
		}
		case TOGGLE_IS_FETCHING: {
			return {...state, isFetching: action.isFetching}
		}
		case TOGGLE_IS_FOLLOWING_PROGRESS: {
			return {
				...state, 
				followingInProgress: action.isFetching 
				? [...state.followingInProgress, action.userId] 
				: state.followingInProgress.filter(id => id !== action.userId)
			}
		}
		default: 
			return state;			
	}
};

export const followSuccess = (userId) => ({type: FOLLOW, userId});
export const unFollowSuccess = (userId) => ({type: UNFOLLOW, userId	});
export const setUsers = (users) => ({type: SET_USERS, users});
export const setUsersPage = (currentPage) => ({type: SET_CURRENT_PAGE, currentPage});
export const setTotalUsersCount = (totalUsersCount) => ({type: SET_TOTAL_USERS_COUNT, totalUsersCount});
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching});
export const toggleFollowingProgress = (isFetching, userId) => ({type: TOGGLE_IS_FOLLOWING_PROGRESS, isFetching, userId});

export const getUsers = (page, pageSize) => {
	return (dispatch) => {

	dispatch(toggleIsFetching(true));

		usersAPI.getUsers(page, pageSize).then(data => {
			dispatch(toggleIsFetching(false));
			dispatch(setUsers(data.items));
			// dispatch(setTotalUsersCount(response.data.totalCount));
		});
	}
};

export const follow = (userId) => {
	return (dispatch) => {
		dispatch(toggleFollowingProgress(true, userId));
		usersAPI.follow(userId).then(response => {
			if (response.data.resultCode === 0) {
				dispatch(followSuccess(userId));
			}
			dispatch(toggleFollowingProgress(false, userId));
		});
	}
};

export const unFollow = (userId) => {
	return (dispatch) => {
		dispatch(toggleFollowingProgress(true, userId));
		usersAPI.unFollow(userId).then(response => {
			if (response.data.resultCode === 0) {
				dispatch(unFollowSuccess(userId));
			}
			dispatch(toggleFollowingProgress(false, userId));
		});
	}
}

export default usersReducer;