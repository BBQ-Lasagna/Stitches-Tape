//  This file handles all of the login/sign-up/logout calls

//  Package Variable Declarations
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const router = require('express').Router();

//  Sign up
//  //  @route   POST api/signup
//  //  @desc    Post New User Registration
//  //  @access  Public
router.post('/api/signup', (req, res, next) => {
	const { body } = req;
	const {
		firstName,
		lastName,
		username,
		password,
		email,
		wantsUpdates
	} = body;

	//	//	Validation
	//	//	//	firstName
	if (!firstName) {
		return res.send({
			success: false,
			message: 'Error: First name cannot be blank.'
		});
	}
	//	//	//	lastName
	if (!lastName) {
		return res.send({
			success: false,
			message: 'Error: Last name cannot be blank.'
		});
	}
	//	//	//	username
	if (!username) {
		return res.send({
			success: false,
			message: 'Error: Username cannot be blank.'
		});
	}
	//	//	//	email
	if (!email) {
		return res.send({
			success: false,
			message: 'Error: Email cannot be blank.'
		});
	}
	//	//	//	password
	if (!password) {
		return res.send({
			success: false,
			message: 'Error: Password cannot be blank.'
		});
	}

	//	//	Verify that the value given for email exists in Database
	User.find(
		{
			username: username
		},
		(err, pastUser) => {
			if (err) {
				//	//	//	Return General Error Message
				return res.send({
					success: false,
					message: 'Error: Server Error.'
				});
			} else if (pastUser.length > 0) {
				//	//	//	Return Account Exists Error
				return res.send({
					success: false,
					message: 'Error: Account already exists.'
				});
			}

			//	//	Create newUser to send to the Database
			const newUser = new User();

			//	//	Populate newUser to create a new account
			newUser.email = email;
			newUser.firstName = firstName;
			newUser.lastName = lastName;
			newUser.username = username;
			newUser.wantsUpdates = wantsUpdates;
			newUser.password = newUser.generateHash(password);
			newUser.save((err, user) => {
				if (err) {
					return res.send({
						success: false,
						message: 'Error: Server Error.'
					});
				}
				return res.send({
					success: true,
					message: 'Account Created.'
				});
			});
		}
	);
});

//  Login
//  //  @route   POST api/account/login
//  //  @desc    Login
//  //  @access  Public
router.post('/api/account/login', (req, res, next) => {
	const { body } = req;
	const { password, username } = body;

	//	//	Validation
	//	//	//	username
	if (!username) {
		return res.send({
			success: false,
			message: 'Error: Username cannot be blank.'
		});
	}
	//	//	//	password
	if (!password) {
		return res.send({
			success: false,
			message: 'Error: Password cannot be blank.'
		});
	}

	User.findOne(
		{
			username: username
		},
		(err, user) => {
			if (err) {
				return res.send({
					success: false,
					message: 'Error: Server error'
				});
			}

			if (!user.validPassword(password)) {
				return res.send({
					success: false,
					message: 'Error: Invalid Password'
				});
			}

			//Otherwise correct user
			const userSession = new UserSession();
			userSession.userId = user._id;
			userSession.save((err, doc) => {
				if (err) {
					return res.send({
						success: false,
						message: 'Error: Server error'
					});
				}
				return res.send({
					success: true,
					message: 'Valid sign in!',
					token: doc._id
				});
			});
		}
	);
});

//	Verify User
//  //  @route   GET /api/account/verify
//  //  @desc    Verify token info is for a valid user
//  //  @access  Public
router.get('/api/account/verify', (req, res, next) => {
	//	//	Grab token values
	const { query } = req;
	const { token } = query;

	//	//	Verify that token is unique and is not deleted
	UserSession.find(
		{
			_id: token,
			isDeleted: false
		},
		(err, sessions) => {
			if (err) {
				return res.send({
					sucess: false,
					message: 'Error: Server error'
				});
			}

			if (sessions.length != 1) {
				return res.send({
					success: false,
					message: 'Error: Invalid'
				});
			} else {
				return res.send({
					success: true,
					message: 'Good'
				});
			}
		}
	);
});

//	Verify User
//  //  @route   GET /api/account/logout
//  //  @desc    Logs current user out
//  //  @access  Public
router.get('/api/account/logout', (req, res, next) => {
	//	//	Grab token values
	const { query } = req;
	const { token } = query;

	//	//	Verify that token is unique and is not deleted
	UserSession.findOneAndUpdate(
		{
			_id: token,
			isDeleted: false
		},
		{
			$set: { isDeleted: true }
		},
		null,
		(err, sessions) => {
			if (err) {
				return res.send({
					success: false,
					message: 'Error: Server error'
				});
			}
			return res.send({
				success: false,
				message: 'Good'
			});
		}
	);
});

//  Exports
module.exports = router;
