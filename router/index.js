module.exports = function(app){
  app.use('/', require('./routes/home'));
  app.use('/users', require('./routes/users'));
  app.use('/sessions', require('./routes/sessions'));
  app.use('/api', require('./routes/api'));
  app.use('/pet', require('./routes/pet'));
  app.use('/mypets', require('./routes/mypets'));
  app.use('/add', require('./routes/add'));
  app.use('/remove', require('./routes/remove'))
};
