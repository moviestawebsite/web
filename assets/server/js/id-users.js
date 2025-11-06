let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  localStorage.setItem('userId', userId);
}