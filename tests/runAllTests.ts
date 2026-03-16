// Single entrypoint to run all test files in order
// Importing each test file executes its run() immediately
(async () => {
  await import('./otpHelpers.test');
  await import('./verifyOtpFlow.test');
  await import('./formsValidation.test');
  await import('./formsService.test');
  await import('./jwtHelpers.test');
  await import('./middlewares.test');
  await import('./authController.test');

  console.log('All tests executed');
})();
