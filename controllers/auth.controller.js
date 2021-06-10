const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, smsService } = require('../services');
const ApiError = require('../utils/ApiError');

const baseURL = catchAsync(async(req, res) => {
  const baseURL = await authService.baseURL();
  res.status(httpStatus.OK).send(baseURL);
});


const register = catchAsync(async(req, res) => {
      const emailResponse = await authService.emailRegister(req.body.username);
      if(!emailResponse) { throw new ApiError(httpStatus.NO_CONTENT, "Email Server Error..! can not send email please try again later") };
      res.status(httpStatus.OK).send(emailResponse);
});

const verification = catchAsync(async(req, res) => {
  const usernameType = await authService.usernameTypeValidation(req.body.username);
  
  if(usernameType === 'email') {
    const verified = await authService.emailVerification(req.body.verifyCode, req.body.messageId);
    if(!verified) { throw new ApiError(httpStatus.BAD_REQUEST, 'codeIsNotVerify') ; }
    const user = await userService.createUserByEmail(req.body);
    const token = await tokenService.generateAuthTokens(user);
    const resulte = await userService.userRegLoginParameter(user, token);
    res.status(httpStatus.CREATED).send(resulte); 
  }
  else if (usernameType === 'phone') {
    const verified = await authService.verification(req.body.verifyCode, req.body.messageId);
    if(!verified) { throw new ApiError(httpStatus.BAD_REQUEST, 'codeIsNotVerify') ; }
    const user = await userService.createUserByPhoneNumber(req.body);
    const token = await tokenService.generateAuthTokens(user);
    const resulte = await userService.userRegLoginParameter(user, token);
    res.status(httpStatus.CREATED).send(resulte); 
  }
});


const login = catchAsync(async(req, res) => {
  const { username, password } = req.body;

    const user = await authService.loginUserWithEmailAndPassword(username, password);
    const token = await tokenService.generateAuthTokens(user);
    const resulte = await userService.userRegLoginParameter(user, token);
    console.log('Login_Dash => ',"ID: "+ user._id + ' phoneNumber: '+ user.phoneNumber, 'username: '+ user.username, 'name: '+ user.name, 'Date: '+ new Date);
    res.status(httpStatus.OK).send(resulte);
  
});


const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send('Logout..');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send(tokens);
});

const forgotPassword = catchAsync(async (req, res) => {
  const messageId = await authService.register(req.body.phoneNumber);
  res.status(httpStatus.OK).send({ messageId: messageId }); 
});

const resetPassword = catchAsync(async(req, res) => {
  const verfiy = await authService.verification(req.body.verifyCode, req.body.messageId);
  const pass = await authService.resetPassword(req.body.phoneNumber, req.body.newPassword);
  if(verfiy === true && pass === true) { res.status(httpStatus.OK).send('PasswordIsChannged')};
});

module.exports = {
    baseURL,
    register,
    verification,
    refreshTokens,
    login,
    logout,
    forgotPassword,
    resetPassword,
};